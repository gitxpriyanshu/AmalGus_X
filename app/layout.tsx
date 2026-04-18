import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AmalGus — India\'s First Glass & Allied Products Marketplace',
  description: 'B2B2C marketplace for glass and allied products. AI-powered matching, daily rates, multi-vendor comparison.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0A1628] text-white min-h-screen`}>
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-white/10 mt-20 py-10 text-center text-white/40 text-sm">
          <p>© 2026 AmalGus Technology. World's First B2B2C Glass & Allied Products Marketplace.</p>
          <p className="mt-1">Built for the ₹150B+ glass industry. <span className="text-[#1E88E5]"></span></p>
        </footer>
      </body>
    </html>
  )
}
