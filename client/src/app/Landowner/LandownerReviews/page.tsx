"use client";

import { FormEvent, ReactNode, useMemo, useRef, useState } from "react";
import {FiCheckCircle,FiChevronLeft,FiChevronRight,FiClock,FiEye,FiMessageSquare,FiMoreVertical,FiPaperclip,
  FiSearch,FiSend,FiSmile,FiStar,
} from "@/components/ui/icons";
import { useFetchReviews } from "@/services/fetchReviews";
import type { Reviews, ReviewCategory, ReviewStatus } from "@/features/landowner-Worker/reviewsdata";

const PAGE_SIZE = 5;

function reviewTimestamp(review: Reviews) {
  return Date.parse(review.createdAt || review.date || "") || 0;
}

function formatReviewDate(review: Reviews) {
  const value = review.createdAt || review.date;
  if (!value) return "Not provided";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not provided";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
}

const categoryStyles: Record<ReviewCategory, string> = {
  "Platform Experience": "bg-violet-50 text-violet-700",
  "Support & Service": "bg-blue-50 text-blue-700",
  "Feature Request": "bg-emerald-50 text-emerald-700",
  "General Feedback": "bg-amber-50 text-amber-700",
};

const statusStyles: Record<ReviewStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  Submitted: "bg-emerald-50 text-emerald-700",
  Published: "bg-emerald-50 text-emerald-700",
  "Under Review": "bg-amber-50 text-amber-700",
  Responded: "bg-blue-50 text-blue-700",
};

