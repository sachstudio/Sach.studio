import { SignUp } from "@clerk/nextjs";

/**
 * Only used to create the first admin login. Anyone can open this page, but nobody gets into the admin
 * unless their email is on ADMIN_EMAILS. Turn public sign-ups off in Clerk once the admin account exists.
 */
export default function AdminSignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-16">
      <SignUp routing="path" path="/admin/sign-up" signInUrl="/admin/sign-in" fallbackRedirectUrl="/admin" />
    </main>
  );
}
