"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { FaFacebookF, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { LuArrowRight,LuChevronDown,  LuLeaf, LuMapPin,  LuPlus, LuSearch, LuShieldCheck,  LuSprout,LuSquarePen,LuTrash2,
   LuUsersRound,LuX,LuBadgeCheck,LuBanknote,LuCircleDollarSign,LuClipboardList,LuCreditCard,LuHeart,LuMinus, 
   LuShoppingBasket,LuShoppingCart,LuTruck,

} from "@/components/ui/icons";

const categories = [
  { name: "Grains", image: "wheat.png", alt: "Harvested wheat grains" },
  { name: "Pulses", image: "lentils.png", alt: "Dried lentils" },
  { name: "Fruits", image: "apples.png", alt: "Fresh apples" },
  { name: "Vegetables", image: "potatoes.png", alt: "Freshly harvested potatoes" },
  { name: "Oilseeds", image: "sunflower.png", alt: "Sunflower seeds" },
  { name: "Spices", image: "spices.png", alt: "A selection of aromatic spices" },
  { name: "Dry Fruits", image: "nuts.png", alt: "Nuts and almonds" },
  { name: "Dairy & Others", image: "dairy.webp", alt: "Fresh milk and dairy products" },
] as const;

type Category = "All" | (typeof categories)[number]["name"];
type Product = {
  id: string;
  name: string;
  seller: string;
  location: string;
  category: Category;
  price: number;
  unit: "kg" | "quintal";
  image: string;
  imageAlt: string;
};

const products: Product[] = [
  { id: "wheat", name: "Wheat Grains", seller: "Sharma Farms", location: "Karnal, Haryana", category: "Grains", price: 2100, unit: "quintal", image: "wheat.png", imageAlt: "Golden wheat grains" },
  { id: "rice", name: "Basmati Rice", seller: "GreenFields", location: "Amritsar, Punjab", category: "Grains", price: 3800, unit: "quintal", image: "rice.png", imageAlt: "Uncooked white rice grains" },
  { id: "lentils", name: "Masoor Dal", seller: "Singh Agro", location: "Indore, Madhya Pradesh", category: "Pulses", price: 6200, unit: "quintal", image: "lentils.png", imageAlt: "Dried red lentils" },
  { id: "apples", name: "Fresh Apples", seller: "HimFall Orchards", location: "Shimla, Himachal Pradesh", category: "Fruits", price: 80, unit: "kg", image: "apples.png", imageAlt: "Fresh red apples" },
  { id: "potatoes", name: "Potatoes", seller: "Kisan Produce Co.", location: "Agra, Uttar Pradesh", category: "Vegetables", price: 25, unit: "kg", image: "potatoes.png", imageAlt: "Fresh potatoes ready for sale" },
  { id: "sunflower", name: "Sunflower Seeds", seller: "Patel Farms", location: "Ujjain, Madhya Pradesh", category: "Oilseeds", price: 5500, unit: "quintal", image: "sunflower.png", imageAlt: "Striped sunflower seeds in their shells" },
];

const highlights = [
  { title: "Direct from Farmers", icon: LuLeaf },
  { title: "Quality Assured", icon: LuShieldCheck },
  { title: "Fair Prices", icon: LuTruck },
  { title: "Stronger Rural Communities", icon: LuUsersRound },
];

const processSteps = [
  { title: "List or Browse", description: "Farmers list their produce or buyers browse available products.", icon: LuClipboardList },
  { title: "Connect", description: "Buyers place orders and connect with farmers or suppliers.", icon: LuUsersRound },
  { title: "Confirm & Pay", description: "Secure and transparent payment process.", icon: LuCreditCard },
  { title: "Delivery", description: "Products are delivered to your location.", icon: LuTruck },
];

const benefits = [
  { title: "Quality Produce", description: "Fresh and genuine products", icon: LuLeaf },
  { title: "Trusted Platform", description: "Verified farmers and buyers", icon: LuShieldCheck },
  { title: "Better Income", description: "Empowering rural communities", icon: LuUsersRound },
  { title: "Sustainable Future", description: "Supporting sustainable agriculture", icon: LuLeaf },
];

