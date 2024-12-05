import localFont from "next/font/local";
import "./globals.css";
import "./custom.css";
import Header from "./_utilities/Header";
import Footer from "./_utilities/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "CAPTURED.",
  description: "CaptureIt for inspireation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className={`flex min-h-screen flex-col items-center justify-between lg:py-5 py-3`}>
        {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
