"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function HistoryPage() {
  const [filterVerdict, setFilterVerdict] = useState("all")
  const [filterDate, setFilterDate] = useState("")

  const mockHistory = [
    {
      id: 1,
      date: "2025-01-08",
      filename: "system_log_20250108.pcap",
      verdict: "CLEAN",
      riskLevel: "LOW",
      scanTime: "2m 14s",
    },
    {
      id: 2,
      date: "2025-01-07",
      filename: "network_capture_20250107.pcap",
      verdict: "SUSPICIOUS",
      riskLevel: "MEDIUM",
      scanTime: "1m 52s",
    },
    {
      id: 3,
      date: "2025-01-06",
      filename: "malware_sample_20250106.bin",
      verdict: "INFECTED",
      riskLevel: "CRITICAL",
      scanTime: "3m 41s",
    },
    {
      id: 4,
      date: "2025-01-05",
      filename: "traffic_dump_20250105.pcap",
      verdict: "CLEAN",
      riskLevel: "LOW",
      scanTime: "1m 28s",
    },
    {
      id: 5,
      date: "2025-01-04",
      filename: "process_trace_20250104.log",
      verdict: "SUSPICIOUS",
      riskLevel: "HIGH",
      scanTime: "2m 35s",
    },
  ]

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case "CLEAN":
        return "bg-green-900 text-green-200"
      case "SUSPICIOUS":
        return "bg-yellow-900 text-yellow-200"
      case "INFECTED":
        return "bg-red-900 text-red-200"
      default:
        return "bg-slate-700 text-slate-200"
    }
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case "CRITICAL":
        return "text-red-400"
      case "HIGH":
        return "text-orange-400"
      case "MEDIUM":
        return "text-yellow-400"
      case "LOW":
        return "text-green-400"
      default:
        return "text-slate-400"
    }
  }

  const filteredHistory = mockHistory.filter((item) => {
    if (filterVerdict !== "all" && item.verdict !== filterVerdict) return false
    if (filterDate && item.date !== filterDate) return false
    return true
  })

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
          <h1 className="text-4xl font-bold text-white mb-2">Scan History</h1>
          <p className="text-slate-400">Previous detection scans and results</p>
        </div>

        {/* Filters */}
        <Card className="bg-slate-900 border-slate-800 p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Date</label>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Verdict</label>
              <select
                value={filterVerdict}
                onChange={(e) => setFilterVerdict(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-md"
              >
                <option value="all">All Verdicts</option>
                <option value="CLEAN">Clean</option>
                <option value="SUSPICIOUS">Suspicious</option>
                <option value="INFECTED">Infected</option>
              </select>
            </div>
          </div>
        </Card>

        {/* History Table */}
        <Card className="bg-slate-900 border-slate-800 p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="px-4 py-3 text-left text-slate-400 font-semibold">Date</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-semibold">Filename</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-semibold">Verdict</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-semibold">Risk Level</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-semibold">Scan Time</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-4 text-white">{item.date}</td>
                    <td className="px-4 py-4 text-slate-300 font-mono text-sm">{item.filename}</td>
                    <td className="px-4 py-4">
                      <Badge className={`${getVerdictColor(item.verdict)} border-0`}>{item.verdict}</Badge>
                    </td>
                    <td className={`px-4 py-4 font-semibold ${getRiskColor(item.riskLevel)}`}>{item.riskLevel}</td>
                    <td className="px-4 py-4 text-slate-300">{item.scanTime}</td>
                    <td className="px-4 py-4">
                      <button className="text-blue-400 hover:text-blue-300 font-medium text-sm">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredHistory.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">No scan history matches your filters</p>
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}
