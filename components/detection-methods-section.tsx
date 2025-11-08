"use client"

import { Shield, Cpu, Network, CheckCircle, Clock } from "lucide-react"
import { Spinner } from "./spinner"

const methods = [
  {
    id: "signature",
    title: "Signature-Based Detection",
    icon: Shield,
    description: "Database matching against known threats",
  },
  {
    id: "hostBased",
    title: "Host-Based Detection",
    icon: Cpu,
    description: "Process and system monitoring",
  },
  {
    id: "behavioral",
    title: "Behavior-Based ML Detection",
    icon: Network,
    description: "Machine learning anomaly detection",
  },
]

export function DetectionMethodsSection({ status, isAnalyzing }) {
  const getStatusColor = (methodStatus) => {
    if (methodStatus === "complete") return "text-emerald-400"
    return "text-slate-500"
  }

  const getStatusIcon = (methodStatus) => {
    if (methodStatus === "complete") return <CheckCircle className="w-5 h-5" />
    return isAnalyzing ? <Spinner /> : <Clock className="w-5 h-5" />
  }

  return (
    <div className="mb-8 animate-in fade-in-50 duration-500">
      <h2 className="text-lg font-semibold text-slate-100 mb-4">Detection Methods</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {methods.map((method) => {
          const Icon = method.icon
          const methodKey =
            method.id === "signature" ? "signature" : method.id === "hostBased" ? "hostBased" : "behavioral"
          const methodStatus = status[methodKey]

          return (
            <div
              key={method.id}
              className={`p-4 rounded-lg border transition-all duration-300 ${
                methodStatus === "complete"
                  ? "border-emerald-500/50 bg-emerald-500/10"
                  : "border-slate-600 bg-slate-800/50"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`${getStatusColor(methodStatus)}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`${getStatusColor(methodStatus)}`}>{getStatusIcon(methodStatus)}</div>
              </div>

              <h3 className="font-semibold text-slate-100 text-sm mb-1">{method.title}</h3>
              <p className="text-xs text-slate-400">{method.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
