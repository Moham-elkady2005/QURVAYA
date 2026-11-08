export default function SurahLoading() {
  return (
    <div className="pb-36">
      <div className="border-b border-border/70 bg-background/85">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          <span className="size-10 animate-pulse rounded-full bg-foreground/5" />
          <div className="flex-1 space-y-2">
            <span className="block h-3 w-24 animate-pulse rounded-full bg-foreground/8" />
            <span className="block h-2.5 w-16 animate-pulse rounded-full bg-foreground/5" />
          </div>
          <span className="h-10 w-40 animate-pulse rounded-full bg-foreground/5" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-4xl px-3 pt-5 sm:px-6 sm:pt-8">
        <div className="surface-card flex flex-col items-center px-6 py-14">
          <span className="h-6 w-36 animate-pulse rounded-full bg-foreground/5" />
          <span className="mt-5 h-12 w-56 animate-pulse rounded-2xl bg-foreground/8" />
          <span className="mt-4 h-3 w-28 animate-pulse rounded-full bg-foreground/5" />
          <span className="mt-8 h-8 w-64 animate-pulse rounded-xl bg-foreground/5" />
        </div>

        <div className="surface-card mt-5 space-y-7 p-6 sm:p-10">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <span className="block h-3 w-16 animate-pulse rounded-full bg-foreground/5" />
              <span className="block h-8 w-full animate-pulse rounded-lg bg-foreground/[0.06]" />
              <span
                className="block h-8 animate-pulse rounded-lg bg-foreground/[0.06]"
                style={{ width: `${88 - index * 3}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
