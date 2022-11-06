import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head></head>

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
    </html>
  );
}
