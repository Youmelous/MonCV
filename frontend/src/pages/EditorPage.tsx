import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { HexColorPicker } from 'react-colorful'
import { getCV, updateCV, getSuggestions, getTemplates } from '../data/api'
import type { CV, Template, Suggestion, Experience, Education, SkillCategory, Language } from '../types'
import CVPreview from '../components/CVPreview'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const emptyCV: CV = {
  id: '', userId: null, templateId: '',
  title: 'Mon CV',
  personalInfo: { firstName: '', lastName: '', email: '', phone: '', address: '', title: '', photo: '' },
  profile: '',
  experience: [], education: [], skills: [], languages: [], interests: [],
  colors: { primary: '#1e3a5f', secondary: '#3b82f6', accent: '#e2e8f0' },
  createdAt: '', updatedAt: '',
}

const sections = [
  { id: 'personal', label: 'Informations', icon: '👤' },
  { id: 'objective', label: 'Objectif', icon: '🎯' },
  { id: 'experience', label: 'Expérience', icon: '💼' },
  { id: 'education', label: 'Formation', icon: '🎓' },
  { id: 'skills', label: 'Compétences', icon: '⚡' },
  { id: 'languages', label: 'Langues', icon: '🌍' },
  { id: 'interests', label: 'Centres d\'intérêt', icon: '🎨' },
  { id: 'colors', label: 'Couleurs', icon: '🎨' },
]

