import "./globals.css";
import Sidebar from "../components/layout/Sidebar";

export const metadata = {
  title: "Command Center — Alexandre Santos",
  description: "AI-powered training & work dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface-950 text-gray-100 font-sans" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <Sidebar />
        <main className="ml-[260px] min-h-screen">
          <div className="page-enter">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
