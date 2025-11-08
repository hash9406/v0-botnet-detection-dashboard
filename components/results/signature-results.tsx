"use client"

import { ChevronDown, CheckCircle } from "lucide-react"
import { useState } from "react"

export function SignatureResults({ matches }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const threatCount = matches.length

  return (
    <div className="p-6 rounded-lg bg-slate-800 border border-slate-700 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-100">Signature-Based Results</h3>
        <div
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            threatCount > 0 ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"
          }`}
        >
          {threatCount} Found
        </div>
      </div>

      {threatCount === 0 ? (
        <div className="flex items-center gap-2 text-emerald-400">
          <CheckCircle className="w-5 h-5" />
          <p className="text-sm">No known malicious signatures detected</p>
        </div>
      ) : (
        <button onClick={() => setIsExpanded(!isExpanded)} className="w-full text-left">
          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded hover:bg-slate-700 transition-colors">
            <span className="text-sm text-slate-300">View Threats</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </div>

          {isExpanded && (
            <div className="mt-2 space-y-2">
              {matches.map((match, idx) => (
                <div key={idx} className="p-2 bg-slate-700/30 rounded border border-slate-600 text-xs">
                  <p className="text-red-400 font-mono">{match.ip}</p>
                  <p className="text-slate-400">{match.type}</p>
                </div>
              ))}
            </div>
          )}
        </button>
      )}
    </div>
  )
}
