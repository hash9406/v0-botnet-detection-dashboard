"use client"

import { Upload, X } from "lucide-react"
import { useRef, useState } from "react"

export function FileUploadSection({ onAnalyze, uploadedFile, isAnalyzing, onReset }) {
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === "dragenter" || e.type === "dragover")
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (["text/csv", "application/json"].includes(file.type)) {
        onAnalyze(file)
      }
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      onAnalyze(e.target.files[0])
    }
  }

  return (
    <div className="mb-8 animate-in fade-in-50 duration-500">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`p-8 rounded-lg border-2 border-dashed transition-all duration-300 ${
          dragActive ? "border-blue-400 bg-blue-500/10" : "border-blue-500 bg-slate-800/50 hover:bg-slate-800"
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <Upload className={`w-12 h-12 ${dragActive ? "text-blue-400" : "text-blue-500"}`} />

          <div className="text-center">
            <h2 className="text-xl font-semibold text-slate-100 mb-2">Upload Network Log File (CSV or JSON)</h2>
            <p className="text-slate-400 text-sm">Supports signature-based, host-based, and behavior-based detection</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <input ref={fileInputRef} type="file" accept=".csv,.json" onChange={handleFileSelect} className="hidden" />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-all"
            >
              Select File
            </button>

            {uploadedFile && (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-100 rounded-lg">
                  <span className="truncate text-sm">{uploadedFile.name}</span>
                  <span className="text-xs text-slate-400">({(uploadedFile.size / 1024).toFixed(2)} KB)</span>
                </div>

                {!isAnalyzing && (
                  <button
                    onClick={() => onAnalyze(uploadedFile)}
                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-all"
                  >
                    Analyze
                  </button>
                )}

                {isAnalyzing && (
                  <button
                    onClick={onReset}
                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium rounded-lg transition-all flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reset
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
