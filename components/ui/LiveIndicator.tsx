export function LiveIndicator() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#69f6b8] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#69f6b8]"></span>
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-[#69f6b8]">Live</span>
    </div>
  );
}
