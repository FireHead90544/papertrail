import type { Metadata } from "next";
import { Roboto } from "next/font/google"
import "./globals.css";

const font = Roboto({
	weight: ["100", "300", "400", "500", "700", "900"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PaperTrail",
  description: "Publications summary generator for faculty profile building. Team That1Bit's submission for Smart India Hackathon 2024 for the problem statement SIH 1614.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
