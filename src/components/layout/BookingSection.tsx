import { SectionHeading } from "@/components/ui";
import { CalEmbed } from "./CalEmbed";

export function BookingSection({ id = "book-a-call" }: { id?: string }) {
  return (
    <section id={id} className="scroll-mt-10 px-4 py-16 sm:px-6 sm:py-28">
      <div className="mx-auto flex max-w-[1300px] flex-col gap-10 sm:gap-14">
        <SectionHeading
          title="Book a 15-min call"
          subtitle="Choose a time that works for you, and let’s discuss your project, goals, and how SACH STUDIO can help bring your vision to life."
        />
        <CalEmbed />
      </div>
    </section>
  );
}
