import ContactHead from "@/components/contact/ContactHead";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact Us — Al Dhiyafah Properties",
  description: "Reach out for a viewing, a valuation, or just to ask a question.",
};

export default function ContactPage() {
  return (
    <section className="pt-[calc(6.4rem+env(safe-area-inset-top,0px))] pb-[clamp(3rem,7vw,5.5rem)] px-[clamp(1.2rem,4vw,3rem)] max-w-[1180px] mx-auto w-full">
      <ContactHead />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-9.5 items-start">
        <ContactInfo />
        <ContactForm />
      </div>
    </section>
  );
}
