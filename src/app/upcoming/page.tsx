import type { Metadata } from "next";
import { BadgeCheck, CalendarClock } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = { title: "Upcoming phones" };

export default function UpcomingPage() {
  return <section className="page-shell py-14 md:py-20"><SectionHeading eyebrow="Upcoming" title="Announcements, not rumours." description="This page will only publish upcoming devices when an announcement can be attached to a reliable source and market context." /><div className="soft-panel grid min-h-[320px] place-items-center p-8 text-center"><div className="max-w-md"><div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[var(--surface-2)]"><CalendarClock size={20} /></div><h2 className="mt-5 text-xl font-semibold">Verification queue is empty</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">Rumour-only listings stay out of the production catalog. That is intentional.</p><span className="eyebrow mt-5"><BadgeCheck size={13} /> Source policy active</span></div></div></section>;
}
