import { CartProvider } from "@/lib/cart";
import { dbGetCollections } from "@/lib/repo";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collections = await dbGetCollections();
  const customCollections = collections
    .filter((c) => c.custom)
    .map((c) => ({ title: c.title, href: `/collections/${c.slug}` }));

  return (
    <CartProvider>
      <Header customCollections={customCollections} />
      {children}
      <CartDrawer />
      <Footer />
    </CartProvider>
  );
}
