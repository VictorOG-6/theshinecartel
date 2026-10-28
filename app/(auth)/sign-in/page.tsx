"use client";

import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import type { AuthPayload } from "@/lib/auth";
import { getAuthPayload, storeAuthToken, validateToken } from "@/lib/auth";
import { API_URL } from "@/lib/constants";
import processError from "@/lib/error";
import { $http, addAccessTokenToHttpInstance } from "@/lib/http";
import {
  getAxiosErrorDetail,
  isUnverifiedLoginError,
  redirectUnverifiedUserToOtp,
  UNVERIFIED_LOGIN_DETAIL,
} from "@/lib/verification-flow";
import { userKeys } from "@/lib/react-query/query-keys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const signInSchema = z.object({
  username: z
    .string()
    .email()
    .toLowerCase()
    .trim()
    .min(2, "Email must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInFormField = z.infer<typeof signInSchema>;

type SignInResponse = AuthPayload | { data?: AuthPayload };

const ADMIN_ROLES = new Set(["admin", "staff"]);

const SLIDES = [
  {
    tagline:
      "The Shine Cartel Lipgloss - A light and nourishing lip balm for everyday wear.",
    src: "/images/contact-1.avif",
    alt: "The Shine Cartel Lipgloss",
  },
  {
    tagline:
      "The Shine Cartel Blush - A soft and subtle blush for a natural glow.",
    src: "/images/contact-2.avif",
    alt: "The Shine Cartel Blush",
  },
  {
    tagline:
      "The Shine Cartel Strawberry Lip Kit — a sweet and juicy look for every occasion.",
    src: "/images/contact-3.avif",
    alt: "The Shine Cartel Strawberry Lip Kit",
  },
  {
    tagline:
      "A botanical-powered skincare and beauty for skin that looks as good as it feels with the extra aesthetics.",
    src: "/images/contact-4.avif",
    alt: "The Shine Cartel",
  },
] as const;

const SLIDE_INTERVAL_MS = 5500;

const SignIn = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleAuthLoading, setIsGoogleAuthLoading] =
    useState<boolean>(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<SignInFormField>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<SignInFormField> = async (values) => {
    setIsLoading(true);

    try {
      // Call FastAPI backend
      const { data } = await $http.post<SignInResponse>("/auth/login", values);
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

      // Store user data
      sessionStorage.setItem(
        "user_session",
        JSON.stringify({
          email: authPayload.user.email,
          name: authPayload.user.name,
          role: authPayload.user.role,
        }),
      );

      await queryClient.refetchQueries({
        queryKey: userKeys.me,
        type: "active",
      });

      const destination = ADMIN_ROLES.has(authPayload.user.role)
        ? "/admin"
        : "/";
      router.replace(destination);
    } catch (error) {
      console.error("Sign in error:", error);
      if (error instanceof AxiosError) {
        if (isUnverifiedLoginError(error)) {
          await redirectUnverifiedUserToOtp(values.username, router, {
            notify: getAxiosErrorDetail(error) ?? UNVERIFIED_LOGIN_DETAIL,
          });
          return;
        }
        processError(error);
      } else {
        toast.error("Sign in failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = () => {
    setIsGoogleAuthLoading(true);
    window.location.href = `${API_URL}/auth/google`;
  };

  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSlideIndex((i) => (i + 1) % SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const slide = SLIDES[slideIndex];

  const handleFormError = (errors: FieldErrors<SignInFormField>) => {
    console.log("Form validation errors:", errors);
    // Show first error to user
    const firstError = Object.values(errors)[0];
    if (typeof firstError?.message === "string") {
      toast.error(firstError.message);
    }
  };

  return (
    <main className="w-screen bg-foreground">
      <section className="max-w-7xl mx-auto py-16 flex justify-between">
        <div className="w-150 bg-white rounded-2xl border border-[#66666650] px-20 pt-2 pb-12">
          <div className="flex justify-center">
            <Image src={"/logo.png"} alt="Logo" width={200} height={56} />
          </div>
          <div className="text-[#333333]">
            <h1 className="text-2xl mb-1 text-primary">Sign In</h1>
            <p className="font-normal mb-4">
              Don&apos;t have an account?{" "}
              <Link
                href={"/sign-up"}
                className="underline font-medium text-primary"
              >
                Sign up
              </Link>
            </p>
            <form onSubmit={form.handleSubmit(onSubmit, handleFormError)}>
              <FieldGroup>
                <FieldSet>
                  <Field>
                    <FieldLabel>Email address</FieldLabel>
                    <input
                      type="email"
                      placeholder="Enter email"
                      {...form.register("username")}
                      required
                      autoComplete="off"
                      className="border border-[#66666659] h-14 w-full outline-none bg-transparent rounded-md px-2"
                    />
                    {form.formState.errors.username && (
                      <p className="text-sm text-red-600 mt-1" role="alert">
                        {form.formState.errors.username.message}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Password</FieldLabel>
                    <div className="flex items-center justify-between pr-3 border border-[#66666659] rounded-md h-14 w-full">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...form.register("password")}
                        required
                        autoComplete="new-password"
                        aria-describedby="password-requirements"
                        className="outline-none border-none shadow-none bg-transparent px-2"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff size={16} color="black" />
                        ) : (
                          <Eye size={16} color="black" />
                        )}
                      </button>
                    </div>
                    {form.formState.errors.password && (
                      <p className="text-sm text-red-600 mt-1" role="alert">
                        {form.formState.errors.password.message}
                      </p>
                    )}
                  </Field>
                </FieldSet>
              </FieldGroup>
              <button
                type="submit"
                disabled={isLoading || !form.formState.isValid}
                className={`rounded-3xl ${form.formState.isValid ? "bg-primary" : "bg-[#11111125]"} text-white text-base flex items-center justify-center w-full py-5 mt-8 ${form.formState.isValid ? "cursor-pointer" : "cursor-not-allowed"}`}
              >
                {isLoading ? "Signing in..." : "Sign in to your account"}
              </button>
            </form>
            <div className="flex items-center justify-between gap-6 text-base text-[#666666] mt-5">
              <span className="h-px w-full bg-[#666666]" />
              OR
              <span className="h-px w-full bg-[#666666]" />
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={signInWithGoogle}
                disabled={isGoogleAuthLoading || isLoading}
                className="w-62.5 flex items-center justify-center gap-4 border border-[#333333] rounded-3xl text-[#333333] text-sm py-3 cursor-pointer"
              >
                <Image
                  src="/images/google_logo.png"
                  alt="Google Logo"
                  width={16}
                  height={16}
                />
                {isGoogleAuthLoading ? "Signing in..." : "Sign in with Google"}
              </button>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center justify-center flex-1 min-w-0">
          <div className="flex flex-col items-center max-w-md px-4">
            <h2 className="text-3xl font-semibold text-primary mb-2">
              Shop with The Shine Cartel
            </h2>
            <p
              key={slideIndex}
              className="w-full text-xl text-black text-center mb-8 min-h-18 flex items-center justify-center animate-in fade-in duration-300"
            >
              {slide.tagline}
            </p>
            <Image
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              width={400}
              height={400}
              className="rounded-2xl object-cover w-full max-w-100 h-auto aspect-square"
            />
            <div
              className="flex items-center justify-center gap-3 mt-8"
              role="tablist"
              aria-label="Promotional slides"
            >
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === slideIndex}
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setSlideIndex(i)}
                  className={`h-3 w-3 rounded-full transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    i === slideIndex
                      ? "bg-primary scale-110"
                      : "bg-black/25 hover:bg-black/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignIn;
