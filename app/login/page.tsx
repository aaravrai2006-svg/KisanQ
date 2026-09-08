'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { Eye, EyeOff, Mail, Phone, Lock, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, X } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()

  // Form State
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  // Validation & Feedback State
  const [errors, setErrors] = useState<{ identifier?: string; password?: string; general?: string }>({})
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotInput, setForgotInput] = useState('')
  const [forgotSubmitted, setForgotSubmitted] = useState(false)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Live input change handler
  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentifier(e.target.value)
    if (errors.identifier || errors.general) {
      setErrors((prev) => ({ ...prev, identifier: undefined, general: undefined }))
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (errors.password || errors.general) {
      setErrors((prev) => ({ ...prev, password: undefined, general: undefined }))
    }
  }

  const validateForm = () => {
    const newErrors: { identifier?: string; password?: string } = {}
    const trimmedId = identifier.trim()

    if (!trimmedId) {
      newErrors.identifier = 'Please enter your email or 10-digit mobile number'
    } else if (trimmedId.includes('@')) {
      // Basic email check
      if (!/^\S+@\S+\.\S+$/.test(trimmedId)) {
        newErrors.identifier = 'Please enter a valid email address (e.g. name@domain.com)'
      }
    } else {
      // Phone check
      const digitsOnly = trimmedId.replace(/\D/g, '')
      if (digitsOnly.length < 10) {
        newErrors.identifier = 'Please enter a valid 10-digit mobile number'
      }
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const result = await login(identifier, password, rememberMe)
    if (result.success) {
      showToast('Login successful! Redirecting to farmer dashboard...')
      setTimeout(() => {
        router.push('/')
      }, 700)
    } else {
      setErrors((prev) => ({
        ...prev,
        general: result.error || 'Invalid credentials. Please try again.',
      }))
    }
  }

  const fillDemoFarmer = () => {
    setIdentifier('ramesh@kisanq.gov.in')
    setPassword('kisan123')
    setErrors({})
    showToast('Demo Farmer credentials loaded')
  }

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotInput.trim()) return
    setForgotSubmitted(true)
  }

  return (
    <div className="auth-root">
      {/* Header */}
      <header className="auth-header">
        <Link href="/" className="brand">
          <div className="brand-mark">
            <img src="/kisanq-icon.png" alt="KisanQ" className="brand-mark-img" width={40} height={40} />
          </div>
          <div>
            <strong>KisanQ</strong>
            <small>Procurement made simple</small>
          </div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/admin/login" className="admin-portal-link">
            <span>🛡️</span> Mandi Staff Login
          </Link>
          <Link href="/" className="auth-nav-link">
            Back to Portal
          </Link>
        </div>
      </header>

      {/* Main Form Area */}
      <main className="auth-main">
        <div className="auth-ambient-glow glow-1"></div>
        <div className="auth-ambient-glow glow-2"></div>

        <div className="auth-card">
          <div className="auth-badge-pill">
            <span className="pulse-dot"></span>
            FARMER ACCESS PORTAL
          </div>

          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">
            Sign in to access your queue tokens, track MSP payments, and check live mandi arrivals.
          </p>

          {/* Quick Demo Credentials Bar */}
          <div className="demo-quick-bar">
            <span>
              💡 <strong>Quick Test:</strong> Use pre-filled demo farmer account
            </span>
            <button type="button" onClick={fillDemoFarmer} className="demo-quick-btn">
              Fill Demo
            </button>
          </div>

          {/* General Error Alert */}
          {errors.general && (
            <div className="auth-alert error" role="alert">
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Authentication Error</strong>
                <div>{errors.general}</div>
              </div>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Identifier Field (Email or Phone) */}
            <div className="form-field">
              <label htmlFor="login-identifier" className="form-label">
                Email or Mobile Number <span className="required">*</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon-left">
                  {identifier.includes('@') ? <Mail size={17} /> : <Phone size={17} />}
                </span>
                <input
                  id="login-identifier"
                  type="text"
                  placeholder="ramesh@kisanq.gov.in or 9876543210"
                  value={identifier}
                  onChange={handleIdentifierChange}
                  className={`auth-text-input ${errors.identifier ? 'input-error' : ''}`}
                  autoComplete="username"
                  required
                />
              </div>
              {errors.identifier && (
                <div className="field-error-msg">
                  <AlertCircle size={13} /> {errors.identifier}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="form-field">
              <div className="form-label">
                <span>
                  Password <span className="required">*</span>
                </span>
                <button
                  type="button"
                  className="forgot-pwd-link"
                  onClick={() => {
                    setShowForgotModal(true)
                    setForgotSubmitted(false)
                    setForgotInput(identifier || '')
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="input-wrap">
                <span className="input-icon-left">
                  <Lock size={17} />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your secret password"
                  value={password}
                  onChange={handlePasswordChange}
                  className={`auth-text-input has-right-btn ${errors.password ? 'input-error' : ''}`}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="input-btn-right"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <div className="field-error-msg">
                  <AlertCircle size={13} /> {errors.password}
                </div>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="form-row-space">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="auth-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me on this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isLoading} className="auth-submit-btn">
              {isLoading ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to KisanQ</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="auth-footer-links">
            <div>
              New to KisanQ? <Link href="/register">Register your farm account →</Link>
            </div>
            <div style={{ marginTop: '4px' }}>
              <Link href="/admin/login" className="admin-portal-link">
                Mandi Official / Centre Staff Login <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="auth-modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="auth-modal-close"
              onClick={() => setShowForgotModal(false)}
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            {!forgotSubmitted ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'var(--green-light)',
                      color: 'var(--green)',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, font: '600 20px Georgia, serif', color: 'var(--ink)' }}>
                      Reset Password
                    </h3>
                    <small style={{ color: 'var(--muted)', fontSize: '11.5px' }}>
                      Mock recovery verification
                    </small>
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                  Enter your registered Kisan email or phone number. We will send a mock 6-digit recovery OTP.
                </p>

                <form onSubmit={handleForgotSubmit}>
                  <div className="form-field" style={{ marginBottom: '18px' }}>
                    <label className="form-label">Email or Mobile Number</label>
                    <div className="input-wrap">
                      <span className="input-icon-left">
                        <Mail size={16} />
                      </span>
                      <input
                        type="text"
                        className="auth-text-input"
                        placeholder="e.g. ramesh@kisanq.gov.in"
                        value={forgotInput}
                        onChange={(e) => setForgotInput(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <button type="submit" className="auth-submit-btn">
                    Send Verification OTP →
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: '#e7f5eb',
                    color: '#248352',
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ margin: '0 0 8px', font: '600 22px Georgia, serif' }}>
                  Recovery Code Sent!
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '20px' }}>
                  A verification code has been simulated for <strong>{forgotInput}</strong>. You may now
                  use the demo password <code>kisan123</code> to sign in.
                </p>
                <button
                  type="button"
                  className="auth-submit-btn"
                  onClick={() => setShowForgotModal(false)}
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toastMessage && (
        <div className="toast" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} style={{ color: '#52b77c' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}
