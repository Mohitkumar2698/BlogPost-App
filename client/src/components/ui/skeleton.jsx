import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return <div className={cn("bg-accent animate-pulse rounded-md", className)} {...props} />;
}

export { Skeleton };
export default Skeleton;
