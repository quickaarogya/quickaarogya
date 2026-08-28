import { NextResponse } from 'next/server';
import { FamilyService } from '@/server/services/family.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const primaryUserId = searchParams.get('primaryUserId') || 'usr-101';

    const members = await FamilyService.getFamilyMembers(primaryUserId);
    return NextResponse.json({ success: true, data: members });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const primaryUserId = body.primaryUserId || 'usr-101';

    const newMember = await FamilyService.addFamilyMember(primaryUserId, body);
    return NextResponse.json({ success: true, data: newMember }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
