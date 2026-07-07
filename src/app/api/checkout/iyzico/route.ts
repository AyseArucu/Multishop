import { NextResponse } from 'next/server';
import Iyzipay from 'iyzipay';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, totalAmount, firstName, lastName, phone, email, address } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Sepetiniz boş." }, { status: 400 });
    }

    // Temporary guest user creation or find existing
    let user = await prisma.user.findFirst({ where: { email: email || 'guest@multishop.local' } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: `${firstName} ${lastName}`,
          email: email || 'guest@multishop.local',
          password: 'nopassword',
        }
      });
    }

    // Fetch Iyzico Settings
    const settings = await prisma.setting.findMany({
      where: {
        key: { in: ['iyzicoApiKey', 'iyzicoSecretKey', 'iyzicoEnvironment'] }
      }
    });
    
    const settingsMap = settings.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    const apiKey = settingsMap['iyzicoApiKey'];
    const secretKey = settingsMap['iyzicoSecretKey'];
    const environment = settingsMap['iyzicoEnvironment'] || 'sandbox';

    if (!apiKey || !secretKey) {
      // Iyzico ayarları yoksa, test için sahte bir ödeme ekranı HTML'i dön
      const mockHtml = `
        <div style="text-align: center; padding: 40px; background-color: #f8fafc; border-radius: 16px;">
          <h3 style="font-size: 24px; font-weight: bold; margin-bottom: 16px; color: #1e293b;">Test Ödeme Ekranı</h3>
          <p style="color: #64748b; margin-bottom: 24px; line-height: 1.5;">Sanal POS (Iyzico) ayarları henüz yapılmadığı için test modundasınız.<br/>Siparişi tamamlamak için aşağıdaki butona tıklayabilirsiniz.</p>
          <button id="mock-payment-btn" style="background-color: #ec4899; color: white; font-weight: bold; padding: 12px 32px; border-radius: 12px; border: none; cursor: pointer; font-size: 16px; box-shadow: 0 10px 15px -3px rgba(236, 72, 153, 0.3);">Test Ödemesini Onayla</button>
          <script>
            document.getElementById('mock-payment-btn').addEventListener('click', function() {
              this.innerText = 'İşleniyor...';
              this.disabled = true;
              var form = document.createElement('form');
              form.method = 'POST';
              form.action = '/api/checkout/callback';
              var input = document.createElement('input');
              input.type = 'hidden';
              input.name = 'token';
              input.value = 'mock_token_WAITING';
              form.appendChild(input);
              document.body.appendChild(form);
              form.submit();
            });
          </script>
        </div>
      `;

      // Siparişi veritabanına ekle (mock token için order.id lazım, o yüzden burada order'ı oluşturuyoruz)
      const order = await prisma.order.create({
        data: {
          userId: user.id,
          totalAmount,
          paymentMethod: 'CREDIT_CARD',
          status: 'PENDING',
          firstName,
          lastName,
          phone,
          email,
          address,
          orderItems: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        }
      });

      const finalHtml = mockHtml.replace('mock_token_WAITING', 'mock_token_' + order.id);

      return NextResponse.json({
        status: "success",
        checkoutFormContent: finalHtml
      });
    }

    const iyzipay = new Iyzipay({
      apiKey: apiKey,
      secretKey: secretKey,
      uri: environment === 'sandbox' ? 'https://sandbox-api.iyzipay.com' : 'https://api.iyzipay.com'
    });

    // Create a pending order to get an ID for Iyzico
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        totalAmount,
        paymentMethod: 'CREDIT_CARD',
        status: 'PENDING',
        firstName,
        lastName,
        phone,
        email,
        address,
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });

    const price = totalAmount.toFixed(2);
    const callbackUrl = process.env.NEXT_PUBLIC_SITE_URL 
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout/callback`
      : 'http://localhost:3000/api/checkout/callback';

    const request = {
      locale: 'tr',
      conversationId: order.id,
      price: price,
      paidPrice: price,
      currency: 'TRY',
      basketId: order.id,
      paymentGroup: 'PRODUCT',
      callbackUrl: callbackUrl,
      enabledInstallments: [2, 3, 6, 9],
      buyer: {
        id: user.id,
        name: firstName || 'Guest',
        surname: lastName || 'User',
        gsmNumber: phone || '+905555555555',
        email: email || 'guest@multishop.local',
        identityNumber: '74300864791', // Required by iyzico
        lastLoginDate: '2023-10-05 12:43:35',
        registrationDate: '2023-04-21 15:12:09',
        registrationAddress: address || 'Istanbul Turkey',
        ip: '85.34.78.112',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34732'
      },
      shippingAddress: {
        contactName: `${firstName} ${lastName}`,
        city: 'Istanbul',
        country: 'Turkey',
        address: address || 'Istanbul Turkey',
        zipCode: '34732'
      },
      billingAddress: {
        contactName: `${firstName} ${lastName}`,
        city: 'Istanbul',
        country: 'Turkey',
        address: address || 'Istanbul Turkey',
        zipCode: '34732'
      },
      basketItems: [
        {
          id: 'BASKET',
          name: 'Sepet Toplamı (İndirim ve Kargo Dahil)',
          category1: 'Genel',
          itemType: 'PHYSICAL',
          price: price
        }
      ]
    };

    return new Promise((resolve) => {
      iyzipay.checkoutFormInitialize.create(request, function (err: any, result: any) {
        if (err) {
          console.error("Iyzico Error:", err);
          resolve(NextResponse.json({ error: "Ödeme sistemiyle iletişim kurulamadı.", details: err }, { status: 500 }));
        } else {
          // result contains checkoutFormContent (HTML) and token
          // sometimes result.status === 'failure'
          if (result && result.status === 'failure') {
             console.error("Iyzico Failure Result:", result);
             resolve(NextResponse.json({ error: result.errorMessage || "Iyzico işlem hatası", result }, { status: 400 }));
          } else {
             resolve(NextResponse.json(result));
          }
        }
      });
    });

  } catch (error: any) {
    console.error("POST Checkout Iyzico Error:", error);
    return NextResponse.json({ error: "İşlem başlatılamadı.", details: error?.message, stack: String(error) }, { status: 500 });
  }
}
