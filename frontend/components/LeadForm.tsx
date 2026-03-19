"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  use_case: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  use_case?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function LeadForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    use_case: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.email.trim()) {
      errs.email = "Work email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Enter a valid email address";
    }
    if (!form.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-().]{7,}$/.test(form.phone)) {
      errs.phone = "Enter a valid phone number";
    }
    if (!form.use_case.trim()) errs.use_case = "Please describe what you're looking for";
    return errs;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-10 pb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
            <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">You&apos;re all set!</h2>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
            Thanks! Our AI agent will call you within a few minutes to learn more about your needs.
          </p>
          <p className="mt-6 text-xs text-slate-400">
            Keep your phone nearby.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-slate-900">Get in touch</CardTitle>
        <CardDescription className="text-sm text-slate-500">
          An AI agent will call you within minutes. No hold music. No waiting.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Jane Smith"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? "border-red-400 focus-visible:ring-red-300" : ""}
                disabled={loading}
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="company" className="text-sm font-medium text-slate-700">
                Company
              </Label>
              <Input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                placeholder="Acme Corp"
                value={form.company}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-slate-700">
              Work Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="jane@acme.com"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "border-red-400 focus-visible:ring-red-300" : ""}
              disabled={loading}
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 (415) 555-1234"
              value={form.phone}
              onChange={handleChange}
              className={errors.phone ? "border-red-400 focus-visible:ring-red-300" : ""}
              disabled={loading}
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="use_case" className="text-sm font-medium text-slate-700">
              What are you looking for? <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="use_case"
              name="use_case"
              rows={3}
              placeholder="Briefly describe your challenge or goal..."
              value={form.use_case}
              onChange={handleChange}
              disabled={loading}
              className={`flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${
                errors.use_case ? "border-red-400 focus-visible:ring-red-300" : "border-input"
              }`}
            />
            {errors.use_case && <p className="text-xs text-red-500">{errors.use_case}</p>}
          </div>

          {serverError && (
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-sm text-red-600">{serverError}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium h-11"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3-3-3h4z" />
                </svg>
                Submitting...
              </span>
            ) : (
              "Request a call"
            )}
          </Button>

          <p className="text-center text-xs text-slate-400">
            By submitting, you agree to be contacted by phone. No spam, ever.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
