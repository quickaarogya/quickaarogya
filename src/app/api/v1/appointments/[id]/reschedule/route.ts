import { NextResponse } from 'next/server';
import { AppointmentService } from '@/server/services/appointment.service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { date, timeSlot } = body;

    if (!date || !timeSlot) {
      return NextResponse.json(
        { success: false, error: 'Both new date and timeSlot are required for rescheduling.' },
        { status: 400 }
      );
    }

    const updated = await AppointmentService.rescheduleAppointment(id, date, timeSlot);

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
