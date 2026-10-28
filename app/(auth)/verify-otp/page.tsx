"use client";

import type { AuthPayload } from "@/lib/auth";
import { getAuthPayload, storeAuthToken, validateToken } from "@/lib/auth";
import processError from "@/lib/error";
import { $http, addAccessTokenToHttpInstance } from "@/lib/http";
import {
  PENDING_VERIFICATION_EMAIL_KEY,
  storePendingVerificationEmail,
} from "@/lib/verification-flow";
import { userKeys } from "@/lib/react-query/query-keys";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

type VerifyOtpResponse = AuthPayload & {
  message: string;
};

const formatCountdown = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

function OTPInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = value.padEnd(OTP_LENGTH, " ").split("").slice(0, OTP_LENGTH);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  };

  const updateValue = (nextValue: string) => {
    onChange(nextValue.slice(0, OTP_LENGTH));
  };

  const handleChange = (index: number, inputValue: string) => {
    const sanitized = inputValue.replace(/\D/g, "");

    if (!sanitized) {
      const nextDigits = [...digits];
      nextDigits[index] = " ";
      updateValue(nextDigits.join("").trimEnd());
      return;
    }

    if (sanitized.length > 1) {
      const pasted = sanitized.slice(0, OTP_LENGTH);
      updateValue(pasted);
      focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = sanitized;
    const nextValue = nextDigits.join("").replace(/ /g, "");
    updateValue(nextValue);

    if (index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !digits[index]?.trim() && index > 0) {
      focusInput(index - 1);
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    updateValue(pasted);
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={OTP_LENGTH}
          value={digit.trim()}
          disabled={disabled}
          aria-label={`Digit ${index + 1} of ${OTP_LENGTH}`}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.currentTarget.select()}
          className="size-11 sm:size-14 rounded-lg border border-[#66666659] bg-transparent text-center text-lg sm:text-xl font-medium text-[#333333] outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50"
        />
      ))}
    </div>
  );
}

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const emailFromQuery = searchParams.get("email")?.trim().toLowerCase() ?? "";
  const [email] = useState(() => {
    if (emailFromQuery) {
      storePendingVerificationEmail(emailFromQuery);
      return emailFromQuery;
    }

    return sessionStorage.getItem(PENDING_VERIFICATION_EMAIL_KEY) ?? "";
  });

  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (!email) {
      router.replace("/sign-up");
    }
  }, [email, router]);

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendCooldown((current) => {
        if (current <= 1) {
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const startResendCooldown = useCallback(() => {
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
  }, []);

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email) {
      toast.error("Email is missing. Please sign up again.");
      router.replace("/sign-up");
      return;
    }

    if (otp.length !== OTP_LENGTH) {
      toast.error(`Please enter the ${OTP_LENGTH}-digit verification code.`);
      return;
    }

    setIsVerifying(true);

    try {
      const { data } = await $http.post<VerifyOtpResponse>("/auth/verify-otp", {
        email,
        otp,
      });
      const authPayload = getAuthPayload(data);

      validateToken(authPayload.access_token);
      await storeAuthToken(
        authPayload.access_token,
        authPayload.refresh_token,
        authPayload.user.role,
      );
      addAccessTokenToHttpInstance(authPayload.access_token);
      sessionStorage.setItem("access_token", authPayload.access_token);
      sessionStorage.setItem("refresh_token", authPayload.refresh_token);
      sessionStorage.setItem(
        "user_session",
        JSON.stringify({
          email: authPayload.user.email,
          name: authPayload.user.name,
          role: authPayload.user.role,
        }),
      );
      sessionStorage.removeItem(PENDING_VERIFICATION_EMAIL_KEY);

      await queryClient.refetchQueries({
        queryKey: userKeys.me,
        type: "active",
      });

      toast.success(data.message ?? "Email verified successfully.");
      router.replace("/");
    } catch (error) {
      console.error("Verify OTP error:", error);
      if (error instanceof AxiosError) {
        const detail = (error.response?.data as { detail?: string })?.detail;

        if (detail === "Email already verified") {
          sessionStorage.removeItem(PENDING_VERIFICATION_EMAIL_KEY);
          toast.message(detail);
          router.replace("/sign-in");
          return;
        }

        processError(error);
      } else {
        toast.error("Verification failed. Please try again.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email || resendCooldown > 0 || isResending) {
      return;
    }

    setIsResending(true);

    try {
      await $http.post("/auth/resend-otp", { email });
      toast.success("A new verification code has been sent.");
      startResendCooldown();
    } catch (error) {
      console.error("Resend OTP error:", error);
      if (error instanceof AxiosError) {
        processError(error);
      } else {
        toast.error("Could not resend the code. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  const isVerifyDisabled = isVerifying || otp.length !== OTP_LENGTH;
  const isResendDisabled = resendCooldown > 0 || isResending || isVerifying;

  if (!email) {
    return null;
  }

  return (
    <main className="min-h-screen bg-foreground px-4 py-10 sm:px-6 md:py-16">
      <section className="mx-auto flex w-full max-w-lg flex-col items-center">
        <div className="w-full rounded-2xl border border-[#66666650] bg-white px-5 py-8 sm:px-10 sm:py-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <Image
              src="/logo.png"
              alt="The Shine Cartel logo"
              width={160}
              height={40}
              className="h-auto w-32 sm:w-40"
              priority
            />
            <h1 className="mt-6 text-xl font-medium text-primary sm:text-2xl">
              Verify your email
            </h1>
            <p className="mt-3 text-sm text-secondary sm:text-base">
              We sent a verification code to{" "}
              <span className="font-medium text-[#333333]">{email}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="flex flex-col gap-8">
            <OTPInput value={otp} onChange={setOtp} disabled={isVerifying} />

            <button
              type="submit"
              disabled={isVerifyDisabled}
              className={`flex w-full items-center justify-center rounded-3xl py-4 text-base text-white transition-colors ${
                isVerifyDisabled
                  ? "cursor-not-allowed bg-[#11111125]"
                  : "cursor-pointer bg-primary"
              }`}
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-secondary sm:text-base">
            <p>
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResendDisabled}
                className={`font-medium ${
                  isResendDisabled
                    ? "cursor-not-allowed text-[#666666]"
                    : "cursor-pointer text-primary underline"
                }`}
              >
                Resend
              </button>
            </p>
            {resendCooldown > 0 && (
              <p className="mt-2 text-sm text-[#666666]">
                You can resend again in {formatCountdown(resendCooldown)}
              </p>
            )}
          </div>

          <p className="mt-8 text-center text-sm text-secondary">
            Wrong email?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-primary underline"
            >
              Go back to sign up
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function VerifyOTPFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-foreground px-4">
      <div className="w-full max-w-lg rounded-2xl border border-[#66666650] bg-white px-6 py-10 text-center">
        <div className="mx-auto mb-4 size-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-secondary">Loading verification...</p>
      </div>
    </main>
  );
}

const VerifyOTP = () => {
  return (
    <Suspense fallback={<VerifyOTPFallback />}>
      <VerifyOTPContent />
    </Suspense>
  );
};

export default VerifyOTP;
