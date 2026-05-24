"use client";

import { FirebaseError } from "firebase/app";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { FcGoogle } from "react-icons/fc";

import { useAuth } from "@/context/AuthContext";

type AuthFormProps = {
  mode: "login" | "register";
};

function getFirebaseMessage(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return error instanceof Error ? error.message : "Something went wrong. Please try again.";
  }

  const messages: Record<string, string> = {
    "auth/email-already-in-use": "That email is already registered. Try signing in instead.",
    "auth/invalid-credential": "The email or password is incorrect.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/popup-closed-by-user": "Google sign-in was closed before it finished.",
    "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/user-not-found": "No account exists for that email.",
    "auth/wrong-password": "The email or password is incorrect.",
  };

  return messages[error.code] ?? error.message;
}

export function AuthForm({ mode }: AuthFormProps) {
  const isRegister = mode === "register";
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading, login, loginWithGoogle, register, resetPassword, user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  const redirectTo = useMemo(() => {
    const redirect = searchParams.get("redirect");
    return redirect?.startsWith("/") ? redirect : "/";
  }, [searchParams]);

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectTo);
    }
  }, [loading, redirectTo, router, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setPending(true);

    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }

      router.replace(redirectTo);
    } catch (caughtError) {
      setError(getFirebaseMessage(caughtError));
    } finally {
      setPending(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setNotice("");
    setPending(true);

    try {
      await loginWithGoogle();
      router.replace(redirectTo);
    } catch (caughtError) {
      setError(getFirebaseMessage(caughtError));
    } finally {
      setPending(false);
    }
  }

  async function handlePasswordReset() {
    setError("");
    setNotice("");

    if (!email.trim()) {
      setError("Enter your email first, then request a password reset.");
      return;
    }

    setPending(true);

    try {
      await resetPassword(email);
      setNotice("Password reset email sent. Check your inbox.");
    } catch (caughtError) {
      setError(getFirebaseMessage(caughtError));
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0F] px-4 py-6 text-[#F0F0F5] sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-lg border border-[#1E1E2E] bg-[#111118] lg:grid-cols-[1fr_420px]">
          <section className="hidden bg-[#0D0D14] p-10 lg:flex lg:flex-col lg:justify-between">
            <Link href="/" className="flex items-center gap-3 text-lg font-semibold">
              <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#4F8EF7] to-[#7C5CFC]">
                <Sparkles size={18} />
              </span>
              ResumeIQ
            </Link>

            <div className="max-w-xl">
              <p className="mb-4 font-mono text-sm text-[#4F8EF7]">
                AI resume intelligence
              </p>
              <h1 className="mb-5 max-w-lg text-4xl leading-tight text-[#F0F0F5]">
                {isRegister ? "Create your account and start improving faster." : "Welcome back. Your resume workspace is ready."}
              </h1>
              <p className="text-lg leading-8 text-[#8888A0]">
                Upload a resume, compare it with live role requirements, and keep your analysis attached to your secure account.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm text-[#8888A0]">
              <div className="rounded-lg border border-[#1E1E2E] bg-[rgba(255,255,255,0.03)] p-4">
                <div className="mb-1 text-xl text-[#F0F0F5]">10k+</div>
                Analyzed
              </div>
              <div className="rounded-lg border border-[#1E1E2E] bg-[rgba(255,255,255,0.03)] p-4">
                <div className="mb-1 text-xl text-[#F0F0F5]">94%</div>
                Match lift
              </div>
              <div className="rounded-lg border border-[#1E1E2E] bg-[rgba(255,255,255,0.03)] p-4">
                <div className="mb-1 text-xl text-[#F0F0F5]">24/7</div>
                Access
              </div>
            </div>
          </section>

          <section className="p-6 sm:p-8">
            <div className="mb-8 lg:hidden">
              <Link href="/" className="flex items-center gap-3 text-lg font-semibold">
                <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#4F8EF7] to-[#7C5CFC]">
                  <Sparkles size={18} />
                </span>
                ResumeIQ
              </Link>
            </div>

            <div className="mb-7">
              <h1 className="mb-2 text-3xl text-[#F0F0F5]">
                {isRegister ? "Create account" : "Sign in"}
              </h1>
              <p className="text-sm text-[#8888A0]">
                {isRegister ? "Use email/password or continue with Google." : "Continue with your email/password or Google account."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={pending}
              className="mb-5 flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] text-sm text-[#F0F0F5] transition-all duration-200 hover:border-[#4F8EF7] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FcGoogle className="size-5" />
              Continue with Google
            </button>

            <div className="mb-5 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#1E1E2E]" />
              <span className="text-xs text-[#44445A]">or</span>
              <div className="h-px flex-1 bg-[#1E1E2E]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister ? (
                <label className="block">
                  <span className="mb-2 block text-sm text-[#B8B8C8]">Name</span>
                  <span className="relative block">
                    <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8888A0]" />
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      placeholder="Dhiraj Sharma"
                      className="h-11 w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] pl-10 pr-3 text-[#F0F0F5] outline-none transition-all duration-200 placeholder:text-[#44445A] focus:border-[#4F8EF7] focus:ring-1 focus:ring-[#4F8EF7]"
                    />
                  </span>
                </label>
              ) : null}

              <label className="block">
                <span className="mb-2 block text-sm text-[#B8B8C8]">Email</span>
                <span className="relative block">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8888A0]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    placeholder="you@example.com"
                    className="h-11 w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] pl-10 pr-3 text-[#F0F0F5] outline-none transition-all duration-200 placeholder:text-[#44445A] focus:border-[#4F8EF7] focus:ring-1 focus:ring-[#4F8EF7]"
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-[#B8B8C8]">Password</span>
                <span className="relative block">
                  <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8888A0]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={6}
                    required
                    placeholder="At least 6 characters"
                    className="h-11 w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] pl-10 pr-11 text-[#F0F0F5] outline-none transition-all duration-200 placeholder:text-[#44445A] focus:border-[#4F8EF7] focus:ring-1 focus:ring-[#4F8EF7]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-[#8888A0] hover:bg-[#1A1A24] hover:text-[#F0F0F5]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </span>
              </label>

              {!isRegister ? (
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={pending}
                  className="text-sm text-[#4F8EF7] transition-colors hover:text-[#7C5CFC] disabled:opacity-60"
                >
                  Forgot password?
                </button>
              ) : null}

              {error ? (
                <div className="rounded-lg border border-[#EF4444]/40 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">
                  {error}
                </div>
              ) : null}

              {notice ? (
                <div className="rounded-lg border border-[#22C55E]/40 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">
                  {notice}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={pending}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] text-sm text-[#F0F0F5] transition-all duration-200 hover:shadow-[0_0_24px_rgba(79,142,247,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? "Please wait" : isRegister ? "Create account" : "Sign in"}
                <ArrowRight size={16} />
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#8888A0]">
              {isRegister ? "Already have an account?" : "New to ResumeIQ?"}{" "}
              <Link
                href={isRegister ? "/login" : "/register"}
                className="text-[#4F8EF7] transition-colors hover:text-[#7C5CFC]"
              >
                {isRegister ? "Sign in" : "Create account"}
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
