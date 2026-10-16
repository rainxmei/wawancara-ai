import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, MapPin, Briefcase, FileText, Mic, Square, RotateCcw, Lightbulb, MessageSquare, Lock, Info, Clock, Sparkles, CheckCircle2, Check, ChevronRight, Keyboard, WifiOff, FlagTriangleRight, Undo2 } from 'lucide-react'
import { Page } from '../../components/Shell'
import { Avatar, FakePlayer, Wave, useRecognizer, useSpeech } from '../../components/media'
import { useStore } from '../../store'
import { COMPANY, COMPS, JOB, QUESTIONS, Turn, Variant, judgeFree, tokenize, turnText, nowClock, fmtDur } from '../../data'

type Phase = 'asking' | 'recording' | 'processing' | 'review' | 'evaluating'
const SENSITIVE = /\d|memimpin|pemimpin|membantu|sendiri|ratus|puluh|ribu|milidetik|detik|menit|persen|%|kali|lipat/i

export default function Interview() {
  const nav = useNavigate()
  const { s, set, toast } = useStore()
  const sess = s.sess
  const q = QUESTIONS[Math.min(sess.qi, QUESTIONS.length - 1)]
  const follow = sess.follow && !!q.followUp
  const variants: Variant[] = follow ? q.followUp!.variants : q.variants
  const qText = follow ? q.followUp!.question : q.question({ project: s.cv.project })
  const prevTurn = sess.turns.filter((t) => t.qid === q.id).slice(-1)[0]
  const turnId = follow ? `${q.id}.1` : q.id

  const [phase, setPhase] = useState<Phase>('asking')
  const [vid, setVid] = useState('a')
  const [mode, setMode] = useState<'simulasi' | 'ketik' | 'mikrofon'>('simulasi')
  const [typed, setTyped] = useState('')
  const [pending, setPending] = useState<Turn | null>(null)
  const [secs, setSecs] = useState(0)
  const [line, setLine] = useState('')
  const [micNote, setMicNote] = useState('')
  const [evalStep, setEvalStep] = useState(0)
  const [typeErr, setTypeErr] = useState('')
  const sp = useSpeech(s.sound)
  const rec = useRecognizer()
  const alive = useRef(true)

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
      sp.stop()
    }
  }, [])

  useEffect(() => {
    if (sess.status === 'none') set((st) => ({ applied: true, form: st.form.name ? st.form : { ...st.form, name: 'Abyan Keane', email: 'abyan@example.com', wa: '0812 3456 7890' }, sess: { ...st.sess, status: 'berjalan' } }))
  }, [])

  // Saat pertanyaan berganti: avatar menyampaikan pertanyaan
  useEffect(() => {
    if (sess.status === 'selesai') {
      nav('/pelamar/selesai', { replace: true })
      return
    }
    if (sess.status === 'terputus') {
      nav('/pelamar/terputus', { replace: true })
      return
    }
    setPhase('asking')
    setVid('a')
    setTyped('')
    setPending(null)
    setSecs(0)
    setMicNote('')
    setTypeErr('')
    const first = sess.qi === 0 && !sess.follow && sess.turns.length === 0
    let cancel = false
    ;(async () => {
      await new Promise((r) => setTimeout(r, 450))
      if (cancel) return
      if (first) {
        setLine('Halo! Saya asisten AI Ruang Wawancara. Mari kita mulai sesi wawancara. Silakan jawab pertanyaan dengan jelas dan sesuai pengalaman Anda.')
        await sp.speak('Halo! Saya asisten AI Ruang Wawancara. Mari kita mulai sesi wawancara. Silakan jawab pertanyaan dengan jelas dan sesuai pengalaman Anda.')
        if (cancel) return
      }
      setLine(qText)
      await sp.speak(qText)
    })()
    return () => {
      cancel = true
      sp.stop()
    }
  }, [sess.qi, sess.follow])

  // Timer rekaman
  useEffect(() => {
    if (phase !== 'recording') return
    const t = setInterval(() => setSecs((x) => x + 1), 1000)
    return () => clearInterval(t)
  }, [phase])

  // Proses evaluasi (animasi langkah)
  useEffect(() => {
    if (phase !== 'evaluating') return
    setEvalStep(0)
    const ts = [setTimeout(() => setEvalStep(1), 500), setTimeout(() => setEvalStep(2), 1000), setTimeout(() => setEvalStep(3), 1500)]
    return () => ts.forEach(clearTimeout)
  }, [phase])

  const variant = variants.find((v) => v.id === vid) || variants[0]

  const startAnswer = () => {
    if (mode === 'ketik') {
      if (typed.trim().split(/\s+/).length < 3) {
        setTypeErr('Ketik jawaban minimal beberapa kata.')
        return
      }
    }
    sp.stop()
    setTypeErr('')
    setSecs(0)
    setPhase('recording')
    if (mode === 'mikrofon') rec.start()
  }

  const finishAnswer = async () => {
    setPhase('processing')
    let raw = variant.raw
    let mishear = variant.mishear
    let sufficient = variant.sufficient
    let measured = !!variant.measured
    let dur = variant.dur
    let source: Turn['source'] = 'simulasi'
    if (mode === 'ketik') {
      raw = typed.trim()
      const j = judgeFree(q.comp, raw)
      sufficient = j.sufficient
      measured = j.measured
      dur = Math.max(5, Math.round(j.words * 0.55))
      mishear = undefined
      source = 'ketik'
    } else if (mode === 'mikrofon') {
      const t = await rec.stop()
      if (t && t.trim().split(/\s+/).length >= 2) {
        raw = t.trim()
        const j = judgeFree(q.comp, raw)
        sufficient = j.sufficient
        measured = j.measured
        dur = Math.max(secs, 3)
        mishear = undefined
        source = 'mikrofon'
      } else {
        setMicNote('Tidak ada ucapan terdeteksi, jadi jawaban contoh dipakai untuk simulasi.')
      }
    }
    const turn: Turn = {
      id: turnId,
      qid: q.id,
      kind: follow ? 'lanjutan' : 'inti',
      comp: q.comp,
      question: qText,
      raw,
      tokens: tokenize(raw, mishear),
      corrections: [],
      sufficient,
      measured,
      dur,
      source,
      locked: false,
      confirmed: false,
    }
    await new Promise((r) => setTimeout(r, 1700))
    if (!alive.current) return
    setPending(turn)
    setPhase('review')
  }

  const lockTurn = (t: Turn, confirmed = true) => {
    const locked: Turn = { ...t, locked: true, confirmed }
    const turns = [...sess.turns, locked]
    // keputusan berikutnya
    const needFollow = !locked.sufficient && !follow && !!q.followUp && sess.followCount < 2
    setPhase('evaluating')
    setLine('Jawaban sudah dicatat.')
    sp.speak('Jawaban sudah dicatat.')
    setTimeout(() => {
      if (!alive.current) return
      if (needFollow) {
        set({ sess: { ...sess, turns, follow: true, followCount: sess.followCount + 1 } })
        return
      }
      const nextQ = sess.qi + 1
      if (nextQ >= QUESTIONS.length) {
        set({ sess: { ...sess, turns, follow: false, status: 'selesai' } })
        nav('/pelamar/selesai')
        return
      }
      set({ sess: { ...sess, turns, qi: nextQ, follow: false } })
    }, 2100)
  }

  const endEarly = () => {
    if (!window.confirm('Akhiri sesi sekarang? Kompetensi yang belum ditanyakan akan ditulis “belum diperiksa” (bukan nilai rendah).')) return
    sp.stop()
    set({ sess: { ...sess, status: 'selesai', endedEarly: true } })
    nav('/pelamar/selesai')
  }
  const disconnect = () => {
    sp.stop()
    set({ sess: { ...sess, status: 'terputus' } })
    nav('/pelamar/terputus')
  }

  const header = (
    <div className="row wrap" style={{ marginBottom: 18, gap: 10 }}>
      {QUESTIONS.map((x, i) => (
        <span key={x.id} className={'badge ' + (i < sess.qi ? 'ok' : i === sess.qi ? 'pri' : 'gray')}>
          {i < sess.qi ? <Check size={13} /> : null} {x.id} · {COMPS[x.comp].short}
        </span>
      ))}
      {follow && <span className="badge warn">Pertanyaan lanjutan</span>}
    </div>
  )

  /* ===== Fase review transkrip (P09) ===== */
  if (phase === 'review' && pending) {
    return (
      <Review
        turn={pending}
        onChange={setPending}
        onConfirm={() => lockTurn(pending, true)}
        onReport={() => {
          const t = { ...pending, reported: true }
          toast('Dilaporkan: rekaman dan masalahnya diarahkan ke HRD. Anda tidak perlu mengetik ulang jawaban.')
          lockTurn(t, true)
        }}
      />
    )
  }

  /* ===== Fase lain: panggung avatar ===== */
  const qBlock = follow ? (
    <>
      <div className="panel-soft" style={{ marginBottom: 12 }}>
        <div className="row" style={{ marginBottom: 6 }}>
          <MessageSquare size={18} color="#4338ca" />
          <b className="small">Jawaban Anda sebelumnya</b>
        </div>
        <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 10, padding: '12px 14px' }}>“{prevTurn ? turnText(prevTurn) : '…'}”</div>
      </div>
      <span className="badge pri" style={{ marginBottom: 10, alignSelf: 'flex-start' }}>
        <Lightbulb size={14} /> Penggalian bukti
      </span>
      <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.6 }}>Pertanyaan lanjutan</h2>
      <p className="muted small" style={{ margin: '4px 0 12px' }}>
        Pertanyaan ini menggali bukti konkret dari pengalaman Anda sebelumnya.
      </p>
      <div className="q-box sm">{qText}</div>
    </>
  ) : (
    <>
      <div className="small" style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: 6 }}>
        Pertanyaan {sess.qi + 1}
      </div>
      <div className="q-box">{qText}</div>
    </>
  )

  return (
    <Page crumbs={['Wawancara', 'Sesi AI']} title={phase === 'recording' ? 'Wawancara dengan AI' : 'Wawancara AI'} sub={phase === 'recording' ? 'Jawab pertanyaan berikut dengan suara. Dengarkan pertanyaan dengan saksama dan berikan jawaban terbaik Anda.' : `${JOB.title} • ${COMPS[q.comp].name}`} code={phase === 'recording' ? 'P08 • Jawaban lisan' : follow ? 'P10 • Evidence seeking' : 'P07 • AI menyampaikan pertanyaan'}>
      {header}
      <div className="stage">
        <div className="card avatar-card">
          <div className="avatar-frame">
            <Avatar speaking={sp.speaking} level={sp.level} />
            <div className="ai-chip">
              <Sparkles size={15} /> AI Pewawancara
            </div>
            {line && (
              <div className="subtitle" aria-live="polite">
                {line}
              </div>
            )}
            {!line && (
              <div className="avatar-label">
                <Mic size={16} /> Avatar pewawancara
              </div>
            )}
          </div>
        </div>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {phase === 'asking' && (
            <>
              <div className="row">
                <div className="ico">
                  <MessageSquare size={26} />
                </div>
                <div>
                  <h2 style={{ fontSize: 24, fontWeight: 800 }}>Pertanyaan</h2>
                  <div className="muted small">
                    {JOB.title} • {COMPANY.name} • {COMPANY.city}
                  </div>
                </div>
                {sp.speaking && (
                  <span className="badge pri" style={{ marginLeft: 'auto' }}>
                    <span className="eq" style={{ display: 'inline-flex', gap: 2, alignItems: 'flex-end', height: 12 }}>
                      <i style={{ width: 3, background: '#4338ca', height: 8 }} />
                      <i style={{ width: 3, background: '#4338ca', height: 12 }} />
                      <i style={{ width: 3, background: '#4338ca', height: 6 }} />
                    </span>
                    Avatar berbicara
                  </span>
                )}
              </div>
              {qBlock}
              <div className="panel-soft row">
                <div className="ico sm" style={{ background: '#e8e8fb', borderRadius: '50%' }}>
                  <Clock size={22} />
                </div>
                <div>
                  <b>Waktu berpikir</b>
                  <div className="muted small">Durasi akan ditetapkan setelah pengujian.</div>
                </div>
              </div>
              <div className="row">
                <button className="btn" style={{ flex: 1.3, height: 54 }} onClick={startAnswer}>
                  <Mic size={20} /> Mulai menjawab
                </button>
                <button
                  className="btn out"
                  style={{ flex: 1, height: 54 }}
                  onClick={() => {
                    setLine(qText)
                    sp.speak(qText)
                  }}
                >
                  <RotateCcw size={18} /> Ulangi pertanyaan
                </button>
              </div>
              {follow && (
                <p className="small muted">
                  <Info size={14} style={{ verticalAlign: -2 }} /> Pertanyaan lanjutan dibatasi oleh waktu dan cakupan kompetensi.
                </p>
              )}
              <div className="demo-card">
                <div className="ttl">
                  <Sparkles size={14} /> Panel simulasi · pilih jawaban Anda
                </div>
                <div className="row wrap" style={{ gap: 8, marginBottom: 10 }}>
                  {[
                    ['simulasi', 'Jawaban contoh'],
                    ['ketik', 'Ketik sendiri'],
                    ...(rec.supported ? [['mikrofon', 'Mikrofon sungguhan']] : []),
                  ].map(([k, l]) => (
                    <button key={k} className={'btn sm ' + (mode === k ? '' : 'out')} onClick={() => setMode(k as any)}>
                      {k === 'ketik' ? <Keyboard size={14} /> : k === 'mikrofon' ? <Mic size={14} /> : <Sparkles size={14} />} {l}
                    </button>
                  ))}
                </div>
                {mode === 'simulasi' &&
                  variants.map((v) => (
                    <label key={v.id} className={'opt' + (vid === v.id ? ' sel' : '')}>
                      <input type="radio" name="v" checked={vid === v.id} onChange={() => setVid(v.id)} />
                      <div>
                        <b>{v.label}</b>
                        <span>{v.note}</span>
                        <div className="small muted" style={{ marginTop: 4, fontStyle: 'italic' }}>
                          “{v.raw.length > 110 ? v.raw.slice(0, 110) + '…' : v.raw}”
                        </div>
                      </div>
                    </label>
                  ))}
                {mode === 'ketik' && (
                  <>
                    <textarea className="input" rows={3} placeholder="Ketik jawaban Anda seolah-olah diucapkan…" value={typed} onChange={(e) => setTyped(e.target.value)} />
                    {typeErr && <div className="err">{typeErr}</div>}
                    <div className="tiny" style={{ marginTop: 4 }}>
                      Dinilai dengan aturan kata kunci sederhana, bukan AI. Mode ini hanya untuk simulasi (produk asli memakai suara).
                    </div>
                  </>
                )}
                {mode === 'mikrofon' && <div className="small muted">Izinkan mikrofon saat diminta, lalu bicara. Pengenalan suara memakai fitur bawaan browser (Chrome/Edge), bukan model lokal.</div>}
                <div className="row" style={{ marginTop: 10, justifyContent: 'space-between' }}>
                  <button className="btn out sm" onClick={disconnect}>
                    <WifiOff size={14} /> Simulasikan koneksi putus
                  </button>
                  {sess.turns.length > 0 && (
                    <button className="btn out sm" onClick={endEarly}>
                      Akhiri sesi lebih awal
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {phase === 'recording' && (
            <>
              <div className="row">
                <div className="ico">
                  <FileText size={26} />
                </div>
                <div>
                  <div className="small muted">Posisi yang dilamar</div>
                  <b style={{ fontSize: 20 }}>{JOB.title}</b>
                  <div className="meta-row small" style={{ gap: 14 }}>
                    <span>
                      <Building2 size={14} /> {COMPANY.name}
                    </span>
                    <span>
                      <MapPin size={14} /> {COMPANY.city}
                    </span>
                    <span>
                      <Briefcase size={14} /> {COMPANY.mode}
                    </span>
                  </div>
                </div>
              </div>
              <hr style={{ border: 0, borderTop: '1px solid var(--line)' }} />
              {qBlock}
              <div className="panel-soft">
                <div className="row">
                  <span className="badge pri">
                    <Mic size={14} /> Anda sedang menjawab
                  </span>
                  <span className="sp" />
                  <b style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtDur(secs)}</b>
                </div>
                <Wave active live height={96} />
                {mode === 'ketik' && <div className="small muted">Mode ketik: “{typed.slice(0, 80)}{typed.length > 80 ? '…' : ''}”</div>}
              </div>
              <div className="row between" style={{ justifyContent: 'space-between' }}>
                <span className="small muted">
                  <Info size={14} style={{ verticalAlign: -2 }} /> Jeda singkat tidak otomatis mengakhiri jawaban.
                </span>
                <span className="badge gray">
                  <Clock size={13} /> Batas waktu belum ditetapkan
                </span>
              </div>
              <button className="btn block" style={{ height: 56, fontSize: 17 }} onClick={finishAnswer}>
                <Square size={16} fill="#fff" /> Selesai menjawab
              </button>
            </>
          )}

          {(phase === 'processing' || phase === 'evaluating') && (
            <div style={{ display: 'grid', placeItems: 'center', flex: 1, textAlign: 'center', gap: 16, padding: '30px 10px' }}>
              <div className="spin" />
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800 }}>{phase === 'processing' ? 'Memproses transkrip…' : 'Jawaban sudah dicatat'}</h2>
                <p className="muted small" style={{ marginTop: 4 }}>
                  {phase === 'processing' ? 'Audio disimpan lebih dulu, lalu diubah menjadi teks (STT). Waktu tunggu ini tidak memakan jatah koreksi Anda.' : 'Sistem memeriksa cakupan bukti. Belum ada penilaian yang ditampilkan kepada Anda.'}
                </p>
                {micNote && <div className="notice warn" style={{ marginTop: 10 }}>{micNote}</div>}
              </div>
              {phase === 'evaluating' && (
                <div style={{ textAlign: 'left', width: 'min(360px,100%)' }}>
                  {['Jawaban terkunci & tersimpan', 'Bukti dipetakan ke indikator', 'Cakupan & jatah klarifikasi diperiksa', 'Menentukan pertanyaan berikutnya'].map((t, i) => (
                    <div key={t} className="row" style={{ padding: '5px 0', color: i <= evalStep ? 'var(--ink)' : 'var(--ink3)' }}>
                      {i < evalStep ? <CheckCircle2 size={18} color="#16a34a" /> : <span style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #d3d3e6' }} />}
                      {t}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Page>
  )
}

/* ---------- P09: Periksa transkrip & koreksi terbatas ---------- */
function Review({ turn, onChange, onConfirm, onReport }: { turn: Turn; onChange: (t: Turn) => void; onConfirm: () => void; onReport: () => void }) {
  const { s } = useStore()
  const [sel, setSel] = useState<number | null>(null)
  const [val, setVal] = useState('')
  const [err, setErr] = useState('')
  const open = (i: number) => {
    setSel(i)
    setVal('')
    setErr('')
  }
  const corrIdx = (i: number) => turn.corrections.findIndex((c: any) => c.idx === i)
  const save = () => {
    const v = val.trim()
    if (!v) return setErr('Isi teks pengganti.')
    if (v.split(/\s+/).length > 3 || v.length > 28) return setErr('Koreksi hanya untuk potongan pendek (maks. 3 kata). Menambah jawaban tidak diizinkan.')
    if (turn.corrections.length >= 5) return setErr('Batas jumlah koreksi per jawaban tercapai.')
    const from = turn.tokens[sel!]
    const sensitive = SENSITIVE.test(from) || SENSITIVE.test(v)
    const c: any = { from, to: v, at: nowClock(), status: sensitive ? 'Perlu tinjauan' : 'Diajukan kandidat', sensitive, idx: sel }
    onChange({ ...turn, corrections: [...turn.corrections.filter((x: any) => x.idx !== sel), c] })
    setSel(null)
  }
  const undo = (i: number) => onChange({ ...turn, corrections: turn.corrections.filter((x: any) => x.idx !== i) })
  const name = s.form.name || 'Abyan Keane'
  return (
    <Page crumbs={['Jadwal', 'Sesi wawancara', 'Periksa transkrip']} title="Periksa transkrip jawaban" sub="Periksa transkripsi jawaban Anda. Koreksi hanya kata yang salah terbaca." code="P09 • Koreksi transkrip terbatas">
      <div className="card row" style={{ marginBottom: 18, gap: 28 }}>
        <div className="row">
          <div className="ico sm" style={{ borderRadius: '50%' }}>
            <FileText size={22} />
          </div>
          <div>
            <b style={{ fontSize: 17 }}>{name}</b>
            <div className="muted small">Pelamar</div>
          </div>
        </div>
        <div className="row">
          <div className="ico sm">
            <Briefcase size={22} />
          </div>
          <div>
            <b>{JOB.title}</b>
            <div className="muted small">
              {COMPANY.name} • {COMPANY.city} • {COMPANY.mode}
            </div>
          </div>
        </div>
        <span className="sp" />
        <div>
          <b>
            {turn.id} · {COMPS[turn.comp].short}
          </b>
          <div className="muted small">{turn.kind === 'lanjutan' ? 'Pertanyaan lanjutan' : 'Pertanyaan inti'}</div>
        </div>
      </div>
      <div className="grid cols" style={{ gridTemplateColumns: '300px 1fr', alignItems: 'stretch' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ width: 190, height: 190, margin: '4px auto 8px', borderRadius: '50%', overflow: 'hidden', background: '#e8e5fb', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, transform: 'scale(1.5) translateY(14%)' }}>
              <Avatar />
            </div>
          </div>
          <div className="tiny">Avatar AI</div>
          <div className="notice" style={{ marginTop: 12, background: '#e8e8fb', color: '#2b2b8f', justifyContent: 'center', fontWeight: 600 }}>
            <Lock size={18} /> Audio jawaban sudah dikunci
          </div>
          <p className="small muted" style={{ margin: '10px 0' }}>
            Rekaman audio tersimpan dengan aman dan tidak dapat diubah.
          </p>
          <FakePlayer seconds={turn.dur} />
        </div>
        <div className="card" style={{ position: 'relative', minHeight: 330 }}>
          <div className="row">
            <h2>Transkrip jawaban</h2>
            <span className="sp" />
            <span className="badge warn">
              <Info size={14} /> {turn.corrections.length ? 'Koreksi kandidat belum diverifikasi' : 'Transkrip awal dari STT'}
            </span>
          </div>
          <div className="tx-text" style={{ marginTop: 18 }}>
            {turn.tokens.map((tok, i) => {
              const ci = corrIdx(i)
              const c: any = ci >= 0 ? turn.corrections[ci] : null
              const mis = tok.includes(' ') && !c
              const nextPunct = /^[.,;:!?]/.test(turn.tokens[i + 1] || '')
              return (
                <span key={i}>
                  <span className={'tok' + (c ? ' fixed' : mis ? ' mis' : '') + (sel === i ? ' sel' : '')} onClick={() => open(i)} title="Klik untuk koreksi">
                    {c ? c.to : tok}
                  </span>
                  {nextPunct ? '' : ' '}
                </span>
              )
            })}
          </div>
          {turn.corrections.length > 0 && (
            <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
              {turn.corrections.map((c: any) => (
                <div key={c.idx} className="notice" style={{ background: '#eef0fb', alignItems: 'center' }}>
                  <FileText size={16} />
                  <span>
                    <s>{c.from}</s> → <strong>{c.to}</strong> · {c.status}
                    {c.sensitive && ' (memengaruhi makna, akan diperiksa HRD)'}
                  </span>
                  <button className="btn out sm" style={{ marginLeft: 'auto', height: 30 }} onClick={() => undo(c.idx)}>
                    <Undo2 size={13} /> Batal
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="notice" style={{ position: 'absolute', left: 24, bottom: 20, right: 24, background: '#f3f3fa', color: 'var(--ink2)' }}>
            <Info size={16} /> Transkrip awal, koreksi, dan rekaman tetap tersimpan.
            <button className="small" style={{ marginLeft: 'auto', background: 'none', border: 0, color: 'var(--primary)', fontWeight: 600 }} onClick={onReport}>
              Transkrip tidak sesuai rekaman
            </button>
          </div>
          {sel !== null && (
            <div className="pop" style={{ position: 'relative', marginTop: 16, width: 330 }}>
              <div className="row">
                <h3 className="h3">Koreksi potongan</h3>
                <span className="sp" />
                <button style={{ background: 'none', border: 0, color: 'var(--ink3)' }} onClick={() => setSel(null)}>
                  ✕
                </button>
              </div>
              <div className="small" style={{ fontWeight: 600, margin: '10px 0 4px' }}>
                Teks asli
              </div>
              <div className="input" style={{ height: 40, background: '#f1f1f8', display: 'flex', alignItems: 'center' }}>
                {turn.tokens[sel]}
              </div>
              <div className="small" style={{ fontWeight: 600, margin: '10px 0 4px' }}>
                Ganti dengan
              </div>
              <input className="input" style={{ height: 42 }} autoFocus value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && save()} placeholder={turn.tokens[sel].includes(' ') ? 'mis. FastAPI' : ''} />
              {err && <div className="err">{err}</div>}
              <button className="btn block" style={{ marginTop: 12, height: 42 }} onClick={save}>
                Simpan koreksi
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="row" style={{ marginTop: 18, gap: 16 }}>
        <div className="notice bad" style={{ flex: 1, alignItems: 'center' }}>
          <Lock size={24} />
          <div>
            <b>Tidak ada fitur tambah jawaban</b>
            Anda hanya dapat mengoreksi bagian tertentu dari transkrip. Jawaban tidak dapat ditambahkan.
          </div>
        </div>
        <button className="btn" style={{ height: 60, minWidth: 280, fontSize: 16 }} onClick={onConfirm}>
          Konfirmasi dan lanjutkan <ChevronRight size={18} />
        </button>
      </div>
    </Page>
  )
}
