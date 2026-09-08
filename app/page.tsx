'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/language-context'
import {
  Home as HomeIcon,
  type LucideIcon,
  MapPin,
  Ticket,
  Clock3,
  Bell,
  HelpCircle,
  LayoutDashboard,
  ListOrdered,
  Building2,
  Wallet,
  FileBarChart,
  LogOut,
  ChevronRight,
  ArrowRight,
  User,
  Menu,
  IndianRupee,
  Search,
  BellRing,
  Languages,
  MoreHorizontal,
  ShieldCheck,
  Phone,
  Check,
  Truck,
  Scale,
  FileText,
  BadgeCheck,
  Printer,
  Download,
  X,
  TrendingUp,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react'
import {
  MOCK_QUEUE_ITEMS,
  MOCK_CENTRES,
  MOCK_PAYMENTS,
  MOCK_REPORTS,
  type QueueItem,
  type CentreItem,
  type PaymentItem,
} from '@/lib/mock-data'

type View = 'home' | 'centers' | 'queue' | 'status' | 'notifications' | 'help'
type Role = 'farmer' | 'admin'

type Center = { name: string; distance: string; wait: string; status: string; crop: string; accent: string }

const centersData: Record<'en' | 'hi', Center[]> = {
  en: [
    { name: 'Dharampur Procurement Centre', distance: '2.4 km away', wait: '18 min wait', status: 'Open now', crop: 'Wheat, Rice, Maize', accent: 'saffron' },
    { name: 'Mandi Yard — Sector 4', distance: '5.8 km away', wait: '42 min wait', status: 'Open now', crop: 'Wheat, Mustard', accent: 'blue' },
    { name: 'Kisan Seva Kendra', distance: '8.1 km away', wait: 'Low crowd', status: 'Opens at 9:00 AM', crop: 'Paddy, Pulses', accent: 'green' },
  ],
  hi: [
    { name: 'धरमपुर मुख्य खरीद केंद्र', distance: '2.4 किमी दूर', wait: '18 मिनट प्रतीक्षा', status: 'अभी खुला है', crop: 'गेहूं, धान, मक्का', accent: 'saffron' },
    { name: 'मंडी यार्ड — सेक्टर 4', distance: '5.8 किमी दूर', wait: '42 मिनट प्रतीक्षा', status: 'अभी खुला है', crop: 'गेहूं, सरसों', accent: 'blue' },
    { name: 'किसान सेवा केंद्र डिपो', distance: '8.1 किमी दूर', wait: 'कम भीड़', status: 'सुबह 9:00 बजे खुलेगा', crop: 'धान, दालें', accent: 'green' },
  ],
}

const navIcon: Record<View, LucideIcon> = {
  home: HomeIcon,
  centers: MapPin,
  queue: Ticket,
  status: Clock3,
  notifications: Bell,
  help: HelpCircle,
}

export default function Page() {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const { language, toggleLanguage, t } = useLanguage()

  const [role, setRole] = useState<Role>('farmer')
  const [view, setView] = useState<View>('home')
  const [token, setToken] = useState('A-042')
  const [toast, setToast] = useState('')
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [showSlipModal, setShowSlipModal] = useState(false)

  const notify = (message: string) => {
    setToast(message)
    if (typeof window !== 'undefined') {
      window.setTimeout(() => setToast(''), 3000)
    }
  }

  const generateToken = () => {
    const next = `A-${String(Math.floor(Math.random() * 50) + 43).padStart(3, '0')}`
    setToken(next)
    setView('queue')
    notify(`${t('home.token_generated', 'Token generated successfully')}: ${next}`)
  }

  if (role === 'admin') {
    return <AdminDashboard onBack={() => setRole('farmer')} notify={notify} toast={toast} />
  }

  const displayName = user ? user.name : (language === 'hi' ? 'रमेश कुमार' : 'Ramesh Kumar')
  const displayId = user?.farmerId
    ? `${language === 'hi' ? 'किसान आईडी' : 'Farmer ID'} · ${user.farmerId}`
    : user
    ? user.email
    : `${language === 'hi' ? 'किसान आईडी' : 'Farmer ID'} · KS-2491`
  const displayAvatar = user ? user.avatar : 'RM'

  const navItems: { id: View; label: string }[] = [
    { id: 'home', label: t('nav.overview', 'Overview') },
    { id: 'centers', label: t('nav.centers', 'Find a centre') },
    { id: 'queue', label: t('nav.queue', 'My queue token') },
    { id: 'status', label: t('nav.status', 'Procurement status') },
    { id: 'notifications', label: t('nav.notifications', 'Notifications') },
    { id: 'help', label: t('nav.help', 'Help & support') },
  ]

  const currentCenters = centersData[language] || centersData.en

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <img src="/kisanq-icon.png" alt="KisanQ" className="brand-mark-img" width={40} height={40} />
          </div>
          <div>
            <strong>KisanQ</strong>
            <small>{t('brand.tagline', 'Procurement made simple')}</small>
          </div>
        </div>

        {/* Profile Card & Account Switcher */}
        <div className="profile" style={{ position: 'relative' }}>
          <div className="avatar">{displayAvatar}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <strong style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {displayName}
            </strong>
            <small>{displayId}</small>
          </div>
          <button
            aria-label="Profile menu"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            style={{ padding: '4px', cursor: 'pointer' }}
          >
            <MoreHorizontal size={17} />
          </button>

          {profileMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                right: '0',
                marginTop: '6px',
                background: '#ffffff',
                border: '1px solid #dce4da',
                borderRadius: '12px',
                boxShadow: '0 12px 28px rgba(24, 53, 43, 0.14)',
                padding: '8px',
                zIndex: 30,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div style={{ padding: '6px 8px', borderBottom: '1px solid #edf1eb', fontSize: '11px', color: '#6f7d73' }}>
                {t('topbar.signed_in_as', 'Signed in as')}{' '}
                <strong style={{ color: '#18352b', display: 'block' }}>{displayName}</strong>
              </div>
              <Link
                href="/login"
                onClick={() => setProfileMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '7px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#1d6047',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                {t('topbar.sign_in_switch', 'Sign In / Switch Account')}
              </Link>
              <Link
                href="/register"
                onClick={() => setProfileMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '7px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#18352b',
                  textDecoration: 'none',
                }}
              >
                {t('topbar.register_new', '+ Register New Farmer')}
              </Link>
              <button
                type="button"
                onClick={() => {
                  setProfileMenuOpen(false)
                  setRole('admin')
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#18352b',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <ShieldCheck size={15} /> {t('nav.admin_login', 'Admin console login')}
              </button>
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setProfileMenuOpen(false)
                    notify(t('topbar.signed_out', 'Signed out successfully'))
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '7px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#c53030',
                    fontWeight: 600,
                    borderTop: '1px solid #edf1eb',
                    marginTop: '2px',
                  }}
                >
                  {t('topbar.logout', 'Log Out')}
                </button>
              )}
            </div>
          )}
        </div>

        <nav>
          {navItems.map((item) => {
            const Icon = navIcon[item.id]
            return (
              <button
                key={item.id}
                className={view === item.id ? 'active' : ''}
                onClick={() => setView(item.id)}
              >
                <Icon size={19} strokeWidth={2} />
                {item.label}
                {item.id === 'notifications' && <b className="notification-dot">3</b>}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <button
            onClick={() => {
              toggleLanguage()
              notify(language === 'en' ? 'हिंदी भाषा चुनी गई (Hindi selected)' : 'Switched to English')
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '11px 12px',
              borderRadius: '9px',
              background: language === 'hi' ? '#eef7f1' : 'transparent',
              border: language === 'hi' ? '1px solid #bce2cb' : '1px solid transparent',
              color: language === 'hi' ? '#125e36' : '#65776d',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'left',
            }}
          >
            <Languages size={19} />
            {language === 'en' ? 'हिंदी में बदलें (Hindi)' : 'Switch to English'}
          </button>
          <Link
            href="/admin/login"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '13px',
              padding: '12px 12px',
              borderRadius: '9px',
              textAlign: 'left',
              color: '#718077',
              fontSize: '13px',
              textDecoration: 'none',
            }}
          >
            <ShieldCheck size={19} />
            {t('nav.admin_login', 'Admin login')}
          </Link>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="mobile-menu" aria-label="Open menu">
            <Menu size={22} />
          </button>
          <div className="crumb">
            KisanQ <span>/</span> {navItems.find((n) => n.id === view)?.label}
          </div>
          <div className="top-actions">
            <Link
              href="/login"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--green)',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(22,105,63,0.2)',
                background: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
              }}
            >
              {t('topbar.sign_in', 'Sign In')}
            </Link>
            <Link
              href="/register"
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#213a29',
                padding: '6px 12px',
                borderRadius: '6px',
                background: '#e8b54c',
                textDecoration: 'none',
              }}
            >
              {t('topbar.register', 'Register')}
            </Link>

            {/* Language Switch Button in Header */}
            <button
              onClick={() => {
                toggleLanguage()
                notify(language === 'en' ? 'हिंदी भाषा चुनी गई (Hindi selected)' : 'Switched to English')
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1.5px solid #16693f',
                background: language === 'hi' ? '#16693f' : '#ffffff',
                color: language === 'hi' ? '#ffffff' : '#16693f',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: '0 2px 5px rgba(22,105,63,0.12)',
              }}
              title={language === 'en' ? 'हिंदी में अनुवाद करें' : 'Translate to English'}
            >
              <Languages size={15} />
              {language === 'en' ? 'हिंदी' : 'English'}
            </button>

            <button className="bell" onClick={() => setView('notifications')} aria-label="Notifications">
              <BellRing size={19} />
              <b>3</b>
            </button>
            <div
              className="mini-avatar"
              style={{ cursor: 'pointer' }}
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              {displayAvatar}
            </div>
          </div>
        </header>

        <div className="content">
          {view === 'home' && (
            <Home
              onGenerate={generateToken}
              onCenters={() => setView('centers')}
              token={token}
              notify={notify}
              userName={displayName}
              onViewSlip={() => setShowSlipModal(true)}
              centers={currentCenters}
            />
          )}
          {view === 'centers' && <Centers onGenerate={generateToken} notify={notify} centers={currentCenters} />}
          {view === 'queue' && (
            <Queue token={token} onHome={() => setView('home')} notify={notify} />
          )}
          {view === 'status' && <Status />}
          {view === 'notifications' && <Notifications />}
          {view === 'help' && <Help notify={notify} />}
        </div>
      </main>

      {/* Electronic Mandi Slip Modal */}
      {showSlipModal && (
        <MandiSlipModal onClose={() => setShowSlipModal(false)} notify={notify} />
      )}

      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  )
}

