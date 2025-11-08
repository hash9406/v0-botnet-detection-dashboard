"use client"

import { useState } from "react"
import { FileUploadSection } from "./file-upload-section"
import { DetectionMethodsSection } from "./detection-methods-section"
import { ResultsGrid } from "./results-grid"
import { AIVerdictBanner } from "./ai-verdict-banner"
import { Header } from "./dashboard-header"

export function BotnetDashboard() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [detectionStatus, setDetectionStatus] = useState({
    signature: "pending",
    hostBased: "pending",
    behavioral: "pending",
  })
  const [results, setResults] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)

  const handleAnalyze = async (file) => {
    setUploadedFile(file)
    setIsAnalyzing(true)
    setAnalysisComplete(false)

    // Simulate analysis phases
    await new Promise((r) => setTimeout(r, 1000))
    setDetectionStatus((prev) => ({ ...prev, signature: "complete" }))

    await new Promise((r) => setTimeout(r, 1000))
    setDetectionStatus((prev) => ({ ...prev, hostBased: "complete" }))

    await new Promise((r) => setTimeout(r, 1500))
    setDetectionStatus((prev) => ({ ...prev, behavioral: "complete" }))

    // Mock results
    setResults({
      verdict: "CLEAN", // CLEAN, SUSPICIOUS, INFECTED
      riskLevel: "LOW", // LOW, MEDIUM, HIGH, CRITICAL
      timestamp: new Date().toISOString(),
      signatureMatches: [],
      suspiciousProcesses: [
        { name: "explorer.exe", cpu: 2.1, memory: 156, connections: 2 },
        { name: "svchost.exe", cpu: 0.8, memory: 45, connections: 1 },
      ],
      anomalyScore: 18,
      aiExplanation:
        "Network traffic patterns are consistent with normal user activity. No indicators of compromise detected.",
    })

    setIsAnalyzing(false)
    setAnalysisComplete(true)
  }

  const handleReset = () => {
    setUploadedFile(null)
    setAnalysisComplete(false)
    setDetectionStatus({
      signature: "pending",
      hostBased: "pending",
      behavioral: "pending",
    })
    setResults(null)
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Header onDownloadReport={() => {}} />

      <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <FileUploadSection
          onAnalyze={handleAnalyze}
          uploadedFile={uploadedFile}
          isAnalyzing={isAnalyzing}
          onReset={handleReset}
        />

        {(isAnalyzing || analysisComplete) && (
          <>
            <DetectionMethodsSection status={detectionStatus} isAnalyzing={isAnalyzing} />

            {analysisComplete && results && (
              <>
                <ResultsGrid results={results} />
                <AIVerdictBanner results={results} />
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}
