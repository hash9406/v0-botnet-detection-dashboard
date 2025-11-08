"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, HistoryIcon, BookOpen } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Detection", icon: Shield },
    { href: "/signature-details", label: "Signature", icon: Shield },
    { href: "/host-details", label: "Host-Based", icon: Shield },
    { href: "/behavioral-details", label: "Behavioral", icon: Shield },
    { href: "/history", label: "History", icon: HistoryIcon },
    { href: "/about", label: "About", icon: BookOpen },
  ]

  return (
    <nav className="border-b border-slate-800 bg-slate-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-blue-400">
            <Shield className="w-6 h-6" />
            BotNet Detector
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <span className="text-sm text-slate-400">Quick Links</span>
          </div>
        </div>
      </div>
    </nav>
  )
}
