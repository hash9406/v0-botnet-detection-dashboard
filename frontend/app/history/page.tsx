"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function HistoryPage() {
  const [filterVerdict, setFilterVerdict] = useState("all")
  const [filterDate, setFilterDate] = useState("")
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load history on component mount
  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('http://localhost:5000/api/history')
      if (!response.ok) {
        throw new Error(`Failed to load history: ${response.status}`)
      }
      const data = await response.json()
      setHistory(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getVerdictColor = (verdict: string) => {
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

  const getRiskColor = (risk: string) => {
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

  const filteredHistory = history.filter((item) => {
    if (filterVerdict !== "all" && item.verdict !== filterVerdict) return false
    if (filterDate && new Date(item.timestamp).toISOString().split('T')[0] !== filterDate) return false
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
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      Loading history...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-red-400">
                      Error: {error}
                    </td>
                  </tr>
                ) : filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      No scan history found
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((item, index) => (
                    <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-4 text-white">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-slate-300 font-mono text-sm">
                        {item.file_info?.filename || 'Unknown'}
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={`${getVerdictColor(item.verdict)} border-0`}>
                          {item.verdict}
                        </Badge>
                      </td>
                      <td className={`px-4 py-4 font-semibold ${getRiskColor(item.gemini_analysis?.risk_level || 'UNKNOWN')}`}>
                        {item.gemini_analysis?.risk_level || 'UNKNOWN'}
                      </td>
                      <td className="px-4 py-4 text-slate-300">
                        {item.risk_score}/100
                      </td>
                      <td className="px-4 py-4">
                        <button className="text-blue-400 hover:text-blue-300 font-medium text-sm">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
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
