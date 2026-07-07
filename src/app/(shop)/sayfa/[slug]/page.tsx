import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CustomPage({ params }: { params: { slug: string } }) {
  const page = await prisma.page.findUnique({
    where: { slug: params.slug }
  });

  if (!page || !page.isActive) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 border-b border-gray-100 pb-6">
            {page.title}
          </h1>
          
          <div className="prose prose-slate max-w-none text-gray-600 font-medium whitespace-pre-wrap leading-relaxed">
            {page.content}
          </div>
        </div>
      </div>
    </div>
  );
}
