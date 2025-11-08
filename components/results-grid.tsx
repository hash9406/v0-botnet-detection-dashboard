"use client"
import { SignatureResults } from "./results/signature-results"
import { HostBasedResults } from "./results/host-based-results"
import { BehavioralResults } from "./results/behavioral-results"

export function ResultsGrid({ results }) {
  return (
    <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in-50 duration-500">
      <SignatureResults matches={results.signatureMatches} />
      <HostBasedResults processes={results.suspiciousProcesses} />
      <BehavioralResults anomalyScore={results.anomalyScore} />
    </div>
  )
}
