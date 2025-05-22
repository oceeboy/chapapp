"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function Home() {
  useEffect(() => {
    const timer = setTimeout(() => {
      redirect("/login");
    }, 1000); // 2 seconds delay

    return () => clearTimeout(timer); // cleanup
  }, []);

  return (
    <section className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" />
    </section>
  );
}
