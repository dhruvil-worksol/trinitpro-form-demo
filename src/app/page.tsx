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

      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success) {
        setStatus(result.message || "Submission failed.");
        return;
      }

      setStatus("Thank you. Your message has been received ✅");

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
            Testing form validation, honeypot protection, timing checks,
            and Google Apps Script submission.
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
              <p className="text-center text-sm font-medium text-slate-700">
                {status}
              </p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}

// "use client";

// import { FormEvent, useEffect, useRef, useState } from "react";

// export default function Home() {
//   const formStartedAt = useRef<number | null>(null);
//   const [status, setStatus] = useState("");

//   useEffect(() => {
//     formStartedAt.current = Date.now();
//   }, []);

//   function handleSubmit(event: FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     const form = event.currentTarget;
//     const formData = new FormData(form);

//     const honeypot = formData.get("company_website");

//     if (honeypot) {
//       setStatus("Submission blocked.");
//       return;
//     }

//     if (formStartedAt.current === null) {
//       setStatus("Please wait a moment and try again.");
//       return;
//     }

//     const elapsedTime = Date.now() - formStartedAt.current;

//     if (elapsedTime < 2000) {
//       setStatus("Please wait a moment and try again.");
//       return;
//     }

//     setStatus("Form passed frontend checks ✅");

//     console.log({
//       name: formData.get("name"),
//       email: formData.get("email"),
//       message: formData.get("message"),
//       elapsedTime,
//     });
//   }

//   return (
//     <main className="min-h-screen bg-[#f5f7fb] px-6 py-16">
//       <div className="mx-auto max-w-xl">
//         <div className="rounded-3xl bg-white p-8 shadow-sm md:p-10">
//           <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#00CACE]">
//             TrinitPro
//           </p>

//           <h1 className="text-3xl font-semibold text-slate-900">
//             Secure Contact Form Demo
//           </h1>

//           <p className="mt-3 text-sm leading-6 text-slate-600">
//             Testing form validation, honeypot protection, and submission timing.
//           </p>

//           <form onSubmit={handleSubmit} className="mt-8 space-y-5">
//             <div
//               className="absolute left-[-9999px] h-px w-px overflow-hidden"
//               aria-hidden="true"
//             >
//               <label htmlFor="company_website">Company Website</label>

//               <input
//                 id="company_website"
//                 name="company_website"
//                 type="text"
//                 tabIndex={-1}
//                 autoComplete="off"
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="name"
//                 className="mb-2 block text-sm font-medium text-slate-800"
//               >
//                 Name
//               </label>

//               <input
//                 id="name"
//                 name="name"
//                 type="text"
//                 required
//                 minLength={2}
//                 maxLength={80}
//                 className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#00CACE]"
//                 placeholder="Your name"
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="email"
//                 className="mb-2 block text-sm font-medium text-slate-800"
//               >
//                 Email
//               </label>

//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 required
//                 maxLength={120}
//                 className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#00CACE]"
//                 placeholder="you@company.com"
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="message"
//                 className="mb-2 block text-sm font-medium text-slate-800"
//               >
//                 Message
//               </label>

