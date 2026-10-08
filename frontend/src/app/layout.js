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
  title: "Al Dhiyafah Properties — UAE Real Estate",
  description:
    "Villas, flats, kiosks and warehouses across Dubai, Abu Dhabi and Sharjah — handled by a team that actually answers the phone.",
};

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
                var t = (h >= 5 && h < 12) ? 'morning' : (h >= 12 && h < 17) ? 'afternoon' : (h >= 17 && h < 20) ? 'evening' : 'night';
                document.documentElement.setAttribute('data-theme', t);
              } catch (e) {}
            })()`,
          }}
        />
      </head>
      <body>
        <TimeTheme />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
