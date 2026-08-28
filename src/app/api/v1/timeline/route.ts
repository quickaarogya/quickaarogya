import { NextResponse } from 'next/server';
import { DocumentService } from '@/server/services/document.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientProfileId = searchParams.get('patientProfileId') || undefined;

    const timeline = await DocumentService.getMedicalTimeline(patientProfileId);

    return NextResponse.json({ success: true, data: timeline });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
