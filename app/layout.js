import "./globals.css";

export const metadata = {
  title: "提示词库",
  description: "美妆提示词搜索库",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased text-gray-900 bg-gray-50">
        {children}
      </body>
    </html>
  );
}