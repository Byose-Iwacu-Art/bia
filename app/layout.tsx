"use client"
import { useState, useEffect } from "react";
import "./styles/globals.css";
import NavBar from "./pages/navbar";
import Footer from "./pages/footer";
import Preloader from "./comps/forms/Preloader";
import { usePathname } from "next/navigation";
import SideBar from "./comps/dash/sidebar";
import Top from "./comps/dash/top";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDashLayout = pathname.startsWith("/dash");
  const isNoLayout = pathname.startsWith("/auth");

  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Ensure content is fully loaded (like DOM ready)
    const handleContentReady = () => {
      setIsLoading(false); // Mark as not loading when the content is ready
    };

    // Listen for when the DOM content is fully loaded
    if (document.readyState === "complete") {
      // If already loaded
      handleContentReady();
    } else {
      // Otherwise, listen for DOMContentLoaded event
      window.addEventListener("load", handleContentReady);

      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener("load", handleContentReady);
      };
    }
  }, []);

  return (
    <html lang="en">
      <link rel="shortcut icon" href="/imgs/logo.ico" type="image/x-icon"></link>
      
      <body>
          {/* Dash layout */}
        {isDashLayout ? (
          <div id="main-content">
            <SideBar />
            <Top />
            <div className="dash-content">{children}</div>
          </div>
        ) : isNoLayout ? (
         <div id="main-content">
          {children}
         </div>
        ) : (

       
          // Default layout
          <>
            <NavBar />
            <main>
              {/* Show Preloader while main content is loading */}
              <div className="relative">
                {isLoading ? (
                  <Preloader />
                ) : (
                  <div id="main-content">{children}</div>
                )}
              </div>
            </main>
            <Footer />
          </>
        )}
       
      </body>
      
    </html>
  );
}
