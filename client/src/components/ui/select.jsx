import { cn } from "@/lib/utils";

function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-200",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export { Select };
export default Select;
