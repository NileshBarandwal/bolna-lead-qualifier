"use client";

import { useEffect, useState, useCallback } from "react";
import StatsBanner from "@/components/StatsBanner";
import LeadsTable from "@/components/LeadsTable";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const POLL_INTERVAL = 15000;

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/leads`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      setLeads(data);
      setLastUpdated(new Date());
      setError("");
    } catch {
      setError("Could not connect to the backend. Is it running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchLeads]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900">Lead Qualifier</h1>
              <p className="text-xs text-slate-400">AI-powered outbound calling</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="text-xs text-slate-400">
                Updated {lastUpdated.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
              </span>
            )}
            <a
              href="/"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              + Add Lead
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Leads Dashboard</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Auto-refreshes every 15 seconds. Click any row to view the call transcript.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {loading ? (
          <div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm px-5 py-4 animate-pulse">
                  <div className="h-3 bg-slate-100 rounded w-20 mb-3" />
                  <div className="h-7 bg-slate-100 rounded w-10" />
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm h-64 animate-pulse" />
          </div>
        ) : (
          <>
            <StatsBanner leads={leads} />
            <LeadsTable leads={leads} />
          </>
        )}
      </main>
    </div>
  );
}
