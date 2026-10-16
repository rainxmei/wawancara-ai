import { Navigate, Route, Routes } from 'react-router-dom'
import { Shell } from './components/Shell'
import Landing from './pages/Landing'
import { Daftar, Jadwal, Lowongan, PeriksaCV, Persiapan, PeriodeBerakhir, SlotPenuh, Terkonfirmasi, Terputus } from './pages/applicant/Flow'
import Interview from './pages/applicant/Interview'
import { LamaranSaya, Selesai } from './pages/applicant/After'
import { BuatLowongan, Dashboard, JadwalHRD, Keputusan, Kompetensi, Lamaran, Laporan, Tinjauan } from './pages/hrd/HRD'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/pelamar" element={<Shell role="pelamar" />}>
        <Route index element={<Navigate to="lowongan" replace />} />
        <Route path="lowongan" element={<Lowongan />} />
        <Route path="daftar" element={<Daftar />} />
        <Route path="periksa-cv" element={<PeriksaCV />} />
        <Route path="jadwal" element={<Jadwal />} />
        <Route path="slot-penuh" element={<SlotPenuh />} />
        <Route path="terkonfirmasi" element={<Terkonfirmasi />} />
        <Route path="persiapan" element={<Persiapan />} />
        <Route path="wawancara" element={<Interview />} />
        <Route path="selesai" element={<Selesai />} />
        <Route path="terputus" element={<Terputus />} />
        <Route path="periode-berakhir" element={<PeriodeBerakhir />} />
        <Route path="lamaran" element={<LamaranSaya />} />
      </Route>
      <Route path="/hrd" element={<Shell role="hrd" />}>
        <Route index element={<Dashboard />} />
        <Route path="lowongan/baru" element={<BuatLowongan />} />
        <Route path="kompetensi" element={<Kompetensi />} />
        <Route path="jadwal" element={<JadwalHRD />} />
        <Route path="lamaran" element={<Lamaran />} />
        <Route path="tinjauan" element={<Tinjauan />} />
        <Route path="laporan/:id" element={<Laporan />} />
        <Route path="keputusan/:id" element={<Keputusan />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
