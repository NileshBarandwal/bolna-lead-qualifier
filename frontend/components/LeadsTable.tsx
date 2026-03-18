"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  call_status: string;
  qualification: string;
  transcript: string | null;
  created_at: string;
}

interface LeadsTableProps {
  leads: Lead[];
}

const QUALIFICATION_CONFIG: Record<string, { label: string; className: string }> = {
  hot: { label: "Hot", className: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100" },
  warm: { label: "Warm", className: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100" },
  cold: { label: "Cold", className: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100" },
  unqualified: { label: "Pending", className: "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-100" },
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-100" },
  in_progress: { label: "In Progress", className: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50" },
  completed: { label: "Completed", className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-50" },
  failed: { label: "Failed", className: "bg-red-50 text-red-600 border-red-200 hover:bg-red-50" },
};

function formatDate(isoString: string) {
  return new Date(isoString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function LeadsTable({ leads }: LeadsTableProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
        <div className="py-20 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-slate-700">No leads yet</h3>
          <p className="mt-1 text-sm text-slate-400">
            Submit the first lead from the{" "}
            <a href="/" className="text-indigo-600 hover:underline">
              home page
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide">Name</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide hidden sm:table-cell">Company</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide hidden md:table-cell">Phone</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide">Score</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide hidden lg:table-cell">Submitted</th>
              <th className="w-8 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.map((lead) => {
              const isExpanded = expandedId === lead.id;
              const qConfig = QUALIFICATION_CONFIG[lead.qualification] ?? QUALIFICATION_CONFIG.unqualified;
              const sConfig = STATUS_CONFIG[lead.call_status] ?? STATUS_CONFIG.pending;

              return (
                <>
                  <tr
                    key={lead.id}
                    onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{lead.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{lead.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">
                      {lead.company || <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{lead.phone}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs font-medium ${sConfig.className}`}>
                        {sConfig.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs font-medium ${qConfig.className}`}>
                        {qConfig.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs hidden lg:table-cell">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      <svg
                        className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr key={`${lead.id}-expanded`} className="bg-slate-50">
                      <td colSpan={7} className="px-4 py-4">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                          Call Transcript
                        </div>
                        {lead.transcript ? (
                          <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono bg-white rounded-lg border border-slate-100 p-4 leading-relaxed max-h-64 overflow-y-auto">
                            {lead.transcript}
                          </pre>
                        ) : (
                          <p className="text-sm text-slate-400 italic">
                            {lead.call_status === "completed"
                              ? "No transcript available for this call."
                              : "Transcript will appear here once the call completes."}
                          </p>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
