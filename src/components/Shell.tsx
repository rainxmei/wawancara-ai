import { ReactNode, useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell, Briefcase, Calendar, ChevronDown, ChevronRight, FileText, Users, BarChart3, Search, RotateCcw, Compass, X, Home, UserRound,
  ArrowLeftRight, Info, Check, Wifi, WifiOff, Clock, ListChecks,
} from 'lucide-react'
import { useStore } from '../store'
import { initials } from '../data'

export const Logo = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="currentColor">
    <circle cx="11" cy="9" r="4.2" />
    <circle cx="22" cy="9.5" r="3.7" opacity=".75" />
    <path d="M3 25c0-5 3.6-8 8-8s8 3 8 8zM15 25c.2-4.2 3-6.6 7-6.6s6.8 2.4 7 6.6z" />
  </svg>
)

export function Page({ crumbs, title, sub, code, right, children }: { crumbs?: string[]; title: string; sub?: ReactNode; code?: string; right?: ReactNode; children: ReactNode }) {
  return (
    <>
      {crumbs && (
        <div className="crumbs">
          {crumbs.map((c, i) => (
            <span key={i} style={{ display: 'contents' }}>
              {i > 0 && <ChevronRight size={14} />}
              <span style={i === crumbs.length - 1 ? { color: 'var(--ink3)' } : undefined}>{c}</span>
            </span>
          ))}
        </div>
      )}
      <div className="head-row">
        <div>
          <h1 className="page-title">{title}</h1>
          {sub && <p className="page-sub">{sub}</p>}
        </div>
        {right}
      </div>
      {children}
      {code && <div className="code-tag">{code}</div>}
    </>
  )
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" style={wide ? { width: 'min(980px,100%)' } : undefined} onClick={(e) => e.stopPropagation()}>
        <div className="mh">
          <h2 className="h2">{title}</h2>
          <button className="x" onClick={onClose} aria-label="Tutup">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

const APP_NAV = [
  { to: '/pelamar/lowongan', label: 'Lowongan', icon: Briefcase },
  { to: '/pelamar/lamaran', label: 'Lamaran Saya', icon: FileText },
  { to: '/pelamar/jadwal', label: 'Jadwal Wawancara', icon: Calendar },
]
const HRD_NAV = [
  { to: '/hrd', label: 'Lowongan', icon: Briefcase, end: true },
  { to: '/hrd/lamaran', label: 'Lamaran', icon: Users },
  { to: '/hrd/jadwal', label: 'Jadwal', icon: Calendar },
  { to: '/hrd/tinjauan', label: 'Tinjauan', icon: BarChart3 },
]

export function Shell({ role }: { role: 'pelamar' | 'hrd' }) {
  const { s, set, reset, toastMsg, live } = useStore()
  const nav = useNavigate()
  const loc = useLocation()
  const [menu, setMenu] = useState(false)
  const items: any[] = role === 'pelamar' ? APP_NAV : HRD_NAV
  const immersive = false
  const name = role === 'hrd' ? 'Ni Komang Diah' : s.form.name || 'Abyan Keane'
  const sub = role === 'hrd' ? 'HRD' : 'Pelamar'

  useEffect(() => {
    window.scrollTo(0, 0)
    setMenu(false)
  }, [loc.pathname])

  return (
    <div className="app">
      <div className="sim-banner">
        <Info size={14} />
        <span>
          <b>Simulasi interaktif</b> · Tampilan seperti produk jadi, namun belum ada AI sungguhan. Semua jawaban, skor, dan data adalah contoh.
        </span>
        <button onClick={() => set({ guideOpen: true })}>Panduan demo</button>
      </div>
      <header className="topbar">
        <Link to="/" className="brand" title="Kembali ke beranda simulasi">
          <Logo />
          Ruang Wawancara
        </Link>
        <div className="top-right">
          <button className="bell" aria-label="Notifikasi" onClick={() => set({ guideOpen: true })}>
            <Bell size={22} />
            <i />
          </button>
          <div className="user" onClick={() => setMenu(!menu)}>
            <div className="avatar-i">{initials(name)}</div>
            <div className="meta">
              <b>{name}</b>
              <span>{sub}</span>
            </div>
            <ChevronDown size={18} color="#55557a" />
            {menu && (
              <div className="menu" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => nav(role === 'hrd' ? '/pelamar/lowongan' : '/hrd')}>
                  <ArrowLeftRight size={16} /> Beralih ke sisi {role === 'hrd' ? 'Pelamar' : 'HRD'}
                </button>
                <button onClick={() => (set({ guideOpen: true }), setMenu(false))}>
                  <Compass size={16} /> Panduan demo
                </button>
                <hr />
                <button
                  onClick={() => {
                    reset()
                    setMenu(false)
                    nav('/')
                  }}
                >
                  <RotateCcw size={16} /> Atur ulang simulasi
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="body">
        {!immersive && (
          <aside className="side">
            {items.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => 'nav' + (isActive ? ' active' : '')}>
                <n.icon size={22} strokeWidth={1.8} />
                {n.label}
              </NavLink>
            ))}
            <div className="foot">Rancangan • Data contoh</div>
          </aside>
        )}
        <main className="main">
          <Outlet />
        </main>
      </div>
      <Guide />
      {toastMsg && (
        <div className="toast">
          <Check size={18} color="#86efac" />
          {toastMsg}
        </div>
      )}
    </div>
  )
}

