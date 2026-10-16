import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import parkingLogo from '../../../assets/parking-logo.jpg'

interface FloatingCar {
  id: number
  x: number
  delay: number
  duration: number
}

// Fields sent to POST /api/Account/register
interface RegisterForm {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

interface FieldErrors {
  fullName?: string
  email?: string
  password?: string
  confirmPassword?: string
  agreeTerms?: string
}

const passwordStrength = (pw: string): { score: number; label: string; color: string } => {
  if (!pw) return { score: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const map = [
    { score: 1, label: 'Yếu', color: '#f87171' },
    { score: 2, label: 'Trung bình', color: '#fb923c' },
    { score: 3, label: 'Khá mạnh', color: '#facc15' },
    { score: 4, label: 'Mạnh', color: '#34d399' },
  ]
  return map[score - 1] ?? { score: 0, label: '', color: '' }
}

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<RegisterForm>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)
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
    setFieldErrors(prev => ({ ...prev, [name]: undefined }))
    if (apiError) setApiError('')
  }

  const validate = (): boolean => {
    const errs: FieldErrors = {}
    if (!form.fullName.trim()) errs.fullName = 'Vui lòng nhập họ và tên.'
    if (!form.email.trim()) errs.email = 'Vui lòng nhập email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email không hợp lệ.'
    if (!form.password) errs.password = 'Vui lòng nhập mật khẩu.'
    else if (form.password.length < 6) errs.password = 'Mật khẩu phải có ít nhất 6 ký tự.'
    if (!form.confirmPassword) errs.confirmPassword = 'Vui lòng xác nhận mật khẩu.'
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Mật khẩu xác nhận không khớp.'
    if (!form.agreeTerms) errs.agreeTerms = 'Bạn phải đồng ý với điều khoản sử dụng.'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setApiError('')

    try {
      const res = await fetch('/api/Account/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          fullName: form.fullName.trim(),
        }),
      })

      if (res.ok) {
        setSuccess(true)
      } else {
        // Try to parse error message from the API response
        let message = 'Đăng ký thất bại. Vui lòng thử lại.'
        try {
          const data = await res.json()
          // Handle ASP.NET Core validation errors or custom messages
          if (typeof data === 'string') {
            message = data
          } else if (data?.message) {
            message = data.message
          } else if (data?.errors) {
            // ASP.NET Identity errors: { errors: [{ description: '...' }] }
            const descriptions = Object.values(data.errors).flat() as string[]
            if (descriptions.length > 0) message = descriptions[0]
          } else if (Array.isArray(data) && data[0]?.description) {
            message = data[0].description
          }
        } catch {
          // non-JSON body — use status text
          message = res.statusText || message
        }
        setApiError(message)
      }
    } catch {
      setApiError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.')
    } finally {
      setIsLoading(false)
    }
  }

  const pwStrength = passwordStrength(form.password)

  const inputBase =
    'w-full py-3 pl-11 pr-4 rounded-xl text-[14px] text-white placeholder-white/20 outline-none transition-all duration-200'
  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.background = 'rgba(99,179,237,0.07)'
    e.target.style.borderColor = 'rgba(99,179,237,0.5)'
    e.target.style.boxShadow = '0 0 0 3px rgba(99,179,237,0.12)'
  }
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.background = 'rgba(255,255,255,0.05)'
    e.target.style.borderColor = 'rgba(255,255,255,0.1)'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-[Inter,system-ui,sans-serif] py-8">
      {/* ── Background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 80% 10%, hsl(260,70%,12%) 0%, transparent 60%),' +
              'radial-gradient(ellipse 60% 50% at 20% 85%, hsl(213,80%,10%) 0%, transparent 55%),' +
              'linear-gradient(160deg, hsl(220,40%,6%) 0%, hsl(210,50%,8%) 50%, hsl(200,45%,7%) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(167,139,250,.04) 1px,transparent 1px),' +
              'linear-gradient(90deg,rgba(167,139,250,.04) 1px,transparent 1px)',
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse at center,black 40%,transparent 80%)',
          }}
        />
        {[
          { w: 500, h: 500, top: -120, right: -80, color: 'hsla(260,80%,60%,0.13)', dur: '14s', delay: '0s' },
          { w: 400, h: 400, bottom: -80, left: -60, color: 'hsla(213,90%,55%,0.10)', dur: '10s', delay: '-5s' },
          { w: 280, h: 280, top: '40%', left: '50%', color: 'hsla(190,90%,50%,0.08)', dur: '16s', delay: '-9s' },
        ].map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: orb.w, height: orb.h, top: orb.top, right: (orb as any).right,
              bottom: (orb as any).bottom, left: orb.left,
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
              <rect x="5" y="10" width="50" height="14" rx="4" fill="rgba(167,139,250,0.15)" />
              <rect x="12" y="4" width="28" height="12" rx="3" fill="rgba(167,139,250,0.12)" />
              <circle cx="14" cy="24" r="4" fill="rgba(167,139,250,0.2)" />
              <circle cx="44" cy="24" r="4" fill="rgba(167,139,250,0.2)" />
            </svg>
          </div>
        ))}
      </div>

      {/* ── Card ── */}
      <div className="relative z-10 w-full max-w-[480px] px-4 py-5">
        <div
          className="rounded-3xl border border-white/10 px-10 pt-10 pb-8"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 0 0 1px rgba(167,139,250,0.08) inset, 0 32px 80px rgba(0,0,0,0.5)',
            animation: 'cardIn .6s cubic-bezier(.34,1.56,.64,1) both',
          }}
        >
          {/* Back */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 mb-6 text-[13px] text-white/40 hover:text-white/80 transition-colors duration-200 cursor-pointer border-none bg-transparent p-0"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Quay lại đăng nhập
          </button>

          {/* Logo */}
          <div className="flex flex-col items-center gap-4 mb-7">
            <div
              className="w-[72px] h-[72px] rounded-2xl p-[3px]"
              style={{
                background: 'linear-gradient(135deg, hsl(260,80%,60%), hsl(213,90%,55%))',
                boxShadow: '0 0 30px rgba(167,139,250,0.4), 0 8px 24px rgba(0,0,0,0.4)',
                animation: 'logoGlowPurple 3s ease-in-out infinite alternate',
              }}
            >
              <img src={parkingLogo} alt="ParkingSystem Logo" className="w-full h-full rounded-[18px] object-cover block" />
            </div>
            <div className="text-center">
              <h1
                className="text-[24px] font-extrabold tracking-tight m-0 mb-1"
                style={{
                  background: 'linear-gradient(135deg, #fff 20%, hsl(260,80%,80%))',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}
              >
                Tạo tài khoản
              </h1>
              <p className="text-[13px] text-white/40 m-0">
                Tham gia <span className="text-violet-400/80 font-medium">ParkingSystem</span> ngay hôm nay
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.08), transparent)' }} />
            <span className="text-[11px] text-white/25 uppercase tracking-widest whitespace-nowrap">Thông tin đăng ký</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.08), transparent)' }} />
          </div>

          {/* ── Success ── */}
          {success ? (
            <div className="flex flex-col items-center gap-5 py-6 text-center" style={{ animation: 'cardIn .5s cubic-bezier(.34,1.56,.64,1) both' }}>
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, hsl(152,80%,40%), hsl(213,90%,55%))', boxShadow: '0 0 40px rgba(52,211,153,0.4)' }}
              >
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="white" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <p className="text-[20px] font-bold text-white mb-2">Đăng ký thành công!</p>
                <p className="text-[14px] text-white/50 leading-relaxed">
                  Tài khoản <span className="text-violet-300 font-medium">{form.email}</span> đã được tạo.<br />
                  Bạn có thể đăng nhập ngay bây giờ.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-8 py-3 rounded-xl text-[15px] font-semibold text-white border-none cursor-pointer transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, hsl(213,90%,52%), hsl(190,90%,42%))', boxShadow: '0 4px 24px rgba(56,142,229,0.35)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(56,142,229,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(56,142,229,0.35)' }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Đăng nhập ngay
              </button>
            </div>
          ) : (
            /* ── Form ── */
            <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>

              {/* API error banner */}
              {apiError && (
                <div
                  className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl border border-red-400/30 bg-red-500/10 text-red-300 text-[13.5px] leading-snug"
                  role="alert"
                  style={{ animation: 'shakeIn .4s cubic-bezier(.36,.07,.19,.97)' }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-px">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {apiError}
                </div>
              )}

              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-fullName" className="text-[13px] font-medium text-white/60">
                  Họ và tên <span className="text-violet-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-white/30 flex items-center pointer-events-none">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    id="reg-fullName" name="fullName" type="text"
                    placeholder="Nguyễn Văn A" value={form.fullName}
                    onChange={handleChange} autoComplete="name" autoFocus
                    className={inputBase} style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                  />
                </div>
                {fieldErrors.fullName && <p className="text-[12px] text-red-400 mt-0.5">{fieldErrors.fullName}</p>}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-email" className="text-[13px] font-medium text-white/60">
                  Email <span className="text-violet-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-white/30 flex items-center pointer-events-none">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <input
                    id="reg-email" name="email" type="email"
                    placeholder="you@email.com" value={form.email}
                    onChange={handleChange} autoComplete="email"
                    className={inputBase} style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                  />
                </div>
                {fieldErrors.email && <p className="text-[12px] text-red-400 mt-0.5">{fieldErrors.email}</p>}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-password" className="text-[13px] font-medium text-white/60">
                  Mật khẩu <span className="text-violet-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-white/30 flex items-center pointer-events-none">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="reg-password" name="password" type={showPassword ? 'text' : 'password'}
                    placeholder="Tối thiểu 6 ký tự..." value={form.password}
                    onChange={handleChange} autoComplete="new-password"
                    className={`${inputBase} pr-11`} style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 p-1 rounded-md text-white/30 hover:text-white/70 transition-all duration-200 cursor-pointer border-none bg-transparent">
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {/* Strength bar */}
                {form.password && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className="flex-1 h-1 rounded-full transition-all duration-300"
                          style={{
                            background: i <= pwStrength.score ? pwStrength.color : 'rgba(255,255,255,0.1)',
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] shrink-0 font-medium" style={{ color: pwStrength.color }}>
                      {pwStrength.label}
                    </span>
                  </div>
                )}
                {fieldErrors.password && <p className="text-[12px] text-red-400 mt-0.5">{fieldErrors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reg-confirm" className="text-[13px] font-medium text-white/60">
                  Xác nhận mật khẩu <span className="text-violet-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-white/30 flex items-center pointer-events-none">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </span>
                  <input
                    id="reg-confirm" name="confirmPassword" type={showConfirm ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu..." value={form.confirmPassword}
                    onChange={handleChange} autoComplete="new-password"
                    className={`${inputBase} pr-11`} style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3.5 p-1 rounded-md text-white/30 hover:text-white/70 transition-all duration-200 cursor-pointer border-none bg-transparent">
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>
                {/* Match indicator */}
                {form.confirmPassword && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {form.password === form.confirmPassword ? (
                      <>
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#34d399" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                        <span className="text-[11px] text-emerald-400">Mật khẩu khớp</span>
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#f87171" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        <span className="text-[11px] text-red-400">Mật khẩu không khớp</span>
                      </>
                    )}
                  </div>
                )}
                {fieldErrors.confirmPassword && <p className="text-[12px] text-red-400 mt-0.5">{fieldErrors.confirmPassword}</p>}
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer select-none" htmlFor="reg-terms">
                  <input id="reg-terms" name="agreeTerms" type="checkbox" className="hidden" checked={form.agreeTerms} onChange={handleChange} />
                  <span
                    className="w-4 h-4 mt-0.5 rounded-[5px] flex items-center justify-center shrink-0 transition-all duration-200"
                    style={{
                      border: form.agreeTerms ? 'none' : '1.5px solid rgba(255,255,255,0.2)',
                      background: form.agreeTerms ? 'linear-gradient(135deg, hsl(260,80%,60%), hsl(213,90%,55%))' : 'rgba(255,255,255,0.04)',
                      boxShadow: form.agreeTerms ? '0 0 8px rgba(167,139,250,0.5)' : 'none',
                    }}
                  >
                    {form.agreeTerms && (
                      <svg viewBox="0 0 10 7" width="10" height="7" fill="none" stroke="white" strokeWidth="1.8">
                        <polyline points="1 3.5 3.5 6 9 1" />
                      </svg>
                    )}
                  </span>
                  <span className="text-[13px] text-white/50 leading-snug">
                    Tôi đồng ý với{' '}
                    <a href="#" className="text-violet-400/80 hover:text-violet-300 hover:underline transition-colors">Điều khoản sử dụng</a>
                    {' '}và{' '}
                    <a href="#" className="text-violet-400/80 hover:text-violet-300 hover:underline transition-colors">Chính sách bảo mật</a>.
                  </span>
                </label>
                {fieldErrors.agreeTerms && <p className="text-[12px] text-red-400 mt-1.5">{fieldErrors.agreeTerms}</p>}
              </div>

              {/* Submit */}
              <button
                id="register-submit-btn" type="submit" disabled={isLoading}
                className="flex items-center justify-center gap-2 w-full py-3.5 mt-1 rounded-xl text-[15px] font-semibold text-white tracking-wide border-none cursor-pointer transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, hsl(260,80%,58%), hsl(213,90%,50%))', boxShadow: '0 4px 24px rgba(167,139,250,0.3)' }}
                onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(167,139,250,0.45)' } }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(167,139,250,0.3)' }}
              >
                {isLoading ? (
                  <>
                    <span className="w-[18px] h-[18px] rounded-full border-[2.5px] border-white/30 border-t-white shrink-0" style={{ animation: 'spin .7s linear infinite' }} />
                    Đang tạo tài khoản...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                      <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                    Tạo tài khoản
                  </>
                )}
              </button>

              <p className="text-center text-[13px] text-white/35 mt-1">
                Đã có tài khoản?{' '}
                <button type="button" onClick={() => navigate('/')}
                  className="text-sky-400/80 hover:text-sky-300 hover:underline transition-colors cursor-pointer border-none bg-transparent p-0 font-medium">
                  Đăng nhập
                </button>
              </p>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        @keyframes orbFloat { 0% { transform:translate(0,0) scale(1); } 100% { transform:translate(30px,40px) scale(1.1); } }
        @keyframes carFloat { 0% { transform:translateY(0); opacity:0; } 5% { opacity:1; } 95% { opacity:.6; } 100% { transform:translateY(calc(-100svh - 80px)); opacity:0; } }
        @keyframes cardIn { from { opacity:0; transform:translateY(32px) scale(.96); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes logoGlowPurple { 0% { box-shadow:0 0 20px rgba(167,139,250,.3),0 8px 24px rgba(0,0,0,.4); } 100% { box-shadow:0 0 50px rgba(167,139,250,.6),0 8px 24px rgba(0,0,0,.4); } }
        @keyframes shakeIn { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
    </div>
  )
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export default RegisterPage
