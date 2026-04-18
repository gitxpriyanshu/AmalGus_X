'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [role, setRole] = useState('homeowner')

  useEffect(() => {
    const r = typeof window !== 'undefined' ? localStorage.getItem('amalgus_role') || 'homeowner' : 'homeowner'
    setRole(r)
    
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleRoleChange = (newRole: string) => {
    localStorage.setItem('amalgus_role', newRole)
    window.location.reload()
  }

  const roleColors: Record<string, string> = {
    homeowner: 'text-green-400',
    architect: 'text-blue-400',
    builder: 'text-amber-400',
    dealer: 'text-amber-400'
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${isScrolled ? 'py-3' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`glass-card flex items-center justify-between px-6 py-2.5 border-white/5 shadow-2xl transition-all duration-500 ${isScrolled ? 'bg-black/60 backdrop-blur-3xl' : 'bg-transparent border-transparent shadow-none'}`}>
          <div className="flex items-center gap-10">
            <Link href="/" className="text-xl font-bold tracking-tighter transition-transform hover:scale-105">
              <span className="text-white">Amal</span><span className="text-[#1E88E5]">Gus</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              {[
                { name: 'Catalogue', href: '/products' },
                { name: 'AI Expert', href: '/ai-match' },
                { name: 'Estimation', href: '/quote' },
              ].map(item => (
                <Link key={item.name} href={item.href} className="text-[13px] font-medium text-white/50 hover:text-white transition-all relative group">
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#1E88E5] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest group cursor-pointer hover:bg-white/10 transition-all">
                <span className={`w-1.5 h-1.5 rounded-full bg-current ${roleColors[role] || 'text-[#1E88E5]'} animate-pulse`} />
                <select 
                   value={role} 
                   onChange={(e) => handleRoleChange(e.target.value)}
                   className="bg-transparent text-white/60 focus:outline-none appearance-none cursor-pointer group-hover:text-white transition-colors"
                >
                   <option value="homeowner" className="bg-[#0A1628]">Homeowner</option>
                   <option value="architect" className="bg-[#0A1628]">Architect</option>
                   <option value="builder" className="bg-[#0A1628]">Builder</option>
                   <option value="dealer" className="bg-[#0A1628]">Dealer</option>
                </select>
             </div>
             
             <Link href="/ai-match" className="px-5 py-2 rounded-xl bg-[#1E88E5] text-white text-xs font-bold hover:bg-[#1976D2] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#1E88E5]/20">
               Build Project
             </Link>

             <button className="md:hidden p-2 text-white/60 hover:text-white" onClick={() => setOpen(!open)}>
               {open ? <X size={20} /> : <Menu size={20} />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden mt-4 mx-4 glass-card p-6 space-y-4 reveal active">
          {[
            { name: 'Glass Catalogue', href: '/products' },
            { name: 'AI Match Tool', href: '/ai-match' },
            { name: 'Digital Estimate', href: '/quote' },
          ].map(item => (
            <Link key={item.name} href={item.href} onClick={() => setOpen(false)} className="block text-lg font-medium text-white/70 hover:text-white">
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
