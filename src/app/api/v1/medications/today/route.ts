import { NextResponse } from 'next/server';
import { MedicationService } from '@/server/services/medication.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientProfileId = searchParams.get('patientProfileId') || undefined;

    const todayDoses = await MedicationService.getTodayDoses(patientProfileId);
    const stats = await MedicationService.getAdherenceStats(patientProfileId);

    return NextResponse.json({
      success: true,
      data: {
        doses: todayDoses,
        stats,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
