import { NextResponse } from 'next/server';
import { FamilyService } from '@/server/services/family.service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const member = await FamilyService.getFamilyMemberById(id);
    if (!member) {
      return NextResponse.json({ success: false, error: 'Family member not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: member });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await FamilyService.updateFamilyMember(id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await FamilyService.deleteFamilyMember(id);
    return NextResponse.json({ success: true, message: 'Family member removed successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
