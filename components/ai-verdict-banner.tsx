"use client"

import { AlertTriangle, CheckCircle, AlertCircle, ChevronDown } from "lucide-react"
import { useState } from "react"

export function AIVerdictBanner({ results }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getVerdictColors = () => {
    switch (results.verdict) {
      case "INFECTED":
        return {
          bg: "bg-red-600",
          border: "border-red-500",
          icon: AlertTriangle,
          label: "INFECTED",
        }
      case "SUSPICIOUS":
        return {
          bg: "bg-amber-500",
          border: "border-amber-400",
          icon: AlertCircle,
          label: "SUSPICIOUS",
        }
      default:
        return {
          bg: "bg-emerald-600",
          border: "border-emerald-500",
          icon: CheckCircle,
          label: "CLEAN",
        }
    }
  }

  const getRiskLevelColor = () => {
    switch (results.riskLevel) {
      case "CRITICAL":
        return "bg-red-500"
      case "HIGH":
        return "bg-orange-500"
      case "MEDIUM":
        return "bg-amber-500"
      default:
        return "bg-emerald-500"
    }
  }

  const verdict = getVerdictColors()
  const VerdictIcon = verdict.icon

  const timestamp = new Date(results.timestamp).toLocaleString()

  return (
    <div
      className={`rounded-lg border-2 ${verdict.border} ${verdict.bg}/20 overflow-hidden animate-in fade-in-50 duration-500`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full ${verdict.bg} text-white p-6 flex items-center justify-between hover:opacity-90 transition-opacity`}
      >
        <div className="flex items-center gap-4">
          <VerdictIcon className="w-8 h-8" />
          <div className="text-left">
            <p className="text-2xl font-bold">{verdict.label}</p>
            <p className="text-sm opacity-90">Analysis completed at {timestamp}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${getRiskLevelColor()} text-white`}>
            {results.riskLevel}
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      {isExpanded && (
        <div className="p-6 bg-slate-800/50">
          <h4 className="font-semibold text-slate-100 mb-3">AI Analysis & Recommendations</h4>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">{results.aiExplanation}</p>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-300">Recommendations:</p>
            <ul className="space-y-1 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                <span>Monitor network activity for unusual patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                <span>Keep antivirus definitions updated</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                <span>Review host-based detection alerts regularly</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
