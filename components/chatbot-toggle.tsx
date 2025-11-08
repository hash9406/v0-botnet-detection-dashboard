"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"

export function ChatbotToggle() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Fixed side toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950"
        aria-label="Toggle chatbot"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chatbot panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 z-40 w-96 h-96 bg-slate-900 border border-slate-700 rounded-lg shadow-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Header */}
          <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
            <h3 className="font-semibold text-white">Security Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700 rounded p-1 transition-colors"
              aria-label="Close chatbot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                AI
              </div>
              <div className="bg-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200">
                Hello! I'm your security assistant. Ask me anything about botnet detection, threat analysis, or system
                information.
              </div>
            </div>
          </div>

          {/* Input area */}
          <div className="border-t border-slate-700 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask a question..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 text-sm font-medium transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
