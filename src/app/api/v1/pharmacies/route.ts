import { NextResponse } from 'next/server';
import { PharmacyService } from '@/server/services/pharmacy.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('searchQuery') || undefined;
    const only24x7 = searchParams.get('only24x7') === 'true';

    const pharmacies = await PharmacyService.getPharmacies({
      searchQuery,
      only24x7,
    });

    return NextResponse.json({ success: true, data: pharmacies });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
