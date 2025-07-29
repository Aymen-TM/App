import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // In a real app, you should use HTTP-only cookies for authentication
  // This is a simplified version for development
  const path = request.nextUrl.pathname
  const isVendorPath = path.startsWith('/dashboard-vendeur')
  
  // Check if the user is trying to access the vendor dashboard
  if (isVendorPath) {
    // For development, we'll check for a query parameter
    // In production, use proper session management
    const token = request.nextUrl.searchParams.get('dev') === 'true' 
      ? 'demo-token' 
      : request.cookies.get('vendorToken')?.value
    
    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL('/login-vendeur', request.url)
      loginUrl.searchParams.set('from', path)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/dashboard-vendeur/:path*',
    // Add other protected paths here
  ],
}
