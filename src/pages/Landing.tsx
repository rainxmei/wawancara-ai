import { Link } from 'react-router-dom'
import { ArrowRight, UserRound, Users, ShieldCheck, Mic, FileSearch, Eye, Sparkles, Info } from 'lucide-react'
import { Logo } from '../components/Shell'
import { useStore } from '../store'

export default function Landing() {
  const { s, set } = useStore()
  return (
    <div className="land">
      <div className="sim-banner">
        <Info size={14} />
        <span>
          <b>Simulasi interaktif untuk juri</b> · Seluruh alur sudah bisa dicoba. AI, STT, dan TTS belum disambungkan; jawaban & skor adalah contoh.
        </span>
      </div>
      <div className="land-in">
        <div className="brand" style={{ fontSize: 22 }}>
          <Logo size={32} /> Ruang Wawancara
        </div>
        <div className="hero">
          <span className="badge pri" style={{ marginTop: 28 }}>
            <Sparkles size={14} /> PLAY IT! PLUS 2026 · Digitalisasi AI · Prototipe simulasi
          </span>
          <h1>
            Semua pelamar berhak <span>didengar</span>, bukan hanya yang CV-nya meyakinkan.
          </h1>
          <p className="lead">
            Wawancara awal berbahasa Indonesia dengan avatar AI. AI menggali bukti kemampuan pelamar, HRD memeriksa laporan yang bisa ditelusuri ke kutipan jawaban, dan keputusan akhir
            tetap di tangan manusia.
          </p>
        </div>

        <div className="role-cards">
          <div className="role">
            <div className="ico">
              <UserRound size={28} />
            </div>
            <h2>Coba sebagai Pelamar</h2>
            <ul>
              <li>Daftar, unggah CV, dan periksa hasil pembacaan CV</li>
              <li>Pilih slot, tes perangkat, lalu wawancara dengan avatar</li>
              <li>Periksa transkrip & koreksi terbatas, lihat status</li>
            </ul>
            <div className="row wrap">
              <Link to="/pelamar/lowongan" className="btn" onClick={() => set({ guideOpen: false })}>
                Mulai sebagai pelamar <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          <div className="role">
            <div className="ico">
              <Users size={28} />
            </div>
            <h2>Coba sebagai HRD</h2>
            <ul>
              <li>Buat lowongan, setujui kompetensi dan jadwal</li>
              <li>Tinjau laporan bukti per kompetensi, flag, dan audio</li>
              <li>Putuskan tindak lanjut tanpa penolakan otomatis oleh AI</li>
            </ul>
            <div className="row wrap">
              <Link to="/hrd" className="btn out">
                Buka dashboard HRD <ArrowRight size={18} />
              </Link>
              <Link to="/hrd/laporan/sari" className="btn out">
                Lihat laporan contoh
              </Link>
            </div>
          </div>
        </div>
        <p className="tiny" style={{ marginTop: 14 }}>
          Tips: jalani sisi pelamar sampai selesai, lalu buka sisi HRD. Wawancara yang Anda jalani akan muncul sebagai laporan nyata di dashboard HRD.
        </p>

        <div className="pillars">
          <div className="pillar">
            <div className="ico xs">
              <ShieldCheck size={18} />
            </div>
            <b>Tanpa gerbang CV</b>
            <span>CV wajib sebagai bahan percakapan, bukan alat penyaring.</span>
          </div>
          <div className="pillar">
            <div className="ico xs">
              <Mic size={18} />
            </div>
            <b>Evidence seeking</b>
            <span>AI menanyakan tindakan, alasan, dan hasil ketika jawaban masih umum.</span>
          </div>
          <div className="pillar">
            <div className="ico xs">
              <FileSearch size={18} />
            </div>
            <b>Bukti dapat ditelusuri</b>
            <span>Setiap penilaian terhubung ke kutipan, ID giliran, dan audio.</span>
          </div>
          <div className="pillar">
            <div className="ico xs">
              <Eye size={18} />
            </div>
            <b>Manusia memutuskan</b>
            <span>AI memberi flag dan laporan. HRD yang menentukan tindak lanjut.</span>
          </div>
        </div>

        <h3 className="h3" style={{ marginTop: 40 }}>
          Alur yang bisa Anda coba
        </h3>
        <div className="flow-strip">
          {['Lowongan', 'Formulir + CV', 'Periksa CV', 'Pilih slot', 'Tes perangkat', 'Wawancara avatar', 'Periksa transkrip', 'Laporan bukti HRD', 'Keputusan HRD'].map((x, i, a) => (
            <span key={x} style={{ display: 'contents' }}>
              <span className="f">{x}</span>
              {i < a.length - 1 && <ArrowRight size={16} color="#8a8aa8" />}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
