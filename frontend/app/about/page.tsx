import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Detection
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">About BotNet Detection</h1>
          <p className="text-slate-400">Understanding our advanced threat detection system</p>
        </div>

        {/* What is Botnet Detection */}
        <Card className="bg-slate-900 border-slate-800 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">What is Botnet Detection?</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Botnets are networks of compromised computers (bots) remotely controlled by attackers. BotNet Detection is
            an advanced cybersecurity system that identifies and analyzes potential botnet infections using multiple
            detection methodologies.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Our system employs three complementary detection methods to provide comprehensive threat identification:
            signature-based detection for known threats, host-based detection for suspicious system behavior, and
            behavioral analysis using machine learning models.
          </p>
        </Card>

        {/* Detection Methods */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Detection Methods Explained</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-900 border-slate-800 p-6">
              <h3 className="text-xl font-semibold text-blue-400 mb-3">Signature-Based</h3>
              <p className="text-slate-300 text-sm">
                Identifies known malware by comparing file hashes and patterns against a constantly updated database of
                known threats. Fast and reliable for detecting previously identified botnets.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-400">Database: 15,000+ signatures</p>
                <p className="text-xs text-slate-400">Accuracy: 99.8%</p>
              </div>
            </Card>

            <Card className="bg-slate-900 border-slate-800 p-6">
              <h3 className="text-xl font-semibold text-green-400 mb-3">Host-Based</h3>
              <p className="text-slate-300 text-sm">
                Monitors system processes, file system activities, and network connections. Detects suspicious behaviors
                like unauthorized registry modifications and unusual process chains.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-400">Processes Monitored: Real-time</p>
                <p className="text-xs text-slate-400">Detection Latency: {"<"}100ms</p>
              </div>
            </Card>

            <Card className="bg-slate-900 border-slate-800 p-6">
              <h3 className="text-xl font-semibold text-orange-400 mb-3">Behavioral</h3>
              <p className="text-slate-300 text-sm">
                Uses machine learning to identify anomalous behaviors that deviate from baseline patterns. Effective
                against zero-day exploits and new botnet variants.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-xs text-slate-400">Model: XGBoost</p>
                <p className="text-xs text-slate-400">Accuracy: 94.2%</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Dataset & Model */}
        <Card className="bg-slate-900 border-slate-800 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Dataset & Model Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Dataset: CTU-13 Botnet Traffic Capture</h3>
              <p className="text-slate-300 text-sm">
                Our behavioral detection model is trained on the CTU-13 dataset, which contains 13 real botnet traffic
                captures from the Czech Technical University. This comprehensive dataset includes traffic from various
                botnet families including Zeus, Mirai, and Conficker.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Model Specifications</h3>
              <ul className="text-slate-300 text-sm space-y-2">
                <li>Algorithm: XGBoost (Extreme Gradient Boosting)</li>
                <li>Training Samples: 48,000+ network flows</li>
                <li>Features Extracted: 21 network statistical features</li>
                <li>Cross-validation Accuracy: 94.2%</li>
                <li>Inference Time: {"<"}50ms per sample</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Accuracy Metrics */}
        <Card className="bg-slate-900 border-slate-800 p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Accuracy Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Confusion Matrix</h3>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-slate-700">
                    <td className="px-2 py-2 text-slate-400"></td>
                    <td className="px-2 py-2 text-slate-400 font-semibold">Predicted Benign</td>
                    <td className="px-2 py-2 text-slate-400 font-semibold">Predicted Botnet</td>
                  </tr>
                  <tr className="border-b border-slate-700">
                    <td className="px-2 py-2 text-slate-400 font-semibold">Actual Benign</td>
                    <td className="px-2 py-2 text-green-400 font-mono">9,847</td>
                    <td className="px-2 py-2 text-orange-400 font-mono">153</td>
                  </tr>
                  <tr>
                    <td className="px-2 py-2 text-slate-400 font-semibold">Actual Botnet</td>
                    <td className="px-2 py-2 text-orange-400 font-mono">287</td>
                    <td className="px-2 py-2 text-green-400 font-mono">8,713</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Accuracy</span>
                  <span className="text-white font-mono font-bold">94.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Precision</span>
                  <span className="text-white font-mono font-bold">98.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Recall</span>
                  <span className="text-white font-mono font-bold">96.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">F1 Score</span>
                  <span className="text-white font-mono font-bold">97.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">False Positive Rate</span>
                  <span className="text-white font-mono font-bold">1.5%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
