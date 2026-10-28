import type { Metadata } from "next";
import { PolicyHero } from "../privacy-policy/page";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Terms of Service",
    description:
      "Read the Terms of Service that govern your use of the The Shine Cartel website.",
    openGraph: {
      title: "Terms of Service",
      description:
        "Read the Terms of Service that govern your use of the The Shine Cartel website.",
    },
  };
};

export default async function TermsPage() {
  const sections = [
    {
      id: "01",
      title: "Introduction",
      content: (
        <p>
          This is the terms of service for the The Shine Cartel website.{" "}
          <a
            href="mailto:The Shine Cartel@gmail.com"
            className="text-primary font-medium underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            The Shine Cartel@gmail.com
          </a>
        </p>
      ),
    },
    {
      id: "02",
      title: "Platform Description",
      content: (
        <p>
          The Shine Cartel is an online platform that connects clients seeking
          services with independent service providers. The platform facilitates
          discovery, communication, and transactions between parties.
        </p>
      ),
    },
    {
      id: "03",
      title: "No Employment Relationship",
      content: (
        <p>
          By using the The Shine Cartel platform, you acknowledge that you are
          not an employee, contractor, or agent of The Shine Cartel. You are a
          client seeking services and are responsible for your own interactions
          with service providers.
        </p>
      ),
    },
    {
      id: "04",
      title: "User Accounts",
      content: (
        <p>
          Users must provide accurate and complete information when registering
          and are responsible for maintaining the confidentiality of their login
          credentials. You agree to notify us immediately of any unauthorised
          use of your account.
        </p>
      ),
    },
    {
      id: "05",
      title: "Service Agreements",
      content: (
        <p>
          Any agreement for services is concluded directly between the Client
          and the Service Provider. The platform is not a party to these
          agreements and accepts no liability arising from them.
        </p>
      ),
    },
    {
      id: "06",
      title: "Payment and Refunds",
      content: (
        <>
          <p className="text-secondary mb-3 text-[0.97rem] leading-[1.8]">
            Payments are processed securely through the platform. Refunds are
            subject to the terms agreed between the Client and the Service
            Provider.
          </p>
        </>
      ),
    },
    {
      id: "07",
      title: "Payments",
      content: (
        <p>
          Payments may be processed through third-party payment providers.
          Service Providers authorise the platform to deduct applicable platform
          fees from payments collected on their behalf before remittance.
        </p>
      ),
    },
    {
      id: "08",
      title: "Reviews",
      content: (
        <p>
          Users may leave reviews and ratings. All reviews must be truthful and
          must not contain unlawful, defamatory, discriminatory, or otherwise
          harmful content. The platform reserves the right to remove reviews
          that violate these guidelines.
        </p>
      ),
    },
    {
      id: "09",
      title: "Limitation of Liability",
      content: (
        <p>
          The platform is not liable for any losses or damages arising from the
          use of the platform or any services provided. The platform is not
          responsible for the actions of Service Providers or Clients and
          provides no guarantees regarding the quality, suitability, or legality
          of services.
        </p>
      ),
    },
    {
      id: "10",
      title: "Governing Law",
      content: (
        <p>
          These Terms and Conditions are governed by and construed in accordance
          with the laws of Nigeria. Any disputes arising under or in connection
          with these Terms and Conditions shall be subject to the exclusive
          jurisdiction of the courts of Nigeria.
        </p>
      ),
    },
  ];

  return (
    <main>
      <section className="max-w-7xl mx-auto min-h-screen">
        <PolicyHero
          label="Terms of Service"
          title="Terms of Service"
          updated="Last updated: 27/04/2026"
          description="This is the terms of service for the The Shine Cartel website."
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
