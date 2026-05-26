import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/components/Provider";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Meal calorie tracker",
  description: "A simple meal calorie tracker built with Next.js, TypeScript, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}:{
  children: React.ReactNode;
}){
  return (
    <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen flex flex-col">
          <Provider>
              <Header />
              {children}
          </Provider>
        </body>
    </html>
  );
}
