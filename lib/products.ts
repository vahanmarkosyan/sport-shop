export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number; // AMD
  type: string; // Ապրանքի տեսակը
  sizes: string[];
  gender: "Male" | "Female" | "Unisex";
  colors: string[];
  collections: string[]; // collection slugs
  description: string;
  image: string | null; // null → placeholder with logo
};

export type Collection = {
  slug: string;
  title: string;
  description?: string;
};

export const COLLECTIONS: Collection[] = [
  { slug: "new-in", title: "Նոր Տեսականի" },
  { slug: "new-collection", title: "Նոր Հավաքածու" },
  { slug: "best-sellers", title: "Բեսթսելերներ" },
  { slug: "t-shirts", title: "Շապիկներ" },
  { slug: "hoodies-and-sweatshirts", title: "Հուդիներ և Սվիտերներ" },
  { slug: "tracksuits", title: "Սպորտային Հանդերձանք" },
  { slug: "shorts", title: "Շորտեր" },
  { slug: "bottoms", title: "Տաբատներ" },
  { slug: "shirts", title: "Վերնաշապիկներ" },
  { slug: "activewear", title: "Activewear" },
  { slug: "swimwear", title: "Լողազգեստներ" },
  { slug: "jackets", title: "Բաճկոններ և Վերնազգեստ" },
  { slug: "kids", title: "Մանկական Հագուստ" },
  { slug: "caps", title: "Գլխարկներ" },
  { slug: "jewellery", title: "Զարդեր" },
  { slug: "socks", title: "Գուլպաներ" },
  { slug: "sports-accessories", title: "Սպորտային պարագաներ" },
];

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

const ADULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const KID_SIZES = ["1-2 տարի", "3-4 տարի", "5-6 տարի", "7-8 տարի", "9-10 Years"];
const ONE_SIZE = ["Մեկ չափս"];

