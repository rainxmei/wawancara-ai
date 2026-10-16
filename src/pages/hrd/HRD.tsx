import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Plus, Briefcase, Building2, MapPin, Settings, Users, FileText, Sparkles, Calendar, BarChart3, CheckCircle2, Clock, Info, Code2, Database, Bug,
  Quote, AlertTriangle, Play, ArrowRight, ArrowLeft, Search, Flag, ShieldCheck, Check, Layers, Mail, Phone, ChevronRight, Loader2,
} from 'lucide-react'
import { Page, Modal } from '../../components/Shell'
import { FakePlayer } from '../../components/media'
import { useStore } from '../../store'
import { Applicant, COMPANY, COMPS, CV, CompKey, JOB, evaluate, initials, levelOf, turnText } from '../../data'

const CIcon = ({ k, size = 22 }: { k: string; size?: number }) => (k === 'api' ? <Code2 size={size} /> : k === 'db' ? <Database size={size} /> : <Bug size={size} />)

/* ---------- H01: Dashboard lowongan ---------- */
export function Dashboard() {
  const nav = useNavigate()
  const { applicants, s } = useStore()
  const done = applicants.filter((a) => a.status === 'Selesai').length
  const wait = applicants.filter((a) => a.decision === 'Menunggu tinjauan HRD').length
  return (
    <Page title="Lowongan perusahaan" sub={<>{COMPANY.name}<br /><span className="muted small">Kelola lowongan, pantau pelamar, dan lanjutkan ke proses wawancara dengan Ruang Wawancara.</span></>} code="H01 • Dashboard lowongan" right={<button className="btn" style={{ height: 56 }} onClick={() => nav('/hrd/lowongan/baru')}><Plus size={20} /> Buat lowongan</button>}>
      <div className="card row wrap" style={{ gap: 24 }}>
        <div className="ico" style={{ width: 88, height: 88, borderRadius: 18 }}>
          <Code2 size={40} />
        </div>
        <div style={{ flex: 1, minWidth: 260 }}>
          <div className="row">
            <h2 style={{ fontSize: 28, fontWeight: 800 }}>{JOB.title}</h2>
            <span className="badge ok">
              <i style={{ width: 8, height: 8, background: '#16a34a', borderRadius: '50%' }} /> Pendaftaran dibuka
            </span>
          </div>
          <p className="muted">Pengembangan API dan database</p>
          <div className="meta-row small" style={{ marginTop: 8 }}>
            <span>
              <Building2 size={16} /> {COMPANY.name}
            </span>
            <span>
              <MapPin size={16} /> Jakarta (Hybrid)
            </span>
            <span>
              <Briefcase size={16} /> Teknologi Informasi
            </span>
          </div>
        </div>
        <div className="row wrap">
          <Link to="/pelamar/lowongan" className="btn out">
            <Users size={18} /> Lihat halaman pelamar
          </Link>
          <Link to="/hrd/lowongan/baru" className="btn out">
            <Settings size={18} /> Atur lowongan
          </Link>
        </div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', margin: '20px 0', gap: 16 }}>
        {[
          ['Lamaran masuk', applicants.length, Users],
          ['Wawancara selesai', done, CheckCircle2],
          ['Menunggu tinjauan', wait, Clock],
          ['Dengan flag terbuka', applicants.filter((a) => a.turns && evaluate(a.turns).flags.some((f) => !s.resolvedFlags.includes(`${a.id}:${f.id}`))).length, Flag],
        ].map(([l, v, I]: any) => (
          <div className="card" key={l} style={{ padding: 18 }}>
            <div className="row">
              <div className="ico xs">
                <I size={18} />
              </div>
              <span className="muted small">{l}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, marginTop: 6 }}>{v}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <h2>Alur proses rekrutmen di Ruang Wawancara</h2>
        <p className="muted small">Dari pembuatan lowongan hingga tinjauan oleh HRD, semua dalam satu platform.</p>
        <div className="row" style={{ marginTop: 22, alignItems: 'flex-start', justifyContent: 'space-between' }}>
          {[
            [FileText, 'Lowongan', 'Buat dan kelola lowongan perusahaan', '/hrd/lowongan/baru'],
            [Sparkles, 'Wawancara AI', 'Pelamar mengikuti wawancara dengan AI', '/hrd/jadwal'],
            [FileText, 'Laporan bukti', 'Dapatkan ringkasan hasil wawancara dalam bentuk laporan', '/hrd/lamaran'],
            [Users, 'Tinjauan HRD', 'HRD meninjau laporan dan melanjutkan proses', '/hrd/tinjauan'],
          ].map(([I, t, d, to]: any, i, a) => (
            <div key={t} style={{ display: 'contents' }}>
              <Link to={to} style={{ textAlign: 'center', flex: 1, color: 'var(--ink)' }}>
                <div className="ico" style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 10px' }}>
                  <I size={32} />
                </div>
                <b style={{ fontSize: 17 }}>{t}</b>
                <div className="muted small" style={{ maxWidth: 200, margin: '4px auto 0' }}>
                  {d}
                </div>
              </Link>
              {i < a.length - 1 && <ArrowRight size={26} color="#b4b4d0" style={{ marginTop: 28 }} />}
            </div>
          ))}
        </div>
      </div>
    </Page>
  )
}

/* ---------- H02: Buat lowongan ---------- */
export function BuatLowongan() {
  const nav = useNavigate()
  const { toast } = useStore()
  const [f, setF] = useState({ pos: JOB.title, co: COMPANY.name, loc: 'Malang', mode: 'Hybrid', desc: JOB.desc.slice(0, 2).join('\n'), open: '', close: '', iv: '' })
  const up = (k: string, v: string) => setF((x) => ({ ...x, [k]: v }))
  return (
    <Page crumbs={['Lowongan', 'Buat lowongan']} title="Buat lowongan" sub="Lengkapi informasi pekerjaan. Setelah disimpan, Anda dapat menyusun kompetensi untuk proses wawancara." code="H02 • Pengaturan lowongan">
      <div className="grid cols" style={{ gridTemplateColumns: '1.35fr 1fr', alignItems: 'start' }}>
        <div className="card">
          <h2>Informasi lowongan</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr', gap: 14, alignItems: 'center', marginTop: 16 }}>
            <label className="f" style={{ margin: 0 }}>Nama posisi <em>*</em></label>
            <input className="input" value={f.pos} onChange={(e) => up('pos', e.target.value)} />
            <label className="f" style={{ margin: 0 }}>Nama perusahaan <em>*</em></label>
            <input className="input" value={f.co} onChange={(e) => up('co', e.target.value)} />
          </div>
          <div className="two" style={{ marginTop: 16 }}>
            <div>
              <label className="f">Lokasi kerja <em>*</em></label>
              <select className="select input" value={f.loc} onChange={(e) => up('loc', e.target.value)}>
                {['Malang', 'Jakarta', 'Surabaya', 'Bandung'].map((x) => <option key={x}>{x}</option>)}
              </select>
            </div>
            <div>
              <label className="f">Sistem kerja <em>*</em></label>
              <select className="select input" value={f.mode} onChange={(e) => up('mode', e.target.value)}>
                {['Hybrid', 'Onsite', 'Remote'].map((x) => <option key={x}>{x}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label className="f">Deskripsi pekerjaan <em>*</em></label>
            <textarea className="input" rows={5} maxLength={1000} value={f.desc} onChange={(e) => up('desc', e.target.value)} />
            <div className="tiny" style={{ textAlign: 'right' }}>{f.desc.length}/1000</div>
          </div>
          <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '14px 0' }} />
          <h3 className="h3">Jadwal rekrutmen</h3>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginTop: 12 }}>
            {[['open', 'Tanggal buka'], ['close', 'Tanggal tutup pendaftaran'], ['iv', 'Tenggat wawancara']].map(([k, l]) => (
              <div key={k}>
                <label className="f">{l} <em>*</em></label>
                <input type="date" className="input" value={(f as any)[k]} onChange={(e) => up(k, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="notice" style={{ marginTop: 14 }}>
            <Info size={18} /> Untuk MVP, periode pendaftaran dan tenggat wawancara dapat memakai waktu penutupan yang sama.
          </div>
          <div className="row" style={{ marginTop: 18 }}>
            <button className="btn" onClick={() => nav('/hrd/kompetensi')}>Simpan dan susun kompetensi</button>
            <button className="btn out" onClick={() => toast('Draft disimpan.')}>Simpan draft</button>
          </div>
        </div>
        <div className="card">
          <div className="row">
            <div>
              <h2>Halaman pelamar</h2>
              <p className="muted small">Berikut tampilan lowongan yang akan dilihat oleh pelamar.</p>
            </div>
            <span className="sp" />
            <span className="badge pri">Draft</span>
          </div>
          <div style={{ border: '1px solid var(--line)', borderRadius: 14, padding: 20, marginTop: 14 }}>
            <div className="row">
              <div className="ico sm"><Building2 size={22} /></div>
              <div>
                <b>{f.co}</b>
                <div className="muted small">{f.loc} • {f.mode}</div>
              </div>
            </div>
            <h3 style={{ fontSize: 30, fontWeight: 800, margin: '14px 0', letterSpacing: -0.6 }}>{f.pos}</h3>
            <div className="meta-row small">
              <span><MapPin size={15} /> {f.loc}</span>
              <span><Briefcase size={15} /> {f.mode}</span>
              <span><Building2 size={15} /> {f.co}</span>
            </div>
            <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '14px 0' }} />
            <b>Deskripsi pekerjaan</b>
            <p className="muted small" style={{ whiteSpace: 'pre-line', marginTop: 6 }}>{f.desc}</p>
            <div className="notice" style={{ marginTop: 12 }}>
              <Info size={16} /> Tahap awal menggunakan AI. Keputusan akhir diperiksa manusia.
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

/* ---------- Kompetensi & rubrik ---------- */
export function Kompetensi() {
  const nav = useNavigate()
  const { s, set, toast } = useStore()
  const [gen, setGen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [req, setReq] = useState<Record<string, boolean>>({ api: true, db: true, debug: false })
  const suggest = () => {
    setBusy(true)
    setTimeout(() => (setBusy(false), setGen(true)), 1400)
  }
  return (
    <Page crumbs={['Lowongan', 'Backend Developer', 'Kompetensi & rubrik']} title="Kompetensi dan rubrik" sub="AI mengusulkan kompetensi dari deskripsi pekerjaan. HRD memeriksa, mengubah, dan menyetujui sebelum dipublikasikan." code="H03 • Kompetensi dan rubrik">
      <div className="grid cols" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'start' }}>
        <div className="grid">
          {!gen ? (
            <div className="card" style={{ textAlign: 'center', padding: 36 }}>
              <div className="ico" style={{ margin: '0 auto 12px' }}><Sparkles size={26} /></div>
              <h2>Susun kompetensi dari deskripsi pekerjaan</h2>
              <p className="muted" style={{ maxWidth: 480, margin: '6px auto 16px' }}>Pada simulasi ini hasil usulan berupa data contoh, bukan keluaran model sungguhan.</p>
              <button className="btn" onClick={suggest} disabled={busy}>
                {busy ? <><Loader2 size={18} className="spin-i" /> Menyusun usulan…</> : <><Sparkles size={18} /> Usulkan kompetensi dengan AI</>}
              </button>
            </div>
          ) : (
            (Object.keys(COMPS) as CompKey[]).map((k) => (
              <div className="card" key={k}>
                <div className="row">
                  <div className="ico sm"><CIcon k={k} /></div>
                  <div style={{ flex: 1 }}>
                    <h3 className="h3">{COMPS[k].name}</h3>
                    <div className="muted small">{COMPS[k].desc}</div>
                  </div>
                  <select className="select input" style={{ width: 150, height: 40 }} value={req[k] ? 'wajib' : 'pendukung'} onChange={(e) => setReq({ ...req, [k]: e.target.value === 'wajib' })}>
                    <option value="wajib">Wajib</option>
                    <option value="pendukung">Pendukung</option>
                  </select>
                </div>
                <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
                  {COMPS[k].indicators.map((ind) => (
                    <label key={ind} className="check" style={{ alignItems: 'center', color: 'var(--ink)' }}>
                      <input type="checkbox" defaultChecked /> {ind}
                    </label>
                  ))}
                </div>
                <div className="notice" style={{ marginTop: 12 }}>
                  <Quote size={16} />
                  <div className="small">
                    <b>Contoh bukti yang memenuhi tingkat “Cukup”</b>
                    {k === 'api' ? 'Menyebut peran pribadi, teknologi, dan tindakan nyata (endpoint, validasi, pengujian).' : k === 'db' ? 'Menjelaskan alasan optimasi dan dasar pengukuran sebelum–sesudah.' : 'Menjelaskan langkah menelusuri akar masalah dan alat bantu yang dipakai.'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="grid">
          <div className="card">
            <h2>Rubrik & versi</h2>
            <div className="row" style={{ marginTop: 12 }}>
              <span className="badge ok"><CheckCircle2 size={14} /> v1 · {gen ? 'siap disetujui' : 'belum disusun'}</span>
            </div>
            <p className="muted small" style={{ marginTop: 10 }}>Rubrik yang sudah dipakai diberi versi. Perubahan tidak diam-diam menggantikan dasar wawancara sebelumnya.</p>
            <div className="notice warn" style={{ marginTop: 12 }}>
              <Info size={18} />
              <div>
                <b>Metode skoring belum ditetapkan</b>
                Skala, bobot, dan ambang resmi menunggu kajian bersama HRD/pakar. Di simulasi, skor ditampilkan sebagai contoh bertanda “Skor simulasi”.
              </div>
            </div>
            <h3 className="h3" style={{ marginTop: 16 }}>Pertanyaan inti</h3>
            <ol className="small muted" style={{ paddingLeft: 18, display: 'grid', gap: 6, marginTop: 8 }}>
              <li>Ceritakan proyek API yang Anda tulis di CV. Bagian mana yang Anda kerjakan sendiri?</li>
              <li>Bagaimana Anda mendesain dan mengoptimalkan database untuk trafik tinggi?</li>
              <li>Ceritakan satu kasus debugging yang paling menantang.</li>
            </ol>
            <button className="btn block" style={{ marginTop: 16 }} disabled={!gen} onClick={() => (toast('Kompetensi dan rubrik v1 disetujui.'), nav('/hrd/jadwal'))}>
              Setujui dan lanjut ke jadwal <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </Page>
  )
}

/* ---------- H04: Jadwal dan aturan ---------- */
const OPTS = {
  think: ['Belum ditetapkan', '30 detik', '45 detik', '60 detik'],
  answer: ['Belum ditetapkan', '2 menit', '3 menit', '5 menit'],
  fix: ['Belum ditetapkan', '30 detik', '60 detik', '90 detik'],
  follow: ['Belum ditetapkan', '1 per kompetensi', '2 per kompetensi', '3 per kompetensi'],
}
export function JadwalHRD() {
  const { toast, set } = useStore()
  const nav = useNavigate()
  const [f, setF] = useState<any>({ start: '', end: '', cap: '', think: OPTS.think[0], answer: OPTS.answer[0], fix: OPTS.fix[0], follow: OPTS.follow[0] })
  const [err, setErr] = useState('')
  const up = (k: string, v: string) => setF((x: any) => ({ ...x, [k]: v }))
  const sample = () => setF({ start: '2025-04-21', end: '2025-04-25', cap: '1', think: OPTS.think[2], answer: OPTS.answer[2], fix: OPTS.fix[2], follow: OPTS.follow[2] })
  const missing = [f.start, f.end, f.cap].some((x) => !x) || [f.think, f.answer, f.fix, f.follow].some((x) => x === 'Belum ditetapkan')
  const row = (l: string, v: string) => (
    <div className="row" style={{ padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
      <Clock size={18} color="#55557a" />
      <span style={{ flex: 1 }}>{l}</span>
      <span className="muted small">{v || 'Belum ditetapkan'}</span>
    </div>
  )
  return (
    <Page crumbs={['Jadwal', 'Buat jadwal dan aturan']} title="Jadwal dan aturan wawancara" sub="Atur periode, sesi, dan ketentuan wawancara untuk lowongan. Setelah dipublikasikan, kandidat dapat memilih jadwal sesuai ketersediaan." code="H04 • Jadwal dan aturan" right={<button className="btn out sm" onClick={sample}>Isi nilai contoh</button>}>
      <div className="grid cols" style={{ gridTemplateColumns: '1.8fr 1fr', alignItems: 'start' }}>
        <div className="card">
          <h2>Informasi lowongan</h2>
          <div className="row" style={{ background: 'var(--primary-soft2)', border: '1px solid var(--line)', borderRadius: 12, padding: 14, margin: '12px 0 20px' }}>
            <div className="ico xs"><Building2 size={18} /></div>
            <div><b>{JOB.title}</b><div className="muted small">Malang • Hybrid • {COMPANY.name}</div></div>
          </div>
          <h3 className="h3">Periode wawancara</h3>
          <p className="muted small">Tentukan rentang tanggal pelaksanaan wawancara.</p>
          <div className="two" style={{ marginTop: 10 }}>
            <div><label className="f">Tanggal mulai <em>*</em></label><input type="date" className="input" value={f.start} onChange={(e) => up('start', e.target.value)} /></div>
            <div><label className="f">Tanggal selesai <em>*</em></label><input type="date" className="input" value={f.end} onChange={(e) => up('end', e.target.value)} /></div>
            <div>
              <label className="f">Jam operasional server <em>*</em></label>
              <div className="tiny" style={{ marginBottom: 6 }}>Kandidat memilih slot dalam jam operasional server.</div>
              <input className="input" value="09.00 – 16.00" readOnly />
            </div>
            <div>
              <label className="f">Kapasitas sesi <em>*</em></label>
              <div className="tiny" style={{ marginBottom: 6 }}>Sesi bersamaan dibatasi sesuai hasil pengujian.</div>
              <select className="select input" value={f.cap} onChange={(e) => up('cap', e.target.value)}>
                <option value="">Ditentukan pengelola setelah pengujian</option>
                <option value="1">1 sesi bersamaan (prototipe)</option>
                <option value="2">2 sesi bersamaan</option>
              </select>
            </div>
          </div>
          <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '20px 0' }} />
          <h3 className="h3">Aturan sesi wawancara</h3>
          <p className="muted small">Tetapkan durasi dan batasan untuk setiap sesi.</p>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginTop: 10 }}>
            {[['think', 'Waktu berpikir'], ['answer', 'Waktu menjawab'], ['fix', 'Waktu koreksi transkrip'], ['follow', 'Batas pertanyaan lanjutan']].map(([k, l]) => (
              <div key={k}>
                <label className="f" style={{ fontSize: 13.5 }}>{l} <em>*</em></label>
                <select className="select input" style={{ height: 44, fontSize: 14 }} value={f[k]} onChange={(e) => up(k, e.target.value)}>
                  {(OPTS as any)[k].map((o: string) => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="notice" style={{ marginTop: 16 }}><Info size={18} /> Penjadwalan ulang hanya sebelum tenggat.</div>
          {err && <div className="err" style={{ marginTop: 10 }}>{err}</div>}
          <div className="row" style={{ marginTop: 16 }}>
            <button className="btn" onClick={() => {
              if (missing) return setErr('Lengkapi seluruh periode, kapasitas, dan aturan sesi sebelum publikasi (atau klik “Isi nilai contoh”).')
              setErr('')
              set({ hrdJobPublished: true })
              toast('Lowongan dipublikasikan. Tautan pendaftaran siap dibagikan.')
              nav('/hrd')
            }}>Publikasikan lowongan</button>
            <button className="btn out" onClick={() => toast('Draft disimpan.')}>Simpan draft</button>
          </div>
        </div>
        <div className="card">
          <h2>Ringkasan pengaturan</h2>
          <p className="muted small">Berikut ringkasan jadwal dan aturan yang akan dipublikasikan.</p>
          <div style={{ marginTop: 8 }}>
            {row('Periode wawancara', f.start && f.end ? `${f.start} → ${f.end}` : '')}
            {row('Jam operasional server', '09.00 – 16.00')}
            {row('Kapasitas sesi', f.cap ? `${f.cap} sesi bersamaan` : 'Ditentukan pengelola setelah pengujian')}
            {row('Waktu berpikir', f.think)}
            {row('Waktu menjawab', f.answer)}
            {row('Waktu koreksi transkrip', f.fix)}
            {row('Batas pertanyaan lanjutan', f.follow)}
          </div>
          {!missing && (
            <div className="notice ok" style={{ marginTop: 14 }}>
              <CheckCircle2 size={18} />
              <div className="small"><b>Ilustrasi slot</b>Jika satu sesi ±20 menit dengan cadangan 10 menit, slot dibuka tiap 30 menit: 14 slot/hari pada jam operasional. Angka final menunggu pengujian perangkat.</div>
            </div>
          )}
        </div>
      </div>
    </Page>
  )
}

/* ---------- H05: Daftar lamaran ---------- */
const statusBadge = (st: string) => (st === 'Selesai' ? 'info' : st === 'Tidak selesai' ? 'warn' : st === 'Terputus' ? 'bad' : st === 'Terjadwal' || st === 'Wawancara berlangsung' ? 'pri' : 'gray')
const decBadge = (d: string) => (d === 'Menunggu tinjauan HRD' ? 'warn' : d === 'Lanjut tahap berikutnya' ? 'ok' : d === 'Perlu pemeriksaan' ? 'info' : d === 'Tidak dilanjutkan' ? 'bad' : 'gray')
export function Lamaran() {
  const { applicants } = useStore()
  const [q, setQ] = useState('')
  const [st, setSt] = useState('Semua status')
  const [dc, setDc] = useState('Semua status')
  const rows = applicants.filter((a) => (!q || (a.name + a.email).toLowerCase().includes(q.toLowerCase())) && (st === 'Semua status' || a.status === st) && (dc === 'Semua status' || a.decision === dc))
  return (
    <Page crumbs={['Lamaran', 'Backend Developer']} title="Lamaran masuk" sub={`Lihat dan kelola lamaran untuk posisi ${JOB.title} di ${COMPANY.name}.`} code="H05 • Daftar lamaran">
      <div className="card row wrap" style={{ marginBottom: 16 }}>
        <div className="ico"><Building2 size={26} /></div>
        <div>
          <h3 style={{ fontSize: 22, fontWeight: 800 }}>{JOB.title}</h3>
          <div className="meta-row small"><span>{COMPANY.name}</span><span>Malang</span><span>Hybrid</span></div>
        </div>
        <span className="sp" />
        <Link to="/pelamar/lowongan" className="btn out sm">Lihat detail lowongan</Link>
      </div>
      <div className="card row wrap" style={{ marginBottom: 16, alignItems: 'flex-end' }}>
        <div className="input-ic" style={{ flex: 1, minWidth: 220 }}>
          <Search size={18} />
          <input className="input" placeholder="Cari nama pelamar atau kata kunci..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div style={{ width: 230 }}>
          <label className="f small">Status wawancara</label>
          <select className="select input" value={st} onChange={(e) => setSt(e.target.value)}>
            {['Semua status', 'Data perlu konfirmasi', 'Siap memilih jadwal', 'Terjadwal', 'Wawancara berlangsung', 'Terputus', 'Selesai', 'Daftar tunggu', 'Tidak selesai'].map((x) => <option key={x}>{x}</option>)}
          </select>
        </div>
        <div style={{ width: 230 }}>
          <label className="f small">Tindak lanjut</label>
          <select className="select input" value={dc} onChange={(e) => setDc(e.target.value)}>
            {['Semua status', 'Menunggu tinjauan HRD', 'Lanjut tahap berikutnya', 'Perlu pemeriksaan', 'Tidak dilanjutkan'].map((x) => <option key={x}>{x}</option>)}
          </select>
        </div>
      </div>
      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead><tr><th>Pelamar</th><th>Dokumen</th><th>Wawancara</th><th>Tindak lanjut</th><th>Aksi</th></tr></thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id}>
                <td>
                  <div className="row">
                    <div className="avatar-i" style={{ width: 48, height: 48 }}>{initials(a.name)}</div>
                    <div>
                      <b>{a.name}</b> {a.live && <span className="badge pri" style={{ padding: '1px 8px', fontSize: 11.5 }}>Anda</span>}
                      <div className="muted small">{a.email}</div>
                    </div>
                  </div>
                </td>
                <td><span className="badge ok"><FileText size={14} /> CV tersedia</span></td>
                <td><span className={'badge ' + statusBadge(a.status)}>{a.status === 'Selesai' && <CheckCircle2 size={14} />}{a.status === 'Tidak selesai' ? 'Tidak selesai — melewati batas waktu' : a.status}</span></td>
                <td><span className={'badge ' + decBadge(a.decision)}>{a.decision === '—' ? 'Belum ada' : a.decision}</span></td>
                <td>{a.turns && a.turns.length ? <Link to={`/hrd/laporan/${a.id}`} className="btn sm">Buka laporan</Link> : <button className="btn out sm" disabled>Belum ada laporan</button>}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="muted" style={{ textAlign: 'center', padding: 30 }}>Tidak ada lamaran yang cocok.</td></tr>}
          </tbody>
        </table>
        <div className="notice" style={{ marginTop: 12 }}><Info size={18} /> Semua pelamar mendapat kesempatan wawancara tanpa pemeringkatan kualitas CV.</div>
      </div>
    </Page>
  )
}

/* ---------- Tinjauan (antrian) ---------- */
export function Tinjauan() {
  const { applicants, s } = useStore()
  const rows = applicants.filter((a) => a.turns && a.turns.length)
  return (
    <Page crumbs={['Tinjauan']} title="Antrian tinjauan" sub="Laporan wawancara yang siap diperiksa. Flag dan sumber harus ditinjau sebelum keputusan." code="H05b • Tinjauan">
      <div className="grid" style={{ gap: 14 }}>
        {rows.length === 0 && <div className="card muted">Belum ada laporan. Selesaikan wawancara di sisi pelamar atau buka laporan contoh.</div>}
        {rows.map((a) => {
          const ev = evaluate(a.turns!)
          const open = ev.flags.filter((f) => !s.resolvedFlags.includes(`${a.id}:${f.id}`)).length
          return (
            <div className="card row wrap" key={a.id}>
              <div className="avatar-i" style={{ width: 52, height: 52 }}>{initials(a.name)}</div>
              <div style={{ flex: 1 }}>
                <b style={{ fontSize: 17 }}>{a.name}</b> {a.live && <span className="badge pri">Anda</span>}
                <div className="muted small">{JOB.title} • {a.decision}</div>
              </div>
              <span className={'badge ' + (open ? 'warn' : 'ok')}><Flag size={14} /> {open ? `${open} flag perlu diperiksa` : 'Flag sudah diperiksa'}</span>
              <span className="badge gray">Skor simulasi: {ev.overall ?? '—'}</span>
              <Link to={`/hrd/laporan/${a.id}`} className="btn sm">Buka laporan</Link>
            </div>
          )
        })}
      </div>
    </Page>
  )
}

/* ---------- Util laporan ---------- */
function useApplicant(id?: string): Applicant | undefined {
  const { applicants } = useStore()
  return applicants.find((a) => a.id === id)
}

/* ---------- H06: Laporan wawancara ---------- */
export function Laporan() {
  const { id } = useParams()
  const a = useApplicant(id)
  const { s, set, toast } = useStore()
  const nav = useNavigate()
  const [modal, setModal] = useState<'cv' | 'tx' | 'rec' | null>(null)
  const ev = useMemo(() => (a?.turns ? evaluate(a.turns) : null), [a])
  if (!a || !a.turns || !ev)
    return (
      <Page crumbs={['Tinjauan', 'Laporan wawancara']} title="Laporan wawancara">
        <div className="card">Laporan belum tersedia untuk pelamar ini. <Link to="/hrd/lamaran">Kembali ke daftar</Link></div>
      </Page>
    )
  const isDone = (fid: string) => s.resolvedFlags.includes(`${a.id}:${fid}`)
  const toggle = (fid: string) => {
    const k = `${a.id}:${fid}`
    set({ resolvedFlags: s.resolvedFlags.includes(k) ? s.resolvedFlags.filter((x) => x !== k) : [...s.resolvedFlags, k] })
  }
  const flags = ev.flags
  const openCount = flags.filter((f) => !isDone(f.id)).length
  const statusChip = (st: string) =>
    st === 'tersedia' ? <span className="badge ok"><CheckCircle2 size={14} /> Bukti jawaban tersedia</span> : st === 'tinjau' ? <span className="badge warn"><Clock size={14} /> Perlu tinjauan</span> : <span className="badge gray">— Belum diperiksa</span>
  return (
    <Page crumbs={['Tinjauan', 'Laporan wawancara']} title="Laporan wawancara" sub="Ringkasan hasil wawancara dan bukti jawaban kandidat." code="H06 • Laporan bukti"
      right={<div className="card row" style={{ padding: '14px 20px' }}><div className="ico xs"><Briefcase size={18} /></div><div><b>{JOB.title}</b><div className="muted small">{COMPANY.name} • Malang • Hybrid</div></div></div>}>
      <div className="card row wrap" style={{ gap: 30, marginBottom: 18 }}>
        <div className="avatar-i" style={{ width: 70, height: 70, fontSize: 24 }}>{initials(a.name)}</div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800 }}>{a.name}</h2>
          <div className="meta-row small" style={{ marginTop: 4 }}><span><Mail size={15} /> {a.email || '—'}</span><span><Phone size={15} /> {a.phone || '—'}</span></div>
        </div>
        <div className="row"><Calendar size={26} color="#55557a" /><div><div className="tiny">Tanggal wawancara</div><b>{a.date !== '—' ? a.date : 'Hari ini'}</b></div></div>
        <div className="row"><Users size={26} color="#55557a" /><div><div className="tiny">Pewawancara</div><b>AI lokal</b><div className="tiny">Wawancara awal</div></div></div>
      </div>

      <div className="card">
        <div className="row wrap" style={{ alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <h2>Peta bukti kompetensi</h2>
            <p className="muted small">Ringkasan jawaban kandidat berdasarkan transkrip dan rekaman wawancara.</p>
          </div>
          <div className="notice warn" style={{ maxWidth: 440 }}>
            <BarChart3 size={22} />
            <div>
              <b>Skor simulasi: {ev.overall ?? '—'} / 100 <span className="sim-tag" style={{ marginLeft: 6 }}>Contoh</span></b>
              <span className="small">Metode skoring final (skala, bobot, ambang) belum ditetapkan. Angka ini dihitung dengan aturan sederhana untuk demonstrasi.</span>
            </div>
          </div>
        </div>
        <div className="comp-grid" style={{ marginTop: 16 }}>
          {ev.comps.map((c) => (
            <div className="comp" key={c.key}>
              <div className="row">
                <div className="ico xs"><CIcon k={c.key} /></div>
                <b style={{ fontSize: 17 }}>{COMPS[c.key].name}</b>
              </div>
              <div>{statusChip(c.status)}</div>
              <p className="muted small">{COMPS[c.key].desc}</p>
              <div className="quote"><Quote size={18} /><span>{c.quote}</span></div>
              <div className="tiny" style={{ display: 'flex', gap: 6, alignItems: 'center' }}><FileText size={13} /> {c.source}</div>
              {c.issue && <div className="notice warn" style={{ padding: '10px 12px' }}><AlertTriangle size={16} /><div className="small"><b>{c.key === 'db' ? 'Dasar pengukuran belum cukup' : 'Bukti belum cukup'}</b>{c.issue}</div></div>}
              <div style={{ marginTop: 'auto' }}>
                {c.score != null ? (
                  <div className="score">
                    <span className="num">{c.score}</span>
                    <div style={{ flex: 1 }}>
                      <div className="bar"><i style={{ width: `${c.score}%` }} /></div>
                      <div className="tiny" style={{ marginTop: 3 }}>{levelOf(c.score)} · <span className="sim-tag">Skor simulasi</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="tiny">Skor: belum diperiksa (bukan nilai rendah)</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <div className="row">
          <h2>AI flag & human escalation</h2>
          <span className="sp" />
          <span className={'badge ' + (openCount ? 'warn' : 'ok')}><Flag size={14} /> {openCount ? `${openCount} perlu diperiksa` : 'Semua sudah diperiksa'}</span>
        </div>
        <p className="muted small">Flag diberikan pada bagian tertentu, bukan pada seluruh kandidat. Tinjauan dilakukan setelah sesi.</p>
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          {flags.length === 0 && <div className="notice ok"><CheckCircle2 size={18} /> Tidak ada flag untuk laporan ini.</div>}
          {flags.map((f) => (
            <div key={f.id} className={'flagcard ' + (isDone(f.id) ? 'done' : 'open')}>
              <AlertTriangle size={20} color={isDone(f.id) ? '#16a34a' : '#c27803'} style={{ marginTop: 2 }} />
              <div style={{ flex: 1 }}>
                <b>{f.type}</b> {f.comp && <span className="badge gray" style={{ marginLeft: 6 }}>{COMPS[f.comp].short}</span>}
                <div className="small muted">{f.reason}</div>
                <div className="tiny" style={{ marginTop: 2 }}>Sumber: {f.source}</div>
              </div>
              <button className={'btn sm ' + (isDone(f.id) ? 'out' : '')} onClick={() => toggle(f.id)}>{isDone(f.id) ? 'Buka kembali' : 'Tandai sudah diperiksa'}</button>
            </div>
          ))}
        </div>
      </div>

      <div className="card row wrap" style={{ marginTop: 18, justifyContent: 'space-between' }}>
        <div>
          <h3 className="h3">Sumber wawancara</h3>
          <p className="muted small">Akses dokumen dan rekaman untuk meninjau detail jawaban kandidat.</p>
        </div>
        <div className="row wrap">
          <button className="btn out" onClick={() => setModal('cv')}><FileText size={18} /> Lihat CV</button>
          <button className="btn out" onClick={() => setModal('tx')}><FileText size={18} /> Lihat transkrip</button>
          <button className="btn out" onClick={() => setModal('rec')}><Play size={18} /> Periksa rekaman</button>
        </div>
      </div>
      <div className="row" style={{ marginTop: 18, justifyContent: 'space-between' }}>
        <button className="btn out" onClick={() => nav('/hrd/lamaran')}><ArrowLeft size={18} /> Kembali ke daftar kandidat</button>
        <button className="btn" style={{ height: 52 }} onClick={() => nav(`/hrd/keputusan/${a.id}`)}>Lanjut ke tinjauan HRD <ArrowRight size={18} /></button>
      </div>

      {modal === 'cv' && (
        <Modal title={`CV — ${a.name}`} onClose={() => setModal(null)}>
          <div className="muted small">{a.live ? 'Versi dikonfirmasi pelamar (CV asli dan riwayat koreksi tetap tersimpan).' : 'CV contoh.'}</div>
          <div className="notice" style={{ marginTop: 10 }}><Layers size={16} /> <span>Peran: <b>{a.live ? s.cv.role : 'Pengembang modul backend'}</b> · Proyek: <b>{a.live ? s.cv.project : 'Sistem Inventaris'}</b></span></div>
          {a.live && s.cv.history.map((h, i) => <div key={i} className="small muted" style={{ marginTop: 6 }}>Koreksi: {h.from} → {h.to} ({h.at})</div>)}
          <p style={{ marginTop: 12 }}>{CV.summary}</p>
          {CV.projects.map((p) => <div key={p.name} style={{ marginTop: 10 }}><b>{p.name}</b> <span className="tiny">{p.period}</span><div className="small muted">{p.text}</div></div>)}
          <div className="row wrap" style={{ marginTop: 12 }}>{(a.live ? s.cv.skills : CV.skills).map((k) => <span key={k} className="chip">{k}</span>)}</div>
        </Modal>
      )}
      {modal === 'tx' && (
        <Modal title="Transkrip" onClose={() => setModal(null)}>
          {a.turns.map((t) => (
            <div key={t.id} style={{ marginBottom: 16 }}>
              <div className="tiny">{t.id} · {COMPS[t.comp].name} · {t.kind}</div>
              <b>{t.question}</b>
              <p style={{ marginTop: 4 }}>“{turnText(t)}”</p>
              {t.corrections.map((c: any) => <div key={c.idx} className="notice" style={{ marginTop: 6, background: '#eef0fb' }}><Check size={14} /> Transkrip awal “{c.from}” → “{c.to}” · {c.status}</div>)}
            </div>
          ))}
        </Modal>
      )}
      {modal === 'rec' && (
        <Modal title="Periksa rekaman" onClose={() => setModal(null)}>
          <p className="muted small">Audio adalah sumber untuk memeriksa apa yang diucapkan. Pemutar di simulasi hanya menampilkan progres.</p>
          {a.turns.map((t) => (
            <div key={t.id} style={{ marginTop: 12 }}>
              <div className="small"><b>{t.id}</b> · {COMPS[t.comp].short}{t.corrections.length ? ` · koreksi: ${t.corrections.map((c) => c.to).join(', ')}` : ''}</div>
              <FakePlayer seconds={t.dur} />
            </div>
          ))}
        </Modal>
      )}
    </Page>
  )
}

/* ---------- H07: Tinjauan akhir HRD ---------- */
export function Keputusan() {
  const { id } = useParams()
  const a = useApplicant(id)
  const { s, set, toast } = useStore()
  const nav = useNavigate()
  const [val, setVal] = useState(s.decision && a?.live ? s.decision.value : 'Perlu pemeriksaan')
  const [note, setNote] = useState(a?.live && s.decision ? s.decision.note : 'Perlu tugas teknis untuk memeriksa optimasi database.')
  if (!a) return <Page title="Tinjauan akhir HRD"><div className="card">Pelamar tidak ditemukan.</div></Page>
  const ev = a.turns ? evaluate(a.turns) : null
  const flags = ev ? ev.flags : []
  const open = flags.filter((f) => !s.resolvedFlags.includes(`${a.id}:${f.id}`)).length
  const opts = [
    ['Lanjut tahap berikutnya', 'Kandidat akan melanjutkan ke tahap berikutnya sesuai alur rekrutmen.'],
    ['Perlu pemeriksaan', 'Diperlukan pemeriksaan lebih lanjut, misalnya tugas teknis atau wawancara tambahan.'],
    ['Tidak dilanjutkan', 'Kandidat tidak melanjutkan ke tahap berikutnya.'],
  ]
  const decided = a.live ? s.decision : null
  return (
    <Page crumbs={['Tinjauan', 'Tinjauan akhir HRD']} title="Tinjauan akhir HRD" sub="Tinjau hasil wawancara dan tentukan tindak lanjut kandidat." code="H07 • Keputusan HRD">
      <div className="grid cols" style={{ gridTemplateColumns: '1fr 1.25fr', alignItems: 'start' }}>
        <div className="card">
          <div className="row">
            <div className="avatar-i" style={{ width: 80, height: 80, fontSize: 26 }}>{initials(a.name)}</div>
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 800 }}>{a.name}</h2>
              <div className="meta-row small" style={{ gap: 12, marginTop: 4 }}><span><Mail size={14} /> {a.email || '—'}</span><span><Phone size={14} /> {a.phone || '—'}</span></div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--line)', margin: '16px 0 8px' }}>
            {[['Posisi yang dilamar', JOB.title, Briefcase], ['Perusahaan', COMPANY.name, Building2], ['Lokasi', 'Malang', MapPin], ['Tipe kerja', 'Hybrid', Layers]].map(([l, v, I]: any) => (
              <div className="row" key={l} style={{ padding: '10px 0' }}><I size={20} color="#55557a" /><span className="muted" style={{ width: 140 }}>{l}</span><b style={{ fontWeight: 500 }}>{v}</b></div>
            ))}
          </div>
          {open === 0 ? (
            <div className="notice ok"><CheckCircle2 size={26} /><div><b>Sumber dan flag sudah diperiksa</b>Resume, jawaban wawancara, dan catatan telah ditinjau. Tidak ada flag yang memerlukan tindak lanjut khusus.</div></div>
          ) : (
            <div className="notice warn"><AlertTriangle size={26} /><div><b>{open} flag belum diperiksa</b>Periksa sumber di laporan sebelum memutuskan. <Link to={`/hrd/laporan/${a.id}`}>Buka laporan</Link></div></div>
          )}
          <h3 className="h3" style={{ marginTop: 18 }}>Ringkasan proses</h3>
          <div className="tl" style={{ marginTop: 6 }}>
            {[['Lamaran diterima', true], ['Wawancara selesai', true], ['Tinjauan HRD', !!decided]].map(([t, on]: any) => (
              <div key={t} className="tl-i"><span className={'dot' + (on ? '' : ' off')}>{on && <Check size={14} />}</span><b style={{ fontWeight: 500 }}>{t}</b></div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2>Tentukan tindak lanjut</h2>
          <p className="muted small">Pilih keputusan berdasarkan hasil wawancara dan pertimbangan Anda.</p>
          <div style={{ marginTop: 14 }}>
            {opts.map(([t, d]) => (
              <div key={t} className={'radio-card' + (val === t ? ' sel' : '')} onClick={() => setVal(t)}>
                <span className="r" />
                <div><b>{t}</b><span>{d}</span></div>
              </div>
            ))}
          </div>
          <label className="f" style={{ marginTop: 6 }}>Catatan HRD</label>
          <textarea className="input" rows={4} maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} />
          <div className="tiny" style={{ textAlign: 'right' }}>{note.length}/1000</div>
          <div className="notice" style={{ marginTop: 8 }}><Info size={18} /> Keputusan akhir diambil HRD. Tidak ada penolakan otomatis oleh AI.</div>
          <div className="row wrap" style={{ marginTop: 14 }}>
            <div className="row" style={{ border: '1px solid var(--line)', borderRadius: 12, padding: '10px 14px', flex: 1, minWidth: 200 }}>
              <BarChart3 size={24} color="#4338ca" />
              <div><b className="small">Skor simulasi: {ev?.overall ?? '—'}</b><div className="tiny">Metode final belum ditetapkan.</div></div>
            </div>
            <button className="btn" style={{ height: 52 }} onClick={() => {
              if (a.live) set({ decision: { value: val, note, at: new Date().toISOString() } })
              else set((st: any) => ({ seedDecisions: { ...(st.seedDecisions || {}), [a.id]: val } }))
              toast(`Keputusan dicatat: ${val}.`)
              nav('/hrd/lamaran')
            }}>Simpan keputusan</button>
            <button className="btn out" style={{ height: 52 }} onClick={() => nav(`/hrd/laporan/${a.id}`)}>Kembali ke laporan</button>
          </div>
          {decided && <div className="notice ok" style={{ marginTop: 12 }}><CheckCircle2 size={18} /> Keputusan tersimpan. Pelamar kini dapat melihat statusnya di sisi pelamar.</div>}
        </div>
      </div>
    </Page>
  )
}
