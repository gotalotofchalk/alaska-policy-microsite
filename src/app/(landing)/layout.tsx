import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-[100rem] flex-col gap-10 px-4 py-8 md:px-8 lg:px-12">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
