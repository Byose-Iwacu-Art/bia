"use client"
import { useState, useEffect } from "react";
import "./styles/globals.css";
import NavBar from "./pages/navbar";
import Footer from "./pages/footer";
import { usePathname } from "next/navigation";
import SideBar from "./comps/dash/sidebar";
import Top from "./comps/dash/top";
import { AuthModalProvider } from "./comps/auth/AuthModalContext";

// Lightweight skeleton shimmer that fades out once the page is ready
const PageSkeleton = () => (
  <div className="animate-pulse px-4 py-6 space-y-6 max-w-7xl mx-auto">
    {/* Hero placeholder */}
    <div className="h-48 sm:h-72 bg-gray-200 rounded-2xl w-full"></div>
    {/* Category row */}
    <div className="flex gap-3 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 rounded-full flex-shrink-0 w-24"></div>
      ))}
    </div>
    {/* Product grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-40 bg-gray-200 rounded-xl w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashLayout = pathname.startsWith("/dash");
  const isNoLayout = pathname.startsWith("/auth");
  const [showSiderBar, setShowSideBar] = useState<string | any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const handleShow = (p: string) => {
    setShowSideBar(p);
  };

  useEffect(() => {
    const handleContentReady = () => {
      // Fade the skeleton out smoothly instead of a hard cut
      setFadeOut(true);
      setTimeout(() => setIsLoading(false), 300);
    };

    if (document.readyState === "complete") {
      handleContentReady();
    } else {
      window.addEventListener("load", handleContentReady);
      return () => window.removeEventListener("load", handleContentReady);
    }
  }, []);

  return (
    <html lang="en">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet" />
      <link rel="shortcut icon" href="/imgs/logo.ico" type="image/x-icon" />
      <body>
        <AuthModalProvider>
        {/* Dash layout */}
        {isDashLayout ? (
          <div id="main-content" className="bg-gray-50 min-h-screen">
            <SideBar toggleButtonId={showSiderBar} />
            <Top onSidebarClick={handleShow} />
            <div className="dash-content sm:ml-[240px] mt-[64px] p-4 sm:p-6">{children}</div>
          </div>
        ) : isNoLayout ? (
          <div id="main-content">{children}</div>
        ) : (
          <>
            <NavBar />
            <main className="sm:mt-[165px] sm:mb-[20px] mt-[60px] mb-[60px]">
              <div className="relative">
                {isLoading ? (
                  <div
                    className={`transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
                  >
                    <PageSkeleton />
                  </div>
                ) : (
                  <div
                    id="main-content"
                    className="animate-[fadeIn_0.3s_ease-in-out]"
                  >
                    {children}
                  </div>
                )}
              </div>
            </main>
            <Footer />
          </>
        )}
        </AuthModalProvider>
      </body>
    </html>
  );
}
