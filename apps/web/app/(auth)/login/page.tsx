"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { LoginForm } from "~/components/login-form";

export default function Page() {
  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
