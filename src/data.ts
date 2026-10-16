// Data contoh & logika simulasi. Tidak ada AI sungguhan: semua keluaran adalah skrip/heuristik sederhana.

export const COMPANY = { name: 'PT Contoh Teknologi', city: 'Malang', mode: 'Hybrid' }
export const JOB = {
  title: 'Backend Developer',
  team: 'Engineering',
  field: 'Produk Digital',
  type: 'Penuh waktu',
  about:
    'PT Contoh Teknologi adalah perusahaan teknologi yang mengembangkan solusi digital untuk berbagai industri. Kami membangun produk yang berdampak dan didukung oleh tim yang kolaboratif.',
  desc: [
    'Mengembangkan dan memelihara API serta database untuk mendukung produk.',
    'Melakukan debugging dan memastikan performa sistem tetap stabil.',
    'Bekerja sama dengan tim lintas fungsi untuk menghadirkan solusi yang andal dan skalabel.',
  ],
}

export type CompKey = 'api' | 'db' | 'debug'
export const COMPS: Record<CompKey, { name: string; short: string; desc: string; indicators: string[] }> = {
  api: {
    name: 'Pengembangan API',
    short: 'API',
    desc: 'Kemampuan merancang dan mengembangkan API yang terstruktur dan aman.',
    indicators: ['Menjelaskan kontribusi pribadi pada API', 'Validasi input & penanganan error', 'Pengujian dan kualitas kode'],
  },
  db: {
    name: 'Database',
    short: 'Database',
    desc: 'Pemahaman perancangan database, optimasi kueri, dan pemeliharaan data.',
    indicators: ['Alasan memilih optimasi (mis. indeks)', 'Dasar pengukuran sebelum–sesudah', 'Pemeliharaan & monitoring'],
  },
  debug: {
    name: 'Debugging',
    short: 'Debugging',
    desc: 'Kemampuan menganalisis masalah, melakukan debugging, dan memastikan sistem tetap stabil.',
    indicators: ['Langkah menelusuri akar masalah', 'Penggunaan log / alat bantu', 'Pencegahan masalah berulang'],
  },
}

export const CV = {
  name: 'Abyan Keane',
  title: 'Backend Developer',
  email: 'abyan.keane@email.com',
  phone: '0812 3456 7890',
  city: 'Malang, Jawa Timur',
  linkedin: 'linkedin.com/in/abyankeane',
  summary:
    'Pengembang backend dengan pengalaman membangun sistem web yang andal dan terukur. Fokus pada pengembangan API, pengelolaan basis data, dan integrasi layanan pihak ketiga.',
  projects: [
    {
      name: 'Sistem Inventaris',
      company: 'PT Contoh Teknologi',
      period: 'Jan 2023 – Jun 2023',
      text: 'Mengembangkan modul backend untuk sistem inventaris perusahaan. Membangun REST API menggunakan FastAPI, mengelola database PostgreSQL, dan melakukan integrasi dengan layanan eksternal.',
    },
    {
      name: 'Portal Internal',
      company: 'PT Maju Bersama',
      period: 'Agu 2022 – Des 2022',
      text: 'Membangun layanan backend untuk portal internal karyawan menggunakan Python dan FastAPI. Menangani autentikasi, manajemen data pengguna, dan pembuatan laporan.',
    },
  ],
  skills: ['Python', 'SQL', 'FastAPI', 'PostgreSQL', 'Git', 'Docker'],
}

// ---------- Slot ----------
export const SLOTS = [
  { id: 's1', time: '09.00 – 09.30', full: false },
  { id: 's2', time: '09.30 – 10.00', full: false },
  { id: 's3', time: '10.00 – 10.30', full: true },
  { id: 's4', time: '10.30 – 11.00', full: false },
  { id: 's5', time: '13.00 – 13.30', full: false },
  { id: 's6', time: '13.30 – 14.00', full: false },
]

