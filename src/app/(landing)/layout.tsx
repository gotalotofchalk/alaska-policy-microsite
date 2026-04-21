import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      <main>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
