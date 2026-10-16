import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { Applicant, CV, Turn, SEED_APPLICANTS, todayId } from './data'

export interface AppState {
  form: { name: string; email: string; wa: string; portfolio: string; cvName: string; cvSize: string; start: string; consent: boolean }
  applied: boolean
  cv: { role: string; project: string; skills: string[]; history: { at: string; from: string; to: string }[]; confirmed: boolean; extra: string }
  slot: { id: string; time: string } | null
  allFull: boolean
  waitlist: boolean
  reschedules: number
  sess: { status: 'none' | 'berjalan' | 'terputus' | 'selesai'; qi: number; follow: boolean; followCount: number; turns: Turn[]; endedEarly: boolean; startedAt?: string }
  decision: { value: string; note: string; at: string } | null
  resolvedFlags: string[]
  periodEnded: boolean
  sound: boolean
  guideOpen: boolean
  seenGuide: boolean
  hrdJobPublished: boolean
  comps: Record<string, boolean>
  seedDecisions: Record<string, string>
}

export const initialState = (): AppState => ({
  form: { name: '', email: '', wa: '', portfolio: '', cvName: '', cvSize: '', start: '', consent: false },
  applied: false,
  cv: { role: 'Pemimpin seluruh proyek', project: 'Sistem Inventaris', skills: [...CV.skills.slice(0, 3)], history: [], confirmed: false, extra: '' },
  slot: null,
  allFull: false,
  waitlist: false,
  reschedules: 0,
  sess: { status: 'none', qi: 0, follow: false, followCount: 0, turns: [], endedEarly: false },
  decision: null,
  resolvedFlags: [],
  periodEnded: false,
  sound: true,
  guideOpen: false,
  seenGuide: false,
  hrdJobPublished: true,
  comps: { api: true, db: true, debug: true },
  seedDecisions: {},
})

const KEY = 'rw-sim-v2'
function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...initialState(), ...JSON.parse(raw) }
  } catch {}
  return initialState()
}

interface Ctx {
  s: AppState
  set: (p: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void
  reset: () => void
  applicants: Applicant[]
  live: Applicant | null
  toast: (m: string) => void
  toastMsg: string
}
const C = createContext<Ctx>(null as any)
export const useStore = () => useContext(C)

export function deriveLiveStatus(s: AppState): Applicant['status'] {
  if (s.periodEnded) return 'Tidak selesai'
  if (s.sess.status === 'selesai') return 'Selesai'
  if (s.sess.status === 'terputus') return 'Terputus'
  if (s.sess.status === 'berjalan') return 'Wawancara berlangsung'
  if (s.slot) return 'Terjadwal'
  if (s.waitlist) return 'Daftar tunggu'
  if (s.cv.confirmed) return 'Siap memilih jadwal'
  return 'Data perlu konfirmasi'
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<AppState>(load)
  const [toastMsg, setToast] = useState('')
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(s))
    } catch {}
  }, [s])
  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(() => setToast(''), 3200)
    return () => clearTimeout(t)
  }, [toastMsg])

  const value = useMemo<Ctx>(() => {
    const live: Applicant | null = s.applied
      ? {
          id: 'live',
          name: s.form.name || 'Pelamar (Anda)',
          email: s.form.email,
          phone: s.form.wa,
          status: deriveLiveStatus(s),
          decision: s.decision ? (s.decision.value as any) : s.sess.status === 'selesai' ? 'Menunggu tinjauan HRD' : '—',
          cv: true,
          date: s.sess.startedAt || '—',
          turns: s.sess.turns,
          live: true,
        }
      : null
    return {
      s,
      set: (p) => setS((prev) => ({ ...prev, ...(typeof p === 'function' ? p(prev) : p) })),
      reset: () => {
        try {
          localStorage.removeItem(KEY)
        } catch {}
        setS(initialState())
      },
      applicants: (live ? [live, ...SEED_APPLICANTS] : SEED_APPLICANTS).map((a) => (a.live || !s.seedDecisions[a.id] ? a : { ...a, decision: s.seedDecisions[a.id] as any })),
      live,
      toast: setToast,
      toastMsg,
    }
  }, [s, toastMsg])

  return <C.Provider value={value}>{children}</C.Provider>
}
export { todayId }
