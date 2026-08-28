import { NextResponse } from 'next/server';
import { AppointmentService } from '@/server/services/appointment.service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const appointments = await AppointmentService.getAppointments();
    const apt = appointments.find(a => a.id === id);
    if (!apt) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: apt });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await AppointmentService.cancelAppointment(id);
    return NextResponse.json({ success: true, message: 'Appointment cancelled successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