export default function LandownerReviews() {
  const { role, reviews, status, error, retry, totalReviews, pendingReviews, submittedReviews } = useFetchReviews("landowner");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [category, setCategory] = useState("");
  const [review, setReview] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [contact, setContact] = useState("no");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sort, setSort] = useState("Newest First");
  const [page, setPage] = useState(1);
  const fileRef = useRef<HTMLInputElement>(null);

  const visibleReviews = useMemo(() => {
    const term = search.trim().toLowerCase();
    return reviews.filter((item) =>
      (!term || [item._id, item.category, item.title, item.review].some((value) => value?.toLowerCase().includes(term))) &&
      (categoryFilter === "All Categories" || item.category === categoryFilter) &&
      (statusFilter === "All Status" || item.status === statusFilter),
    ).sort((a, b) => sort === "Oldest First" ? reviewTimestamp(a) - reviewTimestamp(b) : reviewTimestamp(b) - reviewTimestamp(a));
  }, [reviews, categoryFilter, search, statusFilter, sort]);

  const recentReviews = useMemo(() => [...reviews].sort((a, b) => reviewTimestamp(b) - reviewTimestamp(a)).slice(0, 3), [reviews]);
  const pages = Math.max(1, Math.ceil(visibleReviews.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const pageReviews = visibleReviews.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const averageRating = reviews.length ? `${(reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length).toFixed(1)}/5` : "—";
  const reviewStatuses = [...new Set(reviews.map((item) => item.status).filter(Boolean))];

  function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!rating || !category || !review.trim()) return;
    setSubmitted(true);
    setRating(0);
    setCategory("");
    setReview("");
    setSuggestion("");
    setAttachment(null);
  }

  if (!role) {
    return <p className="p-6 text-slate-600">User role not found. Please sign in to view your reviews.</p>;
  }
  if (role !== "landowner") {
    return <p role="alert" className="p-6 text-red-600">Only landowners can view this page.</p>;
  }
  if (status === "idle" || status === "loading") {
    return <p role="status" className="p-6 text-slate-600">Loading reviews...</p>;
  }
  if (status === "failed") {
    return <div className="p-6"><p role="alert" className="text-red-600">{error ?? "Failed to fetch reviews."}</p><button type="button" onClick={retry} className="mt-3 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Try again</button></div>;
  }

  return (
    <div className="min-h-full bg-[#f7f9f8] px-4 py-7 text-slate-800 sm:px-7 lg:px-9">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-6"><h1 className="text-3xl font-bold tracking-tight text-slate-950">Review &amp; Suggestions</h1><p className="mt-1.5 text-sm text-slate-500">Share your experience and help us improve the platform</p></header>

        {submitted && <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800"><FiCheckCircle className="text-xl" />Thank you! Your review has been submitted.<button type="button" onClick={() => setSubmitted(false)} className="ml-auto text-xs font-bold">DISMISS</button></div>}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Total Reviews" value={String(totalReviews)} note="All time" icon={<FiStar />} style="bg-violet-50 text-violet-700" />
          <SummaryCard label="Submitted Reviews" value={String(submittedReviews)} note="Marked as submitted" icon={<FiCheckCircle />} style="bg-emerald-50 text-emerald-600" />
          <SummaryCard label="Pending Feedback" value={String(pendingReviews)} note="Awaiting review" icon={<FiClock />} style="bg-amber-50 text-amber-600" />
          <SummaryCard label="Average Rating" value={averageRating} note="Across your reviews" icon={<FiSmile />} style="bg-blue-50 text-blue-600" />
        </section>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,.95fr)]">
          <form onSubmit={submitReview} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">Submit Your Review</h2>
            <fieldset className="mt-5">
              <legend className="text-sm font-semibold text-slate-600">How would you rate your overall experience?</legend>
              <div className="mt-2 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => 
                <button key={star} 
                type="button" aria-label={`${star} star rating`} 
                onMouseEnter={() => setHoveredRating(star)} 
                onMouseLeave={() => setHoveredRating(0)} 
                onClick={() => setRating(star)} 
                className={`text-3xl transition hover:scale-110 ${star <= (hoveredRating || rating) ? "text-amber-400" : "text-slate-300"}`}>
                <FiStar className={star <= (hoveredRating || rating) ? "fill-current" : ""} />
              </button>)}
              <span className="ml-3 text-sm text-slate-500">{rating ? `${rating} out of 5` : "Select rating"}</span>
              </div>
            </fieldset>
            <label className="mt-5 block text-sm font-semibold text-slate-600">
              What is this review about?
              <select value={category} 
              onChange={(event) => setCategory(event.target.value)}
               required 
              className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 font-normal outline-none focus:border-emerald-500">
                <option value="">Select a category</option>
                {Object.keys(categoryStyles).map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="mt-5 block text-sm font-semibold text-slate-600">
              Your Review 
              <span className="text-red-500">*</span>
              <textarea value={review} 
              onChange={(event) => setReview(event.target.value.slice(0, 1000))} 
              required 
              rows={4} 
              placeholder="Tell us about your experience..." 
              className="mt-2 w-full resize-none rounded-lg border border-slate-200 p-3 font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
              <span className="mt-1 block text-xs font-normal text-slate-400">{review.length}/1000 characters</span>
            </label>
            <label className="mt-4 block text-sm font-semibold text-slate-600">
              Suggestions (Optional)
              <textarea value={suggestion} 
              onChange={(event) => setSuggestion(event.target.value.slice(0, 1000))} 
              rows={3} placeholder="What improvements or features would you like to see?" className="mt-2 w-full resize-none rounded-lg border border-slate-200 p-3 font-normal outline-none focus:border-emerald-500" />
              <span className="mt-1 block text-xs font-normal text-slate-400">{suggestion.length}/1000 characters</span>
            </label>
            <fieldset className="mt-4">
              <legend className="text-sm font-semibold text-slate-600">
                Would you like us to contact you regarding this feedback?
              </legend>
              <div className="mt-2 flex flex-wrap gap-6 text-sm">
                <label className="flex items-center gap-2">
                  <input type="radio" 
                  name="contact" value="yes" 
                  checked={contact === "yes"} 
                  onChange={(event) => setContact(event.target.value)} 
                  className="accent-emerald-700" />Yes, please contact me
                </label>
                <label className="flex items-center gap-2">
                  <input 
                  type="radio" 
                  name="contact" 
                  value="no" 
                  checked={contact === "no"} 
                  onChange={(event) => setContact(event.target.value)} 
                  className="accent-emerald-700" />No, thank you
                </label>
                </div>
              </fieldset>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <input ref={fileRef} 
              type="file" accept="image/*,.pdf,.doc,.docx" 
              className="hidden" 
              onChange={(event) => setAttachment(event.target.files?.[0] ?? null)} />
              <button type="button" 
              onClick={() => fileRef.current?.click()} 
              className="inline-flex h-10 min-w-0 items-center gap-2 rounded-lg border border-slate-200 px-4 text-left text-sm font-semibold hover:bg-slate-50">
                <FiPaperclip className="shrink-0" />
                <span className="truncate">{attachment?.name ?? "Attach Files (Optional)"}</span>
                </button>
                <button type="submit" 
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-700 px-5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800">
                  Submit Review 
                  <FiSend />
                  </button>
                </div>
          </form>

          <div className="grid gap-5">
          <section className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <FiSmile className="text-emerald-600" />
              Why Your Feedback Matters
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              {["Help us improve platform features", "Better support for landowners like you", "Your suggestions shape future updates", "We value your time and opinions"].map((text) => <li key={text} className="flex items-center gap-2">
                <FiCheckCircle className="text-emerald-600" />{text}</li>)}
            </ul>
            <div className="absolute bottom-6 right-7 hidden rounded-2xl rounded-br-none bg-emerald-600 px-5 py-3 text-lg tracking-widest text-amber-200 shadow-lg sm:block">★★★★★</div>
          </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Your Previous Reviews</h2>
                <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold hover:bg-slate-50">View All</button>
              </div>
              <div className="mt-3 divide-y divide-slate-100">
                {recentReviews.map((item) => <article key={item._id} className="flex items-center gap-3 py-4">
                <div className="min-w-0 flex-1">
                  <StarRating rating={item.rating} />
                <h3 className="mt-1 truncate text-sm font-bold text-slate-800">{item.title || item.category}</h3>
                <p className="mt-1 truncate text-xs text-slate-500">{item.review}</p>
                </div>
                <span 
                className={`hidden shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold sm:block ${statusStyles[item.status] ?? "bg-slate-100 text-slate-600"}`}>
                  {item.status || "Not provided"}</span>
                <time className="hidden shrink-0 text-[10px] text-slate-500 md:block">{formatReviewDate(item)}</time>
                <button type="button" aria-label={`View ${item._id}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-500">
                  <FiEye />
                </button>
                </article>)}{!reviews.length && <p className="py-6 text-sm text-slate-500">You have not submitted any reviews yet.</p>}
              </div>
            </section>
          </div>
        </div>

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-5 xl:flex-row xl:items-center xl:justify-between">
            <h2 className="text-lg font-bold text-slate-900">All Submitted Feedback</h2>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[230px_180px_150px_150px]">
            <label className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} 
            onChange={(event) => { setSearch(event.target.value); setPage(1); }} 
            placeholder="Search reviews..." 
            className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-emerald-500" />
            </label>
            <select value={categoryFilter} 
            onChange={(event) => { setCategoryFilter(event.target.value); setPage(1); }} 
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm">
            <option>All Categories</option>
            {Object.keys(categoryStyles).map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={statusFilter} 
            onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} 
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm">
              <option>All Status</option>
              {reviewStatuses.map((item) => <option key={item}>{item}</option>)}
              </select>
            <select value={sort} 
            onChange={(event) => { setSort(event.target.value); setPage(1); }} 
            aria-label="Sort reviews" className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm">
            <option>Newest First</option>
            <option>Oldest First</option>
            </select>
          </div>
        </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-600">
                <tr>
                  <th className="px-5 py-4">Review ID</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Rating</th>
                  <th className="px-5 py-4">Review</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Response</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
            <tbody className="divide-y divide-slate-100">{pageReviews.map((item) => <tr key={item._id} className="hover:bg-slate-50/70">
            <td className="whitespace-nowrap px-5 py-4 text-xs font-semibold">{item._id}</td>
            <td className="px-5 py-4">
              <span className={`whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold ${categoryStyles[item.category] ?? "bg-slate-100 text-slate-600"}`}>{item.category}</span>
            </td>
            <td className="px-5 py-4">
              <StarRating rating={item.rating} />
            </td>
            <td className="max-w-xs truncate px-5 py-4">{item.review}</td>
            <td className="whitespace-nowrap px-5 py-4 text-slate-600">{formatReviewDate(item)}</td>
            <td className="px-5 py-4">
              <span className={`whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold ${statusStyles[item.status] ?? "bg-slate-100 text-slate-600"}`}>{item.status || "Not provided"}
              </span>
            </td>
            <td className="px-5 py-4">
              {item.responses ? <span className="inline-flex items-center gap-1 rounded-md border border-blue-100 px-2 py-1 text-xs text-blue-700">
                <FiMessageSquare />{
                item.responses}
              </span> : "–"}
            </td>
            <td className="px-5 py-4">
            <div className="flex gap-2">
            <button type="button" 
            aria-label={`View ${item._id}`} 
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500">
              <FiEye />
              </button>
            <button type="button" 
            aria-label={`More actions for ${item._id}`} 
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500">
              <FiMoreVertical />
            </button>
            </div>
            </td>
            </tr>)}
            {!visibleReviews.length && <tr>
              <td colSpan={8} className="px-5 py-12 text-center text-slate-500">{reviews.length ? "No reviews match your filters." : "You have not submitted any reviews yet."}
              </td>
            </tr>}
            </tbody>
          </table>
        </div>
          <footer 
          className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Showing {visibleReviews.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0} to {Math.min(currentPage * PAGE_SIZE, visibleReviews.length)} of {visibleReviews.length} reviews</p>
          <div className="flex items-center gap-2">
            <PageButton label="Previous" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
            <FiChevronLeft />
            </PageButton>
            <span aria-live="polite">Page {currentPage} of {pages}</span>
            <PageButton label="Next" disabled={currentPage >= pages} onClick={() => setPage(currentPage + 1)}>
            <FiChevronRight />
            </PageButton>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, note, icon, style }:
   { label: string; value: string; note: string; icon: ReactNode; style: string }) {
  return(
  <article className="flex min-h-28 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl text-2xl ${style}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-semibold text-slate-600">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-[11px] text-slate-500">{note}</p>
    </div>
  </article>
  );
}

function StarRating({ rating }: { rating: number }) {
  return( 
  <span 
  className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => 
  <FiStar key={star} className={star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"} />)}
  </span>
  );
}

function PageButton({ children, label, disabled, onClick }: 
  { children: ReactNode; label: string; disabled?: boolean; onClick: () => void }) {
  return (
  <button type="button" 
  aria-label={label} 
  disabled={disabled} 
  onClick={onClick} 
  className="grid h-9 min-w-9 place-items-center rounded-lg border border-slate-200 px-2 font-semibold text-slate-500 disabled:cursor-not-allowed disabled:opacity-40">
    {children}
    </button>
  );
}