const faqs = [
  { question: "How do I buy produce?", answer: "Browse by category or search for a product, add it to your cart, and review the quantity and listed price. Log in to connect with the seller and confirm availability, delivery, and payment terms." },
  { question: "How can I list my produce?", answer: "Create an account to get started. Have your product details, available quantity, location, and preferred price ready when you connect with the platform." },
  { question: "What does the price unit mean?", answer: "Each listing shows its selling unit. A kilogram is shown as kg; one quintal equals 100 kilograms. One unit in your cart corresponds to the selling unit shown on that product." },
];

const imageRoot = "/images/agri-market/";
const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#267442]";
const primaryButton = `inline-flex min-h-12 items-center justify-center gap-4 rounded-md bg-linear-to-br from-[#277a45] to-[#155f34] px-7 py-3 text-sm font-semibold text-white transition-colors hover:from-[#1c6536] hover:to-[#104d2b] ${focusRing}`;
const outlineButton = `inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-[#38794f] bg-white/90 px-7 py-3 text-sm font-semibold text-[#294d35] transition-colors hover:bg-[#eaf5e5] ${focusRing}`;

function formatPrice(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function AgricultureProductSellingPage() {
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");
  const [activeDialog, setActiveDialog] = useState<"cart" | "contact" | "faq" | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogOpen = activeDialog !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialogOpen || !dialog) return;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [dialogOpen]);

  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const visibleProducts = products.filter((product) => {
    const searchable = [product.name, product.seller, product.location, product.category].join(" ").toLowerCase();
    return (category === "All" || product.category === category) && terms.every((term) => searchable.includes(term));
  });
  const cartProducts = products.filter((product) => (cart[product.id] ?? 0) > 0);
  const cartCount = cartProducts.reduce((sum, product) => sum + cart[product.id], 0);
  const cartTotal = cartProducts.reduce((sum, product) => sum + product.price * cart[product.id], 0);

  function resetSearch() {
    setCategory("All");
    setQuery("");
  }

  function addToCart(product: Product) {
    setCart((current) => ({ ...current, [product.id]: Math.min((current[product.id] ?? 0) + 1, 99) }));
    setMessage(`${product.name} added to your cart.`);
  }

  function changeQuantity(product: Product, change: number) {
    setCart((current) => ({ ...current, [product.id]: Math.min(99, Math.max(0, (current[product.id] ?? 0) + change)) }));
    setMessage(`Cart quantity updated for ${product.name}.`);
  }

  function toggleFavorite(product: Product) {
    const saved = favorites.includes(product.id);
    setFavorites((current) => saved ? current.filter((id) => id !== product.id) : [...current, product.id]);
    setMessage(`${product.name} ${saved ? "removed from" : "added to"} favorites.`);
  }

  function subscribeToNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // No newsletter service is configured; never report a subscription that was not saved.
    setNewsletterMessage("Newsletter signups aren’t available yet. Please check back soon.");
  }

  return (
    <>
      <title>Fresh Agricultural Produce | AgriBazaar</title>
      <meta name="description" 
      content="Browse grains, pulses, fruits, vegetables and more from farmers and agricultural suppliers. Discover fresh produce or get started listing your harvest." />
      <main className="overflow-x-clip bg-white font-sans text-[#14231e]">
        <section aria-labelledby="market-heading" className="relative isolate overflow-hidden bg-[#f0f4e8]">
          <Image src="/images/image3.png" 
          alt="Farmers tending a lush green field" fill preload sizes="100vw" 
          className="-z-20 object-cover object-[70%_center] lg:object-[center_45%]" />
          <div aria-hidden="true" 
          className="absolute inset-0 -z-10 bg-linear-to-r from-[#fdfcf3]/98 via-[#fdfcf3]/85 to-[#fdfcf3]/20 sm:via-[#fdfcf3]/65 
          lg:from-[#fdfcf3]/98 lg:via-[#fdfcf3]/65 lg:to-transparent" />
          <div className="relative mx-auto max-w-[1440px] px-6 pb-8 pt-10 sm:px-10 lg:min-h-[365px] lg:px-14 lg:pt-12">
            <div className="max-w-[650px]"><h1 id="market-heading" className="text-[48px] font-extrabold leading-[0.99] tracking-[-0.035em] 
            text-[#0b1d23] sm:text-[64px] lg:text-[76px]">
              Good Food<br />
              Grows Here
              </h1>
              <p className="mt-4 max-w-[520px] text-base leading-6 text-[#45554b] lg:text-xl lg:leading-7">
                A direct marketplace for fresh and quality agricultural produce. Farmers list, buyers buy, communities grow.
              </p>
                <div className="mt-5 flex flex-wrap gap-5">
                  <a href="#featured-products" className={primaryButton}>
                    Browse Products 
                  <LuArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <Link href="/registration" className={`${outlineButton} sm:min-w-56`}>List Your Produce</Link>
                </div>
              </div>
            <p className="absolute right-14 top-12 hidden -rotate-7 font-serif text-3xl italic leading-[1.1] text-[#173e2b] drop-shadow-[0_1px_4px_#ffffff] xl:block">
              Supporting<br />
              Farmers<br />
              Nourishing<br />
              Tomorrow
              <span aria-hidden="true" className="ml-4 mt-3 block h-0.5 w-24 bg-[#2e793b]" />
            </p>
          </div>
          <div className="bg-linear-to-r from-[#f7f9e8]/95 via-[#f7f9e8]/80 to-transparent">
          <div className="mx-auto max-w-[1440px] px-6 py-5 sm:px-10 lg:px-14">
            <div className="grid max-w-[900px] gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
              {highlights.map(({ title, icon: Icon }, index) => 
              <div key={title} className={`flex items-center gap-3 ${index > 0 ? "lg:border-l lg:border-[#bfd1b2]/70 lg:pl-5" : ""}`}>
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#edf5d8] text-[#25713b]">
                  <Icon className="h-8 w-8" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <p className="max-w-36 text-sm font-medium leading-5">{title}</p>
                  </div>)}
                  </div>
                  </div>
                </div>
        </section>

        <section aria-labelledby="category-heading" className="mx-auto max-w-[1440px] px-6 pb-4 pt-6 sm:px-10 lg:px-14">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 id="category-heading" className="text-2xl font-extrabold tracking-tight">
              Shop by Category
              </h2>
          <button type="button" onClick={resetSearch} className={`inline-flex min-h-9 items-center gap-3 rounded-sm text-sm font-medium text-[#415549] hover:text-[#218044] ${focusRing}`}>
            View All 
          <LuArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          </div>
          <div role="group" aria-label="Product categories" className="grid grid-cols-2 gap-3 min-[380px]:grid-cols-4 lg:grid-cols-8 lg:gap-4">
            {categories.map((item) => <button key={item.name} type="button" 
            aria-pressed={category === item.name} 
            onClick={() => setCategory((current) => current === item.name ? "All" : item.name)} 
            className={`group overflow-hidden rounded-lg border text-center transition-colors ${focusRing} ${category === item.name ? "border-[#37844a] bg-[#e9f3df] ring-1 ring-[#37844a]" : "border-[#f0efea] bg-[#f7f6f1] hover:border-[#a9c596] hover:bg-[#eef4e7]"}`}>
              <span className="relative block h-24 overflow-hidden sm:h-28 xl:h-32">
                <Image src={imageRoot + item.image} alt={item.alt} 
                fill sizes="(max-width: 379px) 50vw, (max-width: 1023px) 25vw, 12.5vw" 
                style={{ objectPosition: item.name === "Dairy & Others" ? "50% 78%" : "center" }} 
                className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-105" />
                </span>
                <span className="flex min-h-11 items-center justify-center px-2 py-2 text-xs font-semibold sm:text-sm">
                  {item.name}
                  </span>
                  </button>)}
                  </div>
                </section>

        <section id="featured-products" aria-labelledby="products-heading" 
        className="mx-auto max-w-[1440px] scroll-mt-6 px-6 pb-7 pt-5 sm:px-10 lg:px-14">
          <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-center lg:gap-6">
            <div>
              <h2 id="products-heading" className="text-2xl font-extrabold tracking-tight">
                {category === "All" ? "Featured Products" : category}
                </h2>
              <p className="mt-1.5 text-base leading-6 text-[#6d796f]">
                Fresh harvests, directly from our farmers to you.
                </p>
                </div>
                <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
                  {cartCount > 0 && <button type="button" 
                  onClick={() => setActiveDialog("cart")} 
                  className={`inline-flex min-h-11 items-center gap-2 rounded-md border border-[#b6d1a9] bg-[#edf6e7] px-3 text-sm font-semibold text-[#2b6d38] ${focusRing}`}>
                    <LuShoppingBasket className="h-5 w-5" aria-hidden="true" />Cart ({cartCount})
                </button>}
              <form role="search" onSubmit={(event) => event.preventDefault()} 
              className="flex h-11 min-w-0 flex-1 overflow-hidden rounded-md border border-[#dce4dc] bg-white focus-within:border-[#438753] focus-within:ring-2 focus-within:ring-[#438753]/15 lg:w-[440px]">
                <LuSearch className="my-auto ml-3.5 h-5 w-5 shrink-0 text-[#56685c]" aria-hidden="true" />
                <label htmlFor="product-search" className="sr-only">Search products, farms or locations</label>
                <input id="product-search" 
                type="search" value={query} 
                onChange={(event) => setQuery(event.target.value)} 
                placeholder="Search for products (e.g. wheat, apple, rice...)" 
                className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-[#8d9990]" />
                <button type="submit" 
                className="shrink-0 bg-[#1b6a39] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#12542a] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white">
                  Search
                </button>
                </form>
                </div>
                </div>
          <p role="status" className="sr-only">{visibleProducts.length} products found. {message}</p>
          {visibleProducts.length > 0 ? 
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
            {visibleProducts.map((product) => <article key={product.id} 
            className="flex min-w-0 flex-col overflow-hidden rounded-md border border-[#dbe5db] bg-white shadow-[0_2px_5px_#1b462208] transition-shadow hover:shadow-[0_5px_18px_#1b46221a]">
              <div className="relative h-48 overflow-hidden bg-[#f0f3e9] md:h-44 xl:h-40">
                <Image src={imageRoot + product.image} 
                alt={product.imageAlt} 
                fill sizes="(max-width: 639px) 100vw, (max-width: 767px) 50vw, (max-width: 1279px) 33vw, 17vw" 
                className="object-cover" />
                <button type="button" aria-label={`${favorites.includes(product.id) ? "Remove" : "Save"} ${product.name} ${favorites.includes(product.id) ? "from" : "to"} favorites`} 
                aria-pressed={favorites.includes(product.id)} 
                onClick={() => toggleFavorite(product)} 
                className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md bg-white/95 shadow-sm transition-colors hover:bg-[#eaf4e4] ${focusRing} ${favorites.includes(product.id) ? "text-[#27773f]" : "text-[#627765]"}`}>
                  <LuHeart className={`h-4 w-4 ${favorites.includes(product.id) ? "fill-[#27773f]" : ""}`} aria-hidden="true" />
                  </button>
                  </div>
                  <div className="flex flex-1 flex-col p-3">
                    <h3 className="text-base font-bold tracking-[-0.025em]">{product.name}</h3>
                    <p className="mt-1 text-xs leading-5 text-[#6e7a6d]">By {product.seller}</p>
                    <p className="mt-1 flex items-start gap-1 text-xs leading-5 text-[#6e7a6d]">
                      <LuMapPin className="mt-1 h-3 w-3 shrink-0 text-[#4d6751]" aria-hidden="true" />
                      {product.location}
                    </p>
                    <div className="mt-auto pt-4">
                      <p className="text-xs text-[#536c51]">
                        <span className="text-xl font-bold tracking-tight text-[#1c2a22]">
                          {formatPrice(product.price)}
                        </span> / {product.unit}
                        </p>
                <button type="button" 
                onClick={() => addToCart(product)} 
                disabled={(cart[product.id] ?? 0) >= 99} 
                aria-label={`Add one ${product.unit} of ${product.name} to cart`} 
                className={`mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-sm border border-[#43894f] bg-[#fcfef9] px-2 py-2 text-xs font-semibold text-[#296d36] transition-colors hover:bg-[#edf6e7] disabled:cursor-not-allowed disabled:opacity-50 ${focusRing}`}>
                  <LuShoppingCart className="h-4 w-4" aria-hidden="true" />
                  {(cart[product.id] ?? 0) > 0 ? `Add More (${cart[product.id]})` : "Add to Cart"}
                  </button>
                  </div>
                  </div>
                  </article>)}
                  </div> : 
                  <div className="rounded-lg border border-dashed border-[#cbdcc2] bg-[#f6faf2] px-6 py-12 text-center">
                    <LuShoppingBasket className="mx-auto h-12 w-12 text-[#699463]" aria-hidden="true" />
                    <h3 className="mt-4 text-xl font-bold">No matching products</h3>
                    <p className="mt-2 text-base text-[#6d7a65]">Try another product, category or location.</p>
                    <button type="button" onClick={resetSearch} 
                    className={`${primaryButton} mt-5`}>Browse All Products 
                    <LuArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>}
        </section>

        <section aria-label="For farmers and buyers" className="mx-auto grid max-w-[1480px] gap-5 px-6 pb-6 sm:px-10 lg:grid-cols-2 lg:px-12">
          <article id="for-farmers" aria-labelledby="farmer-heading" className="relative isolate scroll-mt-6 overflow-hidden rounded-xl bg-[#edf7e9] p-7 lg:min-h-[285px]">
            <Image src="/images/image3.png" alt="Farmers growing crops in a green field" 
            fill sizes="(max-width: 1023px) 100vw, 50vw" className="-z-20 object-cover object-[65%_center]" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-[#edf7e9]/98 via-[#edf7e9]/90 to-[#edf7e9]/70" />
            <div className="flex flex-col justify-between gap-6 sm:flex-row">
              <div className="max-w-[315px]">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#2d793b] sm:text-sm">For Farmers</p>
                <h2 id="farmer-heading" className="mt-2 text-3xl font-extrabold leading-[1.1] tracking-[-0.025em]">List Your Produce,
              <br />Reach More Buyers</h2>
              <p className="mt-3 text-sm leading-6 text-[#5f715b]">Get better prices, wider reach and a trusted platform to sell your agricultural products.</p>
              <Link href="/registration" className={`${primaryButton} mt-4`}>Start Listing 
              <LuArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              </div><ul className="grid gap-4 text-xs text-[#3d5a3c] sm:shrink-0 sm:self-center">
              {[{ label: "Easy Listing", icon: LuSquarePen }, 
              { label: "No Middlemen", icon: LuUsersRound }, 
                { label: "Better Prices", icon: LuCircleDollarSign }, 
                { label: "Secure Payments", icon: LuBanknote }].map(({ label, icon: Icon }) => <li key={label} className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#2d8042]">
              <Icon className="h-4 w-4" aria-hidden="true" />
              </span>{label}</li>)}
              </ul>
              </div>
          </article>
          <article id="for-buyers" aria-labelledby="buyer-heading" className="relative isolate scroll-mt-6 overflow-hidden rounded-xl bg-[#f8f3e7] p-7 lg:min-h-[285px]">
            <Image src={imageRoot + "apples.png"} alt="Fresh apples from the harvest" fill sizes="(max-width: 1023px) 100vw, 50vw" 
            className="-z-20 object-cover object-bottom" />
            <div aria-hidden="true" 
            className="absolute inset-0 -z-10 bg-linear-to-r from-[#fbf5e7]/98 via-[#fbf5e7]/95 to-[#fbf5e7]/75" />
            <div className="flex flex-col justify-between gap-6 sm:flex-row">
              <div className="max-w-[310px]">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#93743f] sm:text-sm">For Buyers</p>
                <h2 id="buyer-heading" className="mt-2 text-3xl font-extrabold leading-[1.1] tracking-[-0.025em]">Buy Fresh, Buy Direct</h2>
                <p className="mt-3 text-sm leading-6 text-[#69715b]">Source high-quality produce directly from verified farmers and suppliers.</p>
              <a href="#featured-products" className={`${primaryButton} mt-4`}>Start Buying 
                <LuArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                </div>
            <ul className="grid gap-4 text-xs text-[#465d3b] sm:shrink-0 sm:self-center">
              {[{ label: "Wide Variety", icon: LuShoppingBasket }, 
                { label: "Verified Sellers", icon: LuShieldCheck },
                  { label: "Quality Produce", icon: LuBadgeCheck }, 
                  { label: "Reliable Delivery", icon: LuTruck }].map(({ label, icon: Icon }) => <li key={label} 
              className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#2e7e3f]">
              <Icon className="h-4 w-4" aria-hidden="true" />
              </span>{label}</li>)}
              </ul>
              </div>
          </article>
        </section>

        <section id="how-it-works" aria-labelledby="process-heading" className="mx-auto max-w-[1440px] scroll-mt-6 px-6 pb-9 pt-2 sm:px-10 lg:px-14">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <h2 id="process-heading" className="text-2xl font-extrabold tracking-tight">How It Works</h2>
            <p className="text-sm text-[#6c786a]">A simple and transparent process for everyone.</p>
            </div>
            <ol className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4 lg:gap-x-14">
              {processSteps.map(({ title, description, icon: Icon }, index) => <li key={title} 
              className="relative text-center">
            <div className="relative z-10 mx-auto flex w-fit items-center gap-4 bg-white">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-[#218638] to-[#056027] text-lg font-bold text-white">{index + 1}
                </span>
                <span className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#e3f0dc] text-[#29763a]">
            <Icon className="h-9 w-9" strokeWidth={1.8} aria-hidden="true" />
            </span>
            </div>{index < processSteps.length - 1 && 
            <div aria-hidden="true" className="absolute left-[calc(50%_+_77px)] right-[calc(-50%_+_75px)] top-[34px] hidden h-px bg-linear-to-r from-[#e0ecda] to-[#4b965a] sm:block">
              <LuArrowRight className="absolute -right-1 -top-2 h-4 w-4 text-[#22803c]" /></div>}
              <h3 className="mt-3 text-base font-bold">{title}</h3>
              <p className="mx-auto mt-1.5 max-w-52 text-sm leading-5 text-[#6b7867]">{description}</p>
              </li>)}
          </ol>
        </section>

        <section aria-label="Why choose AgriBazaar" className="bg-[#edf6e9]">
          <div className="mx-auto grid max-w-[1440px] gap-x-8 gap-y-6 px-6 py-6 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:gap-0 lg:px-14">
            {benefits.map(({ title, description, icon: Icon }, index) => <article key={title} 
            className={`flex items-center gap-4 ${index > 0 ? "lg:border-l lg:border-[#c7ddbe] lg:pl-7" : ""} ${index < benefits.length - 1 ? "lg:pr-5" : ""}`}>
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#246f37]">
              <Icon className="h-9 w-9" strokeWidth={2} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-bold">{title}</h2>
                <p className="mt-1 text-xs leading-5 text-[#5c7058]">{description}</p>
                </div>
                </article>)}
                </div>
              </section>

        <footer className="bg-linear-to-br from-[#174a2e] to-[#0c3824] text-[#d5e4d5]">
          <div className="mx-auto grid max-w-[1440px] gap-8 px-6 py-9 sm:grid-cols-2 sm:px-10 lg:grid-cols-[1.25fr_0.65fr_0.65fr_0.9fr_1.65fr] lg:gap-7 lg:px-14">
          <div className="self-center">
            <Link href="/" aria-label="AgriBazaar home" 
            className="inline-flex items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
              <LuSprout className="h-14 w-12 text-[#e0efdc]" strokeWidth={1.5} aria-hidden="true" />
            <span>
              <span className="block text-2xl font-bold tracking-tight text-white">AgriIndia</span>
              <span className="mt-1 block text-xs">From Our Fields to Your Future.</span>
              </span>
              </Link>
              </div>
          <nav aria-label="Quick links">
            <h2 className="text-sm font-semibold text-white">Quick Links</h2>
          <ul className="mt-3 space-y-2 text-xs">
            <li>
            <Link href="/" 
          className="hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-white">Home
          </Link>
          
          </li
          
          ><li>
            
            <a href="#featured-products" className="hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-white">
            Products
            </a>
          </li>
          <li>
            <a href="#for-farmers" 
            className="hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-white">For Farmers
            </a>
            </li>
            <li>
              <a href="#for-buyers"
               className="hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-white">For Buyers</a>
               </li>
               </ul>
               </nav>
          <nav aria-label="Support">
            <h2 className="text-sm font-semibold text-white">Support</h2>
          <ul className="mt-3 space-y-2 text-xs">
            <li>
            <a href="#how-it-works" 
          className="hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-white">
            Help Center
          </a>
          </li>
          <li>
            <button type="button" onClick={() => setActiveDialog("contact")} className="hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-white">
              Contact Us
              </button>
              </li>
              <li>
                <button type="button" 
              onClick={() => setActiveDialog("faq")} 
              className="hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-white">
                FAQs
              </button>
              </li>
              <li>
                <button type="button" 
              onClick={() => setActiveDialog("cart")} 
              className="hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-white">
                Your Cart{cartCount > 0 ? ` (${cartCount})` : ""}
                </button>
                </li>
                </ul>
                </nav>
          <div>
            <h2 className="text-sm font-semibold text-white">Stay Connected</h2>
          <div aria-hidden="true" className="mt-5 flex items-center gap-5 text-[#e1eadd]">
            <FaFacebookF className="h-5 w-5" />
            <FaInstagram className="h-5 w-5" />
            <FaLinkedin className="h-5 w-5" />
            <FaYoutube className="h-5 w-5" />
            
            </div>
            
            </div>
          <div className="sm:col-span-2 lg:col-span-1 lg:border-l lg:border-[#759b78]/45 lg:pl-7">
          <h2 className="text-sm font-semibold text-white">Subscribe to Our Newsletter</h2>
          <p className="mt-1 text-xs leading-5">Get the latest updates on new products and stories from our farming community.</p>
          <form onSubmit={subscribeToNewsletter} className="mt-3 flex overflow-hidden rounded-md border border-[#90b887] bg-white">
            <label htmlFor="newsletter-email" className="sr-only">Your email address</label>
            <input id="newsletter-email" type="email" autoComplete="email" required value={newsletterEmail} 
            onChange={(event) => { setNewsletterEmail(event.target.value); setNewsletterMessage(""); }} 
            placeholder="Enter your email" 
            className="h-11 min-w-0 flex-1 bg-white px-3 text-xs text-[#345340] outline-none placeholder:text-[#8a978d] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#74aa68]" />
            <button type="submit" 
            className="shrink-0 border-l border-[#79a26d] bg-[#226a38] px-4 text-xs font-semibold text-white hover:bg-[#2d8044] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white">
              Subscribe
              </button>
              </form>
              <p role="status" className="mt-2 text-xs leading-5 text-[#e7edd4]">{newsletterMessage}</p>
              </div>
        </div>
        </footer>
      </main>

      <dialog ref={dialogRef} aria-labelledby="market-dialog-heading" 
      onCancel={() => setActiveDialog(null)} 
      onClose={() => setActiveDialog(null)} 
      onClick={(event) => { if (event.target === event.currentTarget) setActiveDialog(null); }} 
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-xl overflow-y-auto rounded-2xl border-0 bg-white p-0 font-sans text-[#263f2c] shadow-2xl backdrop:bg-[#0f291a]/65 backdrop:backdrop-blur-sm">
        {activeDialog && 
        <div className="relative p-6 sm:p-8"
         onClick={(event) => event.stopPropagation()}>
          <button type="button" 
          aria-label="Close dialog" 
          onClick={() => setActiveDialog(null)} 
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#dbe6d6] bg-white text-[#365b3b] hover:bg-[#eff6e8] ${focusRing}`}><LuX className="h-5 w-5" aria-hidden="true" /></button>
          {activeDialog === "cart" ? <>
          <span 
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e3efda] text-[#2b753c]">
            <LuShoppingBasket className="h-7 w-7" aria-hidden="true" />
            </span>
            <h2 id="market-dialog-heading" 
            className="mt-4 text-3xl font-bold tracking-tight">Your Produce Cart</h2>
            {cartProducts.length > 0 ? <>
            <p className="mt-2 text-sm text-[#6a7a61]">Review your quantities before connecting with the sellers.</p>
            <ul className="mt-6 divide-y divide-[#e2ebdd]">
  {cartProducts.map((product) => <li key={product.id} 
className="flex gap-4 py-5 first:pt-0">
  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#edf3e7]">
    <Image src={imageRoot + product.image} alt={product.imageAlt} fill sizes="80px" className="object-cover" />
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{product.name}</h3>
          <p className="mt-1 text-xs text-[#718067]">{formatPrice(product.price)} per {product.unit}{product.unit === "quintal" && " (100 kg)"}</p>
          </div>
          <button type="button" 
          aria-label={`Remove ${product.name} from cart`} 
        onClick={() => { setCart((current) => ({ ...current, [product.id]: 0 })); setMessage(`${product.name} removed from cart.`); }} 
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#77856e] hover:bg-[#f1f5ec] ${focusRing}`}>
          <LuTrash2 className="h-4 w-4" aria-hidden="true" />
          </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center rounded-md border border-[#d5e3cc]">
              <button type="button" aria-label={`Decrease ${product.name} quantity`} 
              onClick={() => changeQuantity(product, -1)} 
  className={`flex h-9 w-9 items-center justify-center rounded-l-md hover:bg-[#edf5e6] ${focusRing}`}>
    <LuMinus className="h-4 w-4" aria-hidden="true" /></button>
    <span aria-label={`${product.name} quantity`} 
    className="min-w-9 px-1 text-center text-sm font-semibold tabular-nums">{cart[product.id]}</span>
    <button type="button"
      aria-label={`Increase ${product.name} quantity`} 
      onClick={() => changeQuantity(product, 1)} 
      disabled={cart[product.id] >= 99} 
      className={`flex h-9 w-9 items-center justify-center rounded-r-md hover:bg-[#edf5e6] disabled:opacity-40 ${focusRing}`}>
      <LuPlus className="h-4 w-4" aria-hidden="true" />
      </button>
      </div>
      <p className="font-semibold">{formatPrice(product.price * cart[product.id])}
        </p>
        </div>
        </div>
        </li>)}
        </ul>
        <div className="mt-3 rounded-lg bg-[#edf5e5] p-5">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-semibold">Estimated subtotal</h3>
            <p className="text-2xl font-bold tabular-nums">{formatPrice(cartTotal)}</p>
            </div>
            <p className="mt-2 text-xs leading-5 text-[#6a7c5d]">Final availability, delivery charges and payment terms are confirmed with each seller.</p>
            </div>
<Link href="/login" className={`${primaryButton} mt-5 w-full`}>Log In to Connect with Sellers 
<LuArrowRight className="h-4 w-4" aria-hidden="true" />
</Link></> : <div className="py-8 text-center">
  <p className="text-base text-[#6a7b60]">Your cart is empty. Find something fresh from our farmers.</p>
  <button type="button" 
  onClick={() => { setActiveDialog(null); document.getElementById("featured-products")?.scrollIntoView(); }} 
  className={`${primaryButton} mt-5`}>Browse Products 
  <LuArrowRight className="h-4 w-4" aria-hidden="true" />
  </button>
  </div>}
  <p role="status" 
  className="sr-only">{message} Cart total: {formatPrice(cartTotal)}.</p>
  </> : activeDialog === "faq" ? <>
  <h2 id="market-dialog-heading" 
  className="pr-10 text-2xl font-bold tracking-tight">A Little Help to Get Started</h2>
  <div className="mt-6 space-y-3">{faqs.map(({ question, answer }) => <details key={question} name="market-faq" 
  className="group rounded-lg border border-[#dce7d5] bg-[#f6f9f1]">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-[#357748] [&::-webkit-details-marker]:hidden">{question}
      <LuChevronDown className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
      
      </summary>
      <p className="border-t border-[#dce7d5] px-4 py-4 text-sm leading-6 text-[#6b7c60]">{answer}
        </p></details>)}</div></> :
          <>
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e3f0d9] text-[#367439]">
          <LuUsersRound className="h-8 w-8" aria-hidden="true" />
          </span>
          <h2 id="market-dialog-heading" className="mt-5 text-3xl font-bold tracking-tight">Better Connections.
            <br />Fresher Possibilities.</h2>
            <p className="mt-4 text-base leading-7 text-[#68795f]">Whether you’re selling your harvest or sourcing fresh produce, start with an account to connect with farmers and buyers.</p>
            <Link href="/registration" className={`${primaryButton} mt-6 w-full`}>Create an Account 
            <LuArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <p className="mt-4 text-center text-sm text-[#6c7b64]">Already registered? 
              <Link href="/login" className={`font-semibold text-[#267143] underline underline-offset-4 ${focusRing}`}>Log in
              </Link>
              </p>
            </>}
        </div>}
      </dialog>
    </>
  );
}