function Home({
  onGenerate,
  onCenters,
  token,
  notify,
  userName,
  onViewSlip,
  centers,
}: {
  onGenerate: () => void
  onCenters: () => void
  token: string
  notify: (s: string) => void
  userName: string
  onViewSlip: () => void
  centers: Center[]
}) {
  const { t, language } = useLanguage()
  const firstName = (userName || 'Farmer').split(' ')[0] || (language === 'hi' ? 'किसान भाई' : 'Farmer')

  return (
    <>
      <section className="welcome">
        <div>
          <p className="eyebrow">{t('home.date', 'TODAY · SEASON 2026')}</p>
          <h1>
            {t('home.greeting', 'Good morning,')} {firstName}.
          </h1>
          <p className="muted">{t('home.subtitle', 'Your farm, your produce, your fair price — all in one place.')}</p>
        </div>
        <button
          className="outline"
          onClick={() => notify(t('topbar.profile_updated', 'Profile details are up to date'))}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <User size={15} /> {t('topbar.view_profile', 'View profile')} <ChevronRight size={15} />
        </button>
      </section>

      {/* Hero Card */}
      <div className="hero-card">
        <div>
          <span className="tag">{t('home.hero_tag', '● SEASON 2026 · WHEAT')}</span>
          <h2>
            {language === 'hi' ? (
              <>
                अपनी फसल बेचें
                <br />
                पूरे विश्वास के साथ।
              </>
            ) : (
              <>
                Sell your harvest
                <br />
                with confidence.
              </>
            )}
          </h2>
          <p>{t('home.hero_desc', "Skip the waiting room. Get your token online and arrive when it's your turn.")}</p>
          <button className="primary" onClick={onGenerate}>
            {t('home.get_token_btn', 'Get a queue token')} <ArrowRight size={16} />
          </button>
        </div>
        <div className="hero-art">
          <div className="sun"></div>
          <div className="hill hill-one"></div>
          <div className="hill hill-two"></div>
          <div className="crop-lines">
            ////
            <br />
            ////
            <br />
            ////
          </div>
        </div>
      </div>

      {/* ==========================================================================
          LIVE PROCUREMENT STATUS CARD (Prominently placed on the Dashboard)
          ========================================================================== */}
      <div className="live-procurement-card">
        <div className="live-proc-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className="live-pulse-badge">
                <span className="live-pulse-dot"></span>
                {t('live_proc.badge', 'LIVE CONSIGNMENT STATUS')}
              </span>
              <span style={{ fontSize: '11px', color: '#65776d', fontWeight: 600 }}>
                {t('live_proc.lot_no', 'Lot #KS-2026-8941')}
              </span>
            </div>
            <h2 style={{ margin: '4px 0 6px 0', fontSize: '20px', color: '#143425', fontWeight: 800 }}>
              {t('live_proc.title', 'Active Harvest Consignment')}
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#5b7164' }}>
              {t('live_proc.subtitle', 'Real-time tracking from entry gate to direct bank transfer (DBT).')}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11.5px', color: '#65776d', display: 'block' }}>
              {t('live_proc.token_label', 'Token')}
            </span>
            <strong style={{ fontSize: '22px', color: '#16693f', fontFamily: 'Georgia, serif' }}>{token}</strong>
          </div>
        </div>

        {/* Metadata Details Strip */}
        <div className="live-proc-meta-grid">
          <div className="live-proc-meta-item">
            <small>{t('live_proc.vehicle', 'Vehicle / Trolley')}</small>
            <strong>{t('live_proc.vehicle_val', 'PB-10-CZ-4921 (Tractor Trolley)')}</strong>
          </div>
          <div className="live-proc-meta-item">
            <small>{t('live_proc.center_label', 'Procurement Centre')}</small>
            <strong>{t('live_proc.center_val', 'Dharampur Procurement Centre · Gate 1')}</strong>
          </div>
          <div className="live-proc-meta-item">
            <small>{t('live_proc.crop_label', 'Crop & Variety')}</small>
            <strong>{t('live_proc.crop_val', 'Wheat (Sharbati Grade A)')}</strong>
          </div>
          <div className="live-proc-meta-item">
            <small>{t('live_proc.net_weight', 'Net Weight')}</small>
            <strong style={{ color: '#16693f' }}>{t('live_proc.net_weight_val', '48.50 Quintals (4,850 kg)')}</strong>
          </div>
        </div>

        {/* 5-Stage Visual Stepper */}
        <div className="proc-stepper">
          {/* Stage 1 */}
          <div className="step-card completed">
            <div className="step-header">
              <span className="step-badge"><Check size={13} strokeWidth={3} /></span>
              <span className="step-time">{t('stage.1.time', '09:42 AM')}</span>
            </div>
            <div className="step-title">{t('stage.1.title', 'Gate Inward Scan')}</div>
            <div className="step-desc">{t('stage.1.desc', 'Vehicle entry logged, QR verified & token validated.')}</div>
          </div>

          {/* Stage 2 */}
          <div className="step-card completed">
            <div className="step-header">
              <span className="step-badge"><Check size={13} strokeWidth={3} /></span>
              <span className="step-time">{t('stage.2.time', '10:05 AM')}</span>
            </div>
            <div className="step-title">{t('stage.2.title', 'Quality Check')}</div>
            <div className="step-desc">{t('stage.2.desc', 'Moisture: 11.2% (Max 12%). Grade A clean grain accepted.')}</div>
          </div>

          {/* Stage 3 */}
          <div className="step-card completed">
            <div className="step-header">
              <span className="step-badge"><Check size={13} strokeWidth={3} /></span>
              <span className="step-time">{t('stage.3.time', '10:28 AM')}</span>
            </div>
            <div className="step-title">{t('stage.3.title', 'Weighbridge Scale')}</div>
            <div className="step-desc">{t('stage.3.desc', 'Gross 6,420 kg - Tare 1,570 kg = 48.50 Qtl net.')}</div>
          </div>

          {/* Stage 4 (Current) */}
          <div className="step-card current">
            <div className="step-header">
              <span className="step-badge">4</span>
              <span className="step-time">{language === 'hi' ? 'प्रक्रियाधीन' : 'Live Now'}</span>
            </div>
            <div className="step-title">{t('stage.4.title', 'MSP & Bill Generation')}</div>
            <div className="step-desc">{t('stage.4.desc', 'Form J / Mandi Sale Slip #EP-9021 being generated at ₹2,425/qtl.')}</div>
          </div>

          {/* Stage 5 */}
          <div className="step-card upcoming">
            <div className="step-header">
              <span className="step-badge">5</span>
              <span className="step-time">{language === 'hi' ? 'अगला चरण' : 'Scheduled'}</span>
            </div>
            <div className="step-title">{t('stage.5.title', 'DBT Direct Credit')}</div>
            <div className="step-desc">{t('stage.5.desc', 'Direct payment to SBI A/C •••• 2491 within 24-48 hours.')}</div>
          </div>
        </div>

        {/* Live Gross Value Strip */}
        <div className="live-value-strip">
          <div>
            <small>{t('live_proc.gross_weight', 'Gross: 6,420 kg | Tare: 1,570 kg')}</small>
            <strong>{t('live_proc.net_weight_val', '48.50 Quintals (Net)')}</strong>
          </div>
          <div>
            <small>{t('live_proc.msp_rate', 'Govt MSP Rate')}</small>
            <strong>{t('live_proc.msp_rate_val', '₹2,425 / quintal')}</strong>
          </div>
          <div>
            <small>{t('live_proc.total_payout', 'Estimated Payout')}</small>
            <strong className="payout-highlight">{t('live_proc.total_payout_val', '₹1,17,612.50')}</strong>
          </div>
        </div>

        {/* Actions for Live Procurement */}
        <div className="live-proc-actions">
          <button className="btn-proc-primary" onClick={onViewSlip}>
            <FileText size={15} />
            {t('live_proc.btn_slip', 'View Mandi Slip')}
          </button>
          <button
            className="btn-proc-outline"
            onClick={() => notify(language === 'hi' ? 'गुणवत्ता रिपोर्ट: नमी 11.2%, अशुद्धता 0.4% — पास' : 'Quality Report: Moisture 11.2%, Foreign matter 0.4% — Passed')}
          >
            <BadgeCheck size={15} />
            {t('live_proc.btn_cert', 'Inspection Report')}
          </button>
          <button
            className="btn-proc-outline"
            onClick={() => notify(language === 'hi' ? 'डीबीटी बैच #PFMS-2026-8812 एनपीसीआई को प्रेषित' : 'DBT Batch #PFMS-2026-8812 queued with NPCI for SBI •••• 2491')}
          >
            <Wallet size={15} />
            {t('live_proc.btn_dbt', 'Track DBT Payment')}
          </button>
        </div>
      </div>

      {/* Activity Summary Section */}
      <div className="section-head">
        <div>
          <h2>{t('stats.activity_title', 'Your activity')}</h2>
          <p className="muted">{t('stats.activity_subtitle', 'A quick look at your procurement journey.')}</p>
        </div>
        <button className="text-btn" onClick={() => notify('Activity history opened')}>
          {t('stats.view_history', 'View history →')}
        </button>
      </div>

      <div className="stats">
        <Stat label={t('stats.current_queue', 'Current queue')} value={token} note={language === 'hi' ? 'धरमपुर केंद्र' : 'Dharampur Centre'} accent="amber" icon={Ticket} />
        <Stat
          label={t('stats.estimated_wait', 'Estimated wait')}
          value={language === 'hi' ? '18 मिनट' : '18 min'}
          note={t('stats.next_in_line', 'You are next in line')}
          accent="blue"
          icon={Clock3}
        />
        <Stat
          label={t('stats.this_season', 'This season')}
          value="₹1,60,292"
          note={language === 'hi' ? '60.9 क्विंटल कुल बिक्री' : '60.9 quintals sold'}
          accent="green"
          icon={IndianRupee}
        />
      </div>

      <div className="split">
        <div className="panel">
          <div className="panel-head">
            <div>
              <h3>{t('centres.nearby_title', 'Nearby procurement centres')}</h3>
              <p className="muted">{t('centres.nearby_subtitle', 'Live availability around you')}</p>
            </div>
            <button className="text-btn" onClick={onCenters}>
              {t('centres.see_all', 'See all')}
            </button>
          </div>
          {centers.slice(0, 2).map((c) => (
            <CenterRow key={c.name} center={c} onClick={onGenerate} />
          ))}
        </div>

        <div className="panel price-panel">
          <div className="panel-head">
            <div>
              <h3>{t('prices.title', "Today's mandi prices")}</h3>
              <p className="muted">{t('prices.subtitle', 'Updated 10 minutes ago')}</p>
            </div>
            <span className="live">{t('prices.live_badge', 'LIVE')}</span>
          </div>
          <div className="price-row">
            <span>
              {t('prices.wheat', 'Wheat')} <small>{t('prices.per_quintal', 'per quintal')}</small>
            </span>
            <strong>
              ₹2,425 <em>+2.1%</em>
            </strong>
          </div>
          <div className="price-row">
            <span>
              {t('prices.mustard', 'Mustard')} <small>{t('prices.per_quintal', 'per quintal')}</small>
            </span>
            <strong>
              ₹5,680 <em>+0.8%</em>
            </strong>
          </div>
          <div className="price-row">
            <span>
              {t('prices.paddy', 'Paddy')} <small>{t('prices.per_quintal', 'per quintal')}</small>
            </span>
            <strong>
              ₹2,190 <em>-0.4%</em>
            </strong>
          </div>
        </div>
      </div>
    </>
  )
}

