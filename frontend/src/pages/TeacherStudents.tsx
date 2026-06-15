import { useEffect, useState } from 'react'
import { AlertTriangle, Edit3, Plus, Save, Trash2, X } from 'lucide-react'
import { LoadingScreen } from '../components/LoadingScreen'
import './TeacherView.css'
import {
  createAdminStudent,
  deleteAdminStudent,
  fetchTeacherOverview,
  updateAdminStudent,
} from '../api/client'
import type { AdminStudentItem, AdminStudentPayload, TeacherOverview } from '../types'

const EMPTY_FORM: AdminStudentPayload = {
  user_id: '',
  name: '',
  department: 'General',
  password: 'password123',
  sleep_hours: 7,
  stress_level: 5,
  age: 20,
  gender: 'Female',
  internet_access: 'Yes',
  family_income: 'Medium',
  parent_edu: 'High School',
  extracurricular: 'No',
}

function riskLabel(risk: AdminStudentItem['risk_level']) {
  if (risk === 'high') return 'Tinggi'
  if (risk === 'medium') return 'Sedang'
  return 'Rendah'
}

function riskColor(risk: AdminStudentItem['risk_level']) {
  if (risk === 'high') return 'var(--danger)'
  if (risk === 'medium') return 'var(--warning)'
  return 'var(--success)'
}

