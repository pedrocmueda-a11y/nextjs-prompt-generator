import { auth } from '@/lib/auth'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  const isOnFormulario = req.nextUrl.pathname.startsWith('/formulario')
  const isOnLogin = req.nextUrl.pathname.startsWith('/login')

  if ((isOnDashboard || isOnFormulario) && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl))
  }

  if (isOnLogin && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', req.nextUrl))
  }
})

export const config = {
  matcher: ['/dashboard/:path*', '/formulario/:path*', '/login/:path*'],
}