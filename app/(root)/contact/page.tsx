import ContactForm from "@/components/pages/contact/contact-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact us for any questions or remarks.",

  keywords: [
    "fashion",
    "beauty",
    "clothing",
    "products",
    "online store",
    "makeup",
    "beauty products",
  ],

  openGraph: {
    title: "Contact | The Shine Cartel",
    description: "Contact us for any questions or remarks.",
    images: ["/opengraph-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

const Contact = () => {
  return (
    <main className="pt-20 md:pt-28">
      <ContactForm />
    </main>
  );
};

export default Contact;
