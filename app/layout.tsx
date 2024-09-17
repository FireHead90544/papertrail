import type { Metadata } from "next";
import { Roboto } from "next/font/google"
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { ThemeProvider } from "@/components/theme/theme-provider";

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
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<div className="container flex flex-col max-w-5xl mx-auto min-h-screen px-4 py-5">
						<Header />
						<main className="flex-1 flex">
              {children}
            </main>
						<Footer />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
