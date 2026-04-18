'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'

const navLinks = [
  { href: '/products', label: 'Products' },
  { href: '/ai-match', label: 'AI Match' },
  { href: '/quote', label: 'Get Quote' },
  { href: '/dashboard', label: 'Rates' },
  { href: '/allied', label: 'Allied' },
  { href: '/service-partners', label: 'Services' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="sticky top-0 z-50 bg-[#0A1628]/90 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1E88E5] flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">AmalGus</span>
            <span className="hidden sm:block text-xs text-white/40 ml-1">Glass Marketplace</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href}
                className="px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                {l.label}
              </Link>
            ))}
            <Link href="/ai-match"
              className="ml-2 px-4 py-2 rounded-lg bg-[#1E88E5] text-white text-sm font-medium hover:bg-[#1976D2] transition-colors">
              AI Recommend
            </Link>
          </div>
          <button className="md:hidden p-2 rounded-lg hover:bg-white/10" onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-1">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
