'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Building,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  BadgeAlert,
} from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const { adminLogin, isLoading } = useAuth()

  // Form State
  const [adminId, setAdminId] = useState('')
  const [password, setPassword] = useState('')
  const [pin, setPin] = useState('')
  const [center, setCenter] = useState('Dharampur Procurement Centre')
  const [showPassword, setShowPassword] = useState(false)

  // Feedback State
  const [errors, setErrors] = useState<{
    adminId?: string
    password?: string
    pin?: string
    general?: string
  }>({})
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const fillDemoAdmin = () => {
    setAdminId('KQ-ADM-01')
    setPassword('admin123')
    setPin('4040')
    setCenter('Dharampur Procurement Centre')
    setErrors({})
    showToast('Admin demo credentials loaded (ID: KQ-ADM-01, PIN: 4040)')
  }

  const validate = () => {
    const errs: typeof errors = {}

    if (!adminId.trim()) {
      errs.adminId = 'Official Admin ID or Email is required'
    }

    if (!password) {
      errs.password = 'Password is required'
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters'
    }

    if (!pin.trim()) {
      errs.pin = '4-digit security PIN is required'
    } else if (pin.replace(/\D/g, '').length !== 4) {
      errs.pin = 'Security PIN must be exactly 4 digits'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const res = await adminLogin(adminId, password, pin, center)
    if (res.success) {
      showToast('Official credentials verified. Launching Admin Console...')
      setTimeout(() => {
        router.push('/admin')
      }, 700)
    } else {
      setErrors((prev) => ({
        ...prev,
        general: res.error || 'Authorization failed. Please check your credentials.',
      }))
    }
  }

  return (
    <div className="admin-auth-root">
      {/* Admin Header */}
      <header className="admin-auth-header">
        <Link href="/" className="admin-brand-wrap">
          <div className="brand-mark" style={{ background: '#ffffff' }}>
            <img src="/kisanq-icon.png" alt="KisanQ" className="brand-mark-img" width={40} height={40} />
          </div>
          <div>
            <strong style={{ fontFamily: 'Georgia, serif', fontSize: '18px' }}>KisanQ</strong>
            <small style={{ display: 'block', color: '#8bb296', fontSize: '10px' }}>
              Mandi Operations & Admin Console
            </small>
          </div>
        </Link>
        <Link
          href="/"
          className="admin-portal-link"
          style={{ background: 'rgba(255,255,255,0.08)', color: '#d9e7da', border: '1px solid rgba(139,178,150,0.2)' }}
        >
          ← Return to Farmer Portal
        </Link>
      </header>

      {/* Main Content */}
      <main className="auth-main">
        <div
          className="auth-ambient-glow"
          style={{
            width: '450px',
            height: '450px',
            background: 'rgba(45, 103, 78, 0.25)',
            top: '5%',
            left: '10%',
          }}
        ></div>

        <div className="admin-auth-card">
          <div className="admin-badge">
            <ShieldCheck size={14} />
            AUTHORISED PERSONNEL ONLY
          </div>

          <h1 className="admin-title">Command Centre Login</h1>
          <p className="admin-subtitle">
            Sign in with your government operator credentials to manage live mandi queues, digital weighing, and MSP payouts.
          </p>

          {/* Quick Demo Admin Button */}
          <div
            className="demo-quick-bar"
            style={{
              background: 'rgba(232, 181, 76, 0.12)',
              borderColor: 'rgba(232, 181, 76, 0.3)',
              color: '#fae3a5',
            }}
          >
            <span style={{ color: '#fae3a5', fontSize: '12px' }}>
              🛡️ <strong>Test Staff Access:</strong> Auto-fill sample Centre Manager credentials
            </span>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="demo-quick-btn"
              style={{ background: '#e8b54c', color: '#172c1e', borderColor: '#f2c76e' }}
            >
              Fill Admin Demo
            </button>
          </div>

          {errors.general && (
            <div
              className="auth-alert error"
              style={{
                background: 'rgba(185, 43, 39, 0.15)',
                borderColor: 'rgba(211, 56, 56, 0.4)',
                color: '#ffc1bd',
              }}
              role="alert"
            >
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Authentication Rejected</strong>
                <div>{errors.general}</div>
              </div>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Centre Selection */}
            <div className="form-field">
              <label className="form-label" style={{ color: '#d9e7da' }}>
                Assigned Procurement Centre
              </label>
              <div className="input-wrap">
                <span className="input-icon-left" style={{ color: '#8bb296' }}>
                  <Building size={17} />
                </span>
                <select
                  value={center}
                  onChange={(e) => setCenter(e.target.value)}
                  className="admin-select-input"
                >
                  <option value="Dharampur Procurement Centre">
                    Dharampur Procurement Centre (Mandi 01)
                  </option>
                  <option value="Mandi Yard — Sector 4">Mandi Yard — Sector 4 (Hub 02)</option>
                  <option value="Kisan Seva Kendra">Kisan Seva Kendra — Rural Point</option>
                </select>
              </div>
            </div>

            {/* Admin ID */}
            <div className="form-field">
              <label htmlFor="admin-id" className="form-label" style={{ color: '#d9e7da' }}>
                Officer ID or Email <span className="required">*</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon-left" style={{ color: '#8bb296' }}>
                  <ShieldCheck size={17} />
                </span>
                <input
                  id="admin-id"
                  type="text"
                  placeholder="KQ-ADM-01 or admin@kisanq.gov.in"
                  value={adminId}
                  onChange={(e) => {
                    setAdminId(e.target.value)
                    if (errors.adminId) setErrors((prev) => ({ ...prev, adminId: undefined }))
                  }}
                  className="admin-text-input"
                  style={errors.adminId ? { borderColor: '#d33838' } : undefined}
                  autoComplete="username"
                  required
                />
              </div>
              {errors.adminId && (
                <div className="field-error-msg" style={{ color: '#ff928f' }}>
                  <AlertCircle size={13} /> {errors.adminId}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="form-field">
              <label htmlFor="admin-password" className="form-label" style={{ color: '#d9e7da' }}>
                Official Password <span className="required">*</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon-left" style={{ color: '#8bb296' }}>
                  <Lock size={17} />
                </span>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter administrative password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                  }}
                  className="admin-text-input"
                  style={
                    errors.password
                      ? { borderColor: '#d33838', paddingRight: '48px' }
                      : { paddingRight: '48px' }
                  }
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="input-btn-right"
                  style={{ color: '#8bb296' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <div className="field-error-msg" style={{ color: '#ff928f' }}>
                  <AlertCircle size={13} /> {errors.password}
                </div>
              )}
            </div>

            {/* Security Passcode / 2FA PIN */}
            <div className="form-field">
              <label htmlFor="admin-pin" className="form-label" style={{ color: '#d9e7da' }}>
                4-Digit Centre Security PIN <span className="required">*</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon-left" style={{ color: '#8bb296' }}>
                  <KeyRound size={17} />
                </span>
                <input
                  id="admin-pin"
                  type="password"
                  maxLength={4}
                  placeholder="4040"
                  value={pin}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '')
                    setPin(val)
                    if (errors.pin) setErrors((prev) => ({ ...prev, pin: undefined }))
                  }}
                  className="admin-text-input"
                  style={
                    errors.pin
                      ? { borderColor: '#d33838', letterSpacing: '4px', fontSize: '18px' }
                      : { letterSpacing: '4px', fontSize: '18px' }
                  }
                  required
                />
              </div>
              {errors.pin && (
                <div className="field-error-msg" style={{ color: '#ff928f' }}>
                  <AlertCircle size={13} /> {errors.pin}
                </div>
              )}
            </div>

            {/* Security Note */}
            <div className="admin-security-note">
              <BadgeAlert size={18} style={{ color: '#f4ca64', flexShrink: 0 }} />
              <span>
                All administrative actions, token overrides, and weighing logs are cryptographically timestamped for audit compliance.
              </span>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isLoading} className="admin-submit-btn">
              {isLoading ? (
                <>
                  <span className="btn-spinner" style={{ borderTopColor: '#172c1e' }}></span>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Enter Admin Command Centre</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Footer Back Link */}
          <div
            className="auth-footer-links"
            style={{ borderTopColor: 'rgba(139, 178, 150, 0.2)' }}
          >
            <div>
              <Link href="/login" style={{ color: '#8bb296' }}>
                Not mandi staff? Return to Farmer Portal Login
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Toast notification */}
      {toastMessage && (
        <div
          className="toast"
          style={{
            background: '#0d241b',
            border: '1px solid #2d674e',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} style={{ color: '#52b77c' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
