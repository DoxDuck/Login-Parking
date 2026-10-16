function HomePage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col font-[Inter,system-ui,sans-serif]"
      style={{
        background: 'linear-gradient(160deg, hsl(220,40%,6%) 0%, hsl(210,50%,8%) 50%, hsl(200,45%,7%) 100%)',
      }}
    >
      {/* ── Top bar ── */}
      <header
        className="flex items-center justify-between px-8 py-4 border-b border-white/[0.07] shrink-0"
        style={{
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex items-center gap-3">
          {/* Pin icon */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, hsl(213,90%,52%), hsl(190,90%,42%))', boxShadow: '0 0 16px rgba(99,179,237,0.4)' }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="white" strokeWidth="2.2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div>
            <h1
              className="text-[17px] font-bold m-0 leading-tight"
              style={{
                background: 'linear-gradient(135deg, #fff 20%, hsl(213,90%,80%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ParkingSystem
            </h1>
            <p className="text-[11px] text-white/35 m-0 tracking-wide">Bản đồ bãi đỗ xe</p>
          </div>
        </div>

        {/* Live badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
          <span className="text-[12px] text-emerald-400 font-medium">Trực tiếp</span>
        </div>
      </header>

      {/* ── Map container ── */}
      <div className="flex-1 relative p-6 flex flex-col gap-4">
        {/* Map card */}
        <div
          className="flex-1 rounded-2xl overflow-hidden border border-white/[0.08] relative"
          style={{
            boxShadow: '0 0 0 1px rgba(99,179,237,0.06) inset, 0 24px 60px rgba(0,0,0,0.4)',
            minHeight: '500px',
          }}
        >
          {/* ⚠️  PASTE YOUR FULL Google Maps embed src below.
               Go to Google Maps → Share → Embed a map → copy the full src URL */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15673.5!2d106.6602!3d10.7769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1600000000000!5m2!1svi!2s"
            width="100%"
            height="100%"
            style={{
              border: 0,
              display: 'block',
              minHeight: '500px',
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Bản đồ bãi đỗ xe"
          />

          {/* Corner label */}
          <div
            className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10"
            style={{ background: 'rgba(10,15,30,0.75)', backdropFilter: 'blur(12px)' }}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="rgba(99,179,237,0.9)" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-[12px] text-white/70 font-medium">Vị trí bãi đỗ xe</span>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
      `}</style>
    </div>
  )
}

export default HomePage
