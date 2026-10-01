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
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-16">
      <div className="mx-auto max-w-xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm md:p-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#00CACE]">
            TrinitPro
          </p>

          <h1 className="text-3xl font-semibold text-slate-900">
            Secure Contact Form Demo
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Testing form validation, honeypot protection, timing checks and
            Google Apps Script submission.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div
              className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
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

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-800"
              >
                Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                maxLength={80}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#00CACE]"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-800"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={120}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#00CACE]"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-medium text-slate-800"
              >
                Message
              </label>

              <textarea
                id="message"
                name="message"
                autoComplete="off"
                required
                minLength={10}
                maxLength={2000}
                rows={6}
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#00CACE]"
                placeholder="Tell us about your requirement..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#00CACE] px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </button>

            {status && (
              <p
                className="text-center text-sm font-medium text-slate-700"
                role="status"
                aria-live="polite"
              >
                {status}
              </p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}