function Stat({
  label,
  value,
  note,
  accent,
  icon,
}: {
  label: string
  value: string
  note: string
  accent: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>
}) {
  const Icon = icon
  return (
    <div className={`stat ${accent}`}>
      <div className="stat-icon">
        <Icon size={18} strokeWidth={2.2} />
      </div>
      <p>{label}</p>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  )
}

function CenterRow({ center, onClick }: { center: Center; onClick: () => void }) {
  return (
    <button className="center-row" onClick={onClick}>
      <div className={`center-icon ${center.accent}`}>
        <MapPin size={20} />
      </div>
      <div className="center-info">
        <strong>{center.name}</strong>
        <span>
          {center.distance} · {center.crop}
        </span>
      </div>
      <div className="center-status">
        <b>{center.status}</b>
        <span>{center.wait}</span>
      </div>
      <ChevronRight className="arrow" size={18} />
    </button>
  )
}

function Centers({
  onGenerate,
  notify,
  centers,
}: {
  onGenerate: () => void
  notify: (s: string) => void
  centers: Center[]
}) {
  const { t } = useLanguage()

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">{t('centres.page_title', 'Find a procurement centre').toUpperCase()}</p>
        <h1>{t('centres.page_title', 'Find a procurement centre')}</h1>
        <p className="muted">{t('centres.page_subtitle', 'Choose a centre with the shortest wait near you.')}</p>
      </section>
      <div className="search">
        <Search size={18} />
        <input placeholder={t('centres.search_placeholder', 'Search by centre, village or crop')} />
        <button>{t('centres.filter', 'Filter')}</button>
      </div>
      <div className="map-strip">
        <div className="map-pin p1"><MapPin size={16} /></div>
        <div className="map-pin p2"><MapPin size={16} /></div>
        <div className="map-pin p3"><MapPin size={16} /></div>
        <div className="map-label">{t('centres.your_location', 'Your location · Dharampur')}</div>
      </div>
      <div className="center-list">
        {centers.map((c) => (
          <div className="large-center" key={c.name}>
            <CenterRow center={c} onClick={onGenerate} />
            <div className="center-actions">
              <button
                className="outline"
                onClick={() => notify(`${t('centres.get_directions', 'Directions to')} ${c.name}`)}
              >
                {t('centres.get_directions', 'Get directions')}
              </button>
              <button className="primary small" onClick={onGenerate}>
                {t('centres.get_token', 'Get token')} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function Queue({
  token,
  onHome,
  notify,
}: {
  token: string
  onHome: () => void
  notify: (s: string) => void
}) {
  const { t } = useLanguage()

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">{t('queue.live_position', 'LIVE QUEUE').toUpperCase()}</p>
        <h1>{t('queue.page_title', 'Your queue token')}</h1>
        <p className="muted">{t('queue.page_subtitle', 'Dharampur Procurement Centre · Today, Season 2026')}</p>
      </section>
      <div className="queue-layout">
        <div className="token-card">
          <span className="tag">{t('queue.your_token', 'YOUR TOKEN')}</span>
          <strong>{token}</strong>
          <p>{t('queue.token_details', 'Wheat · 48.50 quintals')}</p>
          <div className="token-divider"></div>
          <div className="token-meta">
            <span>
              {t('queue.arrive_by', 'Arrive by')}<strong>{t('queue.arrive_time', '10:42 AM')}</strong>
            </span>
            <span>
              {t('queue.counter', 'Counter')}<strong>{t('queue.counter_no', 'Window 02')}</strong>
            </span>
          </div>
        </div>
        <div className="panel queue-panel">
          <div className="panel-head">
            <div>
              <h3>{t('queue.live_position', 'Live queue position')}</h3>
              <p className="muted">{t('queue.updated_now', 'Updated just now')}</p>
            </div>
            <span className="live">● LIVE</span>
          </div>
          <div className="queue-number">
            <strong>12</strong>
            <span>{t('queue.people_ahead', 'people ahead of you')}</span>
          </div>
          <div className="progress">
            <span style={{ width: '72%' }}></span>
          </div>
          <div className="queue-ends">
            <span>
              {t('queue.now_serving', 'Now serving')} <b>A-030</b>
            </span>
            <span>Est. 18 min</span>
          </div>
          <div className="queue-tip">
            {t('queue.tip', "Keep this screen handy. We'll notify you when your turn is near.")}
          </div>
        </div>
      </div>
      <div className="queue-actions">
        <button className="outline" onClick={() => notify('Token cancelled')}>
          {t('queue.cancel_token', 'Cancel token')}
        </button>
        <button className="primary" onClick={onHome}>
          {t('queue.back_overview', 'Back to overview')} <ArrowRight size={16} />
        </button>
      </div>
    </>
  )
}

function Status() {
  const { t } = useLanguage()

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">{t('status.page_title', 'MY PROCUREMENT').toUpperCase()}</p>
        <h1>{t('status.page_title', 'Harvest journey')}</h1>
        <p className="muted">{t('status.page_subtitle', 'Track your produce from arrival to payment.')}</p>
      </section>
      <div className="status-card">
        <div className="status-top">
          <div>
            <span className="tag green-tag">{t('status.processing_badge', '● PAYMENT PROCESSING')}</span>
            <h2>Wheat · 48.50 quintals</h2>
            <p className="muted">Dharampur Procurement Centre · Token A-042</p>
          </div>
          <strong className="amount">₹1,17,612.50</strong>
        </div>
        <div className="timeline">
          <div className="done">
            <Check size={14} />
            <strong>{t('status.timeline_arrived', 'Arrived')}</strong>
            <span>09:42 AM</span>
          </div>
          <div className="done">
            <Check size={14} />
            <strong>{t('status.timeline_qc', 'Quality checked')}</strong>
            <span>10:05 AM</span>
          </div>
          <div className="done">
            <Check size={14} />
            <strong>{t('status.timeline_accepted', 'Accepted')}</strong>
            <span>10:28 AM</span>
          </div>
          <div className="current">
            <IndianRupee size={14} />
            <strong>{t('status.timeline_payment', 'Payment processing')}</strong>
            <span>Direct Benefit Transfer (DBT)</span>
          </div>
        </div>
      </div>
      <div className="panel info-panel">
        <h3>{t('status.payment_details', 'Payment details')}</h3>
        <div className="detail-grid">
          <span>
            {t('status.bank_account', 'Bank account')} <b>State Bank of India •••• 2491</b>
          </span>
          <span>
            {t('status.msp_rate_label', 'MSP rate')} <b>₹2,425 / quintal</b>
          </span>
          <span>
            {t('status.gross_amount', 'Gross amount')} <b>₹1,17,612.50</b>
          </span>
          <span>
            {t('status.expected_by', 'Expected by')} <b>7 September 2026 (PFMS)</b>
          </span>
        </div>
      </div>
    </>
  )
}

function Notifications() {
  const { t } = useLanguage()

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">{t('notif.page_title', 'UPDATES').toUpperCase()}</p>
        <h1>{t('notif.page_title', 'Notifications')}</h1>
        <p className="muted">{t('notif.page_subtitle', 'Important updates about your harvest and centre.')}</p>
      </section>
      <div className="notifications">
        <Notice
          title={t('notif.1_title', 'Your turn is coming up')}
          text={t('notif.1_text', 'You are 12th in line at Dharampur Procurement Centre.')}
          time={t('notif.1_time', 'Just now')}
          accent="amber"
        />
        <Notice
          title={t('notif.2_title', 'Payment is processing')}
          text={t('notif.2_text', '₹1,17,612.50 for Wheat · 48.5 quintals is on its way to account •••• 2491.')}
          time={t('notif.2_time', 'Today, 10:18 AM')}
          accent="green"
        />
        <Notice
          title={t('notif.3_title', 'Mandi prices updated')}
          text={t('notif.3_text', 'Wheat prices increased by 2.1% today. Current MSP is ₹2,425/qtl.')}
          time={t('notif.3_time', 'Today, 9:30 AM')}
          accent="blue"
        />
      </div>
    </>
  )
}

function Notice({
  title,
  text,
  time,
  accent,
}: {
  title: string
  text: string
  time: string
  accent: string
}) {
  return (
    <div className="notice">
      <div className={`notice-icon ${accent}`}>
        <BellRing size={17} />
      </div>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
        <small>{time}</small>
      </div>
      <button aria-label="More options">
        <MoreHorizontal size={16} />
      </button>
    </div>
  )
}

function Help({ notify }: { notify: (s: string) => void }) {
  const { t } = useLanguage()

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">{t('help.page_title', "WE'RE HERE TO HELP").toUpperCase()}</p>
        <h1>{t('help.page_title', 'How can we help?')}</h1>
        <p className="muted">{t('help.page_subtitle', 'Find quick answers or talk to our support team.')}</p>
      </section>
      <div className="help-grid">
        <button onClick={() => notify('Opening token guide')}>
          <span><Ticket size={19} /></span>
          <strong>{t('help.q1_title', 'How do tokens work?')}</strong>
          <small>{t('help.q1_sub', 'Get a token in 3 simple steps →')}</small>
        </button>
        <button onClick={() => notify('Opening payment guide')}>
          <span><IndianRupee size={19} /></span>
          <strong>{t('help.q2_title', 'Payment & MSP rates')}</strong>
          <small>{t('help.q2_sub', 'Understand your payment →')}</small>
        </button>
        <button onClick={() => notify('Calling Kisan helpline: 1800-180-1551')}>
          <span><Phone size={19} /></span>
          <strong>{t('help.q3_title', 'Talk to support')}</strong>
          <small>{t('help.q3_sub', '1800-180-1551 · Toll free →')}</small>
        </button>
      </div>
    </>
  )
}

