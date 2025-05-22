"use client";

import { FormField } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { toast } from "sonner";
import { LoginSchema } from "../../types";
import { loginSchema } from "../../schemas";
import { useAuthentication } from "@/lib/actions";

export function LoginPage() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const router: AppRouterInstance = useRouter();

  const [isdisabled, setIsDisabled] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const { login } = useAuthentication();
  const onSubmit = async (data: LoginSchema) => {
    setIsDisabled(true);
    setResponseMessage(null);
    const result = await login(data);
    if (result.success) {
      toast.success(`${result.message}`);
      reset();
      if (result.user.role === "admin") {
        router.replace("/chat");
        toast.success(`Welcome, Admin ${result.user.userName} `);
      } else if (result.user.role === "user") {
        router.push("/chat");
        toast.success(`Welcome, ${result.user.userName} `);
        reset();
      }
    } else {
      toast.error(`${result.message}`);
    }
    setIsDisabled(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={control}
          name="email"
          label="Email"
          placeholder="Enter your email"
          rules={{ required: "Email is required" }}
          errorMessage={errors.email?.message}
        />
        <div>
          <FormField
            control={control}
            name="password"
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            rules={{ required: "Password is required" }}
            errorMessage={errors.password?.message}
          />
        </div>
        <Button
          type="submit"
          disabled={isdisabled}
          className="w-full bg-amber-600 text-white hover:bg-amber-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Sign In
        </Button>

        <footer className="flex justify-center gap-1 text-sm">
          <p className="text-gray-600">Don&apos;t have an account?</p>
          <Link href="/register" className="text-amber-600">
            Register
          </Link>
        </footer>
      </form>

      {responseMessage && (
        <p className="mt-2 text-center text-sm text-red-600">
          {responseMessage}
        </p>
      )}
    </>
  );
}
