import { useEffect, useRef, useState } from 'react'

/* ---------- Avatar pewawancara (SVG, animasi bicara, tanpa AI) ---------- */
export function Avatar({ speaking, level = 0, tone = 'lilac' }: { speaking?: boolean; level?: number; tone?: string }) {
  const o = speaking ? level : 0
  const mx = 200
  const my = 246
  const w = 21 + o * 3
  const open = 2 + o * 15
  return (
    <svg viewBox="0 0 400 408" aria-label="Avatar AI pewawancara" role="img">
      <defs>
        <linearGradient id="bgA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#cfc9f7" />
          <stop offset="1" stopColor="#e9e6fc" />
        </linearGradient>
        <linearGradient id="blazer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#34344a" />
          <stop offset="1" stopColor="#22222f" />
        </linearGradient>
        <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6d3b8" />
          <stop offset="1" stopColor="#eebf9f" />
        </linearGradient>
      </defs>
      <rect width="400" height="408" fill="url(#bgA)" />
      {/* background decor */}
      <g opacity=".55">
        <ellipse cx="46" cy="250" rx="26" ry="62" fill="#a7b9a0" transform="rotate(-14 46 250)" />
        <ellipse cx="78" cy="262" rx="20" ry="52" fill="#8fa88a" transform="rotate(16 78 262)" />
        <rect x="22" y="300" width="74" height="40" rx="8" fill="#b9b2e8" />
        <rect x="318" y="120" width="60" height="150" rx="8" fill="#d4cff5" />
        <rect x="328" y="132" width="10" height="46" rx="2" fill="#b3abe8" />
        <rect x="344" y="132" width="10" height="46" rx="2" fill="#9a91df" />
        <rect x="360" y="132" width="8" height="46" rx="2" fill="#b3abe8" />
      </g>
      <g className="sway">
        {/* hair back */}
        <path d="M118 175c-10-72 40-110 84-110s92 38 82 112c-3 34 6 60 14 82-26 6-50 2-62-10H166c-12 12-36 16-62 10 10-24 17-52 14-84z" fill="#1f1a22" />
        {/* neck */}
        <path d="M172 268h56v46c0 14-56 14-56 0z" fill="#ecb996" />
        {/* body / blazer */}
        <path d="M40 408c2-52 30-84 90-98l42-14 28 34 28-34 42 14c60 14 88 46 90 98z" fill="url(#blazer)" />
        <path d="M172 296l28 34 28-34 14 6-42 56-42-56z" fill="#f4f4f7" />
        <path d="M172 296l-40 14 36 62 12-14zM228 296l40 14-36 62-12-14z" fill="#2c2c3d" />
        <path d="M200 330v78" stroke="#1b1b27" strokeWidth="2" opacity=".4" />
        {/* ears */}
        <ellipse cx="127" cy="196" rx="9" ry="14" fill="#efc3a3" />
        <ellipse cx="273" cy="196" rx="9" ry="14" fill="#efc3a3" />
        {/* face */}
        <ellipse cx="200" cy="190" rx="73" ry="86" fill="url(#skin)" />
        {/* cheeks */}
        <ellipse cx="155" cy="224" rx="17" ry="10" fill="#f19b94" opacity=".32" />
        <ellipse cx="245" cy="224" rx="17" ry="10" fill="#f19b94" opacity=".32" />
        {/* brows */}
        <path d="M150 163c10-8 24-9 34-4" stroke="#2a1e24" strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M216 159c10-5 24-4 34 4" stroke="#2a1e24" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* eyes */}
        <g className="blink" style={{ transformOrigin: '200px 188px' }}>
          <ellipse cx="168" cy="188" rx="12" ry="8.5" fill="#fff" />
          <ellipse cx="232" cy="188" rx="12" ry="8.5" fill="#fff" />
          <circle cx="169" cy="188" r="6.6" fill="#2b1d21" />
          <circle cx="233" cy="188" r="6.6" fill="#2b1d21" />
          <circle cx="171" cy="185.5" r="2.1" fill="#fff" />
          <circle cx="235" cy="185.5" r="2.1" fill="#fff" />
          <path d="M155 184c5-7 20-9 26-1M219 183c6-8 21-6 26 1" stroke="#2a1e24" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        </g>
        {/* nose */}
        <path d="M200 196c-3 14-7 22-3 26 3 2 9 2 12 0" stroke="#d99f84" strokeWidth="3" strokeLinecap="round" fill="none" />
        {/* mouth */}
        {o > 0.06 ? (
          <g>
            <path d={`M${mx - w} ${my}Q${mx} ${my - 5} ${mx + w} ${my}Q${mx} ${my + open + 8} ${mx - w} ${my}Z`} fill="#7a2c3b" />
            <path d={`M${mx - w + 4} ${my + 0.5}Q${mx} ${my - 3} ${mx + w - 4} ${my + 0.5}L${mx + w - 6} ${my + 4}Q${mx} ${my + 2} ${mx - w + 6} ${my + 4}Z`} fill="#fff" opacity=".92" />
            <path d={`M${mx - w} ${my}Q${mx} ${my - 5} ${mx + w} ${my}`} stroke="#c0585f" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>
        ) : (
          <path d="M177 244q23 17 46 0" stroke="#c0585f" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        )}
        {/* hair front: poni menyamping + helai samping */}
        <path d="M124 196C112 110 156 74 204 76c50 2 86 38 74 120-6-44-26-72-58-84-22 26-62 46-96 84z" fill="#231c25" />
        <path d="M126 190c6 34 8 58 4 80-16-8-26-24-26-50 0-24 8-40 22-30z" fill="#231c25" />
        <path d="M274 190c-6 34-8 58-4 80 16-8 26-24 26-50 0-24-8-40-22-30z" fill="#231c25" />
        <path d="M168 94c24-10 56-8 76 8" stroke="#5a4b63" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".55" />
      </g>
    </svg>
  )
}