// ---------- Pertanyaan & jawaban simulasi ----------
export interface Variant {
  id: string
  label: string
  note: string
  raw: string // transkrip mentah STT (bisa mengandung salah dengar)
  mishear?: string // potongan salah dengar
  fix?: string // koreksi yang diharapkan
  sufficient: boolean
  measured?: boolean
  dur: number
}
export interface QDef {
  id: string
  comp: CompKey
  question: (ctx: any) => string
  variants: Variant[]
  followUp?: { question: string; variants: Variant[] }
}

export const QUESTIONS: QDef[] = [
  {
    id: 'Q-01',
    comp: 'api',
    question: (c) => `Ceritakan proyek API yang Anda tulis di CV, yaitu ${c.project || 'Sistem Inventaris'}. Bagian mana yang Anda kerjakan sendiri?`,
    variants: [
      {
        id: 'a',
        label: 'Jawaban lengkap',
        note: 'Menyebut peran, teknologi, dan tindakan nyata',
        raw: 'Saya mengerjakan modul API menggunakan fast kopi. Saya membuat endpoint, validasi input, dan penanganan error. Saya juga menulis unit test untuk endpoint utama.',
        mishear: 'fast kopi',
        fix: 'FastAPI',
        sufficient: true,
        dur: 28,
      },
      {
        id: 'b',
        label: 'Jawaban umum',
        note: 'Tidak jelas bagian pribadi → memicu pertanyaan lanjutan',
        raw: 'Saya ikut membantu tim membuat API untuk aplikasi inventaris. Kami bekerja bersama dan semuanya berjalan dengan baik.',
        sufficient: false,
        dur: 17,
      },
    ],
    followUp: {
      question: 'Dari proyek tersebut, bagian mana yang Anda kerjakan sendiri? Mohon sebutkan tindakan Anda dan hasilnya.',
      variants: [
        {
          id: 'a',
          label: 'Menjelaskan bagian sendiri',
          note: 'Bukti kontribusi pribadi tersedia',
          raw: 'Bagian saya adalah modul stok masuk dan keluar. Saya membuat endpoint, validasi input, dan menulis pengujian untuk modul itu.',
          sufficient: true,
          dur: 19,
        },
        {
          id: 'b',
          label: 'Masih umum',
          note: 'Bukti belum cukup → diberi flag',
          raw: 'Ya, saya bekerja bersama tim di semua bagian aplikasi itu.',
          sufficient: false,
          dur: 9,
        },
      ],
    },
  },
  {
    id: 'Q-02',
    comp: 'db',
    question: () => 'Bagaimana Anda mendesain dan mengoptimalkan database untuk aplikasi dengan trafik tinggi?',
    variants: [
      {
        id: 'a',
        label: 'Jawaban lengkap + pengukuran',
        note: 'Alasan indeks dan hasil pengukuran jelas',
        raw: 'Saya menambahkan indeks pada kolom pencarian transaksi karena kueri lambat. Saya mengukur dengan explain analyze, waktu respons turun dari sekitar delapan ratus milidetik menjadi seratus dua puluh milidetik.',
        sufficient: true,
        measured: true,
        dur: 31,
      },
      {
        id: 'b',
        label: 'Jawaban singkat tanpa pengukuran',
        note: 'Seperti pada desain: dasar pengukuran belum cukup',
        raw: 'Saya menambahkan indeks agar pencarian lebih cepat.',
        sufficient: false,
        dur: 8,
      },
    ],
    followUp: {
      question: 'Bagaimana Anda mengukur hasil sebelum dan sesudah perubahan tersebut?',
      variants: [
        {
          id: 'a',
          label: 'Menjelaskan cara ukur',
          note: 'Dasar pengukuran jelas',
          raw: 'Saya membandingkan waktu eksekusi kueri sebelum dan sesudah indeks memakai explain analyze di data uji yang sama.',
          sufficient: true,
          measured: true,
          dur: 18,
        },
        {
          id: 'b',
          label: 'Tidak ada pengukuran',
          note: 'Bukti belum cukup → diberi flag',
          raw: 'Saya belum mencatat pengukuran sebelum dan sesudahnya.',
          sufficient: false,
          dur: 7,
        },
      ],
    },
  },
  {
    id: 'Q-03',
    comp: 'debug',
    question: () => 'Ceritakan satu kasus debugging yang paling menantang. Bagaimana Anda menemukan penyebabnya?',
    variants: [
      {
        id: 'a',
        label: 'Jawaban lengkap',
        note: 'Langkah, alat bantu, dan pencegahan jelas',
        raw: 'Pernah ada endpoint yang sesekali timeout. Saya membaca log, mereproduksi masalahnya, lalu menemukan koneksi database tidak dilepas. Saya memperbaikinya dan menambahkan tes serta monitoring.',
        sufficient: true,
        dur: 29,
      },
      {
        id: 'b',
        label: 'Jawaban umum',
        note: 'Tidak ada langkah konkret → memicu pertanyaan lanjutan',
        raw: 'Biasanya saya cari bug-nya sampai ketemu lalu diperbaiki.',
        sufficient: false,
        dur: 8,
      },
    ],
    followUp: {
      question: 'Alat atau langkah apa yang Anda gunakan untuk menelusuri akar masalah pada kasus itu?',
      variants: [
        {
          id: 'a',
          label: 'Menyebut langkah & alat',
          note: 'Bukti tersedia',
          raw: 'Saya mulai dari log error, mereproduksi dengan data yang sama, lalu memakai debugger dan trace untuk melihat alurnya.',
          sufficient: true,
          dur: 17,
        },
        {
          id: 'b',
          label: 'Masih umum',
          note: 'Bukti belum cukup → diberi flag',
          raw: 'Ya pokoknya dicek satu per satu sampai ketemu.',
          sufficient: false,
          dur: 6,
        },
      ],
    },
  },
]

