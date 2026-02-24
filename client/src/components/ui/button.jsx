import { cn } from "@/lib/utils";

const variants = {
  default: "bg-teal-700 text-white hover:bg-teal-800",
  outline: "border border-slate-300 text-slate-900 hover:bg-slate-100",
  ghost: "text-slate-700 hover:bg-slate-100",
  destructive: "bg-rose-600 text-white hover:bg-rose-700",
  secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300",
  link: "text-teal-700 underline-offset-4 hover:underline",
};

const sizes = {
  default: "h-10 px-4 text-sm",
  sm: "h-9 px-3 text-sm",
  lg: "h-11 px-6 text-base",
  icon: "h-10 w-10",
};

function Button({ className, variant = "default", size = "default", type = "button", ...props }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant] || variants.default,
        sizes[size] || sizes.default,
        className
      )}
      {...props}
    />
  );
}

function buttonVariants({ variant = "default", size = "default", className } = {}) {
  return cn(variants[variant] || variants.default, sizes[size] || sizes.default, className);
}

export { Button, buttonVariants };
export default Button;
