"use client";

import type { ReactNode, FC } from "react";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "next-themes";
import ThemeSwitchButton from "./components/ThemeSwitchButton/ThemeSwitchButton";

type Props = {
  children: ReactNode;
};

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"]
});

const MainLayout: FC<Props> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider attribute="class">
          <div className="relative min-h-svh before:absolute before:inset-0 before:-z-10 before:bg-light before:transition-opacity after:absolute after:inset-0 after:-z-10 after:bg-dark after:opacity-0 after:transition-opacity before:dark:opacity-0 after:dark:opacity-100">
            <main>{children}</main>
            <ThemeSwitchButton />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default MainLayout;
