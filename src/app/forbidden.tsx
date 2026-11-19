import Link from "next/link";

export default function Forbidden() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-serif text-5xl text-neutral-950">Not authorised</h1>
      <p className="max-w-md text-lg text-neutral-600">
        This account is signed in, but it is not on the admin list for this site. Ask the site owner to add your email
        address, or sign in with a different account.
      </p>
      <Link href="/" className="font-semibold text-blue-500 underline underline-offset-4">
        Back to the website
      </Link>
    </main>
  );
}
