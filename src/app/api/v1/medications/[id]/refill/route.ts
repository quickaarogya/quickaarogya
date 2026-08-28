import { NextResponse } from 'next/server';
import { MedicationService } from '@/server/services/medication.service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const quantityAdded = typeof body.quantityAdded === 'number' ? body.quantityAdded : 30;

    const updated = await MedicationService.refillSchedule(id, quantityAdded);

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
