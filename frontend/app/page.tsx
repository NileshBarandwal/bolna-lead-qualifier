import LeadForm from "@/components/LeadForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            AI-Powered Sales Qualification
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Talk to an expert — instantly
          </h1>
          <p className="mt-2 text-slate-500 text-sm leading-relaxed">
            Fill out the form and our AI agent will call you within minutes
            to understand your needs and match you with the right solution.
          </p>
        </div>
        <LeadForm />
      </div>
    </main>
  );
}