// ---------- Heuristik untuk jawaban ketik / mikrofon ----------
const KW: Record<CompKey, string[]> = {
  api: ['endpoint', 'validasi', 'rest', 'fastapi', 'error', 'test', 'tes', 'autentikasi', 'modul'],
  db: ['indeks', 'index', 'query', 'kueri', 'optimasi', 'explain', 'ukur', 'benchmark', 'monitoring'],
  debug: ['log', 'trace', 'reproduksi', 'akar', 'debugger', 'bug', 'timeout', 'monitoring', 'tes'],
}
export function judgeFree(comp: CompKey, text: string) {
  const t = text.toLowerCase()
  const words = t.split(/\s+/).filter(Boolean).length
  const hits = KW[comp].filter((k) => t.includes(k)).length
  const measured = /\d|ukur|benchmark|sebelum|sesudah|explain/.test(t)
  const sufficient = words >= 14 && hits >= 2
  return { sufficient, measured, words, hits }
}

// ---------- Tipe giliran & evaluasi ----------
export interface Correction {
  from: string
  to: string
  at: string
  status: 'Diajukan kandidat' | 'Perlu tinjauan' | 'Diterima setelah pemeriksaan' | 'Tidak sesuai rekaman'
  sensitive?: boolean
  idx?: number
}
export interface Turn {
  id: string
  qid: string
  kind: 'inti' | 'lanjutan'
  comp: CompKey
  question: string
  raw: string
  tokens: string[]
  corrections: Correction[]
  sufficient: boolean
  measured?: boolean
  dur: number
  source: 'simulasi' | 'ketik' | 'mikrofon'
  locked: boolean
  confirmed: boolean // dikonfirmasi kandidat (false = kunci karena waktu habis)
  reported?: boolean
}

export function tokenize(raw: string, mishear?: string): string[] {
  if (!mishear) return raw.split(/\s+/).filter(Boolean)
  const i = raw.indexOf(mishear)
  if (i < 0) return raw.split(/\s+/).filter(Boolean)
  const before = raw.slice(0, i).split(/\s+/).filter(Boolean)
  const after = raw.slice(i + mishear.length).split(/\s+/).filter(Boolean)
  return [...before, mishear, ...after]
}
export function turnText(t: Turn) {
  return t.tokens
    .map((tok, i) => {
      const c = t.corrections.find((c) => c.idx === i)
      return c ? c.to : tok
    })
    .join(' ')
    .replace(/\s+([.,;:!?])/g, '$1')
}

