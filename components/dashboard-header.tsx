"use client"

import { Shield, Download } from "lucide-react"
import { useState, useEffect } from "react"

export function Header({ onDownloadReport }) {
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating((prev) => !prev)
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
      <div className="px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`transition-transform duration-500 ${isAnimating ? "scale-110" : "scale-100"}`}>
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Botnet Detection System</h1>
        </div>

        <button
          onClick={onDownloadReport}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Download Report</span>
        </button>
      </div>
    </header>
  )
}
