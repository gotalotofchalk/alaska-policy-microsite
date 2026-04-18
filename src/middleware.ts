import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Legacy route 301 redirects.
 * Old routes → new [state] module locations.
 */
const REDIRECTS: Record<string, string> = {
  // Alaska legacy routes
  "/assess": "/alaska/need",
  "/map": "/alaska/connectivity",
  "/portfolio-builder": "/alaska/portfolio",
  "/calculator": "/alaska/portfolio",
  "/framework": "/alaska/data-methodology",
  "/methods": "/alaska/data-methodology",
  "/alaska": "/alaska/overview",

  // Kentucky legacy routes
  "/kentucky": "/kentucky/overview",
  "/kentucky/satellite-planner": "/kentucky/connectivity",
  "/kentucky/cybersecurity": "/kentucky/capacity",
  "/kentucky/biointellisense": "/kentucky/portfolio",
  "/kentucky/data": "/kentucky/data-methodology",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const target = REDIRECTS[pathname];

  if (target) {
    const url = request.nextUrl.clone();
    url.pathname = target;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/assess",
    "/map",
    "/portfolio-builder",
    "/calculator",
    "/framework",
    "/methods",
    "/alaska",
    "/kentucky",
    "/kentucky/satellite-planner",
    "/kentucky/cybersecurity",
    "/kentucky/biointellisense",
    "/kentucky/data",
  ],
};