export type CompResult = {
  key: CompKey
  status: 'tersedia' | 'tinjau' | 'belum'
  score: number | null
  level: string
  quote: string
  source: string
  issue?: string
}
export function levelOf(s: number | null) {
  if (s == null) return '—'
  return s >= 80 ? 'Kuat' : s >= 65 ? 'Cukup' : 'Perlu digali'
}

export function evaluate(turns: Turn[]): { comps: CompResult[]; overall: number | null; flags: Flag[] } {
  const flags: Flag[] = []
  const comps: CompResult[] = (['api', 'db', 'debug'] as CompKey[]).map((key) => {
    const ts = turns.filter((t) => t.comp === key)
    if (!ts.length) {
      flags.push({
        id: `f-${key}-cov`,
        type: 'Kompetensi belum diperiksa',
        comp: key,
        reason: `Sesi berakhir sebelum pertanyaan ${COMPS[key].name} dibahas. Catat keterbatasan cakupan; bukan nilai rendah.`,
        source: '—',
        resolved: false,
      })
      return { key, status: 'belum', score: null, level: '—', quote: 'Belum ada cuplikan jawaban yang ditinjau untuk kompetensi ini.', source: 'Belum ada sumber jawaban' }
    }
    const last = ts[ts.length - 1]
    const text = ts.map((t) => turnText(t)).join(' ')
    const suff = ts.some((t) => t.sufficient) && last.sufficient
    const measured = ts.some((t) => t.measured)
    const words = text.split(/\s+/).length
    let score = 52 + Math.min(18, Math.round(words / 3)) + (suff ? 14 : 0) + (measured ? 8 : 0) + (ts.length === 1 && suff ? 4 : 0)
    if (!suff) score = Math.min(score, 64)
    score = Math.max(40, Math.min(94, score))
    const corr = ts.filter((t) => t.corrections.length)
    corr.forEach((t) =>
      flags.push({
        id: `f-${t.id}-corr`,
        type: 'Koreksi transkrip perlu diperiksa',
        comp: key,
        reason: `Kandidat mengoreksi: ${t.corrections.map((c) => `“${c.from}” → “${c.to}”`).join(', ')}. HRD mendengarkan potongan audio dan memutuskan koreksi.`,
        source: `${t.id} • Audio`,
        resolved: false,
      }),
    )
    if (!suff) {
      flags.push({
        id: `f-${key}-ev`,
        type: 'Bukti belum cukup',
        comp: key,
        reason:
          key === 'db'
            ? 'Dasar pengukuran sebelum–sesudah belum dijelaskan setelah jatah klarifikasi habis.'
            : 'Kontribusi pribadi belum dijelaskan secara konkret setelah jatah klarifikasi habis.',
        source: `${last.id} • Transkrip`,
        resolved: false,
      })
    }
    const unconfirmed = ts.filter((t) => !t.confirmed)
    if (unconfirmed.length)
      flags.push({
        id: `f-${key}-unc`,
        type: 'Koreksi transkrip perlu diperiksa',
        comp: key,
        reason: 'Waktu pemeriksaan transkrip habis sebelum kandidat mengonfirmasi teks.',
        source: `${unconfirmed[0].id} • Transkrip`,
        resolved: false,
      })
    ts.filter((t) => t.reported).forEach((t) =>
      flags.push({ id: `f-${t.id}-rep`, type: 'Sumber suara bermasalah', comp: key, reason: 'Kandidat melaporkan transkrip tidak sesuai rekaman. Dengarkan audio dan tunda indikator yang bergantung padanya.', source: `${t.id} • Audio`, resolved: false }),
    )
    const status: CompResult['status'] = suff && !corr.some((t) => t.corrections.some((c) => c.sensitive)) ? 'tersedia' : 'tinjau'
    const issue = !suff
      ? key === 'db'
        ? 'Kandidat belum menjelaskan metrik yang digunakan.'
        : 'Kontribusi pribadi belum dijelaskan secara konkret.'
      : undefined
    return {
      key,
      status: suff ? 'tersedia' : 'tinjau',
      score,
      level: levelOf(score),
      quote: turnText(last),
      source: `${last.id} • Transkrip`,
      issue,
    }
  })
  const scored = comps.filter((c) => c.score != null) as any[]
  const overall = scored.length ? Math.round(scored.reduce((a, c) => a + c.score, 0) / scored.length) : null
  return { comps, overall, flags }
}

