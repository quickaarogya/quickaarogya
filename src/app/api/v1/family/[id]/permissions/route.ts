import { NextResponse } from 'next/server';
import { FamilyService } from '@/server/services/family.service';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { permissions } = body;

    if (!Array.isArray(permissions)) {
      return NextResponse.json(
        { success: false, error: 'Permissions must be provided as an array.' },
        { status: 400 }
      );
    }

    const updated = await FamilyService.updatePermissions(id, permissions);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
