import { revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  revalidateTag('news', 'days');
  return Response.json({ revalidated: true, timestamp: new Date().toISOString() });
}