/* ==========================================================================
   ELECTRONIC MANDI WEIGHMENT SLIP MODAL
   ========================================================================== */
function MandiSlipModal({ onClose, notify }: { onClose: () => void; notify: (msg: string) => void }) {
  const { t, language } = useLanguage()

  return (
    <div className="mandi-modal-backdrop" onClick={onClose}>
      <div className="mandi-slip-card" onClick={(e) => e.stopPropagation()}>
        <div className="mandi-slip-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8 }}>
                GOVERNMENT OF PUNJAB · PUNSUP & FCI
              </span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '18px', color: '#ffffff' }}>
                {t('live_proc.receipt_title', 'Electronic Mandi Weighment Slip')}
              </h3>
            </div>
            <button onClick={onClose} style={{ color: '#ffffff', opacity: 0.8, cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="mandi-slip-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #d5ded1', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#687e71' }}>Slip No:</span>
              <strong style={{ display: 'block', fontSize: '14px', color: '#143425' }}>MS-2026-8941-EP</strong>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: '#687e71' }}>Date & Time:</span>
              <strong style={{ display: 'block', fontSize: '13px', color: '#143425' }}>06 Sep 2026 · 10:28 AM</strong>
            </div>
          </div>

          <table className="slip-table">
            <tbody>
              <tr>
                <td>Farmer Name / ID</td>
                <td>Ramesh Kumar (KS-2491)</td>
              </tr>
              <tr>
                <td>Centre / Mandi Yard</td>
                <td>Dharampur Main Yard (Scale #2)</td>
              </tr>
              <tr>
                <td>Vehicle / Trolley No.</td>
                <td>PB-10-CZ-4921 (Tractor)</td>
              </tr>
              <tr>
                <td>Crop & Variety</td>
                <td>Wheat (Sharbati Grade A)</td>
              </tr>
              <tr>
                <td>Moisture Content</td>
                <td><strong style={{ color: '#16693f' }}>11.2%</strong> (Permissible: &lt;12%)</td>
              </tr>
              <tr>
                <td>Gross Vehicle Weight</td>
                <td>6,420 kg</td>
              </tr>
              <tr>
                <td>Tare (Empty Vehicle)</td>
                <td>1,570 kg</td>
              </tr>
              <tr style={{ background: '#f5faf5' }}>
                <td style={{ fontWeight: 700, color: '#16693f' }}>Net Produce Weight</td>
                <td style={{ fontSize: '14px', color: '#16693f', fontWeight: 800 }}>48.50 Quintals (4,850 kg)</td>
              </tr>
              <tr>
                <td>Govt MSP Rate</td>
                <td>₹2,425.00 per Quintal</td>
              </tr>
              <tr style={{ background: '#fdf9ee' }}>
                <td style={{ fontWeight: 700, color: '#976113' }}>Total Gross Payment</td>
                <td style={{ fontSize: '16px', color: '#976113', fontWeight: 800 }}>₹1,17,612.50</td>
              </tr>
              <tr>
                <td>Payment Route</td>
                <td>DBT via PFMS (SBI •••• 2491)</td>
              </tr>
              <tr>
                <td>Weighbridge Operator</td>
                <td>Satish Chander (Emp #WB-08)</td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button
              className="btn-proc-primary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => {
                notify(language === 'hi' ? 'तौल पर्ची डाउनलोड हो गई है (PDF)' : 'Weighment Slip downloaded successfully (PDF)')
                onClose()
              }}
            >
              <Download size={15} /> {t('live_proc.receipt_print', 'Print / Download Slip')}
            </button>
            <button className="btn-proc-outline" onClick={onClose}>
              {t('live_proc.receipt_close', 'Close Slip')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ==========================================================================
   ADMIN DASHBOARD WITH COMPLETE MOCK DATA FOR ALL MODULES
   ========================================================================== */
function AdminDashboard({
  onBack,
  notify,
  toast,
}: {
  onBack: () => void
  notify: (s: string) => void
  toast: string
}) {
  const [active, setActive] = useState('Dashboard')
  const [serving, setServing] = useState('A-030')
  const [queueItems, setQueueItems] = useState<QueueItem[]>(MOCK_QUEUE_ITEMS)
  const [centres, setCentres] = useState<CentreItem[]>(MOCK_CENTRES)
  const [payments, setPayments] = useState<PaymentItem[]>(MOCK_PAYMENTS)
  const [queueFilter, setQueueFilter] = useState<string>('All')
  const [queueSearch, setQueueSearch] = useState<string>('')
  const [paymentFilter, setPaymentFilter] = useState<string>('All')

  // Call Next Farmer Handler
  const handleCallNext = () => {
    const currentNum = Number(serving.slice(2))
    const nextToken = `A-${String(currentNum + 1).padStart(3, '0')}`
    setServing(nextToken)
    notify(`Called Token ${nextToken} to Window 02`)
  }

  // Update Status in Queue Table
  const handleStatusChange = (token: string, newStatus: QueueItem['status']) => {
    setQueueItems((prev) =>
      prev.map((item) => (item.token === token ? { ...item, status: newStatus } : item))
    )
    notify(`Token ${token} marked as ${newStatus}`)
  }

  // Filtered Queue
  const filteredQueue = queueItems.filter((item) => {
    const matchesFilter = queueFilter === 'All' || item.status === queueFilter
    const matchesSearch =
      item.farmer.toLowerCase().includes(queueSearch.toLowerCase()) ||
      item.token.toLowerCase().includes(queueSearch.toLowerCase()) ||
      item.village.toLowerCase().includes(queueSearch.toLowerCase())
    return matchesFilter && matchesSearch
  })

  // Filtered Payments
  const filteredPayments = payments.filter((pmt) => {
    if (paymentFilter === 'All') return true
    return pmt.status === paymentFilter
  })

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <div className="brand">
          <div className="brand-mark">
            <img src="/kisanq-icon.png" alt="KisanQ" className="brand-mark-img" width={40} height={40} />
          </div>
          <div>
            <strong>KisanQ</strong>
            <small>Admin console</small>
          </div>
        </div>
        <p className="admin-label">COMMAND CENTRE</p>
        {[
          { name: 'Dashboard', icon: LayoutDashboard },
          { name: 'Queue management', icon: ListOrdered },
          { name: 'Centres', icon: Building2 },
          { name: 'Payments', icon: Wallet },
          { name: 'Reports', icon: FileBarChart },
        ].map(({ name, icon: Icon }) => (
          <button
            className={active === name ? 'active' : ''}
            onClick={() => setActive(name)}
            key={name}
          >
            <Icon size={19} />
            {name}
          </button>
        ))}
        <button className="back-farmer" onClick={onBack}>
          ← Farmer view
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-top">
          <div>
            <p className="eyebrow">TUESDAY, 6 SEPTEMBER 2026 · 10:24 AM</p>
            <h1>{active}</h1>
          </div>
          <div className="admin-user">
            <div className="mini-avatar">AS</div>
            <span>
              <strong>Arjun Singh</strong>
              <small>Centre Manager · Dharampur</small>
            </span>
            <button onClick={onBack} aria-label="Sign out" title="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* ==========================================================================
            TAB 1: DASHBOARD
            ========================================================================== */}
        {active === 'Dashboard' && (
          <>
            <div className="admin-stats">
              <Stat label="In queue now" value="38" note="12% less than yesterday" accent="amber" icon={ListOrdered} />
              <Stat label="Served today" value="126" note="Of 180 booked tokens" accent="green" icon={Check} />
              <Stat label="Avg. wait time" value="24 min" note="6 min better today" accent="blue" icon={Clock3} />
              <Stat label="Pending payments" value="₹24.8L" note="42 farmers" accent="purple" icon={IndianRupee} />
            </div>

            <div className="admin-grid">
              <div className="panel queue-table">
                <div className="panel-head">
                  <div>
                    <h3>Live queue · Dharampur Centre</h3>
                    <p className="muted">Managing {queueItems.length} active consignments</p>
                  </div>
                  <button
                    className="primary small"
                    onClick={handleCallNext}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    Call next farmer <ArrowRight size={14} />
                  </button>
                </div>
                <div className="serving">
                  <span>NOW SERVING</span>
                  <strong>{serving}</strong>
                  <b>Ramesh Kumar</b>
                  <small>Wheat (48.50 Qtl) · Window 02</small>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Token</th>
                      <th>Farmer</th>
                      <th>Crop / quantity</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queueItems.slice(0, 4).map((row) => (
                      <tr key={row.token}>
                        <td>
                          <strong>{row.token}</strong>
                        </td>
                        <td>
                          <div>{row.farmer}</div>
                          <small style={{ color: '#7a8c80' }}>{row.village}</small>
                        </td>
                        <td>{row.quantity}</td>
                        <td>
                          <span
                            className={`status-pill ${
                              row.status === 'Ready'
                                ? 'ready'
                                : row.status === 'Weighing'
                                ? 'processing'
                                : row.status === 'Inspection'
                                ? 'waiting'
                                : ''
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="more"
                            onClick={() => notify(`Updated ${row.token}`)}
                            aria-label={`Options for ${row.token}`}
                          >
                            <MoreHorizontal size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="panel chart-panel">
                <div className="panel-head">
                  <div>
                    <h3>Today&apos;s throughput</h3>
                    <p className="muted">Farmers served by hour (Peak 11:00 AM)</p>
                  </div>
                  <select style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #d4ddd0' }}>
                    <option>Today</option>
                    <option>This week</option>
                  </select>
                </div>
                <div className="bars">
                  {[32, 45, 38, 70, 58, 82, 64, 92, 76, 54].map((h, i) => (
                    <div key={i}>
                      <span style={{ height: `${h}%` }}></span>
                      <small>{8 + i}:00</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ==========================================================================
            TAB 2: QUEUE MANAGEMENT
            ========================================================================== */}
        {active === 'Queue management' && (
          <div className="panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#163628' }}>Live Consignment & Token Management</h2>
                <p className="muted" style={{ margin: '4px 0 0 0' }}>Real-time gate traffic, inspection queue and weighbridge lanes.</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="primary small"
                  onClick={handleCallNext}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  Call Next Farmer ({serving}) <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap' }}>
              <div className="search" style={{ maxWidth: '320px', margin: 0 }}>
                <Search size={16} />
                <input
                  placeholder="Search farmer, token, village..."
                  value={queueSearch}
                  onChange={(e) => setQueueSearch(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                {['All', 'Waiting', 'Inspection', 'Weighing', 'Ready'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setQueueFilter(f)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: queueFilter === f ? '#16693f' : '#ffffff',
                      color: queueFilter === f ? '#ffffff' : '#45594e',
                      border: '1px solid #d5ded2',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Queue Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1.5px solid #dce4d9', color: '#566b5f' }}>
                  <th style={{ padding: '10px' }}>Token</th>
                  <th style={{ padding: '10px' }}>Farmer / Contact</th>
                  <th style={{ padding: '10px' }}>Village</th>
                  <th style={{ padding: '10px' }}>Crop & Quantity</th>
                  <th style={{ padding: '10px' }}>Vehicle</th>
                  <th style={{ padding: '10px' }}>Current Status</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueue.map((item) => (
                  <tr key={item.token} style={{ borderBottom: '1px solid #edf2eb' }}>
                    <td style={{ padding: '12px 10px' }}>
                      <strong style={{ color: '#16693f', fontSize: '14px' }}>{item.token}</strong>
                      <span style={{ display: 'block', fontSize: '11px', color: '#7a8c80' }}>{item.arrivalTime}</span>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ fontWeight: 600, color: '#183829' }}>{item.farmer}</div>
                      <small style={{ color: '#687e71' }}>{item.phone}</small>
                    </td>
                    <td style={{ padding: '12px 10px', color: '#44564c' }}>{item.village}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ fontWeight: 600 }}>{item.crop}</div>
                      <small style={{ color: '#687e71' }}>{item.quantity}</small>
                    </td>
                    <td style={{ padding: '12px 10px', color: '#44564c' }}>
                      <span style={{ background: '#edf2eb', padding: '3px 8px', borderRadius: '4px', fontSize: '11.5px', fontFamily: 'monospace' }}>
                        {item.vehicle}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.token, e.target.value as any)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          border: '1px solid #c9d8c6',
                          background: item.status === 'Ready' ? '#eaf5ee' : '#ffffff',
                          color: item.status === 'Ready' ? '#126338' : '#22382b',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        <option value="Waiting">Waiting</option>
                        <option value="Inspection">Inspection</option>
                        <option value="Weighing">Weighing</option>
                        <option value="Ready">Ready</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                      <button
                        className="btn-proc-outline"
                        style={{ padding: '4px 10px', fontSize: '11.5px' }}
                        onClick={() => notify(`Slip generated for ${item.token}`)}
                      >
                        Print Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ==========================================================================
            TAB 3: CENTRES
            ========================================================================== */}
        {active === 'Centres' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#163628' }}>Procurement Centres & Silo Depots</h2>
                <p className="muted" style={{ margin: '4px 0 0 0' }}>Manage intake capacities, active weighing scales, and operational status.</p>
              </div>
              <button
                className="btn-proc-primary"
                onClick={() => notify('New procurement centre registration wizard opened')}
              >
                + Register New Centre
              </button>
            </div>

            <div className="admin-card-grid">
              {centres.map((c) => {
                const fillPct = Math.round((c.currentStockMT / c.capacityMT) * 100)
                return (
                  <div key={c.id} className="centre-stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ fontSize: '11px', color: '#687e71', fontWeight: 600 }}>{c.id} · {c.type}</span>
                        <h3 style={{ margin: '4px 0', fontSize: '15px', color: '#143425' }}>{c.name}</h3>
                        <span style={{ fontSize: '12px', color: '#44564c' }}>District: {c.district}</span>
                      </div>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: c.status === 'Open' ? '#e7f5ec' : '#fdf3dd',
                          color: c.status === 'Open' ? '#126338' : '#92580c',
                        }}
                      >
                        ● {c.status}
                      </span>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', color: '#566b5f' }}>
                        <span>Silo Capacity Filled:</span>
                        <strong>{c.currentStockMT.toLocaleString()} / {c.capacityMT.toLocaleString()} MT ({fillPct}%)</strong>
                      </div>
                      <div className="capacity-track">
                        <div className="capacity-fill" style={{ width: `${fillPct}%` }}></div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', background: '#f5f8f4', padding: '10px', borderRadius: '8px' }}>
                      <div>
                        <small style={{ color: '#7a8c80', display: 'block' }}>Weighbridges</small>
                        <strong>{c.activeBridges} / {c.totalBridges} Active</strong>
                      </div>
                      <div>
                        <small style={{ color: '#7a8c80', display: 'block' }}>Today&apos;s Intake</small>
                        <strong style={{ color: '#16693f' }}>{c.todayIntakeMT} MT</strong>
                      </div>
                      <div>
                        <small style={{ color: '#7a8c80', display: 'block' }}>Queue</small>
                        <strong>{c.queueCount} Vehicles</strong>
                      </div>
                      <div>
                        <small style={{ color: '#7a8c80', display: 'block' }}>Manager</small>
                        <strong>{c.manager}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #edf1eb' }}>
                      <span style={{ fontSize: '11px', color: '#687e71' }}>{c.phone}</span>
                      <button
                        className="btn-proc-outline"
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                        onClick={() => {
                          setCentres((prev) =>
                            prev.map((item) =>
                              item.id === c.id
                                ? { ...item, status: item.status === 'Open' ? 'Peak Queue' : 'Open' }
                                : item
                            )
                          )
                          notify(`Updated status for ${c.name}`)
                        }}
                      >
                        Toggle Status
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ==========================================================================
            TAB 4: PAYMENTS (DBT LEDGER)
            ========================================================================== */}
        {active === 'Payments' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#163628' }}>Direct Benefit Transfer (DBT) Payout Ledger</h2>
                <p className="muted" style={{ margin: '4px 0 0 0' }}>Automated government MSP disbursement via PFMS and NPCI payment gateway.</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-proc-primary"
                  onClick={() => notify('Batch of 18 pending payments approved for PFMS transfer')}
                >
                  Approve Ready Batch (₹18.4L)
                </button>
                <button
                  className="btn-proc-outline"
                  onClick={() => notify('Bank disbursement file exported (CSV/XML)')}
                >
                  <Download size={14} /> Export Bank File
                </button>
              </div>
            </div>

            {/* DBT Metrics Cards */}
            <div className="admin-stats" style={{ marginBottom: '18px' }}>
              <Stat label="Total Disbursed Season" value="₹4.82 Cr" note="2,140 farmers credited" accent="green" icon={BadgeCheck} />
              <Stat label="In Bank Batch Today" value="₹24.8 Lakh" note="42 transactions processing" accent="amber" icon={Clock3} />
              <Stat label="Settlement Rate" value="99.2%" note="0.8% KYC flag rate" accent="blue" icon={TrendingUp} />
              <Stat label="Avg Payout Speed" value="26 Hours" note="Direct to A/C" accent="purple" icon={IndianRupee} />
            </div>

            {/* Payment Transactions Table */}
            <div className="panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['All', 'Disbursed', 'Processing', 'Flagged'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setPaymentFilter(f)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: paymentFilter === f ? '#16693f' : '#ffffff',
                        color: paymentFilter === f ? '#ffffff' : '#45594e',
                        border: '1px solid #d5ded2',
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: '12px', color: '#687e71' }}>
                  Showing {filteredPayments.length} transactions
                </span>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1.5px solid #dce4d9', color: '#566b5f' }}>
                    <th style={{ padding: '10px' }}>DBT Ref / Date</th>
                    <th style={{ padding: '10px' }}>Farmer</th>
                    <th style={{ padding: '10px' }}>Bank Account</th>
                    <th style={{ padding: '10px' }}>Crop & Weight</th>
                    <th style={{ padding: '10px' }}>Amount (MSP)</th>
                    <th style={{ padding: '10px' }}>Status</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>UTR Ref</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #edf2eb' }}>
                      <td style={{ padding: '12px 10px' }}>
                        <strong style={{ color: '#16693f', display: 'block' }}>{p.dbtRef}</strong>
                        <span style={{ fontSize: '11px', color: '#7a8c80' }}>{p.date}</span>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ fontWeight: 600 }}>{p.farmerName}</div>
                        <small style={{ color: '#687e71' }}>ID: {p.farmerId}</small>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div>{p.bankName}</div>
                        <small style={{ color: '#687e71', fontFamily: 'monospace' }}>
                          {p.accountMask} · {p.ifsc}
                        </small>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div>{p.crop}</div>
                        <small style={{ color: '#687e71' }}>{p.quintals} Qtl @ ₹{p.mspRate}</small>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <strong style={{ fontSize: '14px', color: '#143425' }}>
                          ₹{p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </strong>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <span
                          className={`status-pill ${
                            p.status === 'Disbursed'
                              ? 'paid'
                              : p.status === 'Processing'
                              ? 'processing'
                              : 'flagged'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'right', fontFamily: 'monospace', fontSize: '11.5px', color: '#566b5f' }}>
                        {p.utr || 'Pending Batch'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==========================================================================
            TAB 5: REPORTS & ANALYTICS
            ========================================================================== */}
        {active === 'Reports' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#163628' }}>Procurement & Financial Analytics</h2>
                <p className="muted" style={{ margin: '4px 0 0 0' }}>Seasonal harvest throughput, crop distribution, and quality grading logs.</p>
              </div>
              <button
                className="btn-proc-primary"
                onClick={() => notify('Procurement Consolidated Report 2026 downloaded (PDF)')}
              >
                <Download size={14} /> Download Full Season PDF
              </button>
            </div>

            <div className="admin-grid" style={{ marginBottom: '20px' }}>
              {/* Crop Distribution Panel */}
              <div className="panel" style={{ padding: '20px' }}>
                <div className="panel-head">
                  <div>
                    <h3>Crop Distribution & Value</h3>
                    <p className="muted">Intake tonnage by grain type</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
                  {MOCK_REPORTS.map((r) => (
                    <div key={r.crop}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                        <strong>{r.crop}</strong>
                        <span>{r.tonnage.toLocaleString()} MT ({r.percentage}%) · ₹{r.valueCrores} Cr</span>
                      </div>
                      <div className="capacity-track">
                        <div
                          className="capacity-fill"
                          style={{
                            width: `${r.percentage}%`,
                            background: r.percentage > 50 ? '#16693f' : r.percentage > 20 ? '#1d8a52' : '#e8a83b',
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quality & Turnaround Metrics */}
              <div className="panel" style={{ padding: '20px' }}>
                <div className="panel-head">
                  <div>
                    <h3>Quality & Grading Indicators</h3>
                    <p className="muted">Laboratory moisture testing logs</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                  <div style={{ background: '#f5f8f4', padding: '14px', borderRadius: '10px' }}>
                    <span style={{ fontSize: '11.5px', color: '#687e71' }}>Avg Moisture Grade</span>
                    <strong style={{ display: 'block', fontSize: '22px', color: '#16693f', margin: '4px 0' }}>11.2%</strong>
                    <small style={{ color: '#44564c' }}>Permissible limit: 12.0%</small>
                  </div>
                  <div style={{ background: '#f5f8f4', padding: '14px', borderRadius: '10px' }}>
                    <span style={{ fontSize: '11.5px', color: '#687e71' }}>Grade A Acceptance</span>
                    <strong style={{ display: 'block', fontSize: '22px', color: '#1d8a52', margin: '4px 0' }}>96.4%</strong>
                    <small style={{ color: '#44564c' }}>3.6% re-cleaning req.</small>
                  </div>
                  <div style={{ background: '#f5f8f4', padding: '14px', borderRadius: '10px' }}>
                    <span style={{ fontSize: '11.5px', color: '#687e71' }}>Avg Turnaround Time</span>
                    <strong style={{ display: 'block', fontSize: '22px', color: '#2f6d8c', margin: '4px 0' }}>38 min</strong>
                    <small style={{ color: '#44564c' }}>Gate-in to Gate-out</small>
                  </div>
                  <div style={{ background: '#f5f8f4', padding: '14px', borderRadius: '10px' }}>
                    <span style={{ fontSize: '11.5px', color: '#687e71' }}>Weighbridge Accuracy</span>
                    <strong style={{ display: 'block', fontSize: '22px', color: '#e8a83b', margin: '4px 0' }}>99.98%</strong>
                    <small style={{ color: '#44564c' }}>Certified daily calibration</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {toast && <div className="toast">✓ {toast}</div>}
      </main>
    </div>
  )
}