export function Guide() {
  const { s, set, reset, live } = useStore()
  const nav = useNavigate()
  const go = (to: string) => {
    nav(to)
    set({ guideOpen: false })
  }
  return (
    <>
      <button className="guide-fab" onClick={() => set({ guideOpen: !s.guideOpen })}>
        <Compass size={18} />
        Panduan demo
      </button>
      {s.guideOpen && (
        <div className="guide">
          <div className="row">
            <h3>Panduan mencoba simulasi</h3>
            <span className="sp" />
            <button className="btn out sm" style={{ height: 32, padding: '0 10px' }} onClick={() => set({ guideOpen: false })}>
              <X size={16} />
            </button>
          </div>
          <p className="small muted" style={{ marginTop: 6 }}>
            Ikuti urutan 1–7 untuk merasakan alur penuh dari sisi pelamar, lalu lihat hasilnya di sisi HRD.
          </p>
          <div className="grp">Alur utama (pelamar)</div>
          {[
            ['Lihat lowongan & daftar', '/pelamar/lowongan'],
            ['Isi data & unggah CV', '/pelamar/daftar'],
            ['Periksa hasil pembacaan CV', '/pelamar/periksa-cv'],
            ['Pilih slot wawancara', '/pelamar/jadwal'],
            ['Tes perangkat', '/pelamar/persiapan'],
            ['Wawancara dengan avatar AI', '/pelamar/wawancara'],
          ].map(([l, to], i) => (
            <button key={to} className="gi" onClick={() => go(to)}>
              <span className="no">{i + 1}</span>
              {l}
            </button>
          ))}
          <div className="grp">Sisi HRD</div>
          <button className="gi" onClick={() => go('/hrd')}>
            <span className="no">7</span>Dashboard lowongan
          </button>
          <button className="gi" onClick={() => go('/hrd/lamaran')}>
            <span className="no">8</span>Lamaran masuk → laporan bukti → keputusan
          </button>
          <div className="grp">Skenario khusus</div>
          <button className="gi" onClick={() => (set({ allFull: true, slot: null, waitlist: false }), go('/pelamar/slot-penuh'))}>
            <Clock size={16} /> Semua slot penuh & daftar tunggu
          </button>
          <button className="gi" onClick={() => go('/pelamar/terputus')}>
            <WifiOff size={16} /> Koneksi terputus saat sesi
          </button>
          <button className="gi" onClick={() => (set({ periodEnded: true }), go('/pelamar/periode-berakhir'))}>
            <ListChecks size={16} /> Periode wawancara berakhir
          </button>
          <button className="gi" onClick={() => go('/hrd/laporan/sari')}>
            <FileText size={16} /> Laporan contoh (Sari Putri)
          </button>
          <div className="grp">Pengaturan</div>
          <button
            className="gi"
            onClick={() => {
              reset()
              go('/')
            }}
          >
            <RotateCcw size={16} /> Atur ulang seluruh simulasi
          </button>
        </div>
      )}
    </>
  )
}