export interface Flag {
  id: string
  type: string
  comp?: CompKey
  reason: string
  source: string
  resolved: boolean
}

// ---------- Pelamar contoh untuk dashboard HRD ----------
export interface Applicant {
  id: string
  name: string
  email: string
  phone: string
  status: 'Terjadwal' | 'Selesai' | 'Daftar tunggu' | 'Tidak selesai' | 'Data perlu konfirmasi' | 'Siap memilih jadwal' | 'Wawancara berlangsung' | 'Terputus'
  decision: 'Menunggu tinjauan HRD' | 'Lanjut tahap berikutnya' | 'Perlu pemeriksaan' | 'Tidak dilanjutkan' | '—'
  cv: boolean
  date: string
  turns?: Turn[]
  live?: boolean
  note?: string
}
const mk = (id: string, qid: string, comp: CompKey, question: string, raw: string, extra: Partial<Turn> = {}): Turn => ({
  id,
  qid,
  kind: 'inti',
  comp,
  question,
  raw,
  tokens: tokenize(raw),
  corrections: [],
  sufficient: true,
  dur: 20,
  source: 'simulasi',
  locked: true,
  confirmed: true,
  ...extra,
})

const sariT1 = mk('Q-01', 'Q-01', 'api', 'Ceritakan proyek API yang Anda tulis di CV. Bagian mana yang Anda kerjakan sendiri?', 'Saya mengerjakan modul API menggunakan fast kopri. Saya membuat endpoint, validasi input, dan penanganan error.', {
  tokens: tokenize('Saya mengerjakan modul API menggunakan fast kopri. Saya membuat endpoint, validasi input, dan penanganan error.', 'fast kopri'),
  corrections: [{ from: 'fast kopri', to: 'FastAPI', at: '10.07', status: 'Perlu tinjauan', sensitive: false, ...({ idx: 4 } as any) }],
  dur: 28,
})
const sariT2 = mk('Q-02', 'Q-02', 'db', 'Bagaimana Anda mengoptimalkan database untuk aplikasi dengan trafik tinggi?', 'Saya menambahkan indeks pada query pencarian transaksi. Saya belum mencatat pengukuran sebelum dan sesudahnya.', { sufficient: false, dur: 15 })
const sariT3 = mk('Q-03', 'Q-03', 'debug', 'Ceritakan satu kasus debugging yang paling menantang.', 'Saya membaca log, mereproduksi masalah, lalu menemukan koneksi yang tidak dilepas dan menambahkan tes agar tidak terulang.', { dur: 22 })

export const SEED_APPLICANTS: Applicant[] = [
  { id: 'sari', name: 'Sari Putri', email: 'sari.putri@email.com', phone: '0813 5521 9001', status: 'Selesai', decision: 'Menunggu tinjauan HRD', cv: true, date: '12 Mei 2025', turns: [sariT1, sariT2, sariT3] },
  { id: 'andi', name: 'Andi Kurniawan', email: 'andi.k@email.com', phone: '0857 2200 1188', status: 'Terjadwal', decision: '—', cv: true, date: '—' },
  { id: 'budi', name: 'Budi Anggara', email: 'budi.anggara@email.com', phone: '0821 4400 7712', status: 'Daftar tunggu', decision: '—', cv: true, date: '—' },
  { id: 'maya', name: 'Maya Lestari', email: 'maya.l@email.com', phone: '0812 9001 3345', status: 'Tidak selesai', decision: '—', cv: true, date: '—', note: 'Tidak selesai — melewati batas waktu' },
]

// ---------- Format ----------
export const fmtDur = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
export const initials = (n: string) =>
  n
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((x) => x[0]?.toUpperCase())
    .join('') || '?'
export const nowClock = () => new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.')
export const todayId = () => new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
