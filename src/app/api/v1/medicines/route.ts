import { NextResponse } from 'next/server';
import { PharmacyService } from '@/server/services/pharmacy.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = (searchParams.get('category') as any) || undefined;
    const searchQuery = searchParams.get('searchQuery') || undefined;
    const rxParam = searchParams.get('requiresPrescription');
    const requiresPrescription = rxParam !== null ? rxParam === 'true' : undefined;

    const medicines = await PharmacyService.getMedicines({
      category,
      searchQuery,
      requiresPrescription,
    });

    return NextResponse.json({ success: true, data: medicines });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
