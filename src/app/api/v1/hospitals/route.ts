import { NextResponse } from 'next/server';
import { AppointmentService } from '@/server/services/appointment.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || undefined;
    const searchQuery = searchParams.get('searchQuery') || undefined;

    const hospitals = await AppointmentService.getHospitals({
      city,
      searchQuery,
    });

    return NextResponse.json({ success: true, data: hospitals });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
