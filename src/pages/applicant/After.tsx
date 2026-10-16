import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, MapPin, Briefcase, CheckCircle2, Clock, Flag, FileText, AlertTriangle, ChevronRight, HelpCircle, User, Info, Edit3 } from 'lucide-react'
import { Page, Modal } from '../../components/Shell'
import { useStore } from '../../store'
import { COMPANY, COMPS, JOB, QUESTIONS, turnText } from '../../data'

/* ---------- P11: Wawancara selesai ---------- */
export function Selesai() {
  const { s, set, toast } = useStore()
  const nav = useNavigate()
  const [full, setFull] = useState(false)
  const [rep, setRep] = useState(false)
  const [msg, setMsg] = useState('')
  const [pick, setPick] = useState('')
  const turns = s.sess.turns
  const name = s.form.name || 'Abyan Keane'
  const decided = s.decision
  return (
    <Page crumbs={['Jadwal', 'Sesi wawancara']} title="Wawancara selesai" sub="Terima kasih telah mengikuti wawancara. Jawaban Anda telah tersimpan dengan aman." code="P11 • Transkrip dan status">
      <div className="grid cols" style={{ gridTemplateColumns: '1.6fr 1fr', alignItems: 'start' }}>
        <div className="grid">
          <div className="card row wrap">
            <div className="ico">
              <Building2 size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 800 }}>{JOB.title}</h3>
              <div className="muted">{COMPANY.name}</div>
              <div className="meta-row small" style={{ gap: 14, marginTop: 4 }}>
                <span>
                  <MapPin size={14} /> {COMPANY.city}
                </span>
                <span>
                  <Briefcase size={14} /> {COMPANY.mode}
                </span>
              </div>
            </div>
            <span className="sp" />
            <div style={{ display: 'grid', gap: 8 }}>
              <span className="badge ok">
                <CheckCircle2 size={14} /> Jawaban tersimpan
              </span>
              {decided ? (
                <span className="badge pri">Keputusan: {decided.value}</span>
              ) : (
                <span className="badge warn">
                  <Clock size={14} /> Menunggu tinjauan HRD
                </span>
              )}
            </div>
          </div>
          <div className="card">
            <h2>Transkrip wawancara</h2>
            <p className="muted small">Ucapan Anda yang tercatat, beserta riwayat koreksi.</p>
            {s.sess.endedEarly && (
              <div className="notice warn" style={{ marginTop: 12 }}>
                <Info size={18} /> Sesi diakhiri lebih awal. Kompetensi yang belum ditanyakan ditulis “belum diperiksa”, bukan kemampuan rendah.
              </div>
            )}
            {turns.length === 0 && <div className="notice" style={{ marginTop: 12 }}>Belum ada jawaban tersimpan.</div>}
            {turns.map((t) => (
              <div key={t.id} style={{ border: '1px solid var(--line)', borderRadius: 12, marginTop: 14, overflow: 'hidden' }}>
                <div className="row" style={{ background: '#f1f1fa', padding: '12px 16px' }}>
                  <HelpCircle size={18} color="#4338ca" />
                  <b className="small">
                    {t.id} • {t.question}
                  </b>
                </div>
                <div className="row" style={{ alignItems: 'flex-start', padding: 16 }}>
                  <div className="ico xs" style={{ borderRadius: '50%' }}>
                    <User size={16} />
                  </div>
                  <div style={{ flex: 1, border: '1px solid var(--line)', borderRadius: 10, padding: '12px 14px' }}>
                    <b className="small">{name}</b>
                    <div>“{turnText(t)}”</div>
                    {t.corrections.map((c: any) => (
                      <div key={c.idx} className="row small" style={{ background: '#eef0fb', borderRadius: 8, padding: '8px 12px', marginTop: 8, color: '#2b2b8f' }}>
                        <Edit3 size={14} /> {c.from} → {c.to} • koreksi kandidat belum diverifikasi
                      </div>
                    ))}
                    {t.reported && (
                      <div className="row small" style={{ background: '#fdf1d9', borderRadius: 8, padding: '8px 12px', marginTop: 8, color: '#7a4a05' }}>
                        <Flag size={14} /> Dilaporkan: transkrip tidak sesuai rekaman. Menunggu tinjauan HRD.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid">
          <div className="card">
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <div className="ico">
                <Flag size={26} />
              </div>
              <div>
                <h2>Langkah berikutnya</h2>
                <p className="muted small">HRD memeriksa laporan dan menentukan tindak lanjut. Anda akan menerima notifikasi melalui email dan aplikasi.</p>
              </div>
            </div>
            <div className="tl" style={{ marginTop: 16 }}>
              {[
                ['Jawaban tersimpan', 'Wawancara Anda telah selesai dan tersimpan.', true],
                ['Tinjauan oleh HRD', decided ? 'HRD telah mencatat keputusan.' : 'HRD sedang memeriksa hasil wawancara.', !!decided],
                ['Informasi tindak lanjut', decided ? `Status: ${decided.value}` : 'Anda akan diberi kabar melalui email dan aplikasi.', !!decided],
              ].map(([t, d, on]: any) => (
                <div key={t} className="tl-i" style={{ alignItems: 'flex-start' }}>
                  <span className={'dot' + (on ? '' : ' off')}>{on && <CheckCircle2 size={14} />}</span>
                  <div>
                    <b>{t}</b>
                    <div className="muted small">{d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 className="h3">Aksi lainnya</h3>
            {[
              [FileText, 'Lihat transkrip lengkap', 'Lihat seluruh catatan wawancara Anda.', () => setFull(true)],
              [AlertTriangle, 'Laporkan masalah catatan', 'Jika ada ketidaksesuaian pada transkrip.', () => setRep(true)],
            ].map(([I, t, d, f]: any, i) => (
              <button key={t} onClick={f} className="row" style={{ width: '100%', textAlign: 'left', border: '1px solid var(--line)', borderRadius: 12, padding: 14, marginTop: 12, background: '#fff' }}>
                <div className="ico xs" style={i === 1 ? { background: '#fdecea', color: '#dc2626' } : undefined}>
                  <I size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <b>{t}</b>
                  <div className="muted small">{d}</div>
                </div>
                <ChevronRight size={18} color="#8a8aa8" />
              </button>
            ))}
            <Link to="/pelamar/lamaran" className="btn out block" style={{ marginTop: 14 }}>
              Lihat status lamaran
            </Link>
          </div>
          <div className="notice">
            <Info size={18} />
            Skor dan anotasi internal tidak ditampilkan kepada pelamar pada rancangan awal. Fokusnya transkrip dan status.
          </div>
        </div>
      </div>
      {full && (
        <Modal title="Transkrip lengkap" onClose={() => setFull(false)}>
          {turns.map((t) => (
            <div key={t.id} style={{ marginBottom: 14 }}>
              <div className="small muted">
                {t.id} · {COMPS[t.comp].name}
              </div>
              <b>{t.question}</b>
              <p style={{ marginTop: 4 }}>“{turnText(t)}”</p>
            </div>
          ))}
        </Modal>
      )}
      {rep && (
        <Modal title="Laporkan masalah catatan" onClose={() => setRep(false)}>
          <p className="muted small">Laporan ini adalah permintaan pemeriksaan atas catatan yang sudah ada. Tidak mengganti jawaban lama atau menambah jawaban baru.</p>
          <label className="f" style={{ marginTop: 12 }}>
            Bagian yang bermasalah
          </label>
          <select className="select input" value={pick} onChange={(e) => setPick(e.target.value)}>
            <option value="">Pilih giliran…</option>
            {turns.map((t) => (
              <option key={t.id} value={t.id}>
                {t.id} — {COMPS[t.comp].name}
              </option>
            ))}
            <option value="teknis">Gangguan teknis</option>
          </select>
          <label className="f" style={{ marginTop: 12 }}>
            Penjelasan
          </label>
          <textarea className="input" rows={3} value={msg} onChange={(e) => setMsg(e.target.value)} />
          <button
            className="btn" style={{ marginTop: 14 }}
            disabled={!pick || !msg.trim()}
            onClick={() => {
              set((st) => ({ sess: { ...st.sess, turns: st.sess.turns.map((t) => (t.id === pick ? { ...t, reported: true } : t)) } }))
              setRep(false)
              setMsg('')
              toast('Laporan terkirim ke HRD untuk diperiksa.')
            }}
          >
            Kirim laporan
          </button>
        </Modal>
      )}
    </Page>
  )
}

/* ---------- Lamaran saya ---------- */
export function LamaranSaya() {
  const { s, live } = useStore()
  const nav = useNavigate()
  if (!live)
    return (
      <Page crumbs={['Lamaran Saya']} title="Lamaran saya" sub="Pantau status lamaran Anda di sini.">
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <p className="muted">Belum ada lamaran. Mulai dari halaman lowongan.</p>
          <Link to="/pelamar/lowongan" className="btn" style={{ marginTop: 14 }}>
            Lihat lowongan
          </Link>
        </div>
      </Page>
    )
  const step = s.periodEnded ? -1 : s.sess.status === 'selesai' ? (s.decision ? 4 : 3) : s.sess.status === 'berjalan' ? 2 : s.slot ? 2 : s.cv.confirmed ? 1 : 0
  const steps = ['Lamaran diterima', 'Data CV dikonfirmasi', 'Jadwal wawancara', 'Wawancara selesai · menunggu tinjauan', 'Keputusan HRD']
  const cta =
    s.sess.status === 'selesai'
      ? ['Lihat transkrip & status', '/pelamar/selesai']
      : s.slot
        ? ['Buka persiapan wawancara', '/pelamar/persiapan']
        : s.cv.confirmed
          ? ['Pilih jadwal', '/pelamar/jadwal']
          : ['Periksa CV', '/pelamar/periksa-cv']
  return (
    <Page crumbs={['Lamaran Saya', 'Detail Lamaran']} title="Lamaran saya" sub="Status dan tahapan lamaran Anda." code="P12 • Status lamaran">
      <div className="card" style={{ maxWidth: 820 }}>
        <div className="row">
          <div className="ico">
            <Building2 size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: 22, fontWeight: 800 }}>{JOB.title}</h3>
            <div className="muted small">
              {COMPANY.name} • {COMPANY.city} • {COMPANY.mode}
            </div>
          </div>
          <span className="sp" />
          {s.periodEnded ? <span className="badge warn">Tidak selesai — melewati batas waktu</span> : s.decision ? <span className="badge pri">{s.decision.value}</span> : <span className="badge gray">{live.status}</span>}
        </div>
        <div className="tl" style={{ marginTop: 20 }}>
          {steps.map((t, i) => (
            <div key={t} className="tl-i">
              <span className={'dot' + (i <= step ? '' : ' off')}>{i <= step && <CheckCircle2 size={14} />}</span>
              <b style={{ fontWeight: i <= step ? 600 : 500, color: i <= step ? 'var(--ink)' : 'var(--ink3)' }}>{t}</b>
              {i === 2 && s.slot && <span className="d">Hari 1 · {s.slot.time} WIB</span>}
            </div>
          ))}
        </div>
        {s.decision && (
          <div className="notice ok" style={{ marginTop: 14 }}>
            <CheckCircle2 size={18} />
            <div>
              <b>HRD mencatat keputusan: {s.decision.value}</b>
              {s.decision.value === 'Perlu pemeriksaan' ? 'Anda mungkin diminta mengerjakan tugas teknis atau wawancara tambahan.' : s.decision.value === 'Lanjut tahap berikutnya' ? 'Selamat! Tim HRD akan menghubungi Anda untuk tahap berikutnya.' : 'Terima kasih telah berpartisipasi. Keputusan ini diambil oleh manusia setelah meninjau laporan.'}
            </div>
          </div>
        )}
        <div className="row" style={{ marginTop: 18 }}>
          <button className="btn" onClick={() => nav(cta[1])}>
            {cta[0]}
          </button>
        </div>
      </div>
    </Page>
  )
}
