import { NextResponse } from 'next/server';
import { AppointmentService } from '@/server/services/appointment.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get('specialty') || undefined;
    const searchQuery = searchParams.get('searchQuery') || undefined;
    const hospitalId = searchParams.get('hospitalId') || undefined;

    const doctors = await AppointmentService.getDoctors({
      specialty,
      searchQuery,
      hospitalId,
    });

    return NextResponse.json({ success: true, data: doctors });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
