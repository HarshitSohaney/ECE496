// File: app/layout.js
import { Provider } from "jotai";
import "./globals.css";

export const metadata = {
  title: "AR Creation Platform",
  description: "Create AR experiences with ease",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
