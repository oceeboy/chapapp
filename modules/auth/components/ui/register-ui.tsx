"use client";
import { useAuthentication } from "@/lib/actions";
import { RegisterSchema } from "../../types";
import { useState } from "react";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../schemas";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/shared";

export function RegisterPage() {
  const {
    control,
    handleSubmit,

    reset,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const router: AppRouterInstance = useRouter();
  const [isdisabled, setIsDisabled] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const { register } = useAuthentication();

  const onSubmit = async (data: RegisterSchema) => {
    setIsDisabled(true);
    setResponseMessage(null);

    const result = await register(data);
    if (result.success) {
      toast.success(`${result.message}`);
      reset();
      if (result.user.role === "admin") {
        router.replace("/chat");
        toast.success(`Welcome, Admin ${result.user.userName} `);
      } else if (result.user.role === "user") {
        router.push("/chat");
        toast.success(`Welcome, ${result.user.userName} `);
      }
    } else {
      toast.error(`${result.message}`);
      reset();
    }
    setIsDisabled(false);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={control}
          name="userName"
          label="User Name"
          errorMessage={errors.userName?.message}
        />
        <FormField
          control={control}
          name="email"
          label="Email"
          errorMessage={errors.email?.message}
        />
        <FormField
          control={control}
          name="password"
          label="Password"
          errorMessage={errors.password?.message}
        />
        <Button
          type="submit"
          disabled={isdisabled}
          className="w-full bg-amber-600 text-white hover:bg-amber-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Sign Up
        </Button>

        <footer className="flex justify-center gap-1 text-sm">
          <p className="text-gray-600">Already have an account?</p>
          <Link href="/login" className="text-amber-600 ">
            Sign In
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
