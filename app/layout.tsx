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
          href="https://fonts.googleapis.com/css2?family=Alegreya+Sans+SC:wght@100&family=Josefin+Sans:wght@100&family=League+Script&family=Montserrat+Alternates:wght@200&display=swap"
          rel="stylesheet"
        />
      </head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <body>
          <main>
            <header>
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
            </header>
            {children}
            <footer></footer>
          </main>
        </body>
      </ThemeProvider>
    </html>
  );
}
