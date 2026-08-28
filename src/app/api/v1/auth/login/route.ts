import { NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validations/auth.schema';
import { AuthService } from '@/server/services/auth.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = loginSchema.parse(body);

    const session = await AuthService.login(validated.identifier, validated.password);

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: session.user.id,
          email: session.user.email,
          phoneNumber: session.user.phoneNumber,
          role: session.user.role,
          isOnboarded: session.user.isOnboarded,
        },
        profile: session.profile,
        token: session.token,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication failed' },
      { status: 400 }
    );
  }
}
