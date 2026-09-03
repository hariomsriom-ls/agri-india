"use client";
type ReviewFieldProps = {
  label: string;
  value?: string | number | Date | null;
};

 export  function ReviewField({
  label,
  value,
}: ReviewFieldProps) {
  return (
    <>
      <div className="px-4 py-3 font-semibold border-r border-gray-300">
        {label}
      </div>

      <div className="px-4 py-3 border-r border-gray-300">
        {value instanceof Date ? value.toLocaleDateString() : value || "NA"}
      </div>
    </>
  );
}