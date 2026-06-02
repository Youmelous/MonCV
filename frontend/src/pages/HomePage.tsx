import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const showcaseTemplates = [
  { id: 'classic-blue', name: 'Classique', src: '/previews/classic-blue.svg', layout: '1 colonne' },
  { id: 'modern-teal', name: 'Moderne', src: '/previews/modern-teal.svg', layout: '2 colonnes' },
  { id: 'creative-coral', name: 'Créatif', src: '/previews/creative-coral.svg', layout: '2 colonnes' },
  { id: 'minimal-slate', name: 'Minimaliste', src: '/previews/minimal-slate.svg', layout: '1 colonne' },
]

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      <header className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-900">MonCV</h1>
        <div className="flex gap-3 items-center">
          {user ? (
            <Link to="/dashboard" className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">Tableau de bord</Link>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">Connexion</Link>
              <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">S'inscrire</Link>
            </>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-16 pb-32">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-block bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Créateur de CV en ligne
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Créez votre CV<br />professionnel en ligne<br />en 5 minutes
            </h2>
            <p className="text-lg text-gray-500 mb-8 max-w-lg">
              Choisissez parmi 30 modèles, ajoutez votre contenu avec des suggestions pré-rédigées en français ou anglais, et téléchargez votre CV en PDF ou Word.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/templates"
                className="px-8 py-4 bg-blue-600 text-white text-lg rounded-xl hover:bg-blue-700 font-medium shadow-lg shadow-blue-200 text-center"
              >
                Créer mon CV
              </Link>
              <Link
                to="/dashboard"
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 text-lg rounded-xl hover:bg-blue-50 font-medium text-center"
              >
                Améliorer mon CV
              </Link>
            </div>
            <div className="mt-8 text-sm text-gray-400 flex flex-wrap gap-4 justify-center lg:justify-start">
              <span>✓ 30 modèles</span>
              <span>✓ Suggestions pré-rédigées</span>
              <span>✓ PDF & Word</span>
              <span>✓ Photo</span>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3 max-w-sm">
            {showcaseTemplates.map((t) => (
              <div key={t.id} className="bg-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <img src={t.src} alt={t.name} className="w-full aspect-[210/297]" />
                <div className="px-2 py-1.5 flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-700">{t.name}</span>
                  <span className="text-[10px] text-gray-400">{t.layout}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Choisissez votre CV</h3>
            <p className="text-gray-500 text-sm">Sélectionnez un modèle parmi 30 designs, puis personnalisez les couleurs.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Personnalisez votre CV</h3>
            <p className="text-gray-500 text-sm">Remplissez chaque section avec nos suggestions pré-rédigées en français ou anglais.</p>
          </div>
          <div>
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Téléchargez votre CV</h3>
            <p className="text-gray-500 text-sm">Exportez en PDF ou Word et postulez en un clic.</p>
          </div>
        </div>

        <div className="mt-32 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Prêt à créer votre CV ?</h2>
          <p className="text-gray-500 mb-8">Rejoignez des milliers de candidats qui utilisent MonCV.</p>
          <Link
            to="/templates"
            className="inline-block px-10 py-4 bg-blue-600 text-white text-lg rounded-xl hover:bg-blue-700 font-medium shadow-lg shadow-blue-200"
          >
            Commencer maintenant
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} MonCV. Tous droits réservés.</p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link to="/templates" className="hover:text-gray-600">Modèles</Link>
            <Link to="/dashboard" className="hover:text-gray-600">Tableau de bord</Link>
            <Link to="/login" className="hover:text-gray-600">Connexion</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
