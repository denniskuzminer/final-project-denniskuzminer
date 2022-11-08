"use client";

import "./globals.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "./theme/themes";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <main>
            <header>
              <center>
                <nav>
                  <ul>
                    <li>
                      <a href="./">Home</a>
                    </li>
                    <li>
                      <a href="./backtest">Backtest</a>
                    </li>
                  </ul>
                </nav>
              </center>
            </header>
            {children}
            <footer></footer>
          </main>
        </body>
      </ThemeProvider>
    </html>
  );
}
