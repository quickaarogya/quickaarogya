import { NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validations/auth.schema';
import { AuthService } from '@/server/services/auth.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = registerSchema.parse(body);

    const session = await AuthService.register({
      fullName: validated.fullName,
      email: validated.email,
      phoneNumber: validated.phoneNumber,
      role: validated.role,
      passwordPlain: validated.password,
    });

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
      },
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Registration failed' },
      { status: 400 }
    );
  }
}
