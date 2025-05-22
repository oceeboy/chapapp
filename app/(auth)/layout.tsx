"use client";

import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";
// import Image from "next/image";
import { Toaster } from "sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRedirectIfAuthenticated();
  return (
    <>
      <Toaster richColors />
      <main className="relative flex min-h-screen w-full items-center justify-center font-inter">
        {/* Background image as full cover */}
        {/* <Image
          src="/images/bgdesktop2.jpg"
          alt="Auth image"
          fill
          className="absolute inset-0 -z-10 object-cover"
          priority
        /> */}

        {/* Optional dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-800 to-pink-500 -z-10 " />

        {/* Centered content */}
        <section className="z-10 w-full  px-6">{children}</section>
      </main>
    </>
  );
}
