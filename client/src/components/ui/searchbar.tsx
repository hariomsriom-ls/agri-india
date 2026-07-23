import {MdOutlineSearch} from "./icons"

export default function SearchBar() {
  return (
    <div className="flex w-full max-w-xl">
      <div className="relative flex-1">
        <MdOutlineSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
         <input
          type="text"
          placeholder="Search workers..."
          className="w-full rounded-l-xl border pl-10 border-r-0 border-gray-300 outline-none
                     focus:border-green-500 focus:ring-1 focus:ring-green-200"
        />
         </div>
          <button
        className="rounded-r-xl bg-green-600 px-2 text-white
                   hover:bg-green-700 transition"
      >
        Search
      </button>
    </div>
  );
}