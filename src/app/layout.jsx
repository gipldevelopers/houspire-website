import "./globals.css";
import "@/styles/theme.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ContentProtection } from "@/components/ContentProtection";

export const metadata = {
  title: "Houspire - Interior Design Made Simple",
  description: "Get professional interior design for your home",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <ContentProtection />
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
