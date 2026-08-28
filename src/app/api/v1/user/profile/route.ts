import { NextResponse } from 'next/server';
import { profileUpdateSchema } from '@/lib/validations/auth.schema';
import { PatientService } from '@/server/services/patient.service';

export async function GET() {
  try {
    const profile = await PatientService.getProfile();
    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validated = profileUpdateSchema.parse(body);
    const updated = await PatientService.updateProfile(validated as any);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
