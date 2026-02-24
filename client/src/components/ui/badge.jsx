import { cn } from "@/lib/utils";

const variants = {
  default: "bg-slate-100 text-slate-700",
  secondary: "bg-teal-100 text-teal-800",
  destructive: "bg-rose-100 text-rose-700",
  outline: "border border-slate-300 text-slate-700",
  ghost: "text-slate-700",
  link: "text-teal-700 underline-offset-4 hover:underline",
};

function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  );
}

function badgeVariants({ variant = "default", className } = {}) {
  return cn(variants[variant] || variants.default, className);
}

export { Badge, badgeVariants };
export default Badge;
