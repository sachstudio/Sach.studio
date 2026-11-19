import { SignIn } from "@clerk/nextjs";

export default function AdminSignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-16">
      <SignIn routing="path" path="/admin/sign-in" fallbackRedirectUrl="/admin" />
    </main>
  );
}
