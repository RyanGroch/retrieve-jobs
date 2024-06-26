import { type Metadata } from "next";
import "./globals.css";
import MainLayout from "@/components/MainLayout/MainLayout";

export const metadata: Metadata = {
  title: "Retrieve Jobs",
  description: "An app for retrieving job output from mainframes"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainLayout>{children}</MainLayout>;
}
