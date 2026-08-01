import {MdOutlineSearch} from "./icons"

interface SearchBarProps {
  name: string;
  type?: string;
  placeholder?: string;
  inputClassName?: string;
  buttonClassName?: string;
  containerClassName?: string;
}

export function SearchBar({
  name,
  type = "text",
  placeholder = "",
   buttonClassName,
    inputClassName,
  containerClassName
}: SearchBarProps)  {
  return (
    <div className={`flex w-full max-w-xl  ${containerClassName}`}>
      <div className="relative flex-1">
        <MdOutlineSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
         <input
         name={name}
          type={type}
          placeholder={placeholder}
          className={` w-full rounded-l-xl border pl-10 border-r-0 border-gray-300 outline-none
                     focus:border-green-500 focus:ring-1 focus:ring-green-200 ${ inputClassName}`}
        />
         </div>
        <button
        className={`rounded-r-xl bg-green-600 px-2 text-white
                   hover:bg-green-700 transition ${buttonClassName}`}
      >
        Search
      </button>
    </div>
  );
}