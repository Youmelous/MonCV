import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTemplates, createCV } from '../data/api'
import type { Template } from '../types'

export default function TemplatesPage() {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTemplates().then(setTemplates).finally(() => setLoading(false))
  }, [])

  const handleSelect = async (templateId: string) => {
    const cv = await createCV(templateId, 'Mon CV')
    navigate(`/editor/${cv.id}`)
  }

  const categories = ['classique', 'moderne', 'créatif', 'minimaliste'] as const

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Chargement des modèles...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Choisissez un modèle</h1>
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700">Retour</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {categories.map((cat) => {
          const filtered = templates.filter((t) => t.category === cat)
          if (filtered.length === 0) return null
          return (
            <section key={cat} className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2 capitalize">{cat}</h2>
              <p className="text-gray-500 mb-6">
                {cat === 'classique' && 'Sobre et professionnel, pour les secteurs traditionnels.'}
                {cat === 'moderne' && 'Design épuré avec une touche de couleur.'}
                {cat === 'créatif' && 'Audacieux pour les métiers créatifs.'}
                {cat === 'minimaliste' && 'Simple et élégant, l\'essentiel sans fioritures.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((t) => (
                    <div
                    key={t.id}
                    onClick={() => handleSelect(t.id)}
                    className="bg-white rounded-xl border-2 border-transparent overflow-hidden cursor-pointer transition-all hover:shadow-md hover:border-blue-500"
                  >
                    <div className="relative overflow-hidden aspect-[210/297] p-4 flex flex-col" style={{ backgroundColor: t.defaultColors.accent }}>
                        <img src={t.preview} alt="" className="absolute inset-0 w-full h-full object-cover opacity-[0.07] pointer-events-none" />
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full" style={{ backgroundColor: t.defaultColors.primary }} />
                        <div className="flex-1 space-y-1">
                          <div className="h-2 rounded w-3/4" style={{ backgroundColor: t.defaultColors.primary, opacity: 0.3 }} />
                          <div className="h-1.5 rounded w-1/2" style={{ backgroundColor: t.defaultColors.secondary, opacity: 0.3 }} />
                        </div>
                      </div>
                      {t.layout === 'two-column' ? (
                        <div className="flex gap-2 flex-1">
                          <div className="w-1/3 rounded space-y-1.5 p-2" style={{ backgroundColor: t.defaultColors.primary, opacity: 0.08 }}>
                            <div className="h-1.5 rounded w-full" style={{ backgroundColor: t.defaultColors.primary, opacity: 0.2 }} />
                            <div className="h-1.5 rounded w-3/4" style={{ backgroundColor: t.defaultColors.primary, opacity: 0.2 }} />
                            <div className="h-1.5 rounded w-1/2" style={{ backgroundColor: t.defaultColors.primary, opacity: 0.2 }} />
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <div className="h-2 rounded w-3/4" style={{ backgroundColor: t.defaultColors.primary, opacity: 0.15 }} />
                            <div className="h-1.5 rounded w-full" style={{ backgroundColor: t.defaultColors.primary, opacity: 0.1 }} />
                            <div className="h-1.5 rounded w-5/6" style={{ backgroundColor: t.defaultColors.primary, opacity: 0.1 }} />
                            <div className="h-1.5 rounded w-2/3" style={{ backgroundColor: t.defaultColors.primary, opacity: 0.1 }} />
                            <div className="h-1.5 rounded w-11/12" style={{ backgroundColor: t.defaultColors.primary, opacity: 0.1 }} />
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 space-y-1.5">
                          <div className="h-1.5 rounded w-full" style={{ backgroundColor: t.defaultColors.secondary, opacity: 0.15 }} />
                          <div className="h-2 rounded w-1/2" style={{ backgroundColor: t.defaultColors.primary, opacity: 0.15 }} />
                          <div className="h-1.5 rounded w-5/6" style={{ backgroundColor: t.defaultColors.primary, opacity: 0.1 }} />
                          <div className="h-1.5 rounded w-3/4" style={{ backgroundColor: t.defaultColors.primary, opacity: 0.1 }} />
                          <div className="h-1.5 rounded w-11/12" style={{ backgroundColor: t.defaultColors.primary, opacity: 0.1 }} />
                          <div className="h-1.5 rounded w-2/3" style={{ backgroundColor: t.defaultColors.primary, opacity: 0.1 }} />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">{t.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{t.description}</p>
                      <div className="flex gap-2 mt-3">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">{t.layout === 'single-column' ? '1 colonne' : '2 colonnes'}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">{t.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        })}

      </main>
    </div>
  )
}
