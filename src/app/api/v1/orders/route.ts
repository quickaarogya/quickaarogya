import { NextResponse } from 'next/server';
import { PharmacyService } from '@/server/services/pharmacy.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientProfileId = searchParams.get('patientProfileId') || undefined;
    const status = (searchParams.get('status') as any) || undefined;

    const orders = await PharmacyService.getOrders(patientProfileId, status);

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newOrder = await PharmacyService.createOrder(body);

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
