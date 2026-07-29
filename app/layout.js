import "./globals.css";

export const metadata = {
  title: "ReplyNest | Your community remembers",
  description: "A persistent Minds-powered community assistant for creators."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
