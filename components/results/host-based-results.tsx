"use client"

export function HostBasedResults({ processes }) {
  return (
    <div className="p-6 rounded-lg bg-slate-800 border border-slate-700 shadow-lg">
      <h3 className="font-semibold text-slate-100 mb-4">Host-Based Results</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-600">
              <th className="text-left py-2 px-2 text-slate-400 font-medium">Process</th>
              <th className="text-right py-2 px-2 text-slate-400 font-medium">CPU %</th>
              <th className="text-right py-2 px-2 text-slate-400 font-medium">Mem MB</th>
              <th className="text-right py-2 px-2 text-slate-400 font-medium">Conn</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((proc, idx) => (
              <tr key={idx} className={`border-b border-slate-700 ${proc.connections > 5 ? "bg-amber-500/10" : ""}`}>
                <td className="py-2 px-2 text-slate-100 font-mono text-xs truncate">{proc.name}</td>
                <td className="py-2 px-2 text-slate-300 text-right">{proc.cpu.toFixed(1)}</td>
                <td className="py-2 px-2 text-slate-300 text-right">{proc.memory}</td>
                <td
                  className={`py-2 px-2 text-right font-semibold ${
                    proc.connections > 5 ? "text-amber-400" : "text-slate-300"
                  }`}
                >
                  {proc.connections}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
