import { NextResponse, type NextRequest } from 'next/server';
import { searchQuran } from '@/lib/search';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim() ?? '';

  const results = searchQuran(query);

  return NextResponse.json(
    { query, results },
    { headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=300' } },
  );
}
