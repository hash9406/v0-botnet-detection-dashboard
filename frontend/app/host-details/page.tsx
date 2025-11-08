"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function HostDetailsPage() {
  const [expandedProcess, setExpandedProcess] = useState(null)

  const mockProcesses = [
    {
      id: 1,
      name: "explorer.exe",
      pid: 4028,
      parentPid: 676,
      cpu: 2.1,
      memory: 156,
      connections: 2,
      suspicious: false,
      details: "Windows Shell Experience Host - Normal system process",
    },
    {
      id: 2,
      name: "svchost.exe",
      pid: 892,
      parentPid: 724,
      cpu: 0.8,
      memory: 45,
      connections: 1,
      suspicious: false,
      details: "Service Host Process - Critical system service",
    },
    {
      id: 3,
      name: "rundll32.exe",
      pid: 3456,
      parentPid: 2104,
      cpu: 5.2,
      memory: 234,
      connections: 8,
      suspicious: true,
      details: "Suspicious DLL loader detected with unusual network activity",
    },
    {
      id: 4,
      name: "spoolsv.exe",
      pid: 1892,
      parentPid: 724,
      cpu: 1.3,
      memory: 78,
      connections: 3,
      suspicious: false,
      details: "Print Spooler Service - System process",
    },
  ]

  const mockNetworkConnections = [
    {
      id: 1,
      source: "192.168.1.100",
      destination: "185.232.40.12",
      port: 443,
      protocol: "TCP",
      status: "ESTABLISHED",
      suspicious: true,
    },
    {
      id: 2,
      source: "192.168.1.100",
      destination: "8.8.8.8",
      port: 53,
      protocol: "UDP",
      status: "ESTABLISHED",
      suspicious: false,
    },
    {
      id: 3,
      source: "192.168.1.100",
      destination: "10.0.0.1",
      port: 445,
      protocol: "TCP",
      status: "TIME_WAIT",
      suspicious: false,
    },
  ]

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
          <h1 className="text-4xl font-bold text-white mb-2">Host-Based Detection</h1>
          <p className="text-slate-400">System process and network activity analysis</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-800 p-6">
            <div className="text-slate-400 text-sm">Active Processes</div>
            <div className="text-3xl font-bold text-white mt-2">{mockProcesses.length}</div>
          </Card>
          <Card className="bg-slate-900 border-slate-800 p-6">
            <div className="text-slate-400 text-sm">Suspicious Processes</div>
            <div className="text-3xl font-bold text-red-400 mt-2">
              {mockProcesses.filter((p) => p.suspicious).length}
            </div>
          </Card>
          <Card className="bg-slate-900 border-slate-800 p-6">
            <div className="text-slate-400 text-sm">Network Connections</div>
            <div className="text-3xl font-bold text-blue-400 mt-2">{mockNetworkConnections.length}</div>
          </Card>
          <Card className="bg-slate-900 border-slate-800 p-6">
            <div className="text-slate-400 text-sm">Suspicious Connections</div>
            <div className="text-3xl font-bold text-orange-400 mt-2">
              {mockNetworkConnections.filter((c) => c.suspicious).length}
            </div>
          </Card>
        </div>

        {/* Processes Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">Running Processes</h2>
          <div className="space-y-3">
            {mockProcesses.map((proc) => (
              <Card
                key={proc.id}
                className={`border-slate-800 p-4 cursor-pointer transition-colors ${
                  proc.suspicious
                    ? "bg-red-900/20 border-red-800 hover:bg-red-900/30"
                    : "bg-slate-900 hover:bg-slate-800"
                }`}
                onClick={() => setExpandedProcess(expandedProcess === proc.id ? null : proc.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-semibold text-white">{proc.name}</h3>
                      <p className="text-xs text-slate-400">PID: {proc.pid}</p>
                    </div>
                  </div>
                  {proc.suspicious && <Badge className="bg-red-600 border-0">SUSPICIOUS</Badge>}
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                  <div>
                    <p className="text-slate-400">CPU</p>
                    <p className="text-white font-mono">{proc.cpu}%</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Memory</p>
                    <p className="text-white font-mono">{proc.memory}MB</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Connections</p>
                    <p className="text-white font-mono">{proc.connections}</p>
                  </div>
                </div>

                {expandedProcess === proc.id && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <p className="text-slate-300 text-sm">{proc.details}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Network Connections Section */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Network Connections</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="px-4 py-3 text-left text-slate-400 font-semibold">Source</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-semibold">Destination</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-semibold">Port</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-semibold">Protocol</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-semibold">Risk</th>
                </tr>
              </thead>
              <tbody>
                {mockNetworkConnections.map((conn) => (
                  <tr key={conn.id} className="border-b border-slate-800 hover:bg-slate-900/50">
                    <td className="px-4 py-3 text-white font-mono text-xs">{conn.source}</td>
                    <td className="px-4 py-3 text-white font-mono text-xs">{conn.destination}</td>
                    <td className="px-4 py-3 text-slate-300">{conn.port}</td>
                    <td className="px-4 py-3 text-slate-300">{conn.protocol}</td>
                    <td className="px-4 py-3 text-slate-300">{conn.status}</td>
                    <td className="px-4 py-3">
                      <Badge className={conn.suspicious ? "bg-red-600 border-0" : "bg-green-600 border-0"}>
                        {conn.suspicious ? "HIGH" : "LOW"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
