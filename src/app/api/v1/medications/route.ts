import { NextResponse } from 'next/server';
import { MedicationService } from '@/server/services/medication.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientProfileId = searchParams.get('patientProfileId') || undefined;
    const status = (searchParams.get('status') as any) || undefined;

    const schedules = await MedicationService.getSchedules({
      patientProfileId,
      status,
    });

    return NextResponse.json({ success: true, data: schedules });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newSchedule = await MedicationService.createSchedule(body);

    return NextResponse.json({ success: true, data: newSchedule }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
