import { DisplayModeProvider } from "../../context/Display";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DisplayModeProvider>
          {children}
        </DisplayModeProvider>
      </body>
    </html>
  );
}