let seq = 0;
function p(
  name: string,
  price: number,
  type: string,
  collections: string[],
  opts?: Partial<Pick<Product, "sizes" | "gender" | "colors" | "description">>
): Product {
  seq += 1;
  const id = String(seq).padStart(3, "0");
  const slug =
    "dn8-" +
    name
      .toLowerCase()
      .replace(/[«»]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") +
    "-" +
    id;
  return {
    id,
    slug,
    name,
    price,
    type,
    sizes: opts?.sizes ?? ADULT_SIZES,
    gender: opts?.gender ?? "Unisex",
    colors: opts?.colors ?? ["Սև"],
    collections,
    description:
      opts?.description ??
      "DN8 պրեմիում որակի հագուստ՝ ստեղծված չեմպիոնների համար։ Բարձրորակ նյութեր, հարմարավետ կտրվածք և բրենդային դետալներ։",
    image: null,
  };
}

export const PRODUCTS: Product[] = [
  // T-shirts
  p("Champion Spirit շապիկ", 14900, "T-shirt", ["t-shirts", "new-in", "new-collection"], { colors: ["Սև", "Սպիտակ"] }),
  p("Stay Bold շապիկ", 13900, "T-shirt", ["t-shirts", "new-in", "best-sellers"], { colors: ["Կապույտ", "Սպիտակ"] }),
  p("DN8 Monogram շապիկ", 15900, "T-shirt", ["t-shirts", "best-sellers"], { colors: ["Սպիտակը Սևով"] }),
  p("Victory Road շապիկ", 14900, "T-shirt", ["t-shirts", "new-collection"], { colors: ["Մոխրագույն"] }),
  // Hoodies
  p("Legacy հուդի", 32900, "Hoodie", ["hoodies-and-sweatshirts", "new-in", "best-sellers"], { colors: ["Սև"] }),
  p("Arman Edition հուդի", 36900, "Hoodie", ["hoodies-and-sweatshirts", "new-collection", "best-sellers"], { colors: ["Սևը Սպիտակով"] }),
  p("Grappler սվիտեր", 28900, "Hoodie", ["hoodies-and-sweatshirts", "new-in"], { colors: ["Մուգ Կապույտ"] }),
  p("Iron Will հուդի", 34900, "Hoodie", ["hoodies-and-sweatshirts", "new-collection"], { colors: ["Խակի"] }),
  // Tracksuits
  p("Team DN8 սպորտային համազգեստ", 54900, "Track Pants", ["tracksuits", "new-in", "best-sellers"], { colors: ["Սև", "Մոխրագույն"] }),
  p("Podium սպորտային համազգեստ", 58900, "Track Pants", ["tracksuits", "new-collection"], { colors: ["Մուգ Կապույտ"] }),
  // Shorts
  p("Combat շորտեր", 17900, "Shorts", ["shorts", "new-in"], { colors: ["Սև"] }),
  p("Summer Camp շորտեր", 16900, "Shorts", ["shorts", "best-sellers"], { colors: ["Բաց Մոխրագույն"] }),
  // Bottoms
  p("Everyday ջոգեր", 24900, "Jogger", ["bottoms", "new-in", "best-sellers"], { colors: ["Սև", "Մոխրագույն"] }),
  p("Off-Mat տաբատ", 26900, "Pants", ["bottoms", "new-collection"], { colors: ["Թաուփ"] }),
  // Shirts
  p("Clean Cut վերնաշապիկ", 27900, "Shirt", ["shirts", "new-in"], { gender: "Male", colors: ["Սպիտակ"] }),
  p("Midnight վերնաշապիկ", 28900, "Shirt", ["shirts", "new-collection"], { gender: "Male", colors: ["Մուգ Կապույտ"] }),
  // Activewear
  p("Training Pro ռաշգարդ", 21900, "T-shirt", ["activewear", "new-in"], { colors: ["Սև"] }),
  p("Flex լեգինս", 19900, "Pants", ["activewear"], { gender: "Female", colors: ["Սևը Սպիտակով"] }),
  // Swimwear
  p("Riviera լողազգեստ", 15900, "Shorts", ["swimwear"], { gender: "Male", colors: ["Կապույտ"] }),
  // Jackets
  p("Windbreaker բաճկոն", 42900, "Jacket", ["jackets", "new-in", "best-sellers"], { colors: ["Սև"] }),
  p("Coach բաճկոն", 39900, "Jacket", ["jackets", "new-collection"], { colors: ["Խակի"] }),
  // Kids
  p("Future Champ մանկական շապիկ", 9900, "T-shirt", ["kids", "new-in"], { sizes: KID_SIZES, colors: ["Սպիտակ"] }),
  p("Little Grappler մանկական հուդի", 18900, "Hoodie", ["kids", "best-sellers"], { sizes: KID_SIZES, colors: ["Մոխրագույն"] }),
  // Caps
  p("DN8 Classic գլխարկ", 11900, "Caps", ["caps", "new-in", "best-sellers"], { sizes: ONE_SIZE, colors: ["Սև"] }),
  p("Snapback գլխարկ", 12900, "Caps", ["caps", "new-collection"], { sizes: ONE_SIZE, colors: ["Սևը Սպիտակով"] }),
  // Jewellery
  p("Monogram շղթա", 22900, "Accessories", ["jewellery", "new-in"], { sizes: ONE_SIZE, colors: ["Սպիտակ"] }),
  // Socks
  p("Crew գուլպաներ (3 զույգ)", 6900, "Accessories", ["socks", "best-sellers"], { sizes: ["S", "M", "L"], colors: ["Սև", "Սպիտակ"] }),
  // Sports accessories
  p("Gym պայուսակ", 29900, "Accessories", ["sports-accessories", "new-in"], { sizes: ONE_SIZE, colors: ["Սև"] }),
  p("Shaker բաժակ", 7900, "Accessories", ["sports-accessories"], { sizes: ONE_SIZE, colors: ["Սև"] }),
];

export function getProductsByCollection(slug: string): Product[] {
  return PRODUCTS.filter((pr) => pr.collections.includes(slug));
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((pr) => pr.slug === slug);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PRODUCTS.filter(
    (pr) =>
      pr.name.toLowerCase().includes(q) ||
      pr.type.toLowerCase().includes(q) ||
      pr.colors.some((c) => c.toLowerCase().includes(q))
  );
}

export function formatPrice(amd: number): string {
  return amd.toLocaleString("en-US").replace(/,/g, " ") + " ֏";
}

// Navigation structure for the header
export const NAV = {
  newIn: { title: "Նոր Տեսականի", href: "/collections/new-in" },
  clothing: {
    title: "Հագուստ",
    href: "/collections/new-in",
    items: [
      { title: "Շապիկներ", href: "/collections/t-shirts" },
      { title: "Հուդիներ և Սվիտերներ", href: "/collections/hoodies-and-sweatshirts" },
      { title: "Սպորտային Հանդերձանք", href: "/collections/tracksuits" },
      { title: "Շորտեր", href: "/collections/shorts" },
      { title: "Տաբատներ", href: "/collections/bottoms" },
      { title: "Վերնաշապիկներ", href: "/collections/shirts" },
      { title: "Activewear", href: "/collections/activewear" },
      { title: "Լողազգեստներ", href: "/collections/swimwear" },
      { title: "Բաճկոններ և Վերնազգեստ", href: "/collections/jackets" },
      { title: "Մանկական Հագուստ", href: "/collections/kids" },
    ],
  },
  collections: {
    title: "Հավաքածուներ",
    href: "#",
    items: [] as { title: string; href: string }[], // will be added later
  },
  accessories: {
    title: "Աքսեսուարներ",
    href: "/collections/caps",
    items: [
      { title: "Գլխարկներ", href: "/collections/caps" },
      { title: "Զարդեր", href: "/collections/jewellery" },
      { title: "Գուլպաներ", href: "/collections/socks" },
      { title: "Սպորտային պարագաներ", href: "/collections/sports-accessories" },
    ],
  },
  about: { title: "Մեր Մասին", href: "/about" },
};
