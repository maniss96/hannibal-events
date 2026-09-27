import { SiteNav } from "@/components/SiteNav";
import { Hero } from "@/components/Hero";
import { Difference } from "@/components/Difference";
import { Spaces } from "@/components/Spaces";
import { Weddings } from "@/components/Weddings";
import { Meetings } from "@/components/Meetings";
import { Occasions } from "@/components/Occasions";
import { Stay } from "@/components/Stay";
import { InquiryForm } from "@/components/InquiryForm";
import { SiteFooter } from "@/components/SiteFooter";

export default function Page() {
  return (
    <>
      <SiteNav />
      <main id="main">
        <Hero />
        <Difference />
        <Spaces />
        <Weddings />
        <Meetings />
        <Occasions />
        <Stay />
        <InquiryForm />
      </main>
      <SiteFooter />
    </>
  );
}
