import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F172A]" />}>
      <LoginForm />
    </Suspense>
  );
}
