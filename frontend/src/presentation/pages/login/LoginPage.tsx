import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import parkingLogo from '../../../assets/parking-logo.jpg'

interface FloatingCar {
  id: number
  x: number
  delay: number
  duration: number
}

// Fields sent to POST /api/Account/login
interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<LoginForm>({ email: '', password: '', rememberMe: false })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [floatingCars, setFloatingCars] = useState<FloatingCar[]>([])

  useEffect(() => {
    setFloatingCars(
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: 5 + Math.random() * 90,
        delay: Math.random() * 6,
        duration: 9 + Math.random() * 7,
      }))
    )
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email.trim() || !form.password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/Account/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      })

      if (res.ok) {
        const data = await res.json().catch(() => null)
        // Store token if returned (e.g. JWT)
        if (data?.token) {
          if (form.rememberMe) {
            localStorage.setItem('auth_token', data.token)
          } else {
            sessionStorage.setItem('auth_token', data.token)
          }
        }
        // Navigate to dashboard (adjust route as needed)
        navigate('/dashboard')
      } else {
        let message = 'Email hoặc mật khẩu không đúng.'
        try {
          const data = await res.json()
          if (typeof data === 'string') {
            message = data
          } else if (data?.message) {
            message = data.message
          } else if (data?.errors) {
            const descriptions = Object.values(data.errors).flat() as string[]
            if (descriptions.length > 0) message = descriptions[0]
          } else if (Array.isArray(data) && data[0]?.description) {
            message = data[0].description
          }
        } catch {
          message = res.statusText || message
        }
        setError(message)
      }
    } catch {
      setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-[Inter,system-ui,sans-serif]">
      {/* ── Animated Background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 20% 10%, hsl(213,80%,12%) 0%, transparent 60%),' +
              'radial-gradient(ellipse 60% 50% at 80% 80%, hsl(196,70%,10%) 0%, transparent 55%),' +
              'linear-gradient(160deg, hsl(220,40%,6%) 0%, hsl(210,50%,8%) 50%, hsl(200,45%,7%) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(99,179,237,.04) 1px,transparent 1px),' +
              'linear-gradient(90deg,rgba(99,179,237,.04) 1px,transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse at center,black 40%,transparent 80%)',
          }}
        />
        {[
          { w: 500, h: 500, top: -100, left: -100, color: 'hsla(213,90%,55%,0.15)', dur: '14s', delay: '0s' },
          { w: 400, h: 400, bottom: -80, right: -80, color: 'hsla(190,90%,50%,0.12)', dur: '10s', delay: '-4s' },
          { w: 300, h: 300, top: '45%', left: '60%', color: 'hsla(260,80%,60%,0.08)', dur: '16s', delay: '-8s' },
        ].map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: orb.w, height: orb.h, top: orb.top, left: orb.left,
              bottom: (orb as any).bottom, right: (orb as any).right,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              filter: 'blur(80px)',
              animation: `orbFloat ${orb.dur} ease-in-out ${orb.delay} infinite alternate`,
            }}
          />
        ))}
        {floatingCars.map(car => (
          <div
            key={car.id}
            className="absolute bottom-0"
            style={{ left: `${car.x}%`, width: 60, opacity: 0, animation: `carFloat ${car.duration}s ${car.delay}s linear infinite` }}
          >
            <svg viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="10" width="50" height="14" rx="4" fill="rgba(99,179,237,0.15)" />
              <rect x="12" y="4" width="28" height="12" rx="3" fill="rgba(99,179,237,0.12)" />
              <circle cx="14" cy="24" r="4" fill="rgba(99,179,237,0.2)" />
              <circle cx="44" cy="24" r="4" fill="rgba(99,179,237,0.2)" />
            </svg>
          </div>
        ))}
      </div>

      {/* ── Login Card ── */}
      <div className="relative z-10 w-full max-w-[460px] px-4 py-5">
        <div
          className="rounded-3xl border border-white/10 px-10 pt-10 pb-8"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow:
              '0 0 0 1px rgba(99,179,237,0.08) inset, 0 32px 80px rgba(0,0,0,0.5), 0 0 60px rgba(99,179,237,0.04)',
            animation: 'cardIn .6s cubic-bezier(.34,1.56,.64,1) both',
          }}
        >
          {/* ── Logo & Brand ── */}
          <div className="flex flex-col items-center gap-4 mb-7">
            <div
              className="w-20 h-20 rounded-2xl p-[3px]"
              style={{
                background: 'linear-gradient(135deg, hsl(213,90%,55%), hsl(190,90%,50%))',
                boxShadow: '0 0 30px rgba(99,179,237,0.4), 0 8px 24px rgba(0,0,0,0.4)',
                animation: 'logoGlow 3s ease-in-out infinite alternate',
              }}
            >
              <img src={parkingLogo} alt="ParkingSystem Logo" className="w-full h-full rounded-[18px] object-cover block" />
            </div>
            <div className="text-center">
              <h1
                className="text-[26px] font-extrabold tracking-tight m-0 mb-1"
                style={{
                  background: 'linear-gradient(135deg, #fff 20%, hsl(213,90%,80%))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                ParkingSystem
              </h1>
              <p className="text-[13px] text-white/40 m-0 tracking-wide">
                Hệ thống quản lý bãi đỗ xe thông minh
              </p>
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.1), transparent)' }} />
            <span className="text-[11px] text-white/30 uppercase tracking-widest whitespace-nowrap">Đăng nhập vào hệ thống</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.1), transparent)' }} />
          </div>

          {/* ── Form ── */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>

            {/* API Error */}
            {error && (
              <div
                className="flex items-center gap-2 px-3.5 py-3 rounded-xl border border-red-400/30 bg-red-500/10 text-red-300 text-[13.5px]"
                role="alert"
                style={{ animation: 'shakeIn .4s cubic-bezier(.36,.07,.19,.97)' }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-[13px] font-medium text-white/60">Email</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-white/30 flex items-center pointer-events-none">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="Nhập email của bạn..."
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  autoFocus
                  className="w-full py-3 pl-11 pr-4 rounded-xl text-[14.5px] text-white placeholder-white/20 outline-none transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => { e.target.style.background = 'rgba(99,179,237,0.07)'; e.target.style.borderColor = 'rgba(99,179,237,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,179,237,0.12)' }}
                  onBlur={e => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-[13px] font-medium text-white/60">Mật khẩu</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-white/30 flex items-center pointer-events-none">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu..."
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className="w-full py-3 pl-11 pr-11 rounded-xl text-[14.5px] text-white placeholder-white/20 outline-none transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={e => { e.target.style.background = 'rgba(99,179,237,0.07)'; e.target.style.borderColor = 'rgba(99,179,237,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,179,237,0.12)' }}
                  onBlur={e => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                  className="absolute right-3.5 p-1 rounded-md text-white/30 hover:text-white/70 transition-all duration-200 cursor-pointer border-none bg-transparent"
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot */}
            <div className="flex items-center justify-between -mt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none" htmlFor="login-remember">
                <input id="login-remember" name="rememberMe" type="checkbox" className="hidden" checked={form.rememberMe} onChange={handleChange} />
                <span
                  className="w-4 h-4 rounded-[5px] flex items-center justify-center shrink-0 transition-all duration-200"
                  style={{
                    border: form.rememberMe ? 'none' : '1.5px solid rgba(255,255,255,0.2)',
                    background: form.rememberMe ? 'linear-gradient(135deg, hsl(213,90%,55%), hsl(190,90%,50%))' : 'rgba(255,255,255,0.04)',
                    boxShadow: form.rememberMe ? '0 0 8px rgba(99,179,237,0.5)' : 'none',
                  }}
                >
                  {form.rememberMe && (
                    <svg viewBox="0 0 10 7" width="10" height="7" fill="none" stroke="white" strokeWidth="1.8">
                      <polyline points="1 3.5 3.5 6 9 1" />
                    </svg>
                  )}
                </span>
                <span className="text-[13px] text-white/50">Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="text-[13px] text-sky-400/80 hover:text-sky-300 hover:underline transition-colors duration-200">
                Quên mật khẩu?
              </a>
            </div>

            {/* Login Button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 w-full py-3.5 mt-1 rounded-xl text-[15px] font-semibold text-white tracking-wide border-none cursor-pointer transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, hsl(213,90%,52%), hsl(190,90%,42%))', boxShadow: '0 4px 24px rgba(56,142,229,0.35)' }}
              onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(56,142,229,0.5)' } }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(56,142,229,0.35)' }}
            >
              {isLoading ? (
                <>
                  <span className="w-[18px] h-[18px] rounded-full border-[2.5px] border-white/30 border-t-white shrink-0" style={{ animation: 'spin .7s linear infinite' }} />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  Đăng nhập
                </>
              )}
            </button>

            {/* ── Register Section ── */}
            <div className="flex items-center gap-3 mt-1">
              <div className="flex-1 h-px bg-white/[0.07]" />
              <span className="text-[12px] text-white/25 whitespace-nowrap">Chưa có tài khoản?</span>
              <div className="flex-1 h-px bg-white/[0.07]" />
            </div>

            <button
              id="go-to-register-btn"
              type="button"
              onClick={() => navigate('/register')}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-[15px] font-semibold tracking-wide border cursor-pointer transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(99,179,237,0.08)'
                e.currentTarget.style.borderColor = 'rgba(99,179,237,0.4)'
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,179,237,0.15)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                e.currentTarget.style.color = 'rgba(255,255,255,0.75)'
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              Tạo tài khoản mới
            </button>
          </form>

          {/* Footer stats */}
          <div className="mt-6 pt-5 border-t border-white/[0.07]">
            <div className="flex items-center justify-center gap-5">
              {[{ val: '500+', label: 'Bãi đỗ xe' }, { val: '10K+', label: 'Người dùng' }, { val: '99.9%', label: 'Uptime' }].map((stat, i, arr) => (
                <>
                  <div key={stat.val} className="flex flex-col items-center gap-0.5">
                    <span className="text-base font-bold tracking-tight" style={{ background: 'linear-gradient(135deg, #fff, hsl(213,90%,80%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                      {stat.val}
                    </span>
                    <span className="text-[11px] text-white/30 tracking-wide">{stat.label}</span>
                  </div>
                  {i < arr.length - 1 && <div key={`div-${i}`} className="w-px h-7 bg-white/[0.08]" />}
                </>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        @keyframes orbFloat { 0% { transform:translate(0,0) scale(1); } 100% { transform:translate(30px,40px) scale(1.1); } }
        @keyframes carFloat { 0% { transform:translateY(0); opacity:0; } 5% { opacity:1; } 95% { opacity:.6; } 100% { transform:translateY(calc(-100svh - 80px)); opacity:0; } }
        @keyframes cardIn { from { opacity:0; transform:translateY(32px) scale(.96); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes logoGlow { 0% { box-shadow:0 0 20px rgba(99,179,237,.3),0 8px 24px rgba(0,0,0,.4); } 100% { box-shadow:0 0 50px rgba(99,179,237,.6),0 8px 24px rgba(0,0,0,.4); } }
        @keyframes shakeIn { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
    </div>
  )
}

export default LoginPage
