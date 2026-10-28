import type { Metadata } from "next";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Privacy Policy",
    description:
      "Learn how The Shine Cartel collects, uses, and protects your personal data on the The Shine Cartel platform.",
    openGraph: {
      title: "Privacy Policy",
      description:
        "Learn how The Shine Cartel collects, uses, and protects your personal data on the The Shine Cartel platform.",
    },
  };
};

export default async function PrivacyPolicyPage() {
  const sections = [
    {
      id: "01",
      title: "Data Controller",
      content: (
        <>
          <p>
            The Shine Cartel is the data controller for the processing of
            personal data collected through the The Shine Cartel platform. We
            are responsible for ensuring that your data is processed in
            accordance with data protection laws.
          </p>
          <p className="mt-3">
            Contact:{" "}
            <a
              href="mailto:The Shine Cartel@gmail.com"
              className="text-primary font-medium underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              The Shine Cartel@gmail.com
            </a>
          </p>
        </>
      ),
    },
    {
      id: "02",
      title: "Data Collection",
      content: (
        <PolicyList
          items={
            [
              "Name and contact details",
              "Account login information",
              "Payment and transaction data",
              "Service provider and client information",
            ] as string[]
          }
        />
      ),
    },
    {
      id: "03",
      title: "Purpose of Processing",
      content: (
        <PolicyList
          items={
            [
              "To operate and improve the platform",
              "Processing payments and transactions",
              "Communicating with you about your account and services",
              "Complying with legal and regulatory requirements",
            ] as string[]
          }
        />
      ),
    },
    {
      id: "04",
      title: "Legal Basis (GDPR)",
      content: (
        <PolicyList
          items={
            [
              "Consent",
              "Contractual necessity",
              "Legal obligation",
              "Vital interests",
              "Public interest",
            ] as string[]
          }
        />
      ),
    },
    {
      id: "05",
      title: "Data Sharing",
      content: (
        <p>
          Data may be shared with payment providers, hosting providers, and
          authorities when required by law. We do not sell your personal data to
          third parties.
        </p>
      ),
    },
    {
      id: "06",
      title: "Data Retention",
      content: (
        <p>
          Personal data is retained only as long as necessary for providing the
          platform services and complying with legal obligations. After the
          retention period expires, data is securely deleted or anonymised.
        </p>
      ),
    },
    {
      id: "07",
      title: "Your Rights",
      content: (
        <PolicyList
          items={
            [
              "Access to your personal data",
              "Rectification of inaccurate data",
              "Deletion of data ('right to be forgotten')",
              "Restriction of processing",
              "Data Portability",
              "Objection",
              "Automated decision-making",
            ] as string[]
          }
        />
      ),
    },
  ];

  return (
    <main className="bg-background">
      <section className="max-w-7xl mx-auto min-h-screen">
        <PolicyHero
          label="Privacy Policy"
          title="Privacy Policy"
          updated="Last updated: 27/04/2026"
          description="Learn how The Shine Cartel collects, uses, and protects your personal data on the The Shine Cartel platform."
        />
        <div className="fluid-width max-w-8xl mx-auto px-4 pb-24 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-[220px_1fr] lg:gap-16 lg:pt-16">
            {/* Sticky TOC */}
            <aside className="hidden lg:block">
              <div className="border-border bg-card sticky top-24 rounded-2xl border p-6 shadow-sm">
                <p className="text-secondary mb-4 text-[0.65rem] font-bold tracking-[0.16em] uppercase">
                  Contents
                </p>
                <nav className="flex flex-col gap-0.5">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#section-${s.id}`}
                      className="text-secondary hover:bg-muted hover:text-primary flex items-center gap-2.5 rounded-lg px-2 py-2 text-[0.82rem] transition-colors"
                    >
                      <span className="text-[#8E8E93] min-w-[1.4rem] text-[0.62rem] font-bold">
                        {s.id}
                      </span>
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main content */}
            <article className="flex flex-col">
              {sections.map((s) => (
                <section
                  key={s.id}
                  id={`section-${s.id}`}
                  className="border-border scroll-mt-24 border-b py-10 first:pt-0 last:border-b-0"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <span className="border-border bg-muted text-secondary rounded-md border px-2 py-0.5 text-[0.62rem] font-bold tracking-wide uppercase">
                      {s.id}
                    </span>
                    <h2 className="font-bricolage-grotesque text-primary text-xl font-bold tracking-tight">
                      {s.title}
                    </h2>
                  </div>
                  <div className="text-secondary [&_strong]:text-primary text-[0.97rem] leading-[1.8] [&_strong]:font-semibold">
                    {s.content}
                  </div>
                </section>
              ))}
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ─── Shared sub-components ──────────────────────────────────────────────── */

export function PolicyHero({
  label,
  title,
  updated,
  description,
}: {
  label: string;
  title: string;
  updated: string;
  description: string;
}) {
  return (
    <div className="border-border relative overflow-hidden border-b">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{ background: "var(--gradient-primary)" }}
      />
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-105 w-105 rounded-full opacity-[0.12] blur-[80px]"
        style={{ background: "var(--gradient-blur)" }}
      />
      <div className="fluid-width max-w-8xl relative mx-auto px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <span
          className="text-primary mb-5 inline-flex items-center rounded-full px-3.5 py-1 text-[0.67rem] font-bold tracking-[0.18em] uppercase"
          style={{ background: "var(--gradient-primary-faded)" }}
        >
          {label}
        </span>
        <h1 className="font-bricolage-grotesque text-primary mb-3 text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.08] font-extrabold tracking-tight">
          {title}
        </h1>
        <p className="text-[#8E8E93] mb-4 text-[0.75rem] font-semibold tracking-[0.12em] uppercase">
          {updated}
        </p>
        <p className="text-secondary max-w-130 text-[1.02rem] leading-[1.74]">
          {description}
        </p>
      </div>
    </div>
  );
}

export function PolicyList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="border-border text-secondary hover:bg-muted hover:text-primary flex items-start gap-3 rounded-xl border bg-white px-4 py-3 text-[0.93rem] shadow-sm transition-colors"
        >
          <span className="bg-primary mt-[0.48rem] h-1.5 w-1.5 shrink-0 rounded-full" />
          {item}
        </li>
      ))}
    </ul>
  );
}
