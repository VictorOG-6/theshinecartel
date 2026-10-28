"use client";

import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FieldErrors, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { AxiosError } from "axios";
import { $http } from "@/lib/http";
import { useRouter } from "next/navigation";
import processError from "@/lib/error";
import {
  getAxiosErrorDetail,
  isEmailAlreadyRegisteredError,
  redirectUnverifiedUserToOtp,
  storePendingVerificationEmail,
} from "@/lib/verification-flow";
import { API_URL } from "@/lib/constants";
import { toast } from "sonner";

const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z
      .string()
      .email()
      .toLowerCase()
      .trim()
      .min(2, "Email must be at least 2 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine(
        (password) => {
          const hasUppercase = /[A-Z]/.test(password);
          const hasSpecialChar = /[!@#$%^&*(),.?:"|{}<>]/.test(password);
          const hasNumber = /[0-9]/.test(password);
          const hasMinLength = password.length >= 8;
          return hasUppercase && hasMinLength && hasSpecialChar && hasNumber;
        },
        {
          message:
            "Password must contain at least one uppercase letter, one special character, one number, and be at least 8 characters long.",
        },
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormField = z.infer<typeof signUpSchema>;

type SignUpResponse = {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

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

const SignUp = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [showPasswordValidation, setShowPasswordValidation] =
    useState<boolean>(false);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleAuthLoading, setIsGoogleAuthLoading] =
    useState<boolean>(false);
  const [passwordValidation, setPasswordValidation] = useState({
    hasUpperCase: false,
    hasSpecialChar: false,
    hasNumber: false,
    hasMinLength: false,
  });

  const form = useForm<SignUpFormField>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const watchPassword = form.watch("password");
  const watchConfirmPassword = form.watch("confirmPassword");

  useEffect(() => {
    const hasUpperCase = /[A-Z]/.test(watchPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?:"|{}<>]/.test(watchPassword);
    const hasNumber = /[0-9]/.test(watchPassword);
    const hasMinLength = watchPassword.length >= 8;

    setPasswordValidation({
      hasUpperCase,
      hasSpecialChar,
      hasNumber,
      hasMinLength,
    });

    if (watchPassword && watchPassword.length > 0) {
      setShowPasswordValidation(true);
    } else {
      setShowPasswordValidation(false);
    }
  }, [watchPassword]);

  useEffect(() => {
    if (watchConfirmPassword) {
      form.trigger("confirmPassword");
    }
  }, [watchPassword, watchConfirmPassword, form]);

  const passwordRequirements = [
    { key: "hasMinLength", label: "Password must be a minimum of 8 letters" },
    { key: "hasUpperCase", label: "An uppercase letter must be used" },
    { key: "hasNumber", label: "A number must be used" },
    { key: "hasSpecialChar", label: "A special character must be used" },
  ];

  const passwordsMatch =
    watchConfirmPassword && watchPassword === watchConfirmPassword;
  const passwordsDontMatch =
    watchConfirmPassword && watchPassword !== watchConfirmPassword;
  const isValidSubmit = form.formState.isValid && acceptTerms;

  const onSubmit: SubmitHandler<SignUpFormField> = async (values) => {
    setIsLoading(true);

    try {
      const { data } = await $http.post<SignUpResponse>("/user", {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      storePendingVerificationEmail(values.email);
      toast.success(
        data.message ?? "Account created. Please verify your email.",
      );
      router.replace(`/verify-otp?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      console.error("Sign up error:", error);
      if (error instanceof AxiosError) {
        const detail = getAxiosErrorDetail(error);

        if (detail && isEmailAlreadyRegisteredError(detail)) {
          await redirectUnverifiedUserToOtp(values.email, router, {
            notify:
              "This email is already registered. Verify your email to continue.",
          });
          return;
        }

        processError(error);
      } else {
        toast.error("Sign up failed. Please try again.");
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

  const handleFormError = (errors: FieldErrors<SignUpFormField>) => {
    console.log("Form validation errors:", errors);
    // Show first error to user
    const firstError = Object.values(errors)[0];
    if (typeof firstError?.message === "string") {
      toast.error(firstError.message);
    }
  };

  return (
    <main className="bg-foreground w-screen h-screen">
      <section className="max-w-7xl mx-auto py-16 flex justify-between">
        <div className="w-150 bg-white rounded-2xl border border-[#66666650] px-20 pt-2 pb-12">
          <div className="flex justify-center">
            <Image src={"/logo.png"} alt="Logo" width={200} height={56} />
          </div>
          <div className="text-[#333333]">
            <h1 className="text-2xl mb-1 text-primary">Sign Up</h1>
            <p className="font-normal mb-4">
              Already have an account?{" "}
              <Link
                href={"/sign-in"}
                className="underline font-medium text-primary"
              >
                Log in
              </Link>
            </p>
            <form onSubmit={form.handleSubmit(onSubmit, handleFormError)}>
              <FieldGroup>
                <FieldSet>
                  <Field>
                    <FieldLabel>Full Name</FieldLabel>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      {...form.register("name")}
                      required
                      autoComplete="off"
                      className="border border-[#66666659] h-14 w-full outline-none bg-transparent rounded-md px-2"
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-600 mt-1" role="alert">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Email address</FieldLabel>
                    <input
                      type="email"
                      placeholder="Enter email"
                      {...form.register("email")}
                      required
                      autoComplete="off"
                      className="border border-[#66666659] h-14 w-full outline-none bg-transparent rounded-md px-2"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1" role="alert">
                        {form.formState.errors.email.message}
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
                    {showPasswordValidation && (
                      <div>
                        {passwordRequirements.map(({ key, label }) => {
                          const isValid =
                            passwordValidation[
                              key as keyof typeof passwordValidation
                            ];
                          return (
                            <div key={key} className="flex items-center gap-2">
                              <div
                                className={`flex items-center justify-center w-4 h-4 rounded-sm border ${isValid ? "border-green-500 bg-green-500" : "border-red-500"}`}
                              >
                                {isValid && <Check size={14} color="white" />}
                              </div>
                              <p
                                className={`${isValid ? "text-green-600" : "text-red-600"}`}
                              >
                                {label}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {form.formState.errors.password && (
                      <p className="text-sm text-red-600 mt-1" role="alert">
                        {form.formState.errors.password.message}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Confirm Password</FieldLabel>
                    <div className="flex items-center justify-between pr-3 border border-[#66666659] rounded-md h-14 w-full">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        {...form.register("confirmPassword")}
                        autoComplete="new-password"
                        aria-describedby="confirm-password-status"
                        className="border-none outline-none shadow-none bg-transparent px-2"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} color="black" />
                        ) : (
                          <Eye size={16} color="black" />
                        )}
                      </button>
                    </div>
                    {passwordsMatch && (
                      <div className="flex items-center gap-2 mt-2">
                        <Check size={14} color="text-green-500" />
                        <p className="text-sm text-green-500">
                          Passwords match
                        </p>
                      </div>
                    )}
                    {passwordsDontMatch && (
                      <div className="flex items-center gap-2 mt-2">
                        <X size={14} color="text-red-500" />
                        <p className="text-sm text-red-500">
                          Passwords don&apos;t match
                        </p>
                      </div>
                    )}
                    {form.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-600 mt-1" role="alert">
                        {form.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </Field>
                </FieldSet>
              </FieldGroup>
              <div className="flex items-center gap-2 mt-3">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="accent-primary cursor-pointer"
                />
                <p className="text-sm">
                  By creating an account, I agree to our{" "}
                  <Link
                    href={"/terms-and-condition"}
                    className="underline text-primary"
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href={"/privacy-policy"}
                    className="underline text-primary"
                  >
                    Privacy Policy
                  </Link>{" "}
                </p>
              </div>
              <button
                type="submit"
                disabled={isLoading || !isValidSubmit}
                className={`rounded-3xl ${isValidSubmit ? "bg-primary" : "bg-[#11111125]"} text-white text-base flex items-center justify-center w-full py-5 mt-8 ${isValidSubmit ? "cursor-pointer" : "cursor-not-allowed"}`}
              >
                {isLoading ? "Creating..." : "Create an account"}
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
                {isGoogleAuthLoading ? "Signing up..." : "Sign up with Google"}
              </button>
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center">
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

export default SignUp;
