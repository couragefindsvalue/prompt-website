import { NextResponse } from 'next/server';

export function middleware(req) {
  // 获取浏览器弹出的 Basic Auth 认证信息
  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    // 用户名固定为 admin，密码从环境变量读取
    if (user === 'admin' && pwd === process.env.ADMIN_PASSWORD) {
      return NextResponse.next();
    }
  }

  // 如果没登录或密码错，返回 401 让浏览器弹出密码框
  return new NextResponse('需要授权', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
  });
}

// 只拦截 /admin 路径，不影响首页和其他页面
export const config = {
  matcher: '/admin/:path*',
};