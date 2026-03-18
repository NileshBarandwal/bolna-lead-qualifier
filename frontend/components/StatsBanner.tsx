"use client";

interface Lead {
  qualification: string;
  call_status: string;
}

interface StatsBannerProps {
  leads: Lead[];
}

export default function StatsBanner({ leads }: StatsBannerProps) {
  const total = leads.length;
  const completed = leads.filter((l) => l.call_status === "completed").length;
  const hot = leads.filter((l) => l.qualification === "hot").length;
  const qualificationRate = completed > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    { label: "Total Leads", value: total, color: "text-slate-800" },
    { label: "Calls Completed", value: completed, color: "text-blue-700" },
    { label: "Hot Leads", value: hot, color: "text-red-600" },
    { label: "Qualification Rate", value: `${qualificationRate}%`, color: "text-green-700" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-slate-100 shadow-sm px-5 py-4"
        >
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
          <p className={`mt-1.5 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