//               <textarea
//                 id="message"
//                 name="message"
//                 required
//                 minLength={10}
//                 maxLength={2000}
//                 rows={6}
//                 className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#00CACE]"
//                 placeholder="Tell us about your requirement..."
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full rounded-xl bg-[#00CACE] px-5 py-3 font-semibold text-white transition hover:opacity-90"
//             >
//               Submit
//             </button>

//             {status && (
//               <p className="text-center text-sm font-medium text-slate-700">
//                 {status}
//               </p>
//             )}
//           </form>
//         </div>
//       </div>
//     </main>
//   );
// }

// // "use client";

// // import { FormEvent, useRef, useState } from "react";

// // export default function Home() {
// //   const formStartedAt = useRef(Date.now());

// //   const [status, setStatus] = useState("");

// //   function handleSubmit(event: FormEvent<HTMLFormElement>) {
// //     event.preventDefault();

// //     const form = event.currentTarget;
// //     const formData = new FormData(form);

// //     const honeypot = formData.get("company_website");
// //     const elapsedTime = Date.now() - formStartedAt.current;

// //     if (honeypot) {
// //       setStatus("Submission blocked.");
// //       return;
// //     }

// //     if (elapsedTime < 2000) {
// //       setStatus("Please wait a moment and try again.");
// //       return;
// //     }

// //     setStatus("Form passed frontend checks ✅");

// //     console.log({
// //       name: formData.get("name"),
// //       email: formData.get("email"),
// //       message: formData.get("message"),
// //       elapsedTime,
// //     });
// //   }

// //   return (
// //     <main className="min-h-screen bg-[#f5f7fb] px-6 py-16">
// //       <div className="mx-auto max-w-xl">
// //         <div className="rounded-3xl bg-white p-8 shadow-sm md:p-10">
// //           <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#00CACE]">
// //             TrinitPro
// //           </p>

// //           <h1 className="text-3xl font-semibold text-slate-900">
// //             Secure Contact Form Demo
// //           </h1>

// //           <p className="mt-3 text-sm leading-6 text-slate-600">
// //             Testing form validation, honeypot protection, and submission timing.
// //           </p>

// //           <form onSubmit={handleSubmit} className="mt-8 space-y-5">
// //             <div
// //               className="absolute left-[-9999px] h-px w-px overflow-hidden"
// //               aria-hidden="true"
// //             >
// //               <label htmlFor="company_website">Company Website</label>

// //               <input
// //                 id="company_website"
// //                 name="company_website"
// //                 type="text"
// //                 tabIndex={-1}
// //                 autoComplete="off"
// //               />
// //             </div>

// //             <div>
// //               <label
// //                 htmlFor="name"
// //                 className="mb-2 block text-sm font-medium text-slate-800"
// //               >
// //                 Name
// //               </label>

// //               <input
// //                 id="name"
// //                 name="name"
// //                 type="text"
// //                 required
// //                 minLength={2}
// //                 maxLength={80}
// //                 className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#00CACE]"
// //                 placeholder="Your name"
// //               />
// //             </div>

// //             <div>
// //               <label
// //                 htmlFor="email"
// //                 className="mb-2 block text-sm font-medium text-slate-800"
// //               >
// //                 Email
// //               </label>

// //               <input
// //                 id="email"
// //                 name="email"
// //                 type="email"
// //                 required
// //                 maxLength={120}
// //                 className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#00CACE]"
// //                 placeholder="you@company.com"
// //               />
// //             </div>

// //             <div>
// //               <label
// //                 htmlFor="message"
// //                 className="mb-2 block text-sm font-medium text-slate-800"
// //               >
// //                 Message
// //               </label>

// //               <textarea
// //                 id="message"
// //                 name="message"
// //                 required
// //                 minLength={10}
// //                 maxLength={2000}
// //                 rows={6}
// //                 className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#00CACE]"
// //                 placeholder="Tell us about your requirement..."
// //               />
// //             </div>

// //             <button
// //               type="submit"
// //               className="w-full rounded-xl bg-[#00CACE] px-5 py-3 font-semibold text-white transition hover:opacity-90"
// //             >
// //               Submit
// //             </button>

// //             {status && (
// //               <p className="text-center text-sm font-medium text-slate-700">
// //                 {status}
// //               </p>
// //             )}
// //           </form>
// //         </div>
// //       </div>
// //     </main>
// //   );
// // }

// // // import Image from "next/image";

// // // export default function Home() {
// // //   return (
// // //     <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
// // //       <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
// // //         <Image
// // //           className="dark:invert h-5 w-[100px]"
// // //           src="/next.svg"
// // //           alt="Next.js logo"
// // //           width={100}
// // //           height={20}
// // //           priority
// // //         />
// // //         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
// // //           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
// // //             To get started, edit the{" "}
// // //             <code className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/[.08]">
// // //               page.tsx
// // //             </code>{" "}
// // //             file.
// // //           </h1>
// // //           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
// // //             Looking for a starting point or more instructions? Head over to{" "}
// // //             <a
// // //               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// // //               className="font-medium text-zinc-950 dark:text-zinc-50"
// // //             >
// // //               Templates
// // //             </a>{" "}
// // //             or the{" "}
// // //             <a
// // //               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// // //               className="font-medium text-zinc-950 dark:text-zinc-50"
// // //             >
// // //               Learning
// // //             </a>{" "}
// // //             center.
// // //           </p>
// // //         </div>
// // //         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
// // //           <a
// // //             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
// // //             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// // //             target="_blank"
// // //             rel="noopener noreferrer"
// // //           >
// // //             <Image
// // //               className="dark:invert h-[14px] w-4"
// // //               src="/vercel.svg"
// // //               alt="Vercel logomark"
// // //               width={16}
// // //               height={14}
// // //             />
// // //             Deploy Now
// // //           </a>
// // //           <a
// // //             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
// // //             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// // //             target="_blank"
// // //             rel="noopener noreferrer"
// // //           >
// // //             Documentation
// // //           </a>
// // //         </div>
// // //       </main>
// // //     </div>
// // //   );
// // // }
