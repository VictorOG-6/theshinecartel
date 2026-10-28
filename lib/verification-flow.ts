import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { $http } from "./http";

export const PENDING_VERIFICATION_EMAIL_KEY = "pending_verification_email";

export const UNVERIFIED_LOGIN_DETAIL =
  "Please verify your email before logging in";

export function getAxiosErrorDetail(error: AxiosError): string | undefined {
  const data = error.response?.data as
    | { detail?: string; message?: string }
    | undefined;

  return data?.detail ?? data?.message;
}

export function storePendingVerificationEmail(email: string) {
  sessionStorage.setItem(
    PENDING_VERIFICATION_EMAIL_KEY,
    email.trim().toLowerCase(),
  );
}

export function getVerifyOtpPath(email: string) {
  return `/verify-otp?email=${encodeURIComponent(email.trim().toLowerCase())}`;
}

export function isVerifyEmailRequiredError(detail: string) {
  const normalized = detail.toLowerCase();

  return (
    normalized === UNVERIFIED_LOGIN_DETAIL.toLowerCase() ||
    normalized.includes("verify your email") ||
    normalized.includes("verify email") ||
    normalized.includes("email not verified") ||
    normalized.includes("not verified")
  );
}

export function isUnverifiedLoginError(error: AxiosError) {
  const detail = getAxiosErrorDetail(error);

  return !!detail && isVerifyEmailRequiredError(detail);
}

export function isEmailAlreadyRegisteredError(detail: string) {
  const normalized = detail.toLowerCase();

  return (
    normalized.includes("already registered") ||
    normalized.includes("already reistered") ||
    normalized.includes("email already exists")
  );
}

export function isEmailAlreadyVerifiedError(detail: string) {
  const normalized = detail.toLowerCase();

  return normalized.includes("already verified");
}

export async function sendVerificationOtp(email: string) {
  try {
    await $http.post("/auth/resend-otp", {
      email: email.trim().toLowerCase(),
    });
    return { sent: true as const };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        sent: false as const,
        detail: getAxiosErrorDetail(error),
      };
    }

    return { sent: false as const };
  }
}

export async function redirectUnverifiedUserToOtp(
  email: string,
  router: AppRouterInstance,
  options?: {
    notify?: string;
  },
) {
  const normalizedEmail = email.trim().toLowerCase();
  storePendingVerificationEmail(normalizedEmail);

  const { sent, detail } = await sendVerificationOtp(normalizedEmail);

  if (detail && isEmailAlreadyVerifiedError(detail)) {
    toast.error("This email is already verified. Please sign in.");
    router.replace("/sign-in");
    return;
  }

  if (options?.notify) {
    toast.message(options.notify);
  } else if (sent) {
    toast.success("Verification code sent. Check your email.");
  } else {
    toast.message(
      "Use the verification code already sent to your email, or resend a new one on the next page.",
    );
  }

  router.replace(getVerifyOtpPath(normalizedEmail));
}
