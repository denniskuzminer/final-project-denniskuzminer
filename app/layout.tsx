"use client";

import {
  ThemeProvider,
  CssBaseline,
  Tabs,
  Tab,
  Typography,
  Toolbar,
  AppBar,
} from "@mui/material";
import { theme } from "./theme/themes";
import { SyntheticEvent, useState } from "react";
import Backtest from "./backtest/page";
import Landing from "./page";

import "./globals.css";
import CustomDrawer from "./CustomDrawer";

interface User {
  username: String;
  hash: String;
  favorites: Array<Object>;
  strategies: Array<Object>;
  backtests: Array<Object>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [page, setPage] = useState("Search");
  const [user, setUser] = useState<User>({} as User);
  const props = { user, setUser };

  const handlePageChange = (event: SyntheticEvent, newValue: string) => {
    setPage(newValue);
  };

  return (
    <html>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@500&display=swap"
          rel="stylesheet"
        />
      </head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <body>
          <main className="root">
            <header>
              <Tabs centered value={page} onChange={handlePageChange}>
                <Tab value="Search" label="Search" />
                <Tab value="Backtest" label="Backtest" />
              </Tabs>
            </header>
            {page === "Search" ? (
              <Landing {...props} />
            ) : (
              <Backtest {...props} />
            )}
            <footer></footer>
          </main>
        </body>
      </ThemeProvider>
    </html>
  );
}
