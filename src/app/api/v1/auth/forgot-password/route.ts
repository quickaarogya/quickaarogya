import { NextResponse } from 'next/server';
import { forgotPasswordSchema, resetPasswordSchema } from '@/lib/validations/auth.schema';
import { AuthService } from '@/server/services/auth.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // If OTP is provided, it's Step 2 (Reset Password)
    if (body.otp) {
      const validated = resetPasswordSchema.parse(body);
      const identifier = body.identifier;
      if (!identifier) {
        return NextResponse.json({ success: false, error: 'Identifier is required' }, { status: 400 });
      }

      await AuthService.resetPassword(identifier, validated.otp, validated.newPassword);
      return NextResponse.json({
        success: true,
        message: 'Password successfully updated.',
      });
    }

    // Step 1: Generate & Send OTP
    const validated = forgotPasswordSchema.parse(body);
    const result = await AuthService.generateResetOtp(validated.identifier);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Request failed' },
      { status: 400 }
    );
  }
}
