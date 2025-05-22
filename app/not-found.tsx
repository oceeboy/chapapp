"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <section className="flex min-h-screen w-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="max-w-md">
        <h1 className="text-5xl font-extrabold tracking-tight text-primary">
          404
        </h1>
        <p className="mt-4 text-xl font-semibold text-muted-foreground">
          Page Not Found
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Sorry, the page you are looking for doesn&apos;t exist or you
          don&apos;t have permission to view it.
        </p>
        <Button
          onClick={goBack}
          className="mt-6 w-full bg-primary text-white hover:bg-primary/90"
          size="lg"
        >
          Go Back
        </Button>
      </div>
    </section>
  );
}
