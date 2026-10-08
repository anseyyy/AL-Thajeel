import { Fraunces, Public_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/fixed/Header";
import Footer from "@/components/fixed/Footer";
import TimeTheme from "@/components/common/TimeTheme";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--serif",
  display: "swap",
  weight: ["400", "600", "700"],
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--sans",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Al-Thajeel Real Estates  UAE Properties",
  description:
    "Villas, houses, flats, offices, shops and staff accommodations across Dubai, Abu Dhabi and Sharjah.",
  icons: {
    icon: [
      { url: "/images/logo/althajeellogo.webp" },
      { url: "/favicon.ico" },
    ],
    shortcut: ["/images/logo/althajeellogo.webp"],
    apple: [
      { url: "/images/logo/althajeellogo.webp" },
    ],
  },
};

import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${publicSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var h = new Date().getHours();
                var t = (h >= 6 && h < 18) ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', t);
              } catch (e) {}
            })()`,
          }}
        />
      </head>
      <body>
        <ToastProvider>
          <AuthProvider>
            <TimeTheme />
            <Header />
            <main>{children}</main>
            <Footer />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