export default function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [cv, setCV] = useState<CV>(emptyCV)
  const [template, setTemplate] = useState<Template | null>(null)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [activeSection, setActiveSection] = useState('personal')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [colorPicker, setColorPicker] = useState<string | null>(null)
  const [suggestLang, setSuggestLang] = useState('fr')
  const [menuOpen, setMenuOpen] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!id) return
    getCV(id).then((data) => {
      setCV(data)
      getTemplates().then((templates) => {
        const t = templates.find((x) => x.id === data.templateId)
        if (t) setTemplate(t)
      })
    })
  }, [id])

  const save = useCallback(async (updated: CV) => {
    setSaving(true)
    try {
      await updateCV(updated.id, updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {}
    setSaving(false)
  }, [])

  const updateField = <K extends keyof CV>(key: K, value: CV[K]) => {
    const updated = { ...cv, [key]: value }
    setCV(updated)
    save(updated)
  }

  const updatePersonalInfo = (field: string, value: string) => {
    const updated = { ...cv, personalInfo: { ...cv.personalInfo, [field]: value } }
    setCV(updated)
    save(updated)
  }

  const updateColor = (key: 'primary' | 'secondary' | 'accent', value: string) => {
    const updated = { ...cv, colors: { ...cv.colors, [key]: value } }
    setCV(updated)
    save(updated)
  }

  const loadSuggestions = async (section?: string, job?: string) => {
    const s = await getSuggestions(job || cv.personalInfo.title, section, suggestLang)
    setSuggestions(s)
  }

  useEffect(() => {
    const sectionMap: Record<string, string> = {
      objective: 'profile', experience: 'experience', education: 'education',
      skills: 'skills', languages: 'languages', interests: 'interests',
    }
    const s = sectionMap[activeSection]
    if (s) loadSuggestions(s)
  }, [activeSection, cv.personalInfo.title, suggestLang])

  const addSuggestionToTasks = (suggestion: Suggestion, expId: string) => {
    const updated = {
      ...cv,
      experience: cv.experience.map((e) =>
        e.id === expId ? { ...e, tasks: [...e.tasks, suggestion.text] } : e
      ),
    }
    setCV(updated)
    save(updated)
  }

  const addExperience = () => {
    const newExp: Experience = {
      id: crypto.randomUUID(), company: '', position: '', startDate: '', endDate: '', current: false, description: '', tasks: [],
    }
    updateField('experience', [...cv.experience, newExp])
  }

  const updateExperience = (id: string, field: string, value: any) => {
    const updated = { ...cv, experience: cv.experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)) }
    setCV(updated)
    save(updated)
  }

  const removeExperience = (id: string) => updateField('experience', cv.experience.filter((e) => e.id !== id))

  const addEducation = () => {
    const newEdu: Education = { id: crypto.randomUUID(), school: '', degree: '', field: '', startDate: '', endDate: '' }
    updateField('education', [...cv.education, newEdu])
  }

  const updateEducation = (id: string, field: string, value: any) => {
    const updated = { ...cv, education: cv.education.map((e) => (e.id === id ? { ...e, [field]: value } : e)) }
    setCV(updated)
    save(updated)
  }

  const removeEducation = (id: string) => updateField('education', cv.education.filter((e) => e.id !== id))

  const addSkill = () => {
    const newSkill: SkillCategory = { id: crypto.randomUUID(), category: '', items: [''] }
    updateField('skills', [...cv.skills, newSkill])
  }

  const updateSkill = (id: string, field: string, value: any) => {
    const updated = { ...cv, skills: cv.skills.map((s) => (s.id === id ? { ...s, [field]: value } : s)) }
    setCV(updated)
    save(updated)
  }

  const removeSkill = (id: string) => updateField('skills', cv.skills.filter((s) => s.id !== id))

  const addLanguage = () => {
    const newLang: Language = { id: crypto.randomUUID(), language: '', level: 'Intermédiaire' }
    updateField('languages', [...cv.languages, newLang])
  }

  const updateLanguage = (id: string, field: string, value: any) => {
    const updated = { ...cv, languages: cv.languages.map((l) => (l.id === id ? { ...l, [field]: value } : l)) }
    setCV(updated)
    save(updated)
  }

  const removeLanguage = (id: string) => updateField('languages', cv.languages.filter((l) => l.id !== id))

  const handleDownloadPDF = async () => {
    const el = previewRef.current
    if (!el) return
    const canvas = await html2canvas(el, { scale: 2, useCORS: true })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfW = pdf.internal.pageSize.getWidth()
    const pdfH = (canvas.height * pdfW) / canvas.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH)
    pdf.save('MonCV.pdf')
  }

  const handleDownloadWord = () => {
    const p = cv.personalInfo
    const colors = cv.colors
    const esc = (s: string) => s?.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') || ''
    const expHtml = cv.experience.map(e => `
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between">
          <b>${esc(e.position)}</b>
          <span style="color:#888;font-size:12px">${esc(e.startDate)} - ${e.current ? 'Présent' : esc(e.endDate)}</span>
        </div>
        ${e.company ? `<div style="color:#666;font-size:12px">${esc(e.company)}</div>` : ''}
        ${e.description ? `<div style="font-size:12px;margin-top:4px">${esc(e.description)}</div>` : ''}
        ${e.tasks.filter(Boolean).length ? `<ul style="margin:4px 0 0 16px;font-size:12px">${e.tasks.filter(Boolean).map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
      </div>
    `).join('')
    const eduHtml = cv.education.map(e => `
      <div style="margin-bottom:6px">
        <b>${esc(e.degree)}</b>${e.field ? ` - ${esc(e.field)}` : ''}<br>
        <span style="color:#666;font-size:12px">${esc(e.school)} — ${esc(e.startDate)} - ${esc(e.endDate)}</span>
      </div>
    `).join('')
    const skillHtml = cv.skills.map(s => `
      <div style="margin-bottom:4px">
        ${s.category ? `<b>${esc(s.category)}</b> : ` : ''}${esc(s.items.filter(Boolean).join(', '))}
      </div>
    `).join('')
    const langHtml = cv.languages.map(l => `
      <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:2px">
        <span>${esc(l.language)}</span><span style="color:#888">${esc(l.level)}</span>
      </div>
    `).join('')
    const interestHtml = cv.interests.filter(Boolean).length ? cv.interests.filter(Boolean).map(i => esc(i)).join(', ') : ''

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${esc(cv.title)}</title>
<style>
  body { font-family: 'Calibri', sans-serif; font-size: 13px; color: #333; max-width: 800px; margin: 40px auto; padding: 0 20px; }
  .header { text-align: center; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2.5px solid ${colors.primary}; }
  .header h1 { color: ${colors.primary}; margin: 0; font-size: 24px; }
  .header .title { color: ${colors.secondary}; margin: 4px 0; }
  .header .contact { color: #888; font-size: 12px; }
  h3 { color: ${colors.primary}; font-size: 13px; text-transform: uppercase; border-bottom: 1.5px solid ${colors.accent}; padding-bottom: 3px; margin: 16px 0 8px; }
  .cols { display: flex; gap: 30px; }
  .col { flex: 1; }
  .photo { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 2px solid ${colors.primary}; margin-bottom: 8px; }
</style>
</head>
<body>
  <div class="header">
    ${p.photo ? `<img src="${esc(p.photo)}" class="photo" />` : ''}
    <h1>${esc(p.firstName)} ${esc(p.lastName)}</h1>
    ${p.title ? `<p class="title">${esc(p.title)}</p>` : ''}
    <p class="contact">${[p.email, p.phone, p.address].filter(Boolean).join(' | ')}</p>
  </div>
  ${cv.profile ? `<div><h3>Profil</h3><p style="font-size:12px">${esc(cv.profile)}</p></div>` : ''}
  ${cv.experience.length ? `<div><h3>Expérience</h3>${expHtml}</div>` : ''}
  ${cv.education.length ? `<div><h3>Formation</h3>${eduHtml}</div>` : ''}
  <div class="cols">
    ${cv.skills.length ? `<div class="col"><h3>Compétences</h3>${skillHtml}</div>` : ''}
    <div class="col">
      ${cv.languages.length ? `<div><h3>Langues</h3>${langHtml}</div>` : ''}
      ${interestHtml ? `<div style="margin-top:12px"><h3>Centres d'intérêt</h3><p style="font-size:12px">${interestHtml}</p></div>` : ''}
    </div>
  </div>
</body>
</html>`
    const blob = new Blob([html], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'MonCV.doc'
    a.click(); URL.revokeObjectURL(url)
  }

  const currentIdx = sections.findIndex(s => s.id === activeSection)
  const progress = ((currentIdx + 1) / sections.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-gray-600 text-xl">&larr;</button>
            <span className="font-bold text-blue-900">MonCV</span>
            <div className="hidden sm:flex items-center gap-1 ml-4">
              {sections.slice(0, 6).map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                    activeSection === s.id ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}. {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${saved ? 'text-green-600' : 'text-gray-400'}`}>
              {saving ? 'Sauvegarde...' : saved ? 'Sauvegardé' : ''}
            </span>
            <button
              onClick={() => setSuggestLang(suggestLang === 'fr' ? 'en' : 'fr')}
              className="px-3 py-1.5 text-xs border rounded-lg hover:bg-gray-50"
            >
              {suggestLang === 'fr' ? '🇬🇧 EN' : '🇫🇷 FR'}
            </button>
            <button onClick={handleDownloadPDF} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
              PDF
            </button>
            <button onClick={handleDownloadWord} className="px-4 py-1.5 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium hidden sm:inline-block">
              Word
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
        <div className="w-full bg-gray-200 h-1 mt-2 rounded-full max-w-7xl mx-auto">
          <div className="bg-blue-600 h-1 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </header>

      {menuOpen && (
        <div className="bg-white border-b px-4 py-3 sm:hidden">
          <div className="flex flex-wrap gap-2">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => { setActiveSection(s.id); setMenuOpen(false) }}
                className={`text-sm px-3 py-1.5 rounded-lg ${
                  activeSection === s.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-1">
        <aside className="w-64 bg-white border-r hidden lg:block">
          <nav className="p-4 space-y-1">
            {sections.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  activeSection === s.id
                    ? 'bg-blue-50 text-blue-700 font-medium shadow-sm border border-blue-100'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  activeSection === s.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {i + 1}
                </span>
                <span>{s.label}</span>
              </button>
            ))}
          </nav>
          <div className="border-t p-4">
            <div className="text-xs text-gray-500 mb-2">Progression</div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="text-xs text-gray-400 mt-1">{currentIdx + 1}/{sections.length}</div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 max-w-3xl mx-auto w-full">
          {activeSection === 'personal' && (
            <div className="bg-white rounded-2xl p-6 border space-y-5 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Informations personnelles</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                <div className="flex items-center gap-4">
                  {cv.personalInfo.photo && (
                    <img src={cv.personalInfo.photo} alt="Photo" className="w-20 h-20 rounded-full object-cover border-2 border-gray-200" />
                  )}
                  <label className="px-5 py-2.5 bg-gray-100 rounded-xl text-sm cursor-pointer hover:bg-gray-200 font-medium">
                    {cv.personalInfo.photo ? 'Changer la photo' : 'Choisir une photo'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onload = (ev) => updatePersonalInfo('photo', ev.target?.result as string || '')
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </label>
                  {cv.personalInfo.photo && (
                    <button onClick={() => updatePersonalInfo('photo', '')} className="text-red-400 text-sm hover:text-red-600 font-medium">Supprimer</button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Prénom" value={cv.personalInfo.firstName} onChange={(v) => updatePersonalInfo('firstName', v)} />
                <Input label="Nom" value={cv.personalInfo.lastName} onChange={(v) => updatePersonalInfo('lastName', v)} />
              </div>
              <Input label="Titre du poste visé" value={cv.personalInfo.title} onChange={(v) => updatePersonalInfo('title', v)} placeholder="ex : Développeur Full Stack" />
              <Input label="Email" value={cv.personalInfo.email} onChange={(v) => updatePersonalInfo('email', v)} type="email" />
              <Input label="Téléphone" value={cv.personalInfo.phone} onChange={(v) => updatePersonalInfo('phone', v)} placeholder="ex : 06 12 34 56 78" />
              <Input label="Adresse" value={cv.personalInfo.address} onChange={(v) => updatePersonalInfo('address', v)} />
            </div>
          )}

          {activeSection === 'objective' && (
            <div className="bg-white rounded-2xl p-6 border space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Objectif professionnel</h2>
              <p className="text-sm text-gray-500">Une phrase d'accroche qui résume votre profil et votre objectif de carrière.</p>
              <textarea
                value={cv.profile}
                onChange={(e) => updateField('profile', e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
                placeholder="ex : Développeur Full Stack avec 5 ans d'expérience..."
              />
              {suggestions.filter((s) => s.section === 'profile').length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Suggestions</p>
                  <div className="space-y-1.5">
                    {suggestions.filter((s) => s.section === 'profile').map((s, i) => (
                      <button
                        key={i}
                        onClick={() => updateField('profile', s.text)}
                        className="block w-full text-left text-sm bg-gray-50 hover:bg-blue-50 hover:text-blue-700 p-3 rounded-xl border transition-colors"
                      >
                        {s.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Expérience professionnelle</h2>
                <button onClick={addExperience} className="text-sm px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium">
                  + Ajouter
                </button>
              </div>
              {cv.experience.map((exp) => (
                <div key={exp.id} className="bg-white rounded-2xl p-6 border space-y-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">{exp.position || 'Nouvelle expérience'}</h3>
                    <button onClick={() => removeExperience(exp.id)} className="text-red-400 hover:text-red-600 text-sm font-medium">Supprimer</button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Intitulé du poste" value={exp.position} onChange={(v) => updateExperience(exp.id, 'position', v)} />
                    <Input label="Entreprise" value={exp.company} onChange={(v) => updateExperience(exp.id, 'company', v)} />
                    <Input label="Date de début" value={exp.startDate} onChange={(v) => updateExperience(exp.id, 'startDate', v)} type="month" />
                    <Input label="Date de fin" value={exp.endDate} onChange={(v) => updateExperience(exp.id, 'endDate', v)} type="month" disabled={exp.current} />
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)} className="rounded" />
                    <span className="text-gray-700">Poste actuel</span>
                  </label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    rows={2}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
                    placeholder="Description synthétique du poste..."
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-700 mb-3 block">Missions / Tâches</span>
                    <div className="space-y-2">
                      {exp.tasks.map((task, ti) => (
                        <div key={ti} className="flex gap-2 items-center">
                          <span className="text-blue-500 text-lg">•</span>
                          <input
                            value={task}
                            onChange={(e) => {
                              const newTasks = [...exp.tasks]; newTasks[ti] = e.target.value
                              updateExperience(exp.id, 'tasks', newTasks)
                            }}
                            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-300"
                            placeholder="Décrivez une mission..."
                          />
                          <button
                            onClick={() => updateExperience(exp.id, 'tasks', exp.tasks.filter((_, i) => i !== ti))}
                            className="text-red-400 hover:text-red-600 text-lg"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => updateExperience(exp.id, 'tasks', [...exp.tasks, ''])}
                      className="text-sm text-blue-600 hover:text-blue-700 mt-3 font-medium"
                    >
                      + Ajouter une mission
                    </button>
                  </div>
                  {suggestions.filter((s) => s.section === 'experience').length > 0 && (
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wider">Suggestions</p>
                      <div className="space-y-1.5">
                        {suggestions.filter((s) => s.section === 'experience').slice(0, 5).map((s, i) => (
                          <button
                            key={i}
                            onClick={() => addSuggestionToTasks(s, exp.id)}
                            className="block text-left text-sm bg-white hover:bg-blue-100 p-3 rounded-xl w-full border border-blue-100 transition-colors"
                          >
                            {s.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {cv.experience.length === 0 && (
                <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border">
                  <p className="text-lg mb-2">Aucune expérience</p>
                  <p className="text-sm">Cliquez sur "+ Ajouter" pour commencer.</p>
                </div>
              )}
            </div>
          )}

          {activeSection === 'education' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Formation</h2>
                <button onClick={addEducation} className="text-sm px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium">
                  + Ajouter
                </button>
              </div>
              {suggestions.filter((s) => s.section === 'education').length > 0 && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wider">Suggestions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.filter((s) => s.section === 'education').map((s, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          const updated = {...cv, education: [...cv.education, {id: crypto.randomUUID(), school: '', degree: s.text, field: '', startDate: '', endDate: ''}]}
                          setCV(updated); save(updated)
                        }}
                        className="text-sm bg-white hover:bg-blue-100 px-4 py-2 rounded-xl border border-blue-100 transition-colors"
                      >
                        {s.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {cv.education.map((edu) => (
                <div key={edu.id} className="bg-white rounded-2xl p-6 border space-y-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">{edu.degree || 'Nouvelle formation'}</h3>
                    <button onClick={() => removeEducation(edu.id)} className="text-red-400 hover:text-red-600 text-sm font-medium">Supprimer</button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Diplôme / Certification" value={edu.degree} onChange={(v) => updateEducation(edu.id, 'degree', v)} />
                    <Input label="Domaine" value={edu.field} onChange={(v) => updateEducation(edu.id, 'field', v)} />
                    <Input label="Établissement" value={edu.school} onChange={(v) => updateEducation(edu.id, 'school', v)} />
                    <Input label="Année de début" value={edu.startDate} onChange={(v) => updateEducation(edu.id, 'startDate', v)} type="month" />
                    <Input label="Année de fin" value={edu.endDate} onChange={(v) => updateEducation(edu.id, 'endDate', v)} type="month" />
                  </div>
                </div>
              ))}
              {cv.education.length === 0 && (
                <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border">
                  <p className="text-lg mb-2">Aucune formation</p>
                  <p className="text-sm">Cliquez sur "+ Ajouter" pour commencer.</p>
                </div>
              )}
            </div>
          )}

          {activeSection === 'skills' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Compétences</h2>
                <button onClick={addSkill} className="text-sm px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium">
                  + Ajouter
                </button>
              </div>
              {suggestions.filter((s) => s.section === 'skills').length > 0 && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wider">Suggestions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.filter((s) => s.section === 'skills').map((s, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          const cat = cv.skills.find(sk => sk.category === s.jobCategory)
                          if (cat) {
                            const updated = {...cv, skills: cv.skills.map(sk => sk.id === cat.id ? {...sk, items: [...sk.items, s.text]} : sk)}
                            setCV(updated); save(updated)
                          } else {
                            const updated = {...cv, skills: [...cv.skills, {id: crypto.randomUUID(), category: s.jobCategory, items: [s.text]}]}
                            setCV(updated); save(updated)
                          }
                        }}
                        className="text-sm bg-white hover:bg-blue-100 px-4 py-2 rounded-xl border border-blue-100 transition-colors"
                      >
                        {s.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {cv.skills.map((skill) => (
                <div key={skill.id} className="bg-white rounded-2xl p-6 border space-y-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <Input label="Catégorie" value={skill.category} onChange={(v) => updateSkill(skill.id, 'category', v)} placeholder="ex : Langages, Outils" />
                    <button onClick={() => removeSkill(skill.id)} className="text-red-400 hover:text-red-600 text-sm font-medium">Supprimer</button>
                  </div>
                  <div className="space-y-2">
                    {skill.items.map((item, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input
                          value={item}
                          onChange={(e) => {
                            const newItems = [...skill.items]; newItems[i] = e.target.value
                            updateSkill(skill.id, 'items', newItems)
                          }}
                          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-300"
                          placeholder="ex : JavaScript, Python"
                        />
                        <button
                          onClick={() => updateSkill(skill.id, 'items', skill.items.filter((_, j) => j !== i))}
                          className="text-red-400 text-lg"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => updateSkill(skill.id, 'items', [...skill.items, ''])}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Ajouter une compétence
                  </button>
                </div>
              ))}
              {cv.skills.length === 0 && (
                <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border">
                  <p className="text-lg mb-2">Aucune compétence</p>
                  <p className="text-sm">Cliquez sur "+ Ajouter" pour commencer.</p>
                </div>
              )}
            </div>
          )}

          {activeSection === 'languages' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Langues</h2>
                <button onClick={addLanguage} className="text-sm px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium">
                  + Ajouter
                </button>
              </div>
              {suggestions.filter((s) => s.section === 'languages').length > 0 && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wider">Suggestions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.filter((s) => s.section === 'languages').map((s, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          const level = s.text.includes('natif') || s.text.includes('native') ? 'Natif' : s.text.includes('courant') || s.text.includes('fluent') ? 'Courant' : 'Intermédiaire'
                          const updated = {...cv, languages: [...cv.languages, {id: crypto.randomUUID(), language: s.text.replace(/\(.*\)/,'').trim(), level}]}
                          setCV(updated); save(updated)
                        }}
                        className="text-sm bg-white hover:bg-blue-100 px-4 py-2 rounded-xl border border-blue-100 transition-colors"
                      >
                        {s.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {cv.languages.map((lang) => (
                <div key={lang.id} className="bg-white rounded-2xl p-6 border space-y-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">{lang.language || 'Nouvelle langue'}</h3>
                    <button onClick={() => removeLanguage(lang.id)} className="text-red-400 hover:text-red-600 text-sm font-medium">Supprimer</button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Langue" value={lang.language} onChange={(v) => updateLanguage(lang.id, 'language', v)} placeholder="ex : Anglais, Espagnol" />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                      <select
                        value={lang.level}
                        onChange={(e) => updateLanguage(lang.id, 'level', e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option>Débutant</option>
                        <option>Intermédiaire</option>
                        <option>Courant</option>
                        <option>Natif</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {cv.languages.length === 0 && (
                <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border">
                  <p className="text-lg mb-2">Aucune langue</p>
                  <p className="text-sm">Ajoutez les langues que vous parlez.</p>
                </div>
              )}
            </div>
          )}

          {activeSection === 'interests' && (
            <div className="bg-white rounded-2xl p-6 border space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Centres d'intérêt</h2>
              <p className="text-sm text-gray-500">Ajoutez vos hobbies et activités personnelles.</p>
              {suggestions.filter((s) => s.section === 'interests').length > 0 && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-blue-700 mb-2 uppercase tracking-wider">Suggestions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.filter((s) => s.section === 'interests').map((s, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          const updated = {...cv, interests: [...cv.interests, s.text]}
                          setCV(updated); save(updated)
                        }}
                        className="text-sm bg-white hover:bg-blue-100 px-4 py-2 rounded-xl border border-blue-100 transition-colors"
                      >
                        {s.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                {cv.interests.map((interest, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={interest}
                      onChange={(e) => {
                        const newInterests = [...cv.interests]; newInterests[i] = e.target.value
                        updateField('interests', newInterests)
                      }}
                      className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ex : Course à pied, Photographie"
                    />
                    <button
                      onClick={() => updateField('interests', cv.interests.filter((_, j) => j !== i))}
                      className="text-red-400 hover:text-red-600 text-xl"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => updateField('interests', [...cv.interests, ''])}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Ajouter un centre d'intérêt
              </button>
              {cv.interests.length === 0 && (
                <p className="text-gray-400 text-center py-8">Aucun centre d'intérêt ajouté.</p>
              )}
            </div>
          )}

          {activeSection === 'colors' && (
            <div className="bg-white rounded-2xl p-6 border space-y-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Personnalisation des couleurs</h2>
              <p className="text-sm text-gray-500">Modifiez les couleurs de votre CV en un clic.</p>
              <div className="grid grid-cols-3 gap-6">
                {(['primary', 'secondary', 'accent'] as const).map((key) => (
                  <div key={key} className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {key === 'primary' ? 'Principale' : key === 'secondary' ? 'Secondaire' : 'Accent'}
                    </label>
                    <div
                      onClick={() => setColorPicker(colorPicker === key ? null : key)}
                      className="w-full h-14 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-gray-400 transition-colors"
                      style={{ backgroundColor: cv.colors[key] }}
                    />
                    {colorPicker === key && (
                      <div className="absolute top-full left-0 mt-2 z-20 shadow-xl rounded-xl">
                        <div className="fixed inset-0" onClick={() => setColorPicker(null)} />
                        <div className="relative">
                          <HexColorPicker
                            color={cv.colors[key]}
                            onChange={(c) => updateColor(key, c)}
                          />
                        </div>
                      </div>
                    )}
                    <input
                      value={cv.colors[key]}
                      onChange={(e) => updateColor(key, e.target.value)}
                      className="w-full mt-2 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        <aside className="w-[400px] bg-white border-l hidden xl:block overflow-y-auto p-4">
          <div className="sticky top-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Aperçu</h3>
              <div className="flex gap-1">
                <button onClick={handleDownloadPDF} className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">PDF</button>
                <button onClick={handleDownloadWord} className="text-xs px-3 py-1.5 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">Word</button>
              </div>
            </div>
            <div ref={previewRef} className="scale-[0.6] origin-top-left w-[calc(100%/0.6)]">
              <CVPreview cv={cv} template={template} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function Input({ label, value, onChange, type, disabled, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; disabled?: boolean; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type || 'text'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
      />
    </div>
  )
}
