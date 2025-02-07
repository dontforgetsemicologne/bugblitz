import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from 'next-auth/react'

export const metadata: Metadata = {
  title: "Bug Blitz",
  description: "A full-stack bug tracking system leveraging Next.js for the frontend, MongoDB for the database, and Prisma for ORM. Features include user authentication, role-based access control, and detailed bug reporting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className='antialiased'>
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
