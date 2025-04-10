import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Firebase Studio App',
  description: 'Generated by Firebase Studio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
              <header className="bg-gray-100 py-4">
                  <nav className="container mx-auto flex justify-between items-center">
                      <Link href="/" className="text-lg font-bold">
                          Task Manager
                      </Link>
                      <div>
                          <Link href="/login" className="mr-4">
                              Login
                          </Link>
                          <Link href="/signup" className="mr-4">
                              Signup
                          </Link>
                          {/* Add Logout button here, conditionally rendered if user is logged in */}
                      </div>
                  </nav>
              </header>
              <main className="container mx-auto py-8">
                  {children}
              </main>
          </body>
      </html>
  );
}
