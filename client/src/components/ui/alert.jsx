import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive: "border-destructive/30 text-destructive bg-card",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function AlertTitle({ className, ...props }) {
  return <div className={cn("font-medium tracking-tight", className)} {...props} />;
}

function AlertDescription({ className, ...props }) {
  return (
    <div
      className={cn("text-muted-foreground mt-1 text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}

function Alert({ className, variant, title, children, ...props }) {
  const mappedVariant = variant === "error" ? "destructive" : variant;

  return (
    <div role="alert" className={cn(alertVariants({ variant: mappedVariant }), className)} {...props}>
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      {children ? <AlertDescription>{children}</AlertDescription> : null}
    </div>
  );
}

export { Alert, AlertTitle, AlertDescription };
export default Alert;
