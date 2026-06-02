import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getUserCVs, deleteCV, duplicateCV } from '../data/api'
import type { CV } from '../types'
import { Link, useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [cvs, setCVs] = useState<CV[]>([])

  useEffect(() => {
    getUserCVs().then(setCVs)
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce CV ?')) return
    await deleteCV(id)
    setCVs(cvs.filter((c) => c.id !== id))
  }

  const handleDuplicate = async (id: string) => {
    const copy = await duplicateCV(id)
    setCVs([copy, ...cvs])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Mon espace</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-500">{user?.name}</span>
            <button onClick={() => { logout(); navigate('/') }} className="text-sm text-gray-500 hover:text-gray-700">Déconnexion</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">Mes CV</h2>
          <Link to="/templates" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            + Nouveau CV
          </Link>
        </div>

        {cvs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">Vous n'avez pas encore de CV</p>
            <Link to="/templates" className="text-blue-600 hover:underline">Créer mon premier CV</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cvs.map((cv) => (
              <div key={cv.id} className="bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow">
                <h3 className="font-semibold text-gray-900 truncate">{cv.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Modèle: {cv.templateId}</p>
                <p className="text-xs text-gray-400 mt-2">Modifié le {new Date(cv.updatedAt).toLocaleDateString('fr-FR')}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => navigate(`/editor/${cv.id}`)} className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100">
                    Éditer
                  </button>
                  <button onClick={() => handleDuplicate(cv.id)} className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-sm hover:bg-gray-100">
                    Dupliquer
                  </button>
                  <button onClick={() => handleDelete(cv.id)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100">
                    Suppr.
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
