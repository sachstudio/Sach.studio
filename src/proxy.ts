import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isSignIn = createRouteMatcher(["/admin/sign-in(.*)", "/admin/sign-up(.*)"]);
const isAdminPage = createRouteMatcher(["/admin(.*)"]);

/*
 * Clerk runs only on the admin and the upload route, so the public site never depends on it.
 * Admin pages send signed-out visitors to the sign-in page; whether a signed-in user is on the
 * allowlist is checked by requireAdmin() in the admin layout, actions and the upload route.
 */
export default clerkMiddleware(async (auth, req) => {
  if (isAdminPage(req) && !isSignIn(req)) await auth.protect();
});

export const config = {
  matcher: ["/admin/:path*", "/api/upload"],
};