export function TeacherStudents() {
  const [teacher, setTeacher] = useState<TeacherOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [form, setForm] = useState<AdminStudentPayload>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<number | null>(null)

  const students = teacher?.students ?? []

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchTeacherOverview()
      setTeacher(data)
    } catch (err) {
      console.error(err)
      setError('Gagal mengambil data admin dari server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
  }

  const startEdit = (student: AdminStudentItem) => {
    setEditingId(student.id)
    setForm({
      user_id: student.user_id,
      name: student.name,
      department: student.department,
      password: '',
      sleep_hours: student.sleep_hours,
      stress_level: student.stress_level,
      age: student.age,
      gender: student.gender,
      internet_access: student.internet_access,
      family_income: student.family_income,
      parent_edu: student.parent_edu,
      extracurricular: student.extracurricular,
    })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      if (editingId) {
        const payload = { ...form }
        if (!payload.password) delete payload.password
        await updateAdminStudent(editingId, payload)
        setMessage('Data siswa berhasil diperbarui.')
      } else {
        await createAdminStudent(form)
        setMessage('Siswa baru berhasil dibuat.')
      }
      resetForm()
      await loadData()
    } catch (err: any) {
      console.error(err)
      setError(err?.response?.data?.detail ?? 'Operasi gagal diproses.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (student: AdminStudentItem) => {
    const confirmed = window.confirm(`Hapus siswa ${student.name} beserta akun login dan progress belajarnya?`)
    if (!confirmed) return
    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      await deleteAdminStudent(student.id)
      setMessage('Siswa berhasil dihapus.')
      if (editingId === student.id) resetForm()
      await loadData()
    } catch (err: any) {
      console.error(err)
      setError(err?.response?.data?.detail ?? 'Gagal menghapus siswa.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingScreen message="Menarik Data Kelas..." />
  }

  return (
    <div className="content">
      <header className="topbar" style={{ marginBottom: '12px' }}>
        <div>
          <p className="eyebrow">Manajemen Akun</p>
          <h1>Data Siswa</h1>
        </div>
      </header>

      {error && <div className="admin-alert danger"><AlertTriangle size={16} /> {error}</div>}
      {message && <div className="admin-alert success">{message}</div>}

      <div className="admin-grid" style={{ gridTemplateColumns: '1fr' }}>
        <section className="panel">
          <div className="panel-heading">
            <h2>{editingId ? 'Edit Siswa' : 'Tambah Siswa'}</h2>
            {editingId && (
              <button className="btn-outline" onClick={resetForm} type="button" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <X size={15} /> Batal
              </button>
            )}
          </div>

          <form className="admin-form" onSubmit={handleSubmit}>
            <label>
              Username
              <input value={form.user_id} onChange={e => setForm(prev => ({ ...prev, user_id: e.target.value }))} required />
            </label>
            <label>
              Nama
              <input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} required />
            </label>
            <label>
              Departemen
              <input value={form.department} onChange={e => setForm(prev => ({ ...prev, department: e.target.value }))} required />
            </label>
            <label>
              Password {editingId && <span>(kosongkan jika tidak diubah)</span>}
              <input type="password" value={form.password ?? ''} onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))} required={!editingId} />
            </label>
            <div className="admin-form-row">
              <label>
                Usia
                <input type="number" min={10} max={60} value={form.age} onChange={e => setForm(prev => ({ ...prev, age: Number(e.target.value) }))} required />
              </label>
              <label>
                Tidur
                <input type="number" min={0} max={24} step={0.5} value={form.sleep_hours} onChange={e => setForm(prev => ({ ...prev, sleep_hours: Number(e.target.value) }))} required />
              </label>
              <label>
                Stres
                <input type="number" min={1} max={10} value={form.stress_level} onChange={e => setForm(prev => ({ ...prev, stress_level: Number(e.target.value) }))} required />
              </label>
            </div>
            <div className="admin-form-row">
              <label>
                Gender
                <select value={form.gender} onChange={e => setForm(prev => ({ ...prev, gender: e.target.value }))}>
                  <option>Female</option>
                  <option>Male</option>
                </select>
              </label>
              <label>
                Internet
                <select value={form.internet_access} onChange={e => setForm(prev => ({ ...prev, internet_access: e.target.value }))}>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </label>
            </div>
            <div className="admin-form-row">
              <label>
                Income
                <select value={form.family_income} onChange={e => setForm(prev => ({ ...prev, family_income: e.target.value }))}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>
              <label>
                Orang Tua
                <select value={form.parent_edu} onChange={e => setForm(prev => ({ ...prev, parent_edu: e.target.value }))}>
                  <option>High School</option>
                  <option>Bachelor</option>
                  <option>Master</option>
                  <option>PhD</option>
                </select>
              </label>
            </div>
            <label>
              Ekstrakurikuler
              <select value={form.extracurricular} onChange={e => setForm(prev => ({ ...prev, extracurricular: e.target.value }))}>
                <option>No</option>
                <option>Yes</option>
              </select>
            </label>
            <button className="btn-primary" type="submit" disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {editingId ? <Save size={16} /> : <Plus size={16} />}
              {editingId ? 'Simpan Perubahan' : 'Tambah Siswa'}
            </button>
          </form>
        </section>

        <section className="panel" style={{ marginTop: '24px' }}>
          <div className="panel-heading">
            <h2>CRUD Data Siswa</h2>
            <span style={{ color: 'var(--muted)', fontSize: '13px' }}>Data ini dipakai langsung oleh dashboard siswa dan rekomendasi ML.</span>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Siswa</th>
                  <th>Skor</th>
                  <th>Progress</th>
                  <th>Kuis</th>
                  <th>Stres</th>
                  <th>Risiko</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: '24px' }}>
                      Database siswa kosong. Tambahkan siswa baru atau biarkan siswa membuat profil saat login.
                    </td>
                  </tr>
                ) : students.map(student => (
                  <tr key={student.id}>
                    <td>
                      <strong>{student.name}</strong>
                      <span>{student.user_id} · {student.department}</span>
                    </td>
                    <td>{student.average_score}</td>
                    <td>{Math.round(student.completion_rate * 100)}%</td>
                    <td>{student.total_quizzes}</td>
                    <td>{student.stress_level}/10</td>
                    <td><span className="admin-risk-badge" style={{ color: riskColor(student.risk_level) }}>{riskLabel(student.risk_level)}</span></td>
                    <td>
                      <div className="admin-actions">
                        <button onClick={() => startEdit(student)} aria-label={`Edit ${student.name}`}><Edit3 size={15} /></button>
                        <button onClick={() => handleDelete(student)} aria-label={`Hapus ${student.name}`}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
