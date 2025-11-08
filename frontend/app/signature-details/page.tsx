"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SignatureDetailsPage() {
  const [expandedSignature, setExpandedSignature] = useState(null)

  const mockSignatures = [
    {
      id: 1,
      name: "Mirai Botnet Signature",
      hash: "5d41402abc4b2a76b9719d911017c592",
      severity: "HIGH",
      detectionCount: 24,
      lastSeen: "2025-01-08T14:32:00Z",
      description: "Known malware variant used in distributed denial-of-service attacks",
    },
    {
      id: 2,
      name: "Emotet Command & Control",
      hash: "6d41402abc4b2a76b9719d911017c593",
      severity: "CRITICAL",
      detectionCount: 18,
      lastSeen: "2025-01-08T12:15:00Z",
      description: "Banking trojan with worm capabilities and data exfiltration features",
    },
    {
      id: 3,
      name: "Generic Trojan Dropper",
      hash: "7d41402abc4b2a76b9719d911017c594",
      severity: "MEDIUM",
      detectionCount: 42,
      lastSeen: "2025-01-08T09:47:00Z",
      description: "Generic malware dropper used to deploy secondary payloads",
    },
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
          <h1 className="text-4xl font-bold text-white mb-2">Signature-Based Detection</h1>
          <p className="text-slate-400">Detailed analysis of detected malware signatures</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-800 p-6">
            <div className="text-slate-400 text-sm">Total Signatures Detected</div>
            <div className="text-3xl font-bold text-white mt-2">{mockSignatures.length}</div>
          </Card>
          <Card className="bg-slate-900 border-slate-800 p-6">
            <div className="text-slate-400 text-sm">Critical Threats</div>
            <div className="text-3xl font-bold text-red-400 mt-2">
              {mockSignatures.filter((s) => s.severity === "CRITICAL").length}
            </div>
          </Card>
          <Card className="bg-slate-900 border-slate-800 p-6">
            <div className="text-slate-400 text-sm">Detection Database</div>
            <div className="text-3xl font-bold text-blue-400 mt-2">15,847</div>
          </Card>
        </div>

        {/* Signatures List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Detected Signatures</h2>
          {mockSignatures.map((sig) => (
            <Card
              key={sig.id}
              className="bg-slate-900 border-slate-800 p-6 cursor-pointer hover:bg-slate-800 transition-colors"
              onClick={() => setExpandedSignature(expandedSignature === sig.id ? null : sig.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{sig.name}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-1">{sig.hash}</p>
                </div>
                <Badge className={`${getSeverityColor(sig.severity)} border-0`}>{sig.severity}</Badge>
              </div>

              {expandedSignature === sig.id && (
                <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider">Description</p>
                    <p className="text-slate-300 mt-1">{sig.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider">Detection Count</p>
                      <p className="text-white font-mono mt-1">{sig.detectionCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider">Last Seen</p>
                      <p className="text-white font-mono mt-1">{new Date(sig.lastSeen).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
