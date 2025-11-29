import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import NavigationTabs from '../components/NavigationTabs'
import Modal from '../components/Modal'
import Button from '../components/Button'
import { apiFetch } from '../utils/api'

type PlanStatus = 'PLANNED' | 'IN_PROGRESS' | 'DONE'

interface DreamPlan {
  id: string
  title: string
  description: string
  targetDate: string | null
  status: PlanStatus
  extraNotes: string | null
}

const statusConfig: Record<PlanStatus, {
  label: string
  icon: string
  description: string
  noteBg: string
  badgeClass: string
  pinColor: string
  pinPosition: 'left' | 'right'
  textColor: string
  accentColor: string
}> = {
  PLANNED: {
    label: 'Planlanan',
    icon: '💭',
    description: 'Yeni fikirler ve taslaklar',
    noteBg: 'bg-[#FFF8D6]',
    badgeClass: 'bg-amber-100 text-amber-700',
    pinColor: 'bg-rose-400',
    pinPosition: 'right',
    textColor: 'text-[#5c4b1c]',
    accentColor: 'text-amber-700',
  },
  IN_PROGRESS: {
    label: 'Yolda',
    icon: '🚀',
    description: 'Üzerinde çalıştıklarımız',
    noteBg: 'bg-[#FFE4EC]',
    badgeClass: 'bg-rose-100 text-rose-700',
    pinColor: 'bg-blue-400',
    pinPosition: 'left',
    textColor: 'text-[#7c1f3c]',
    accentColor: 'text-rose-600',
  },
  DONE: {
    label: 'Gerçekleşen',
    icon: '✨',
    description: 'Mutlulukla hatırladıklarımız',
    noteBg: 'bg-[#E0F7EF]',
    badgeClass: 'bg-emerald-100 text-emerald-700',
    pinColor: 'bg-green-400',
    pinPosition: 'right',
    textColor: 'text-[#0f5132]',
    accentColor: 'text-emerald-700',
  },
}

const rotationClasses = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2']

