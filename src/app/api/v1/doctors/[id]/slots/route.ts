import { NextResponse } from 'next/server';
import { AppointmentService } from '@/server/services/appointment.service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const slots = await AppointmentService.getAvailableSlots(id, date);

    return NextResponse.json({ success: true, data: slots });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
