'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth, UserRole } from '@/lib/auth-context'
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  Check,
  CheckCircle2,
  AlertCircle,
  Tractor,
  Building2,
  FileText,
  X,
} from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading } = useAuth()

  // Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<UserRole>('farmer')
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Visibility states
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Modal State
  const [showTermsModal, setShowTermsModal] = useState(false)

  // Validation State
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    phone?: string
    password?: string
    confirmPassword?: string
    terms?: string
    general?: string
  }>({})
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Password Strength Evaluation
  const hasMinLen = password.length >= 8
  const hasNumber = /\d/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasSpecial = /[^A-Za-z0-9]/.test(password)

  const strengthScore = [hasMinLen, hasNumber, hasUpper, hasSpecial].filter(Boolean).length

  let strengthLabel = 'Too short'
  let strengthClass = 'weak'
  if (password.length > 0) {
    if (strengthScore <= 1) {
      strengthLabel = 'Weak'
      strengthClass = 'weak'
    } else if (strengthScore === 2) {
      strengthLabel = 'Fair'
      strengthClass = 'fair'
    } else if (strengthScore === 3) {
      strengthLabel = 'Good'
      strengthClass = 'good'
    } else if (strengthScore === 4) {
      strengthLabel = 'Strong & Secure'
      strengthClass = 'strong'
    }
  }

  const validateForm = () => {
    const errs: typeof errors = {}

    if (!name.trim()) {
      errs.name = 'Full name is required'
    } else if (name.trim().length < 3) {
      errs.name = 'Name must be at least 3 characters'
    }

    if (!email.trim()) {
      errs.email = 'Email address is required'
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      errs.email = 'Enter a valid email address (e.g. kisan@gmail.com)'
    }

    const cleanPhone = phone.replace(/\D/g, '')
    if (!cleanPhone) {
      errs.phone = 'Mobile number is required'
    } else if (cleanPhone.length !== 10) {
      errs.phone = 'Mobile number must be exactly 10 digits'
    }

    if (!password) {
      errs.password = 'Password is required'
    } else if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters long'
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm your password'
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match'
    }

    if (!acceptTerms) {
      errs.terms = 'You must accept the terms & conditions'
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    const result = await register({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      role,
    })

    if (result.success) {
      showToast('Registration successful! Welcome to KisanQ.')
      setTimeout(() => {
        if (role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/')
        }
      }, 700)
    } else {
      setErrors((prev) => ({
        ...prev,
        general: result.error || 'Failed to create account. Please try again.',
      }))
    }
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
          <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Already registered?</span>
          <Link href="/login" className="auth-nav-link">
            Sign In →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="auth-main">
        <div className="auth-ambient-glow glow-1"></div>
        <div className="auth-ambient-glow glow-2"></div>

        <div className="auth-card wide-card">
          <div className="auth-badge-pill">
            <span className="pulse-dot"></span>
            NEW REGISTRATION
          </div>

          <h1 className="auth-title">Create your KisanQ Account</h1>
          <p className="auth-subtitle">
            Join thousands of farmers tracking fair MSP prices, booking mandi queues, and receiving prompt bank settlements.
          </p>

          {errors.general && (
            <div className="auth-alert error" role="alert">
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Registration Alert</strong>
                <div>{errors.general}</div>
              </div>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {/* Role Selection */}
            <div className="form-field">
              <label className="form-label">
                Select Account Type <span className="required">*</span>
              </label>
              <div className="role-grid">
                <button
                  type="button"
                  className={`role-card-btn ${role === 'farmer' ? 'selected' : ''}`}
                  onClick={() => setRole('farmer')}
                >
                  <div className="role-header">
                    <div className="role-icon">
                      <Tractor size={18} />
                    </div>
                    <div className="role-check">
                      <Check size={12} />
                    </div>
                  </div>
                  <strong>Farmer / Grower</strong>
                  <p>Book mandi tokens, monitor MSP rates, and receive fast payments.</p>
                </button>

                <button
                  type="button"
                  className={`role-card-btn ${role === 'admin' ? 'selected' : ''}`}
                  onClick={() => setRole('admin')}
                >
                  <div className="role-header">
                    <div className="role-icon">
                      <Building2 size={18} />
                    </div>
                    <div className="role-check">
                      <Check size={12} />
                    </div>
                  </div>
                  <strong>Mandi Staff (Demo UI)</strong>
                  <p>Operator console for queue management and procurement verification.</p>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="form-field">
              <label htmlFor="reg-name" className="form-label">
                Full Name <span className="required">*</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon-left">
                  <User size={17} />
                </span>
                <input
                  id="reg-name"
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                  }}
                  className={`auth-text-input ${errors.name ? 'input-error' : ''}`}
                  required
                />
              </div>
              {errors.name && (
                <div className="field-error-msg">
                  <AlertCircle size={13} /> {errors.name}
                </div>
              )}
            </div>

            {/* Email & Phone Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {/* Email */}
              <div className="form-field">
                <label htmlFor="reg-email" className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <div className="input-wrap">
                  <span className="input-icon-left">
                    <Mail size={17} />
                  </span>
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                    }}
                    className={`auth-text-input ${errors.email ? 'input-error' : ''}`}
                    required
                  />
                </div>
                {errors.email && (
                  <div className="field-error-msg">
                    <AlertCircle size={13} /> {errors.email}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="form-field">
                <label htmlFor="reg-phone" className="form-label">
                  Mobile Number <span className="required">*</span>
                </label>
                <div className="input-wrap">
                  <span
                    className="input-icon-left"
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--green)',
                      background: 'var(--green-light)',
                      padding: '2px 5px',
                      borderRadius: '4px',
                      left: '10px',
                    }}
                  >
                    +91
                  </span>
                  <input
                    id="reg-phone"
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '')
                      setPhone(val)
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }))
                    }}
                    className={`auth-text-input ${errors.phone ? 'input-error' : ''}`}
                    style={{ paddingLeft: '48px' }}
                    required
                  />
                </div>
                {errors.phone && (
                  <div className="field-error-msg">
                    <AlertCircle size={13} /> {errors.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="form-field">
              <label htmlFor="reg-password" className="form-label">
                Create Password <span className="required">*</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon-left">
                  <Lock size={17} />
                </span>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 characters with numbers & symbols"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                  }}
                  className={`auth-text-input has-right-btn ${errors.password ? 'input-error' : ''}`}
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

              {/* Password Strength Meter */}
              {password.length > 0 && (
                <div className="pwd-strength-container">
                  <div className="strength-bars">
                    <div
                      className={`strength-segment ${
                        strengthScore >= 1 ? `active-${strengthClass}` : ''
                      }`}
                    />
                    <div
                      className={`strength-segment ${
                        strengthScore >= 2 ? `active-${strengthClass}` : ''
                      }`}
                    />
                    <div
                      className={`strength-segment ${
                        strengthScore >= 3 ? `active-${strengthClass}` : ''
                      }`}
                    />
                    <div
                      className={`strength-segment ${
                        strengthScore >= 4 ? `active-${strengthClass}` : ''
                      }`}
                    />
                  </div>
                  <div className="strength-meta">
                    <span className="text-muted">Password Security</span>
                    <span className={`strength-label ${strengthClass}`}>{strengthLabel}</span>
                  </div>
                  <div className="strength-rules">
                    <div className={`strength-rule-item ${hasMinLen ? 'met' : ''}`}>
                      {hasMinLen ? '✓' : '○'} 8+ characters
                    </div>
                    <div className={`strength-rule-item ${hasNumber ? 'met' : ''}`}>
                      {hasNumber ? '✓' : '○'} At least 1 number
                    </div>
                    <div className={`strength-rule-item ${hasUpper ? 'met' : ''}`}>
                      {hasUpper ? '✓' : '○'} Uppercase letter
                    </div>
                    <div className={`strength-rule-item ${hasSpecial ? 'met' : ''}`}>
                      {hasSpecial ? '✓' : '○'} Special character
                    </div>
                  </div>
                </div>
              )}

              {errors.password && (
                <div className="field-error-msg">
                  <AlertCircle size={13} /> {errors.password}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-field">
              <label htmlFor="reg-confirm-password" className="form-label">
                Confirm Password <span className="required">*</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon-left">
                  <Lock size={17} />
                </span>
                <input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                  }}
                  className={`auth-text-input has-right-btn ${errors.confirmPassword ? 'input-error' : ''}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="input-btn-right"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPassword && password && confirmPassword === password && (
                <div style={{ fontSize: '11.5px', color: '#1e6945', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                  ✓ Passwords match
                </div>
              )}
              {errors.confirmPassword && (
                <div className="field-error-msg">
                  <AlertCircle size={13} /> {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="form-field">
              <label className="checkbox-label" style={{ alignItems: 'flex-start' }}>
                <input
                  type="checkbox"
                  className="auth-checkbox"
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked)
                    if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }))
                  }}
                  style={{ marginTop: '2px' }}
                />
                <span style={{ fontSize: '12.5px', lineHeight: 1.45 }}>
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    style={{
                      color: 'var(--green)',
                      fontWeight: 700,
                      textDecoration: 'underline',
                      padding: 0,
                    }}
                  >
                    KisanQ Procurement Terms of Service
                  </button>{' '}
                  and Privacy Guidelines.
                </span>
              </label>
              {errors.terms && (
                <div className="field-error-msg">
                  <AlertCircle size={13} /> {errors.terms}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={isLoading} className="auth-submit-btn">
              {isLoading ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="auth-footer-links">
            <div>
              Already have an account? <Link href="/login">Sign in here →</Link>
            </div>
          </div>
        </div>
      </main>

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="auth-modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="auth-modal" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <button
              className="auth-modal-close"
              onClick={() => setShowTermsModal(false)}
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--green-light)',
                  color: 'var(--green)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <FileText size={20} />
              </div>
              <h3 style={{ margin: 0, font: '600 20px Georgia, serif' }}>
                KisanQ Procurement Terms
              </h3>
            </div>

            <div
              style={{
                maxHeight: '260px',
                overflowY: 'auto',
                fontSize: '12.5px',
                color: '#49574d',
                lineHeight: 1.6,
                paddingRight: '6px',
                marginBottom: '20px',
                border: '1px solid #e2e8df',
                borderRadius: '8px',
                padding: '12px',
                background: '#fafcfa',
              }}
            >
              <p><strong>1. Digital Token Allocation:</strong> Each generated token represents a verified appointment window at designated APMC Mandis and Procurement Centres. Arriving within your window minimizes wait times.</p>
              <p><strong>2. Fair Weight & MSP Guarantee:</strong> All crop weights recorded at government electronic weighbridges conform to standardized MSP grade specifications.</p>
              <p><strong>3. Direct Benefit Settlement:</strong> Procurement disbursements are credited directly to the farmer’s verified Aadhaar-linked bank account within 24 to 48 hours of quality acceptance.</p>
              <p><strong>4. Privacy & Data Protection:</strong> Farm and financial records are protected under government digital confidentiality standards.</p>
            </div>

            <button
              type="button"
              className="auth-submit-btn"
              onClick={() => {
                setAcceptTerms(true)
                if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }))
                setShowTermsModal(false)
              }}
            >
              I Accept the Terms & Close
            </button>
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