const DreamsPage = () => {
  const navigate = useNavigate()
  const [plans, setPlans] = useState<DreamPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingPlan, setEditingPlan] = useState<DreamPlan | null>(null)
  const [deletingPlan, setDeletingPlan] = useState<DreamPlan | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetDate: '',
    status: 'PLANNED' as PlanStatus,
    extraNotes: '',
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      setIsLoading(true)
      const response = await apiFetch('/api/plans')

      if (response.status === 401) {
        navigate('/login', { replace: true })
        return
      }

      if (response.ok) {
        const data = await response.json()
        setPlans(data)
      }
    } catch (error) {
      console.error('Hayaller yüklenemedi:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPlansByStatus = (status: PlanStatus) => {
    return plans.filter((plan) => plan.status === status)
  }

  const handleAddPlan = () => {
    setEditingPlan(null)
    setFormData({
      title: '',
      description: '',
      targetDate: '',
      status: 'PLANNED',
      extraNotes: '',
    })
    setShowAddForm(true)
  }

  const handleEditPlan = (plan: DreamPlan) => {
    setEditingPlan(plan)
    setFormData({
      title: plan.title,
      description: plan.description,
      targetDate: plan.targetDate ? new Date(plan.targetDate).getFullYear().toString() : '',
      status: plan.status,
      extraNotes: plan.extraNotes || '',
    })
    setShowAddForm(true)
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      title: formData.title,
      description: formData.description,
      targetDate: formData.targetDate ? `${formData.targetDate}-01-01` : null,
      status: formData.status,
      extraNotes: formData.extraNotes || null,
    }

    try {
      if (editingPlan) {
        // Update
        const response = await apiFetch(`/api/plans/${editingPlan.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: editingPlan.id }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Update hatası:', response.status, errorText)
          alert('Güncelleme başarısız: ' + response.status)
          return
        }

        const updated = await response.json()
        setPlans(plans.map((p) => (p.id === editingPlan.id ? updated : p)))
      } else {
        // Create
        const response = await apiFetch('/api/plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('Ekleme hatası:', response.status, errorText)
          alert('Ekleme başarısız: ' + response.status)
          return
        }

        const created = await response.json()
        console.log('Hayal eklendi:', created)
        setPlans([...plans, created])
      }

      setShowAddForm(false)
    } catch (error) {
      console.error('Form gönderme hatası:', error)
      alert('Bir hata oluştu: ' + error)
    }
  }

  const handleDeleteClick = (plan: DreamPlan) => {
    setDeletingPlan(plan)
  }

  const handleConfirmDelete = async () => {
    if (!deletingPlan) return

    try {
      const response = await apiFetch(`/api/plans/${deletingPlan.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPlans(plans.filter((p) => p.id !== deletingPlan.id))
      }
    } catch (error) {
      console.error('Hayal silinemedi:', error)
    } finally {
      setDeletingPlan(null)
    }
  }

  const handleCancelDelete = () => {
    setDeletingPlan(null)
  }

  const handleStatusChange = async (plan: DreamPlan, newStatus: PlanStatus) => {
    try {
      const response = await apiFetch(`/api/plans/${plan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...plan, status: newStatus }),
      })

      if (response.ok) {
        const updated = await response.json()
        setPlans(plans.map((p) => (p.id === plan.id ? updated : p)))
      }
    } catch (error) {
      console.error('Durum güncellenemedi:', error)
    }
  }

  const statusOrder: PlanStatus[] = ['PLANNED', 'IN_PROGRESS', 'DONE']

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-lilac-100 px-4 py-8 font-display text-[#4A4A4A] dark:bg-background-dark dark:text-gray-200">
      <div className="mx-auto w-full max-w-6xl">
        <NavigationTabs currentPage="dreams" />

        <section className="mt-10 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#b28572] dark:text-gray-400">Hayallerimiz</p>
          <h1 className="font-romantic text-4xl sm:text-5xl text-[#6c382a] dark:text-white mt-2">Birlikte Kurduğumuz Hayaller</h1>
          <p className="mt-4 text-base text-[#7a5d59] dark:text-gray-300 max-w-3xl mx-auto">
            Birlikte kurduğumuz hayalleri renkli yapışkan notlar gibi bu panoya iliştiriyoruz. Her not, gelecekte
            gerçekleştireceğimiz özel bir hayali temsil ediyor.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-1">
            <Button onClick={handleAddPlan} variant="primary">
              + Yeni Hayal Ekle
            </Button>
            <Button onClick={() => navigate('/choose')} variant="primary">
              Ana Sayfa
            </Button>
          </div>
        </section>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3 text-[#7a5d59] text-lg">
              <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
              Hayaller yükleniyor...
            </div>
          </div>
        ) : (
          <>
            <div className="relative mt-10 rounded-[32px] bg-gradient-to-br from-rose-50/95 via-amber-50/90 to-lilac-50/90 p-6 sm:p-10 shadow-[0_25px_60px_rgba(244,168,186,0.35)] ring-4 ring-rose-100/40">
              <div className="pointer-events-none absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_65%)] opacity-80"></div>
              <div className="relative mb-6 flex w-full flex-col items-center gap-2 text-[#6c382a]">
                <div className="flex items-center gap-2 text-sm uppercase tracking-[0.35em] text-[#a46a4a]">
                  
                </div>
                <h2
                  className="text-4xl text-[#5a3524]"
                  style={{ fontFamily: '"Gochi Hand", "cursive"' }}
                >
                  Hayaller Panosu
                </h2>
              </div>
              <div className="relative flex flex-wrap justify-center gap-6">
                <AnimatePresence>
                  {plans.map((plan, index) => {
                    const config = statusConfig[plan.status]
                    const rotation = rotationClasses[index % rotationClasses.length]
                    const pinPositionClass =
                      config.pinPosition === 'left' ? '-left-4 sm:-left-3' : '-right-4 sm:-right-3'

                    return (
                      <motion.div
                        key={plan.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.25 }}
                        className={`relative w-full min-w-[260px] max-w-xs flex-grow rounded-2xl p-6 shadow-xl transition ${
                          config.noteBg
                        } ${rotation} hover:rotate-0 hover:scale-105`}
                      >
                        <div
                          className={`absolute -top-4 ${pinPositionClass} flex h-10 w-10 items-center justify-center rounded-full ${config.pinColor} shadow-lg`}
                        >
                          <div className="h-4 w-4 rounded-full bg-white/60" />
                        </div>
                        <div className="flex items-start justify-between gap-3">
                          <h3 className={`font-romantic text-2xl ${config.textColor}`}>{plan.title}</h3>
                          <span className={`text-xs font-semibold rounded-full px-3 py-1 ${config.badgeClass}`}>
                            {config.label}
                          </span>
                        </div>
                        {plan.targetDate && (
                          <p className={`mt-2 text-xs font-semibold ${config.accentColor}`}>
                            📅 {new Date(plan.targetDate).getFullYear()}
                          </p>
                        )}
                        <p className="mt-3 text-sm leading-relaxed text-[#4A4A4A]">
                          {plan.description}
                        </p>
                        {plan.extraNotes && (
                          <p className="mt-2 text-xs italic text-[#6b4f3f]">"{plan.extraNotes}"</p>
                        )}
                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-[#4A4A4A]">
                          <button
                            onClick={() => handleEditPlan(plan)}
                            className="rounded-full bg-black/5 px-3 py-1 transition hover:bg-black/10"
                          >
                            Düzenle
                          </button>
                          {plan.status !== 'DONE' && (
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  plan,
                                  plan.status === 'PLANNED' ? 'IN_PROGRESS' : 'DONE'
                                )
                              }
                              className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-800 transition hover:bg-emerald-500/30"
                            >
                              {plan.status === 'PLANNED' ? 'Başlat' : 'Tamamla'}
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteClick(plan)}
                            className="rounded-full bg-rose-500/20 px-3 py-1 text-rose-700 transition hover:bg-rose-500/30"
                          >
                            Sil
                          </button>
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>

                {!plans.length && (
                  <div className="text-center text-lg font-semibold text-[#6b4f3f]">
                    Henüz panoda hayal yok. İlk notu eklemek ister misin?
                  </div>
                )}
              </div>

              <div className="relative mt-10 flex w-full justify-end">
                <div className="space-y-1 text-right text-xs text-[#6c382a]">
                  {statusOrder.map((status) => {
                    const count = getPlansByStatus(status).length
                    const config = statusConfig[status]
                    return (
                      <p key={status}>
                        <strong>{config.label}</strong> ({count}) — {config.description}
                      </p>
                    )
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)} maxWidth="2xl">
          <h3 className="text-2xl font-bold text-[#4A4A4A] mb-6">
            {editingPlan ? 'Hayali Düzenle' : 'Yeni Hayal Ekle'}
          </h3>

          <form onSubmit={handleSubmitForm} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-[#7a5d59] mb-2">Başlık *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl border border-rose-100/60 bg-white px-4 py-3 text-[#4A4A4A] placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Hayalimizin başlığı"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#7a5d59] mb-2">Açıklama *</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full rounded-xl border border-rose-100/60 bg-white px-4 py-3 text-[#4A4A4A] placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="Bu hayal nedir, neden özel?"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[#7a5d59] mb-2">Hedef Yıl</label>
                <input
                  type="number"
                  min="1900"
                  max="2100"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full rounded-xl border border-rose-100/60 bg-white px-4 py-3 text-[#4A4A4A] shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#7a5d59] mb-2">Durum</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as PlanStatus })}
                  className="w-full rounded-xl border border-rose-100/60 bg-white px-4 py-3 text-[#4A4A4A] shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="PLANNED">Planlanan</option>
                  <option value="IN_PROGRESS">Yolda</option>
                  <option value="DONE">Gerçekleşti</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#7a5d59] mb-2">Ekstra Notlar</label>
              <textarea
                rows={3}
                value={formData.extraNotes}
                onChange={(e) => setFormData({ ...formData, extraNotes: e.target.value })}
                className="w-full rounded-xl border border-rose-100/60 bg-white px-4 py-3 text-[#4A4A4A] placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="İlave düşünceler veya detaylar..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" className="flex-1">
                {editingPlan ? 'Güncelle' : 'Ekle'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowAddForm(false)}>
                İptal
              </Button>
            </div>
          </form>
        </Modal>

        <Modal isOpen={!!deletingPlan} onClose={handleCancelDelete} maxWidth="md">
          {deletingPlan && (
            <div className="text-center text-[#4A4A4A]">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold mb-3">Hayali Sil</h3>
              <p className="mb-2">
                <span className="font-semibold">{deletingPlan.title}</span> hayalini silmek istediğinden emin misin?
              </p>
              <p className="text-sm text-[#7a5d59] mb-6">Bu işlem geri alınamaz.</p>

              <div className="flex gap-3">
                <Button variant="secondary" onClick={handleCancelDelete} className="flex-1">
                  İptal
                </Button>
                <Button variant="danger" onClick={handleConfirmDelete} className="flex-1">
                  Sil
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </main>
  )
}

export default DreamsPage
