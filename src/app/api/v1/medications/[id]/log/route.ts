import { NextResponse } from 'next/server';
import { MedicationService } from '@/server/services/medication.service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const action = body.action || 'taken'; // 'taken' | 'skipped' | 'missed' | 'snoozed'
    const scheduledTime = body.scheduledTime || '';
    const notes = body.notes || '';

    const log = await MedicationService.logDose(id, scheduledTime, action, notes);

    return NextResponse.json({ success: true, data: log });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
