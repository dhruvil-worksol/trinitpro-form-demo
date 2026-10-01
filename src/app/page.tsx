"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzqk_IgOVDvUcVkIfw9RhII1NCNyrnyl7TxvY-dGiFOjAKMvBRrRVC8ausJWLvo7oFJVQ/exec";

export default function Home() {
  const formStartedAt = useRef<number | null>(null);

  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    formStartedAt.current = Date.now();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const honeypot = String(
      formData.get("company_website") || ""
    ).trim();

    if (honeypot) {
      setStatus("Submission blocked.");
      return;
    }

    if (formStartedAt.current === null) {
      setStatus("Please wait a moment and try again.");
      return;
    }

    const elapsedTime = Date.now() - formStartedAt.current;

    if (elapsedTime < 2000) {
      setStatus("Please wait a moment and try again.");
      return;
    }

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      company_website: honeypot,
      elapsedTime,
    };

    try {
      setIsSubmitting(true);
      setStatus("Sending...");

      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      setStatus("Thank you. Your message has been submitted ✅");

      form.reset();
      formStartedAt.current = Date.now();
    } catch (error) {
      console.error("Form submission error:", error);

      setStatus("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eef4f8] px-6 py-16">

      {/* background decorative shapes */}
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#00CACE]/20 blur-3xl" />

      <div className="absolute -bottom-25 -right-20 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />

      <div className="relative w-full max-w-xl perspective-distant">

        {/* 3D back layer */}
        <div className="absolute inset-0 translate-x-4 translate-y-5 rounded-4xl bg-[#00CACE]/20 blur-[2px]" />

        {/* Main card */}
        <div className="relative rounded-4xl border border-white/80 bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl md:p-10">

          <div className="mb-8">
            <div className="mb-4 inline-flex items-center rounded-full border border-[#00CACE]/20 bg-[#00CACE]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#009da0]">
              TrinitPro
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Secure Contact Form
            </h1>

            <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
              Production-style form testing with honeypot protection,
              submission timing and Google Apps Script.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* honeypot */}
            <div
              className="absolute left-[-9999px] h-px w-px overflow-hidden"
              aria-hidden="true"
            >
              <label htmlFor="company_website">
                Company Website
              </label>

              <input
                id="company_website"
                name="company_website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Name
              </label>

              <div className="rounded-2xl bg-slate-100 p-px shadow-inner">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={80}
                  placeholder="Your name"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-[#00CACE] focus:shadow-[0_0_0_4px_rgba(0,202,206,0.12)]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email
              </label>

              <div className="rounded-2xl bg-slate-100 p-px shadow-inner">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={120}
                  placeholder="you@company.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-[#00CACE] focus:shadow-[0_0_0_4px_rgba(0,202,206,0.12)]"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Message
              </label>

              <div className="rounded-2xl bg-slate-100 p-px shadow-inner">
                <textarea
                  id="message"
                  name="message"
                  autoComplete="off"
                  required
                  minLength={10}
                  maxLength={2000}
                  rows={5}
                  placeholder="Tell us about your requirement..."
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-[#00CACE] focus:shadow-[0_0_0_4px_rgba(0,202,206,0.12)]"
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full overflow-hidden rounded-2xl bg-[#00CACE] px-5 py-4 font-semibold text-white shadow-[0_12px_30px_rgba(0,202,206,0.35)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(0,202,206,0.42)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </button>

            {status && (
              <div
                role="status"
                aria-live="polite"
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-700"
              >
                {status}
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
  
}