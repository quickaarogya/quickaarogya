import { NextResponse } from 'next/server';
import { MedicationService } from '@/server/services/medication.service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const schedule = await MedicationService.getScheduleById(id);
    if (!schedule) {
      return NextResponse.json({ success: false, error: 'Medication schedule not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: schedule });
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
    const updated = await MedicationService.updateSchedule(id, body);
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
    await MedicationService.deleteSchedule(id);
    return NextResponse.json({ success: true, message: 'Medication schedule deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
