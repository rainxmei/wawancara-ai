import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, Bookmark, Building2, MapPin, Briefcase, FileText, Calendar, MessageSquare, Users, Info, Code2, Database, Bug, Link2, Phone, X, History,
  Video, Check, Mic, Volume2, Wifi, Lock, Pencil, Play, Clock, AlertTriangle, UserPlus, WifiOff, Pause, CheckCircle2, Upload, RefreshCw, Mail, Plus,
} from 'lucide-react'
import { Page, Modal } from '../../components/Shell'
import { Wave, useSpeech } from '../../components/media'
import { useStore } from '../../store'
import { CV, COMPANY, JOB, SLOTS, todayId } from '../../data'

const CompIcon = ({ k, size = 28 }: { k: string; size?: number }) => (k === 'api' ? <Code2 size={size} /> : k === 'db' ? <Database size={size} /> : <Bug size={size} />)

/* ---------- P01: Detail lowongan ---------- */
export function Lowongan() {
  const nav = useNavigate()
  const { s } = useStore()
  return (
    <Page crumbs={['Lowongan', 'Detail lowongan']} title="" code="P01 • Detail lowongan" sub={undefined}>
      <div className="grid cols" style={{ gridTemplateColumns: '1.9fr 1fr', alignItems: 'start' }}>
        <div className="card" style={{ padding: 28 }}>
          <div className="row" style={{ alignItems: 'flex-start' }}>
            <div className="ico" style={{ width: 66, height: 66 }}>
              <Building2 size={32} />
            </div>
            <div>
              <b style={{ fontSize: 18 }}>{COMPANY.name}</b>
              <div className="muted small">
                {COMPANY.city} • {COMPANY.mode}
              </div>
            </div>
            <span className="sp" />
            <button className="btn out sm">
              <Bookmark size={16} /> Simpan
            </button>
          </div>
          <h1 className="page-title" style={{ margin: '22px 0 10px', fontSize: 40 }}>
            {JOB.title}
          </h1>
          <div className="meta-row">
            <span>
              <MapPin size={18} /> {COMPANY.city}
            </span>
            <span>
              <Briefcase size={18} /> {COMPANY.mode}
            </span>
            <span>
              <Building2 size={18} /> {COMPANY.name}
            </span>
          </div>
          <h3 className="h3" style={{ marginTop: 26 }}>
            Tentang perusahaan
          </h3>
          <p className="muted" style={{ marginTop: 6 }}>
            {JOB.about}
          </p>
          <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '20px 0' }} />
          <h3 className="h3">Deskripsi pekerjaan</h3>
          <div className="muted" style={{ marginTop: 6 }}>
            {JOB.desc.map((d) => (
              <p key={d}>{d}</p>
            ))}
          </div>
          <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '20px 0' }} />
          <h3 className="h3">Keahlian utama</h3>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginTop: 12, gap: 14 }}>
            {[
              ['api', 'API', 'Mengembangkan dan mengelola API yang andal.'],
              ['db', 'Database', 'Merancang dan memelihara database yang efisien.'],
              ['debug', 'Debugging', 'Menganalisis dan menyelesaikan masalah sistem.'],
            ].map(([k, t, d]) => (
              <div key={k} className="row" style={{ background: 'var(--primary-soft2)', borderRadius: 12, padding: 14, alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--primary)' }}>
                  <CompIcon k={k} size={30} />
                </span>
                <div>
                  <b>{t}</b>
                  <div className="muted small">{d}</div>
                </div>
              </div>
            ))}
          </div>
          <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '20px 0' }} />
          <h3 className="h3">Informasi lainnya</h3>
          <div className="row wrap" style={{ gap: 36, marginTop: 10 }}>
            {[
              ['Tipe pekerjaan', JOB.type, Briefcase],
              ['Tim', JOB.team, Users],
              ['Bidang', JOB.field, FileText],
              ['Lokasi kerja', `${COMPANY.city} • ${COMPANY.mode}`, Building2],
            ].map(([l, v, I]: any) => (
              <div className="row" key={l}>
                <I size={22} color="#55557a" />
                <div>
                  <div className="tiny">{l}</div>
                  <b>{v}</b>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2>Tahapan seleksi</h2>
          <p className="muted small">Ikuti proses berikut setelah mendaftar.</p>
          <div className="vsteps" style={{ marginTop: 14 }}>
            {[
              ['Isi lamaran', 'Lengkapi data diri dan informasi yang dibutuhkan.'],
              ['Pilih jadwal', 'Pilih waktu wawancara yang tersedia.'],
              ['Wawancara AI', 'Ikuti wawancara dengan AI sesuai jadwal yang dipilih.'],
              ['Tinjauan HRD', 'Hasil wawancara akan ditinjau oleh tim HRD.'],
            ].map(([t, d], i) => (
              <div key={t} className={'vstep' + (i === 0 ? ' on' : '')}>
                <span className="n">{i + 1}</span>
                <div>
                  <b>{t}</b>
                  <span>{d}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="notice" style={{ marginTop: 14 }}>
            <Info size={20} />
            <div>
              <b>Semua pelamar memiliki kesempatan wawancara.</b>
              CV tidak digunakan sebagai gerbang kualitas.
            </div>
          </div>
          <button className="btn block" style={{ marginTop: 16, height: 52 }} onClick={() => nav('/pelamar/daftar')}>
            Daftar sekarang <ArrowRight size={18} />
          </button>
          {s.applied && (
            <Link to="/pelamar/lamaran" className="small" style={{ display: 'block', textAlign: 'center', marginTop: 12 }}>
              Anda sudah mendaftar · lihat lamaran saya
            </Link>
          )}
        </div>
      </div>
    </Page>
  )
}

/* ---------- P02: Formulir lamaran ---------- */
export function Daftar() {
  const nav = useNavigate()
  const { s, set } = useStore()
  const [f, setF] = useState({ ...s.form })
  const [errs, setErrs] = useState<Record<string, string>>({})
  const fileRef = useRef<HTMLInputElement>(null)
  const up = (k: string, v: any) => setF((x) => ({ ...x, [k]: v }))
  const sample = () =>
    setF({ name: 'Abyan Keane', email: 'abyan@example.com', wa: '0812 3456 7890', portfolio: 'https://github.com/abyankeane', cvName: 'CV-abyan.pdf', cvSize: '1.2 MB', start: '2025-04-01', consent: true })
  const submit = () => {
    const e: Record<string, string> = {}
    if (!f.name.trim()) e.name = 'Nama lengkap wajib diisi.'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Masukkan email yang valid.'
    if (f.wa.replace(/\D/g, '').length < 9) e.wa = 'Nomor WhatsApp wajib diisi.'
    if (!f.cvName) e.cv = 'CV dalam format PDF wajib dilampirkan.'
    if (!f.consent) e.consent = 'Persetujuan wawancara AI diperlukan sebelum sesi.'
    setErrs(e)
    if (Object.keys(e).length) return
    set({ form: f, applied: true })
    nav('/pelamar/periksa-cv')
  }
  const Stepper = ({ cur }: { cur: number }) => (
    <div className="stepper">
      {['Data lamaran', 'Periksa CV', 'Jadwal', 'Wawancara'].map((t, i) => (
        <span key={t} style={{ display: 'contents' }}>
          <div className={'st' + (i === cur ? ' on' : i < cur ? ' done' : '')}>
            <i>{i < cur ? <Check size={16} /> : i + 1}</i>
            {t}
          </div>
          {i < 3 && <span className="arrow">→</span>}
        </span>
      ))}
    </div>
  )
  return (
    <Page crumbs={['Lowongan', 'Backend Developer', 'Daftar']} title="Daftar untuk Backend Developer" sub="Lengkapi data berikut untuk melamar posisi ini. Prosesnya cepat dan mudah." code="P02 • Formulir lamaran">
      <Stepper cur={0} />
      <div className="grid cols" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'start' }}>
        <div className="card">
          <div className="row">
            <h2>Data diri dan dokumen</h2>
            <span className="sp" />
            <button className="btn out sm" onClick={sample}>
              Isi data contoh
            </button>
          </div>
          <div className="two" style={{ marginTop: 16 }}>
            <div>
              <label className="f">
                Nama lengkap <em>*</em>
              </label>
              <input className="input" value={f.name} onChange={(e) => up('name', e.target.value)} />
              {errs.name && <div className="err">{errs.name}</div>}
            </div>
            <div>
              <label className="f">
                Email <em>*</em>
              </label>
              <input className="input" value={f.email} onChange={(e) => up('email', e.target.value)} />
              {errs.email && <div className="err">{errs.email}</div>}
            </div>
            <div>
              <label className="f">
                Nomor WhatsApp <em>*</em>
              </label>
              <div className="input-ic">
                <Phone size={18} />
                <input className="input" placeholder="Nomor aktif" value={f.wa} onChange={(e) => up('wa', e.target.value)} />
              </div>
              {errs.wa && <div className="err">{errs.wa}</div>}
            </div>
            <div>
              <label className="f">Tautan portofolio (opsional)</label>
              <div className="input-ic">
                <Link2 size={18} />
                <input className="input" placeholder="https://contoh.com/portofolio" value={f.portfolio} onChange={(e) => up('portfolio', e.target.value)} />
              </div>
            </div>
          </div>
          <div style={{ marginTop: 18 }}>
            <label className="f">
              CV dalam PDF <em>*</em>
            </label>
            {f.cvName ? (
              <div className="file">
                <div className="ico xs" style={{ background: '#e4e4fb' }}>
                  <FileText size={20} />
                </div>
                <div>
                  <b>{f.cvName}</b>
                  <div className="tiny">PDF • {f.cvSize}</div>
                </div>
                <span className="sp" />
                <button className="btn out sm" style={{ borderRadius: 999, width: 36, padding: 0 }} onClick={() => (up('cvName', ''), up('cvSize', ''))} aria-label="Hapus">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="dropzone" onClick={() => fileRef.current?.click()}>
                <Upload size={22} style={{ marginBottom: 4 }} />
                <div>
                  <b>Klik untuk memilih berkas PDF</b>
                </div>
                <div className="tiny">
                  atau{' '}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      up('cvName', 'CV-abyan.pdf')
                      up('cvSize', '1.2 MB')
                    }}
                  >
                    gunakan CV contoh
                  </a>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={(e) => {
                    const fl = e.target.files?.[0]
                    if (fl) {
                      up('cvName', fl.name)
                      up('cvSize', (fl.size / 1024 / 1024).toFixed(1) + ' MB')
                    }
                  }}
                />
              </div>
            )}
            {errs.cv && <div className="err">{errs.cv}</div>}
            <div className="tiny" style={{ marginTop: 6 }}>
              Di simulasi ini isi berkas tidak dibaca; hasil pembacaan CV menggunakan CV contoh.
            </div>
          </div>
          <div style={{ marginTop: 18 }}>
            <label className="f">Ketersediaan mulai bekerja</label>
            <input type="date" className="input" value={f.start} onChange={(e) => up('start', e.target.value)} />
          </div>
          <label className="check" style={{ marginTop: 18 }}>
            <input type="checkbox" checked={f.consent} onChange={(e) => up('consent', e.target.checked)} />
            <span>Saya menyetujui proses wawancara menggunakan AI, termasuk pembuatan transkrip, perekaman audio, dan peninjauan oleh tim manusia untuk keperluan evaluasi lamaran.</span>
          </label>
          {errs.consent && <div className="err">{errs.consent}</div>}
          <div className="row" style={{ marginTop: 20 }}>
            <button className="btn" onClick={submit}>
              Kirim dan periksa CV
            </button>
            <button className="btn out" onClick={() => nav('/pelamar/lowongan')}>
              Kembali
            </button>
          </div>
        </div>
        <div className="grid">
          <div className="card">
            <h2>Informasi lowongan</h2>
            <div className="row" style={{ marginTop: 14 }}>
              <div className="ico sm">
                <Building2 size={22} />
              </div>
              <div>
                <b>{COMPANY.name}</b>
                <div className="muted small">
                  {COMPANY.city} • {COMPANY.mode}
                </div>
              </div>
            </div>
            <h3 style={{ fontSize: 26, fontWeight: 800, margin: '14px 0 8px', letterSpacing: -0.5 }}>{JOB.title}</h3>
            <p className="muted small">{JOB.desc.slice(0, 2).join(' ')}</p>
          </div>
          <div className="card">
            <h2>Langkah selanjutnya</h2>
            <div className="vsteps" style={{ marginTop: 10 }}>
              {[
                ['Data lamaran', 'Isi data diri dan unggah CV.'],
                ['Periksa CV', 'Kami akan menampilkan ringkasan CV Anda.'],
                ['Jadwal', 'Pilih jadwal wawancara yang tersedia.'],
                ['Wawancara', 'Ikuti wawancara online dengan AI.'],
              ].map(([t, d], i) => (
                <div key={t} className={'vstep' + (i === 0 ? ' on' : '')}>
                  <span className="n">{i + 1}</span>
                  <div>
                    <b>{t}</b>
                    <span>{d}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}

/* ---------- P03: Periksa hasil pembacaan CV ---------- */
export function PeriksaCV() {
  const nav = useNavigate()
  const { s, set, toast } = useStore()
  const [cv, setCv] = useState(s.cv)
  const [skill, setSkill] = useState('')
  const [open, setOpen] = useState(false)
  const lastSaved = useRef(s.cv.role)
  const wrong = /pemimpin|memimpin|lead/i.test(cv.role)
  const save = (confirm = false) => {
    const next = { ...cv }
    if (next.role !== lastSaved.current) {
      next.history = [...next.history, { at: new Date().toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), from: lastSaved.current, to: next.role }]
      lastSaved.current = next.role
    }
    if (confirm) next.confirmed = true
    setCv(next)
    set({ cv: next })
    if (!confirm) toast('Perubahan disimpan. CV asli dan riwayat koreksi tetap tersimpan.')
    else nav('/pelamar/jadwal')
  }
  return (
    <Page crumbs={['Lamaran Saya', 'Backend Developer', 'Periksa hasil pembacaan CV']} title="Periksa hasil pembacaan CV" sub="Kami telah membaca informasi dari CV Anda menggunakan AI. Silakan periksa dan sesuaikan jika ada yang perlu diperbaiki." code="P03 • Konfirmasi pembacaan CV">
      <div className="grid cols" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'start' }}>
        <div className="card">
          <div className="row">
            <h2>CV asli</h2>
            <span className="sp" />
            <span className="muted small">{s.form.cvName || 'CV_Abyan_Keane.pdf'} (245 KB)</span>
          </div>
          <div style={{ border: '1px solid var(--line)', borderRadius: 12, marginTop: 14, padding: 24, height: 560, overflow: 'auto', background: '#fff' }}>
            <h3 style={{ fontSize: 26, fontWeight: 800 }}>{CV.name}</h3>
            <div className="muted">{CV.title}</div>
            <div className="meta-row small" style={{ margin: '10px 0', gap: 14 }}>
              <span>
                <Mail size={14} /> {CV.email}
              </span>
              <span>
                <Phone size={14} /> {CV.phone}
              </span>
              <span>
                <MapPin size={14} /> {CV.city}
              </span>
            </div>
            <hr style={{ border: 0, borderTop: '1px solid var(--line)' }} />
            <h4 className="tiny" style={{ letterSpacing: 1, marginTop: 14, fontWeight: 700, color: 'var(--ink)' }}>
              RINGKASAN
            </h4>
            <p className="small muted">{CV.summary}</p>
            <h4 className="tiny" style={{ letterSpacing: 1, marginTop: 16, fontWeight: 700, color: 'var(--ink)' }}>
              PENGALAMAN PROYEK
            </h4>
            {CV.projects.map((p, i) => (
              <div key={p.name} style={{ padding: 10, borderRadius: 8, background: i === 0 ? '#ececfa' : 'transparent', marginTop: 8 }}>
                <div className="row">
                  <b>{p.name}</b>
                  <span className="sp" />
                  <span className="tiny">{p.period}</span>
                </div>
                <div className="tiny" style={{ marginBottom: 4 }}>
                  {p.company}
                </div>
                <div className="small muted">{p.text}</div>
              </div>
            ))}
            <h4 className="tiny" style={{ letterSpacing: 1, marginTop: 16, fontWeight: 700, color: 'var(--ink)' }}>
              KETERAMPILAN
            </h4>
            <div className="row wrap" style={{ gap: 8, marginTop: 8 }}>
              {CV.skills.map((k, i) => (
                <span key={k} className={'chip ' + (i < 3 ? 'hl' : 'plain')}>
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="row">
            <div>
              <h2>Informasi yang dibaca AI</h2>
              <p className="muted small">Berikut adalah informasi yang kami temukan dari CV Anda.</p>
            </div>
            <span className="sp" />
            <button className="btn out sm" onClick={() => setOpen(true)}>
              <FileText size={16} /> Lihat CV asli
            </button>
          </div>
          {wrong && (
            <div className="notice warn" style={{ marginTop: 14 }}>
              <AlertTriangle size={18} />
              <div>
                <b>Periksa bagian ini</b>
                CV Anda tertulis “Mengembangkan modul backend”, tetapi hasil pembacaan menyebut “{cv.role}”. Perbaiki agar pertanyaan AI tidak memiliki premis yang keliru.
              </div>
            </div>
          )}
          <div className="grid" style={{ gap: 14, marginTop: 16 }}>
            <div>
              <label className="f">Nama lengkap</label>
              <input className="input" value={s.form.name || CV.name} readOnly />
            </div>
            <div>
              <label className="f">
                Peran dalam proyek <em>*</em>
              </label>
              <input className="input" value={cv.role} onChange={(e) => setCv({ ...cv, role: e.target.value })} />
              {cv.history.length > 0 && (
                <div className="notice" style={{ marginTop: 8, background: '#eef0fb' }}>
                  <History size={18} />
                  <div className="small" style={{ width: '100%' }}>
                    {cv.history.map((h, i) => (
                      <div key={i}>
                        <div className="tiny">Riwayat koreksi · {h.at}</div>
                        {h.from} → {h.to}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <label className="f">Nama proyek</label>
              <input className="input" value={cv.project} onChange={(e) => setCv({ ...cv, project: e.target.value })} />
            </div>
            <div>
              <label className="f">
                Keterampilan <em>*</em>
              </label>
              <div className="input" style={{ height: 'auto', minHeight: 56, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', padding: 8 }}>
                {cv.skills.map((k) => (
                  <span className="chip" key={k}>
                    {k}
                    <button onClick={() => setCv({ ...cv, skills: cv.skills.filter((x) => x !== k) })} aria-label={`Hapus ${k}`}>
                      <X size={14} />
                    </button>
                  </span>
                ))}
                <input
                  style={{ border: 0, outline: 0, font: 'inherit', flex: 1, minWidth: 90 }}
                  placeholder="Tambah…"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && skill.trim()) {
                      setCv({ ...cv, skills: [...cv.skills, skill.trim()] })
                      setSkill('')
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <label className="f">Keterangan tambahan (opsional)</label>
              <textarea className="input" rows={2} placeholder="Pengalaman yang tidak tertulis di CV" value={cv.extra} onChange={(e) => setCv({ ...cv, extra: e.target.value })} />
              {cv.extra && <div className="tiny">Akan dicatat sebagai “keterangan tambahan saat konfirmasi CV”, bukan bagian dari CV asli.</div>}
            </div>
          </div>
          <div className="notice" style={{ marginTop: 16 }}>
            <Info size={18} />
            CV asli dan riwayat koreksi tetap tersimpan.
          </div>
          <div className="row" style={{ marginTop: 16, justifyContent: 'flex-end' }}>
            <button className="btn out" onClick={() => save(false)}>
              Simpan perubahan
            </button>
            <button className="btn" disabled={!cv.role.trim() || cv.skills.length === 0} onClick={() => save(true)}>
              Konfirmasi data dan pilih jadwal <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
      {open && (
        <Modal title="CV asli (pratinjau)" onClose={() => setOpen(false)}>
          <p className="muted small">Pada produk sebenarnya, PDF asli ditampilkan di sini bersama penanda halaman sumber setiap klaim.</p>
          <div className="notice" style={{ marginTop: 12 }}>
            <FileText size={18} />
            <div>
              <b>{s.form.cvName || 'CV_Abyan_Keane.pdf'}</b>
              Tersimpan aman. Ekstraksi awal, perubahan Anda, dan versi terkonfirmasi disimpan terpisah.
            </div>
          </div>
        </Modal>
      )}
    </Page>
  )
}

/* ---------- P04: Pilih jadwal ---------- */
export function Jadwal() {
  const nav = useNavigate()
  const { s, set, toast } = useStore()
  const [sel, setSel] = useState<string | null>(s.slot?.id || 's2')
  useEffect(() => {
    if (s.allFull) nav('/pelamar/slot-penuh', { replace: true })
  }, [s.allFull])
  const slot = SLOTS.find((x) => x.id === sel)
  return (
    <Page crumbs={['Jadwal Wawancara', 'Pilih Jadwal']} title="Pilih jadwal wawancara" sub="Pilih slot waktu yang tersedia untuk mengikuti wawancara AI. Setelah dikonfirmasi, Anda akan menerima detail pelaksanaan." code="P04 • Pemilihan slot">
      <div className="grid cols" style={{ gridTemplateColumns: '1.5fr 1fr', alignItems: 'start' }}>
        <div className="card">
          <h2>Slot waktu tersedia</h2>
          <p className="muted small">Pilih salah satu slot waktu pada hari yang tersedia.</p>
          <div style={{ border: '1px solid var(--line)', borderRadius: 14, padding: 20, marginTop: 16 }}>
            <div className="row" style={{ marginBottom: 14 }}>
              <Calendar size={28} color="#4338ca" />
              <div>
                <b style={{ fontSize: 17 }}>Hari 1 · jadwal contoh</b>
                <div className="muted small">Jadwal dalam waktu Indonesia Barat (WIB)</div>
              </div>
            </div>
            {SLOTS.map((x) => (
              <div key={x.id} className={'slot' + (x.full ? ' full' : sel === x.id ? ' sel' : '')} onClick={() => !x.full && setSel(x.id)} role="radio" aria-checked={sel === x.id}>
                <span className="radio">{x.full && <Check size={14} />}</span>
                <b style={{ fontWeight: 500, fontSize: 16 }}>{x.time}</b>
                <span className={'badge tag ' + (x.full ? 'gray' : 'pri')}>{x.full ? 'Terisi' : 'Tersedia'}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2>Ringkasan jadwal</h2>
          <p className="muted small">Pastikan pilihan Anda sudah sesuai sebelum dikonfirmasi.</p>
          <div style={{ border: '1px solid var(--line)', borderRadius: 14, padding: 18, marginTop: 14 }}>
            <div className="row">
              <div className="ico sm">
                <Video size={22} />
              </div>
              <div>
                <b style={{ fontSize: 18 }}>Wawancara AI</b>
                <div className="muted small">Dilakukan secara online melalui platform Ruang Wawancara.</div>
              </div>
            </div>
            {[
              ['Posisi', JOB.title, Briefcase],
              ['Perusahaan', COMPANY.name, Building2],
              ['Lokasi', COMPANY.city, MapPin],
              ['Slot dipilih', slot ? `Hari 1, ${slot.time.replace(' – ', ' – ')} WIB` : '—', Calendar],
            ].map(([l, v, I]: any) => (
              <div key={l} className="row" style={{ padding: '12px 0', borderTop: '1px solid var(--line)', marginTop: 8 }}>
                <I size={20} color="#55557a" />
                <span className="muted" style={{ width: 100 }}>
                  {l}
                </span>
                <b>{v}</b>
              </div>
            ))}
            <div className="notice" style={{ marginTop: 6 }}>
              <Info size={18} />
              Jadwal mengikuti kapasitas server, bukan kalender HRD.
            </div>
            <button
              className="btn block"
              style={{ marginTop: 14, height: 52 }}
              disabled={!slot}
              onClick={() => {
                set({ slot: { id: slot!.id, time: slot!.time }, waitlist: false, reschedules: s.slot ? s.reschedules + 1 : s.reschedules })
                toast(s.slot ? 'Jadwal diubah.' : 'Jadwal terkonfirmasi.')
                nav('/pelamar/terkonfirmasi')
              }}
            >
              Konfirmasi jadwal
            </button>
            <p className="tiny" style={{ textAlign: 'center', marginTop: 10 }}>
              <Clock size={13} style={{ verticalAlign: -2 }} /> Perubahan jadwal hanya sebelum tenggat.
            </p>
          </div>
          <div className="demo-card" style={{ marginTop: 14 }}>
            <div className="ttl">Panel simulasi</div>
            <p className="small muted">Pada pemesanan nyata, backend memproses konflik slot terakhir secara konsisten.</p>
            <button className="btn out sm" style={{ marginTop: 8 }} onClick={() => set({ allFull: true })}>
              Simulasikan: semua slot penuh
            </button>
          </div>
        </div>
      </div>
    </Page>
  )
}

/* ---------- X01: Slot penuh & daftar tunggu ---------- */
export function SlotPenuh() {
  const nav = useNavigate()
  const { s, set, toast } = useStore()
  const times = ['09:00 – 09:45', '10:00 – 10:45', '11:00 – 11:45', '13:00 – 13:45', '14:00 – 14:45', '15:00 – 15:45']
  return (
    <Page crumbs={['Lamaran Saya', 'Jadwal Wawancara']} title="Slot wawancara saat ini penuh" sub={<>Semua slot untuk posisi <b>Backend Developer</b> di PT Contoh Teknologi (Malang) sudah terisi.</>} code="X01 • Slot penuh">
      <div className="grid cols" style={{ gridTemplateColumns: '1.4fr 1fr', alignItems: 'start' }}>
        <div className="card">
          <div className="row">
            <div className="ico warn">
              <Calendar size={28} />
            </div>
            <div>
              <h2>Jadwal wawancara</h2>
              <p className="muted small">Pilih salah satu slot yang tersedia. Semua slot saat ini sudah terisi.</p>
            </div>
          </div>
          <div className="row" style={{ background: 'var(--primary-soft2)', border: '1px solid var(--line)', borderRadius: 12, padding: 14, margin: '16px 0' }}>
            <div className="ico xs">
              <Building2 size={18} />
            </div>
            <div>
              <b>Backend Developer</b>
              <div className="muted small">PT Contoh Teknologi • Malang • Hybrid</div>
            </div>
          </div>
          <b>Senin, 21 April 2025</b>
          <div style={{ marginTop: 10 }}>
            {times.map((t) => (
              <div key={t} className="slot full">
                <Clock size={18} />
                <span>{t} WIB</span>
                <span className="badge gray tag">Terisi</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="row">
            <div className="ico">
              <Users size={28} />
            </div>
            <div>
              <h2>Daftar tunggu</h2>
              <p className="muted small">Dapatkan kesempatan slot yang tersedia sebelum tenggat.</p>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            {[
              ['Posisi', JOB.title],
              ['Perusahaan', COMPANY.name],
              ['Lokasi', `${COMPANY.city} • ${COMPANY.mode}`],
            ].map(([l, v]) => (
              <div className="row" key={l} style={{ padding: '8px 0' }}>
                <span className="muted" style={{ width: 100 }}>
                  {l}
                </span>
                <b>{v}</b>
              </div>
            ))}
          </div>
          <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '10px 0 16px' }} />
          {!s.waitlist ? (
            <button
              className="btn block"
              style={{ height: 52 }}
              onClick={() => {
                set({ waitlist: true })
                toast('Anda masuk daftar tunggu. Ini belum berarti slot terpesan.')
              }}
            >
              <UserPlus size={18} /> Masuk daftar tunggu
            </button>
          ) : (
            <div className="notice ok">
              <CheckCircle2 size={20} />
              <div>
                <b>Anda ada di daftar tunggu (urutan #3)</b>
                Kami akan menawarkan slot jika ada pembatalan. Anda tetap harus mengonfirmasi jadwal.
              </div>
            </div>
          )}
          <button
            className="btn out block"
            style={{ marginTop: 12, height: 52 }}
            onClick={() => toast('Jadwal hari berikutnya belum dibuka (simulasi).')}
          >
            <Calendar size={18} /> Lihat jadwal berikutnya
          </button>
          <div className="notice" style={{ marginTop: 14 }}>
            <Info size={18} />
            Masuk daftar tunggu belum berarti slot terpesan.
          </div>
          <div className="demo-card" style={{ marginTop: 14 }}>
            <div className="ttl">Panel simulasi</div>
            <button
              className="btn out sm"
              onClick={() => {
                set({ allFull: false, waitlist: false })
                toast('Ada pembatalan: slot 10.00 – 10.30 ditawarkan kepada Anda.')
                nav('/pelamar/jadwal')
              }}
            >
              Simulasikan: ada pembatalan slot
            </button>
          </div>
        </div>
      </div>
    </Page>
  )
}

/* ---------- P05: Jadwal terkonfirmasi ---------- */
export function Terkonfirmasi() {
  const { s } = useStore()
  const nav = useNavigate()
  const slot = s.slot || { id: 's2', time: '09.30 – 10.00' }
  return (
    <Page crumbs={['Beranda', 'Jadwal saya']} title="Jadwal wawancara terkonfirmasi" sub="Berikut detail jadwal wawancara Anda. Silakan lakukan persiapan agar sesi berjalan dengan lancar." code="P05 • Konfirmasi jadwal">
      <div className="grid cols" style={{ gridTemplateColumns: '1.7fr 1fr', alignItems: 'start' }}>
        <div className="card" style={{ padding: 28 }}>
          <div style={{ textAlign: 'center', padding: '6px 0 20px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ width: 90, height: 90, borderRadius: '50%', background: '#e2f4e8', display: 'grid', placeItems: 'center', margin: '0 auto 12px' }}>
              <div style={{ width: 54, height: 54, borderRadius: '50%', background: '#16a34a', display: 'grid', placeItems: 'center', color: '#fff' }}>
                <Check size={30} strokeWidth={3} />
              </div>
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 800 }}>Jadwal Anda telah terkonfirmasi</h2>
            <p className="muted">Kami menantikan kehadiran Anda pada waktu yang telah dijadwalkan.</p>
          </div>
          <div style={{ background: 'var(--primary-soft2)', borderRadius: 14, padding: 20, margin: '20px 0' }}>
            <div className="row">
              <div className="ico sm">
                <Building2 size={22} />
              </div>
              <div>
                <b>{COMPANY.name}</b>
                <div className="muted small">
                  {COMPANY.city} • {COMPANY.mode}
                </div>
              </div>
            </div>
            <h3 style={{ fontSize: 30, fontWeight: 800, margin: '10px 0 12px', letterSpacing: -0.6 }}>{JOB.title}</h3>
            <div className="meta-row" style={{ gap: 36, color: 'var(--ink)' }}>
              <span>
                <Calendar size={22} /> Hari 1 · jadwal contoh
              </span>
              <span>
                <Clock size={22} /> {slot.time.replace(' – ', '–')} WIB · contoh
              </span>
              <span>
                <MapPin size={22} /> Ruang wawancara AI
              </span>
            </div>
          </div>
          <b>Persiapan sebelum wawancara</b>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginTop: 10, gap: 14 }}>
            {[
              [Mic, 'Siapkan mikrofon', 'Pastikan perangkat audio berfungsi dengan baik.'],
              [Wifi, 'Pastikan koneksi stabil', 'Gunakan jaringan internet yang stabil.'],
              [FileText, 'Baca aturan wawancara', 'Pahami tata tertib dan hal-hal yang perlu diperhatikan.'],
            ].map(([I, t, d]: any) => (
              <div key={t} className="row" style={{ border: '1px solid var(--line)', borderRadius: 12, padding: 14, alignItems: 'flex-start' }}>
                <div className="ico xs">
                  <I size={18} />
                </div>
                <div>
                  <b className="small">{t}</b>
                  <div className="tiny" style={{ color: 'var(--ink2)' }}>
                    {d}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="row wrap" style={{ marginTop: 20 }}>
            <button className="btn" style={{ height: 52 }} onClick={() => nav('/pelamar/persiapan')}>
              Buka persiapan wawancara
            </button>
            <button className="btn out" style={{ height: 52 }} onClick={() => nav('/pelamar/jadwal')}>
              Ubah jadwal
            </button>
            <span className="tiny" style={{ maxWidth: 240 }}>
              <Info size={13} style={{ verticalAlign: -2 }} /> Penjadwalan ulang tersedia sebelum tenggat dan jika ada slot.
              {s.reschedules > 0 && ` (Diubah ${s.reschedules}×)`}
            </span>
          </div>
        </div>
        <div className="grid">
          <div className="card">
            <h3 className="h3">Tentang lowongan</h3>
            <div className="row" style={{ marginTop: 12 }}>
              <div className="ico xs">
                <Building2 size={18} />
              </div>
              <div>
                <b className="small">{COMPANY.name}</b>
                <div className="tiny">
                  {COMPANY.city} • {COMPANY.mode}
                </div>
              </div>
            </div>
            <h3 style={{ fontSize: 24, fontWeight: 800, margin: '12px 0 6px' }}>{JOB.title}</h3>
            <p className="muted small">{JOB.desc.slice(0, 2).join(' ')}</p>
            <Link className="btn out sm" style={{ marginTop: 12 }} to="/pelamar/lowongan">
              Lihat detail lowongan
            </Link>
          </div>
          <div className="card">
            <div className="row">
              <div className="ico xs">
                <MessageSquare size={18} />
              </div>
              <h3 className="h3">Butuh bantuan?</h3>
            </div>
            <p className="muted small" style={{ margin: '10px 0' }}>
              Jika ada pertanyaan terkait jadwal atau proses wawancara, silakan hubungi tim kami.
            </p>
            <button className="btn out sm">Hubungi tim Ruang Wawancara</button>
          </div>
        </div>
      </div>
    </Page>
  )
}

/* ---------- P06: Persiapan wawancara ---------- */
export function Persiapan() {
  const nav = useNavigate()
  const { s, set } = useStore()
  const sp = useSpeech(s.sound)
  const [mic, setMic] = useState<'sim' | 'real' | 'denied'>('sim')
  const [lvl, setLvl] = useState(false)
  const [ready, setReady] = useState(false)
  const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)
  useEffect(() => {
    const a = () => setOnline(true)
    const b = () => setOnline(false)
    window.addEventListener('online', a)
    window.addEventListener('offline', b)
    return () => {
      window.removeEventListener('online', a)
      window.removeEventListener('offline', b)
    }
  }, [])
  const testMic = async () => {
    try {
      const st = await navigator.mediaDevices.getUserMedia({ audio: true })
      st.getTracks().forEach((t) => t.stop())
      setMic('real')
      setLvl(true)
    } catch {
      setMic('denied')
    }
  }
  return (
    <Page crumbs={['Wawancara Saya', 'Persiapan wawancara']} title="Persiapan wawancara" sub="Pastikan perangkat Anda dalam kondisi baik sebelum memulai wawancara." code="P06 • Tes perangkat">
      <div className="grid cols" style={{ gridTemplateColumns: '1.3fr 1fr', alignItems: 'start' }}>
        <div className="card">
          <h2>Cek perangkat</h2>
          <p className="muted small">Pastikan mikrofon, suara, dan koneksi Anda berfungsi dengan baik.</p>
          {[
            {
              I: Mic,
              t: 'Mikrofon',
              d: 'Suara Anda akan digunakan untuk menjawab pertanyaan.',
              ok: mic !== 'denied',
              body: (
                <div className="row" style={{ gap: 14 }}>
                  <div style={{ width: 150 }}>
                    <Wave active={lvl} bars={22} height={44} />
                  </div>
                  <button className="btn out sm" onClick={testMic}>
                    {mic === 'real' ? 'Uji ulang' : 'Tes mikrofon'}
                  </button>
                </div>
              ),
              st: mic === 'sim' ? 'Siap (simulasi)' : mic === 'real' ? 'Siap' : 'Izin ditolak',
            },
            {
              I: Volume2,
              t: 'Suara avatar',
              d: 'Suara pewawancara virtual akan diputar melalui perangkat ini.',
              ok: true,
              body: (
                <button className="btn out sm" onClick={() => sp.speak('Halo, saya asisten AI Ruang Wawancara. Suara saya terdengar jelas?')}>
                  <Play size={14} /> {sp.speaking ? 'Memutar…' : 'Putar contoh'}
                </button>
              ),
              st: 'Siap',
            },
            { I: Wifi, t: 'Koneksi', d: 'Pastikan koneksi internet Anda stabil selama wawancara.', ok: online, body: <span className="muted small">{online ? 'Koneksi stabil' : 'Tidak terhubung'}</span>, st: online ? 'Siap' : 'Terputus' },
          ].map((r) => (
            <div key={r.t} className="row" style={{ border: '1px solid var(--line)', borderRadius: 14, padding: '16px 18px', marginTop: 14, gap: 18 }}>
              <div className="ico">
                <r.I size={26} />
              </div>
              <div style={{ flex: 1 }}>
                <b style={{ fontSize: 17 }}>{r.t}</b>
                <div className="muted small">{r.d}</div>
              </div>
              <span className={'row'} style={{ gap: 8, color: r.ok ? 'var(--ok)' : 'var(--bad)', fontWeight: 600 }}>
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: r.ok ? '#16a34a' : '#dc2626', display: 'grid', placeItems: 'center', color: '#fff' }}>{r.ok ? <Check size={16} /> : <X size={16} />}</span>
                {r.st}
              </span>
              <div style={{ minWidth: 150, display: 'flex', justifyContent: 'flex-end' }}>{r.body}</div>
            </div>
          ))}
          <label className="check" style={{ marginTop: 16 }}>
            <input type="checkbox" checked={s.sound} onChange={(e) => set({ sound: e.target.checked })} />
            <span>
              Aktifkan suara avatar (memakai suara bawaan browser). Matikan jika perangkat tidak mendukung bahasa Indonesia; teks tetap tampil.
            </span>
          </label>
        </div>
        <div className="card">
          <h2>Aturan sesi</h2>
          <p className="muted small">Ikuti panduan berikut agar wawancara berjalan lancar.</p>
          {[
            [Mic, 'Jawab secara lisan', 'Sampaikan jawaban Anda dengan suara yang jelas dan natural.'],
            [FileText, 'Tekan Selesai menjawab', 'Setelah selesai berbicara, tekan tombol Selesai menjawab untuk melanjutkan ke pertanyaan berikutnya.'],
            [Pencil, 'Koreksi hanya kesalahan transkripsi', 'Anda dapat meminta koreksi jika ada kesalahan pada hasil transkripsi jawaban Anda.'],
            [Lock, 'Jawaban terkunci setelah konfirmasi', 'Setelah Anda mengonfirmasi jawaban, jawaban tidak dapat diubah.'],
          ].map(([I, t, d]: any) => (
            <div key={t} className="row" style={{ alignItems: 'flex-start', marginTop: 16 }}>
              <div className="ico sm" style={{ background: '#efeffb' }}>
                <I size={22} />
              </div>
              <div>
                <b>{t}</b>
                <div className="muted small">{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card row" style={{ marginTop: 20, padding: '18px 24px' }}>
        <label className="check" style={{ alignItems: 'center' }}>
          <input type="checkbox" checked={ready} onChange={(e) => setReady(e.target.checked)} />
          <span>
            <b style={{ color: 'var(--ink)', fontSize: 16 }}>Saya siap memulai wawancara</b>
            <br />
            Membuka halaman belum memulai rekaman.
          </span>
        </label>
        <span className="sp" />
        <button
          className="btn"
          style={{ height: 54, minWidth: 260 }}
          disabled={!ready}
          onClick={() => {
            set((st) => ({
              applied: true,
              form: st.form.name ? st.form : { ...st.form, name: 'Abyan Keane', email: 'abyan@example.com', wa: '0812 3456 7890' },
              sess: st.sess.status === 'selesai' ? st.sess : { ...st.sess, status: 'berjalan', startedAt: st.sess.startedAt || todayId() },
              periodEnded: false,
            }))
            nav('/pelamar/wawancara')
          }}
        >
          <Play size={18} fill="#fff" /> Mulai wawancara
        </button>
      </div>
    </Page>
  )
}

/* ---------- X03: Koneksi terputus ---------- */
export function Terputus() {
  const nav = useNavigate()
  const { s, set, toast } = useStore()
  return (
    <Page crumbs={['Jadwal', 'Sesi wawancara']} title="Sesi wawancara" sub="Sedang mengikuti wawancara sesuai jadwal. Jika terjadi kendala, Anda dapat memulihkan sesi atau menjadwalkan ulang." code="X03 • Pemulihan sesi">
      <div className="card row" style={{ marginBottom: 20 }}>
        <div className="ico">
          <Building2 size={28} />
        </div>
        <div>
          <div className="tiny">Posisi yang dilamar</div>
          <h3 style={{ fontSize: 22, fontWeight: 800 }}>{JOB.title}</h3>
          <div className="meta-row small">
            <span>{COMPANY.name}</span>
            <span>{COMPANY.city}</span>
            <span>{COMPANY.mode}</span>
          </div>
        </div>
        <span className="sp" />
        <div className="row">
          <Calendar size={22} color="#55557a" />
          <div>
            <div className="tiny">Jadwal sesi</div>
            <b>Hari 1 · {s.slot?.time || '10.00 – 11.00'} WIB</b>
          </div>
        </div>
      </div>
      <div className="grid cols" style={{ gridTemplateColumns: '1.45fr 1fr', alignItems: 'stretch' }}>
        <div className="card pad0" style={{ position: 'relative', overflow: 'hidden', minHeight: 440, background: 'linear-gradient(160deg,#6c6a98,#8a86b8)' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#fff', textAlign: 'center' }}>
            <div>
              <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'rgba(0,0,0,.45)', display: 'grid', placeItems: 'center', margin: '0 auto 12px' }}>
                <WifiOff size={44} />
              </div>
              <b style={{ fontSize: 22 }}>Koneksi terputus</b>
              <div style={{ opacity: 0.9 }}>Mencoba menghubungkan kembali…</div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="row" style={{ alignItems: 'flex-start' }}>
            <div className="ico" style={{ background: '#fdeccb', color: '#d97706', borderRadius: '50%', width: 70, height: 70 }}>
              <AlertTriangle size={34} />
            </div>
            <div>
              <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.6 }}>Koneksi terputus</h2>
              <p className="muted">Jawaban yang sudah dikunci tetap tersimpan.</p>
            </div>
          </div>
          <div className="row" style={{ background: '#fdf3de', borderRadius: 14, padding: 18, margin: '20px 0' }}>
            <div className="ico sm" style={{ background: '#fbdca0', color: '#c2680c', borderRadius: '50%' }}>
              <Pause size={20} />
            </div>
            <div>
              <div className="small muted">Status sesi</div>
              <b style={{ fontSize: 20 }}>Sesi dijeda</b>
              <div className="tiny" style={{ color: 'var(--ink2)' }}>
                {s.sess.turns.length} jawaban terkunci tersimpan
              </div>
            </div>
          </div>
          <div className="row">
            <button
              className="btn"
              style={{ flex: 1, height: 52 }}
              onClick={() => {
                set((st) => ({ sess: { ...st.sess, status: 'berjalan' } }))
                toast('Sesi dipulihkan dari tahap terakhir yang tersimpan.')
                nav('/pelamar/wawancara')
              }}
            >
              Pulihkan sesi
            </button>
            <button className="btn out" style={{ flex: 1, height: 52 }} onClick={() => nav('/pelamar/jadwal')}>
              Jadwalkan ulang
            </button>
          </div>
          <p className="small muted" style={{ marginTop: 14 }}>
            <Clock size={14} style={{ verticalAlign: -2 }} /> Penjadwalan ulang hanya tersedia sebelum tenggat.
          </p>
          <div className="notice" style={{ marginTop: 12, background: '#f3f3fa', color: 'var(--ink2)' }}>
            <Lock size={18} />
            Jawaban lama tidak dibuka untuk ditulis ulang.
          </div>
          <div className="notice" style={{ marginTop: 12 }}>
            <Info size={18} />
            Gangguan teknis tidak dianggap sebagai nilai kompetensi rendah.
          </div>
        </div>
      </div>
    </Page>
  )
}

/* ---------- X02: Periode berakhir ---------- */
export function PeriodeBerakhir() {
  const nav = useNavigate()
  const { set } = useStore()
  return (
    <Page crumbs={['Lamaran Saya', 'Detail Lamaran']} title="Periode wawancara telah berakhir" sub="Berikut adalah status dan informasi terkait proses wawancara Anda." code="X02 • Tenggat terlewati">
      <div className="grid cols" style={{ gridTemplateColumns: '1.5fr 1fr', alignItems: 'start' }}>
        <div className="card">
          <div className="notice warn" style={{ alignItems: 'center' }}>
            <AlertTriangle size={30} />
            <div>
              <b style={{ fontSize: 17 }}>Tidak selesai — melewati batas waktu</b>
              Anda tidak menyelesaikan sesi wawancara dalam waktu yang telah ditentukan.
            </div>
          </div>
          <div className="row" style={{ margin: '18px 0 8px' }}>
            <div className="ico sm">
              <Building2 size={22} />
            </div>
            <div>
              <b>{COMPANY.name}</b>
              <div className="muted small">
                {COMPANY.city} • {COMPANY.mode}
              </div>
            </div>
          </div>
          <h3 style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.6 }}>{JOB.title}</h3>
          <div style={{ marginTop: 14 }}>
            {[
              ['Perusahaan', COMPANY.name],
              ['Lokasi kerja', 'Malang (Hybrid)'],
              ['Periode wawancara', '12 Maret 2025 · 09.00 – 09.45 WIB'],
            ].map(([l, v]) => (
              <div key={l} className="row" style={{ padding: '6px 0' }}>
                <span className="muted" style={{ width: 170 }}>
                  {l}
                </span>
                {v}
              </div>
            ))}
            <div className="row" style={{ padding: '6px 0' }}>
              <span className="muted" style={{ width: 170 }}>
                Status
              </span>
              <span className="badge warn">Tidak selesai — melewati batas waktu</span>
            </div>
          </div>
          <div className="notice" style={{ marginTop: 16 }}>
            <Info size={20} />
            <div>
              <b>Pemesanan dan penjadwalan ulang tidak tersedia setelah tenggat.</b>
              <span className="small">Tenggat waktu wawancara untuk lamaran ini telah berakhir, sehingga penjadwalan ulang tidak dapat dilakukan.</span>
            </div>
          </div>
          <div className="row" style={{ marginTop: 16 }}>
            <button className="btn" onClick={() => nav('/pelamar/lamaran')}>
              Lihat status lamaran
            </button>
            <button className="btn out" disabled>
              Pilih jadwal baru
            </button>
          </div>
          <button className="btn out sm" style={{ marginTop: 16 }} onClick={() => (set({ periodEnded: false }), nav('/pelamar/lowongan'))}>
            <RefreshCw size={14} /> Keluar dari skenario ini (simulasi)
          </button>
        </div>
        <div className="grid">
          <div className="card">
            <div className="row">
              <div className="ico xs">
                <FileText size={18} />
              </div>
              <h3 className="h3">Tentang proses ini</h3>
            </div>
            <p className="muted small" style={{ marginTop: 10 }}>
              Wawancara dilakukan sesuai jadwal yang telah Anda pilih sebelumnya. Karena sesi tidak diselesaikan dalam batas waktu, proses wawancara untuk lamaran ini dianggap tidak selesai.
            </p>
          </div>
          <div className="card">
            <h3 className="h3">Hal yang perlu diketahui</h3>
            <ul className="muted small" style={{ paddingLeft: 18, display: 'grid', gap: 8, marginTop: 10 }}>
              <li>Status administrasi ini tidak menyatakan kompetensi kandidat rendah.</li>
              <li>Lamaran Anda tetap tercatat dan dapat dilanjutkan sesuai kebijakan rekrutmen {COMPANY.name}.</li>
              <li>Untuk mengetahui informasi selanjutnya, silakan lihat status lamaran Anda.</li>
            </ul>
          </div>
        </div>
      </div>
    </Page>
  )
}
