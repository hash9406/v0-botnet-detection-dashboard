"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function BehavioralDetailsPage() {
  const [expandedAnomaly, setExpandedAnomaly] = useState(null)

  const mockAnomalies = [
    {
      id: 1,
      type: "Unusual File Access",
      severity: "HIGH",
      score: 8.7,
      description: "Process accessing critical system files outside normal behavior",
      files: ["C:\\Windows\\System32\\drivers\\etc\\hosts", "C:\\Windows\\System32\\config\\SAM"],
    },
    {
      id: 2,
      type: "Registry Modification",
      severity: "MEDIUM",
      score: 6.2,
      description: "Modifications to registry keys related to auto-start programs",
      details: "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
    },
    {
      id: 3,
      type: "DLL Injection Detection",
      severity: "CRITICAL",
      score: 9.4,
      description: "Remote process injection detected with suspicious payload",
      targetProcess: "explorer.exe",
    },
    {
      id: 4,
      type: "Encoded Command Execution",
      severity: "HIGH",
      score: 7.9,
      description: "PowerShell execution with Base64 encoded commands",
      command: "powershell -enc QWRkLURzcE1heUNvdW50IC0x...",
    },
  ]

  const mockTrafficPatterns = [
    { time: "00:00", baseline: 45, actual: 48, anomaly: 0 },
    { time: "04:00", baseline: 32, actual: 31, anomaly: 0 },
    { time: "08:00", baseline: 62, actual: 85, anomaly: 23 },
    { time: "12:00", baseline: 78, actual: 92, anomaly: 14 },
    { time: "16:00", baseline: 71, actual: 156, anomaly: 85 },
    { time: "20:00", baseline: 54, actual: 62, anomaly: 8 },
  ]

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-900 text-red-200"
      case "HIGH":
        return "bg-orange-900 text-orange-200"
      case "MEDIUM":
        return "bg-yellow-900 text-yellow-200"
      default:
        return "bg-slate-700 text-slate-200"
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Detection
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Behavioral Detection</h1>
          <p className="text-slate-400">ML-based anomaly detection and behavior analysis</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-800 p-6">
            <div className="text-slate-400 text-sm">Total Anomalies</div>
            <div className="text-3xl font-bold text-white mt-2">{mockAnomalies.length}</div>
          </Card>
          <Card className="bg-slate-900 border-slate-800 p-6">
            <div className="text-slate-400 text-sm">Critical Behaviors</div>
            <div className="text-3xl font-bold text-red-400 mt-2">
              {mockAnomalies.filter((a) => a.severity === "CRITICAL").length}
            </div>
          </Card>
          <Card className="bg-slate-900 border-slate-800 p-6">
            <div className="text-slate-400 text-sm">Avg Anomaly Score</div>
            <div className="text-3xl font-bold text-blue-400 mt-2">
              {(mockAnomalies.reduce((sum, a) => sum + a.score, 0) / mockAnomalies.length).toFixed(1)}
            </div>
          </Card>
          <Card className="bg-slate-900 border-slate-800 p-6">
            <div className="text-slate-400 text-sm">Model Accuracy</div>
            <div className="text-3xl font-bold text-green-400 mt-2">94.2%</div>
          </Card>
        </div>

        {/* Anomalies Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">Detected Anomalies</h2>
          <div className="space-y-4">
            {mockAnomalies.map((anomaly) => (
              <Card
                key={anomaly.id}
                className="bg-slate-900 border-slate-800 p-6 cursor-pointer hover:bg-slate-800 transition-colors"
                onClick={() => setExpandedAnomaly(expandedAnomaly === anomaly.id ? null : anomaly.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{anomaly.type}</h3>
                    <p className="text-slate-400 text-sm mt-1">{anomaly.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-slate-400">Anomaly Score</p>
                      <p className="text-2xl font-bold text-blue-400">{anomaly.score}</p>
                    </div>
                    <Badge className={`${getSeverityColor(anomaly.severity)} border-0`}>{anomaly.severity}</Badge>
                  </div>
                </div>

                {expandedAnomaly === anomaly.id && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    {anomaly.files && (
                      <div className="mb-3">
                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Affected Files</p>
                        <div className="space-y-1">
                          {anomaly.files.map((file, idx) => (
                            <p key={idx} className="text-slate-300 font-mono text-xs">
                              {file}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    {anomaly.details && <p className="text-slate-300 text-sm">{anomaly.details}</p>}
                    {anomaly.targetProcess && (
                      <p className="text-slate-300 text-sm">
                        <span className="text-slate-400">Target Process:</span> {anomaly.targetProcess}
                      </p>
                    )}
                    {anomaly.command && (
                      <p className="text-slate-300 text-sm font-mono">
                        <span className="text-slate-400">Command:</span> {anomaly.command}
                      </p>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Traffic Analysis */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Network Traffic Analysis</h2>
          <Card className="bg-slate-900 border-slate-800 p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-4 py-3 text-left text-slate-400 font-semibold">Time</th>
                    <th className="px-4 py-3 text-left text-slate-400 font-semibold">Baseline (KB/s)</th>
                    <th className="px-4 py-3 text-left text-slate-400 font-semibold">Actual (KB/s)</th>
                    <th className="px-4 py-3 text-left text-slate-400 font-semibold">Anomaly</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTrafficPatterns.map((pattern, idx) => (
                    <tr key={idx} className="border-b border-slate-700 hover:bg-slate-800/50">
                      <td className="px-4 py-3 text-white font-mono">{pattern.time}</td>
                      <td className="px-4 py-3 text-slate-300">{pattern.baseline}</td>
                      <td className="px-4 py-3 text-slate-300">{pattern.actual}</td>
                      <td className="px-4 py-3">
                        {pattern.anomaly > 0 ? (
                          <Badge className="bg-red-600 border-0">{pattern.anomaly} KB/s</Badge>
                        ) : (
                          <Badge className="bg-green-600/30 text-green-300 border-0">Normal</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
