import { NextResponse } from 'next/server';
import iyzipay from '@/lib/iyzipay';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // Iyzico sends token as form data in POST body
    const formData = await req.formData();
    const token = formData.get('token') as string;

    if (!token) {
      return NextResponse.redirect(new URL('/checkout?error=invalid_token', req.url), 303);
    }

    if (token.startsWith('mock_token_')) {
      const orderId = token.replace('mock_token_', '');
      
      try {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'PREPARING' }
        });
        return NextResponse.redirect(new URL(`/checkout/success?orderId=${orderId}`, req.url), 303);
      } catch (dbErr) {
        console.error("Mock DB Update Error:", dbErr);
        return NextResponse.redirect(new URL(`/checkout/success?orderId=${orderId}&warning=db_update_failed`, req.url), 303);
      }
    }

    return new Promise((resolve) => {
      iyzipay.checkoutForm.retrieve({
        locale: 'tr',
        conversationId: '123456789', // Not strictly required to match but good for logging
        token: token
      }, async function (err: any, result: any) {
        if (err || result.status !== 'success') {
          console.error("Iyzico Callback Error:", err || result.errorMessage);
          resolve(NextResponse.redirect(new URL('/checkout?error=payment_failed', req.url), 303));
          return;
        }

        if (result.paymentStatus === 'SUCCESS') {
          const orderId = result.basketId; // We passed order.id as basketId

          // Update order status to something else, e.g. PREPARING
          try {
            await prisma.order.update({
              where: { id: orderId },
              data: { status: 'PREPARING' }
            });
            resolve(NextResponse.redirect(new URL(`/checkout/success?orderId=${orderId}`, req.url), 303));
          } catch (dbErr) {
            console.error("DB Update Error after successful payment:", dbErr);
            resolve(NextResponse.redirect(new URL(`/checkout/success?orderId=${orderId}&warning=db_update_failed`, req.url), 303));
          }
        } else {
          // Payment failed
          resolve(NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(result.errorMessage || 'payment_failed')}`, req.url), 303));
        }
      });
    });

  } catch (error) {
    console.error("Callback Route Error:", error);
    return NextResponse.redirect(new URL('/checkout?error=server_error', req.url), 303);
  }
}
