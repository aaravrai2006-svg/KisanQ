'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import {
  LayoutDashboard,
  ListOrdered,
  Building2,
  Wallet,
  FileBarChart,
  LogOut,
  ArrowRight,
  ChevronLeft,
  MoreHorizontal,
  Check,
  Clock3,
  IndianRupee,
  Search,
  BadgeCheck,
  TrendingUp,
  Download,
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

export default function AdminPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [active, setActive] = useState('Dashboard')
  const [serving, setServing] = useState('A-030')
  const [toast, setToast] = useState('')

  // State with rich mock data
  const [queueItems, setQueueItems] = useState<QueueItem[]>(MOCK_QUEUE_ITEMS)
  const [centres, setCentres] = useState<CentreItem[]>(MOCK_CENTRES)
  const [payments, setPayments] = useState<PaymentItem[]>(MOCK_PAYMENTS)
  const [queueFilter, setQueueFilter] = useState<string>('All')
  const [queueSearch, setQueueSearch] = useState<string>('')
  const [paymentFilter, setPaymentFilter] = useState<string>('All')

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }

  const handleLogout = () => {
    logout()
    notify('Signed out from Admin Console')
    setTimeout(() => {
      router.push('/admin/login')
    }, 400)
  }

  const handleCallNext = () => {
    const currentNum = Number(serving.slice(2))
    const nextToken = `A-${String(currentNum + 1).padStart(3, '0')}`
    setServing(nextToken)
    notify(`Called Token ${nextToken} to Window 02`)
  }

  const handleStatusChange = (token: string, newStatus: QueueItem['status']) => {
    setQueueItems((prev) =>
      prev.map((item) => (item.token === token ? { ...item, status: newStatus } : item))
    )
    notify(`Token ${token} marked as ${newStatus}`)
  }

  const filteredQueue = queueItems.filter((item) => {
    const matchesFilter = queueFilter === 'All' || item.status === queueFilter
    const matchesSearch =
      item.farmer.toLowerCase().includes(queueSearch.toLowerCase()) ||
      item.token.toLowerCase().includes(queueSearch.toLowerCase()) ||
      item.village.toLowerCase().includes(queueSearch.toLowerCase())
    return matchesFilter && matchesSearch
  })

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

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'rgba(211, 56, 56, 0.15)',
              color: '#ffb3b0',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            <LogOut size={16} /> Sign Out Admin
          </button>
          <Link
            href="/"
            className="back-farmer"
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              color: '#cde2ce',
              fontSize: '12px',
              textDecoration: 'none',
              display: 'block',
            }}
          >
            <ChevronLeft size={14} style={{ verticalAlign: 'middle' }} /> Farmer view
          </Link>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-top">
          <div>
            <p className="eyebrow">TUESDAY, 6 SEPTEMBER 2026 · 10:24 AM</p>
            <h1>{active}</h1>
          </div>
          <div className="admin-user">
            <div className="mini-avatar">{user?.avatar || 'AS'}</div>
            <span>
              <strong>{user?.name || 'Arjun Singh'}</strong>
              <small>{user?.center || 'Dharampur Centre Manager'}</small>
            </span>
            <button onClick={handleLogout} title="Sign Out" aria-label="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* DASHBOARD VIEW */}
        {active === 'Dashboard' && (
          <>
            <div className="admin-stats">
              <div className="stat amber">
                <div className="stat-icon"><ListOrdered size={18} /></div>
                <p>In queue now</p>
                <strong>{queueItems.length}</strong>
                <small>12% less than yesterday</small>
              </div>
              <div className="stat green">
                <div className="stat-icon"><Check size={18} /></div>
                <p>Served today</p>
                <strong>126</strong>
                <small>Of 180 booked tokens</small>
              </div>
              <div className="stat blue">
                <div className="stat-icon"><Clock3 size={18} /></div>
                <p>Avg. wait time</p>
                <strong>24 min</strong>
                <small>6 min better today</small>
              </div>
              <div className="stat purple">
                <div className="stat-icon"><IndianRupee size={18} /></div>
                <p>Pending payments</p>
                <strong>₹24.8L</strong>
                <small>42 farmers queued</small>
              </div>
            </div>

            <div className="admin-grid">
              <div className="panel queue-table">
                <div className="panel-head">
                  <div>
                    <h3>Live queue · {user?.center || 'Dharampur Centre'}</h3>
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
                            onClick={() => notify(`Options opened for ${row.token}`)}
                            aria-label={`More options for ${row.token}`}
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
                    <p className="muted">Farmers served by hour</p>
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

        {/* QUEUE MANAGEMENT VIEW */}
        {active === 'Queue management' && (
          <div className="panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#163628' }}>Live Consignment & Token Management</h2>
                <p className="muted" style={{ margin: '4px 0 0 0' }}>Real-time gate traffic, inspection queue and weighbridge lanes.</p>
              </div>
              <button
                className="primary small"
                onClick={handleCallNext}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                Call Next Farmer ({serving}) <ArrowRight size={14} />
              </button>
            </div>

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

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1.5px solid #dce4d9', color: '#566b5f' }}>
                  <th style={{ padding: '10px' }}>Token</th>
                  <th style={{ padding: '10px' }}>Farmer / Phone</th>
                  <th style={{ padding: '10px' }}>Village</th>
                  <th style={{ padding: '10px' }}>Crop & Quantity</th>
                  <th style={{ padding: '10px' }}>Vehicle</th>
                  <th style={{ padding: '10px' }}>Status</th>
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
                        onClick={() => notify(`Weighment slip printed for ${item.token}`)}
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

        {/* CENTRES VIEW */}
        {active === 'Centres' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#163628' }}>Procurement Centres & Silo Depots</h2>
                <p className="muted" style={{ margin: '4px 0 0 0' }}>Manage intake capacities, active weighing scales, and operational status.</p>
              </div>
              <button
                className="btn-proc-primary"
                onClick={() => notify('Register new centre wizard launched')}
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
                          notify(`Toggled operational status for ${c.name}`)
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

        {/* PAYMENTS VIEW */}
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

            <div className="admin-stats" style={{ marginBottom: '18px' }}>
              <div className="stat green">
                <div className="stat-icon"><BadgeCheck size={18} /></div>
                <p>Total Disbursed Season</p>
                <strong>₹4.82 Cr</strong>
                <small>2,140 farmers credited</small>
              </div>
              <div className="stat amber">
                <div className="stat-icon"><Clock3 size={18} /></div>
                <p>In Bank Batch Today</p>
                <strong>₹24.8 Lakh</strong>
                <small>42 transactions processing</small>
              </div>
              <div className="stat blue">
                <div className="stat-icon"><TrendingUp size={18} /></div>
                <p>Settlement Rate</p>
                <strong>99.2%</strong>
                <small>0.8% KYC flag rate</small>
              </div>
              <div className="stat purple">
                <div className="stat-icon"><IndianRupee size={18} /></div>
                <p>Avg Payout Speed</p>
                <strong>26 Hours</strong>
                <small>Direct to bank</small>
              </div>
            </div>

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

        {/* REPORTS VIEW */}
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
