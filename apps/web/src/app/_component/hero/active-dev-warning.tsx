function WarningText() {
  return (
    <span>
      ⚠️ Cheflog is in active development. Some features may be unstable.
    </span>
  );
}

export function ActiveDevWarning() {
  return (
    <div className="relative  w-full overflow-hidden p-0">
      <div className="marquee-container w-full rounded-md px-4 py-2 font-semibold text-orange-400">
        <div className="marquee-content flex w-max gap-8 whitespace-nowrap text-sm">
          <WarningText />
          <WarningText />
          <WarningText />
          <WarningText />
        
        </div>
      </div>
      <style jsx>{`
        .marquee-container {
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        .marquee-content {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
          will-change: transform;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
