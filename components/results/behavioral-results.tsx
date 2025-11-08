"use client"

export function BehavioralResults({ anomalyScore }) {
  const getColor = () => {
    if (anomalyScore <= 30) return { bg: "bg-emerald-500", text: "text-emerald-400" }
    if (anomalyScore <= 70) return { bg: "bg-amber-500", text: "text-amber-400" }
    return { bg: "bg-red-500", text: "text-red-400" }
  }

  const getLabel = () => {
    if (anomalyScore <= 30) return "CLEAN"
    if (anomalyScore <= 70) return "SUSPICIOUS"
    return "BOTNET"
  }

  const colors = getColor()
  const percentage = anomalyScore

  return (
    <div className="p-6 rounded-lg bg-slate-800 border border-slate-700 shadow-lg flex flex-col items-center">
      <h3 className="font-semibold text-slate-100 mb-6">Behavior-Based Results</h3>

      <div className="relative w-32 h-32 mb-4">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="64" cy="64" r="56" fill="none" stroke="rgb(30, 41, 59)" strokeWidth="8" />
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={`${(2 * Math.PI * 56 * percentage) / 100} ${2 * Math.PI * 56}`}
            className={colors.text}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${colors.text}`}>{percentage}</span>
          <span className="text-xs text-slate-400">%</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-slate-400 mb-1">Anomaly Score</p>
        <p className={`font-bold text-lg ${colors.text}`}>{getLabel()}</p>
      </div>
    </div>
  )
}
