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

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)

      // Call backend API
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const apiResults = await response.json()

      // Update detection status based on API response
      setDetectionStatus({
        signature: "complete",
        hostBased: "complete",
        behavioral: "complete",
      })

      // Transform API results to match component expectations
      const transformedResults = {
        verdict: apiResults.verdict,
        riskLevel: apiResults.gemini_analysis?.risk_level || "UNKNOWN",
        timestamp: apiResults.timestamp || new Date().toISOString(),
        riskScore: apiResults.risk_score,
        signatureMatches: apiResults.signature_based?.threats || [],
        suspiciousProcesses: apiResults.host_based?.suspicious_processes || [],
        anomalyScore: apiResults.behavior_based?.confidence || 0,
        aiExplanation: apiResults.gemini_analysis?.explanation || "Analysis complete",
        recommendations: apiResults.gemini_analysis?.recommendations || [],
        signature_based: apiResults.signature_based,
        host_based: apiResults.host_based,
        behavior_based: apiResults.behavior_based,
        gemini_analysis: apiResults.gemini_analysis,
      }

      setResults(transformedResults)
      setIsAnalyzing(false)
      setAnalysisComplete(true)

    } catch (error) {
      console.error('Analysis failed:', error)
      setIsAnalyzing(false)
      // You might want to show an error state here
      alert(`Analysis failed: ${error.message}`)
    }
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
