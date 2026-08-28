import { NextResponse } from 'next/server';
import { FamilyService } from '@/server/services/family.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const primaryUserId = searchParams.get('primaryUserId') || 'usr-101';

    const overview = await FamilyService.getFamilyHealthOverview(primaryUserId);
    return NextResponse.json({ success: true, data: overview });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