/* ---------- Suara avatar via Web Speech API (opsional, tanpa server) ---------- */
export function useSpeech(enabled: boolean) {
  const [speaking, setSpeaking] = useState(false)
  const [level, setLevel] = useState(0)
  const stopRef = useRef<() => void>(() => {})

  useEffect(() => {
    if (!speaking) {
      setLevel(0)
      return
    }
    let v = 0
    const t = setInterval(() => {
      const target = Math.random() > 0.25 ? 0.25 + Math.random() * 0.75 : 0.05
      v = v * 0.4 + target * 0.6
      setLevel(v)
    }, 95)
    return () => clearInterval(t)
  }, [speaking])

  useEffect(() => () => stopRef.current(), [])

  const speak = (text: string) =>
    new Promise<void>((resolve) => {
      stopRef.current()
      let done = false
      const finish = () => {
        if (done) return
        done = true
        clearTimeout(fallback)
        setSpeaking(false)
        resolve()
      }
      stopRef.current = () => {
        try {
          window.speechSynthesis?.cancel()
        } catch {}
        finish()
      }
      const est = Math.min(14000, 900 + text.length * 62)
      const fallback = setTimeout(finish, est + 1500)
      setSpeaking(true)
      const synth: SpeechSynthesis | undefined = (window as any).speechSynthesis
      if (!enabled || !synth) {
        setTimeout(finish, est)
        return
      }
      try {
        synth.cancel()
        const u = new SpeechSynthesisUtterance(text)
        u.lang = 'id-ID'
        const voices = synth.getVoices()
        const v = voices.find((x) => x.lang?.toLowerCase().startsWith('id'))
        if (v) u.voice = v
        u.rate = 1
        u.pitch = 1.05
        u.onend = finish
        u.onerror = () => setTimeout(finish, est)
        synth.speak(u)
      } catch {
        setTimeout(finish, est)
      }
    })
  const stop = () => stopRef.current()
  return { speaking, level, speak, stop }
}

/* ---------- Pengenalan suara sungguhan (opsional, Chrome/Edge) ---------- */
export function useRecognizer() {
  const SR: any = typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null
  const rec = useRef<any>(null)
  const text = useRef('')
  const supported = !!SR
  const start = () => {
    if (!SR) return
    text.current = ''
    const r = new SR()
    r.lang = 'id-ID'
    r.continuous = true
    r.interimResults = true
    let finals = ''
    r.onresult = (e: any) => {
      let interim = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) finals += t + ' '
        else interim += t
      }
      text.current = (finals + interim).trim()
    }
    r.onerror = () => {}
    try {
      r.start()
      rec.current = r
    } catch {}
  }
  const stop = () =>
    new Promise<string>((resolve) => {
      const r = rec.current
      if (!r) return resolve(text.current)
      r.onend = () => resolve(text.current)
      try {
        r.stop()
      } catch {
        resolve(text.current)
      }
      setTimeout(() => resolve(text.current), 1200)
    })
  return { supported, start, stop }
}

/* ---------- Gelombang suara ---------- */
export function Wave({ active, bars = 54, height = 100, live = false }: { active: boolean; bars?: number; height?: number; live?: boolean }) {
  const [hs, setHs] = useState<number[]>(() => Array.from({ length: bars }, (_, i) => 0.18 + 0.1 * Math.sin(i)))
  useEffect(() => {
    if (!active) {
      setHs(Array.from({ length: bars }, (_, i) => 0.12 + 0.06 * Math.sin(i * 0.7)))
      return
    }
    let ph = 0
    const t = setInterval(() => {
      ph += 0.45
      setHs(
        Array.from({ length: bars }, (_, i) => {
          const env = Math.sin((i / bars) * Math.PI)
          const n = Math.abs(Math.sin(ph + i * 0.55)) * 0.55 + Math.random() * 0.45
          return Math.max(0.08, env * n)
        }),
      )
    }, 110)
    return () => clearInterval(t)
  }, [active, bars])
  return (
    <div className="wave" style={{ height }}>
      {hs.map((h, i) => (
        <i key={i} style={{ height: `${Math.round(h * height)}px`, opacity: live ? 1 : 0.9 }} />
      ))}
    </div>
  )
}

/* ---------- Pemutar audio tiruan (progres saja) ---------- */
export function FakePlayer({ seconds }: { seconds: number }) {
  const [p, setP] = useState(0)
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!on) return
    const t = setInterval(() => {
      setP((x) => {
        if (x >= seconds) {
          setOn(false)
          return 0
        }
        return x + 0.25
      })
    }, 250)
    return () => clearInterval(t)
  }, [on, seconds])
  const f = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
  return (
    <div className="player">
      <button onClick={() => setOn(!on)} aria-label={on ? 'Jeda' : 'Putar'}>
        {on ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 4l13 8-13 8z" />
          </svg>
        )}
      </button>
      <span>{f(p)}</span>
      <div className="bar">
        <i style={{ width: `${(p / seconds) * 100}%` }} />
      </div>
      <span>{f(seconds)}</span>
    </div>
  )
}
