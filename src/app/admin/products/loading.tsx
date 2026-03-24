import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-full max-w-sm" />
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
