import { NextResponse } from 'next/server';
import { DocumentService } from '@/server/services/document.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientProfileId = searchParams.get('patientProfileId') || undefined;
    const category = searchParams.get('category') || undefined;
    const searchQuery = searchParams.get('searchQuery') || undefined;

    const docs = await DocumentService.getDocuments({
      patientProfileId,
      category,
      searchQuery,
    });

    return NextResponse.json({ success: true, data: docs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newDoc = await DocumentService.uploadDocument(body);

    return NextResponse.json({ success: true, data: newDoc }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
