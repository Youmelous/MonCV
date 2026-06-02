import type { CV, Template } from '../types'

export default function CVPreview({ cv, template }: { cv: CV; template: Template | null }) {
  const p = cv.personalInfo
  const colors = cv.colors
  const layout = template?.layout || 'single-column'
  const isTwoColumn = layout === 'two-column'
  const headingFont = template?.fonts?.heading || 'Inter'
  const bodyFont = template?.fonts?.body || 'Inter'

  const SectionTitle = ({ children }: { children: string }) => (
    <h3
      className="font-bold text-xs uppercase tracking-wider mb-2"
      style={{
        color: colors.primary,
        borderBottom: `1.5px solid ${colors.accent}`,
        paddingBottom: 3,
        fontFamily: headingFont,
      }}
    >
      {children}
    </h3>
  )

  if (isTwoColumn) {
    return (
      <div
        className="bg-white shadow-sm rounded-lg overflow-hidden text-sm leading-relaxed flex min-h-[842px]"
        style={{ fontFamily: bodyFont }}
      >
        <div className="w-[35%] p-5 flex flex-col gap-5" style={{ backgroundColor: colors.accent }}>
          <div className="flex flex-col items-center">
            {p.photo && (
              <img src={p.photo} alt="photo" className="w-20 h-20 rounded-full object-cover mb-2 border-2" style={{ borderColor: colors.primary }} />
            )}
            <h2 className="text-base font-bold mb-1 text-center" style={{ color: colors.primary, fontFamily: headingFont }}>
              {p.firstName} {p.lastName}
            </h2>
            {p.title && <p className="text-xs font-medium text-center" style={{ color: colors.secondary, fontFamily: headingFont }}>{p.title}</p>}
          </div>

          <div className="space-y-1 text-xs">
            {p.email && <p>{p.email}</p>}
            {p.phone && <p>{p.phone}</p>}
            {p.address && <p className="text-gray-500">{p.address}</p>}
          </div>

          {cv.skills.length > 0 && (
            <div>
              <SectionTitle>Compétences</SectionTitle>
              {cv.skills.map((s) => (
                <div key={s.id} className="mb-2">
                  {s.category && <p className="text-xs font-medium mb-0.5">{s.category}</p>}
                  <div className="flex flex-wrap gap-1">
                    {s.items.filter(Boolean).map((item, i) => (
                      <span key={i} className="text-xs bg-white/70 px-2 py-0.5 rounded" style={{ color: colors.primary }}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {cv.languages.length > 0 && (
            <div>
              <SectionTitle>Langues</SectionTitle>
              {cv.languages.map((l) => (
                <div key={l.id} className="flex justify-between text-xs mb-1">
                  <span>{l.language}</span>
                  <span className="text-gray-500">{l.level}</span>
                </div>
              ))}
            </div>
          )}

          {cv.interests.filter(Boolean).length > 0 && (
            <div>
              <SectionTitle>Centres d'intérêt</SectionTitle>
              <div className="flex flex-wrap gap-1">
                {cv.interests.filter(Boolean).map((item, i) => (
                  <span key={i} className="text-xs bg-white/50 px-2 py-0.5 rounded">{item}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-[65%] p-5 flex flex-col gap-4">
          {cv.profile && (
            <div>
              <SectionTitle>Profil</SectionTitle>
              <p className="text-xs leading-relaxed text-gray-700">{cv.profile}</p>
            </div>
          )}

          {cv.experience.length > 0 && (
            <div>
              <SectionTitle>Expérience</SectionTitle>
              {cv.experience.map((exp) => (
                <div key={exp.id} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium" style={{ fontFamily: headingFont }}>{exp.position || 'Poste'}</p>
                      {exp.company && <p className="text-xs text-gray-500">{exp.company}</p>}
                    </div>
                    <p className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {exp.startDate} - {exp.current ? "Aujourd'hui" : exp.endDate}
                    </p>
                  </div>
                  {exp.description && <p className="text-xs mt-1 text-gray-600">{exp.description}</p>}
                  {exp.tasks.filter(Boolean).length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {exp.tasks.filter(Boolean).map((task, i) => (
                        <li key={i} className="text-xs flex gap-1.5 text-gray-600">
                          <span style={{ color: colors.secondary }}>•</span>
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {cv.education.length > 0 && (
            <div>
              <SectionTitle>Formation</SectionTitle>
              {cv.education.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <p className="text-sm font-medium" style={{ fontFamily: headingFont }}>{edu.degree || 'Diplôme'}</p>
                  <p className="text-xs text-gray-500">{edu.school}{edu.field ? ` - ${edu.field}` : ''}</p>
                  <p className="text-xs text-gray-400">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden text-sm leading-relaxed" style={{ fontFamily: bodyFont }}>
      <div className="p-6">
        <div className="text-center mb-5 pb-4" style={{ borderBottom: `2.5px solid ${colors.primary}` }}>
          {p.photo && (
            <img src={p.photo} alt="photo" className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-2" style={{ borderColor: colors.primary }} />
          )}
          <h1 className="text-xl font-bold" style={{ color: colors.primary, fontFamily: headingFont }}>
            {p.firstName} {p.lastName}
          </h1>
          {p.title && <p className="text-sm mt-1 font-medium" style={{ color: colors.secondary, fontFamily: headingFont }}>{p.title}</p>}
          <div className="flex justify-center gap-3 text-xs text-gray-500 mt-2 flex-wrap">
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>{p.phone}</span>}
            {p.address && <span className="text-gray-400">{p.address}</span>}
          </div>
        </div>

        {cv.profile && (
          <div className="mb-4">
            <SectionTitle>Profil</SectionTitle>
            <p className="text-xs leading-relaxed text-gray-700">{cv.profile}</p>
          </div>
        )}

        {cv.experience.length > 0 && (
          <div className="mb-4">
            <SectionTitle>Expérience</SectionTitle>
            {cv.experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium" style={{ fontFamily: headingFont }}>{exp.position || 'Poste'}</p>
                    {exp.company && <p className="text-xs text-gray-500">{exp.company}</p>}
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap ml-2">
                    {exp.startDate} - {exp.current ? "Aujourd'hui" : exp.endDate}
                  </p>
                </div>
                {exp.description && <p className="text-xs mt-1 text-gray-600">{exp.description}</p>}
                {exp.tasks.filter(Boolean).length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {exp.tasks.filter(Boolean).map((task, i) => (
                      <li key={i} className="text-xs flex gap-1.5 text-gray-600">
                        <span style={{ color: colors.secondary }}>•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {cv.education.length > 0 && (
          <div className="mb-4">
            <SectionTitle>Formation</SectionTitle>
            {cv.education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <p className="text-sm font-medium" style={{ fontFamily: headingFont }}>{edu.degree || 'Diplôme'}</p>
                <p className="text-xs text-gray-500">{edu.school}{edu.field ? ` - ${edu.field}` : ''}</p>
                <p className="text-xs text-gray-400">{edu.startDate} - {edu.endDate}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-8">
          {cv.skills.length > 0 && (
            <div className="flex-1">
              <SectionTitle>Compétences</SectionTitle>
              {cv.skills.map((s) => (
                <div key={s.id} className="mb-2">
                  {s.category && <p className="text-xs font-medium">{s.category}</p>}
                  <p className="text-xs text-gray-600">{s.items.filter(Boolean).join(', ')}</p>
                </div>
              ))}
            </div>
          )}
          <div className="flex-1 space-y-4">
            {cv.languages.length > 0 && (
              <div>
                <SectionTitle>Langues</SectionTitle>
                {cv.languages.map((l) => (
                  <div key={l.id} className="flex justify-between text-xs mb-1">
                    <span>{l.language}</span>
                    <span className="text-gray-500">{l.level}</span>
                  </div>
                ))}
              </div>
            )}
            {cv.interests.filter(Boolean).length > 0 && (
              <div>
                <SectionTitle>Centres d'intérêt</SectionTitle>
                <div className="flex flex-wrap gap-1">
                  {cv.interests.filter(Boolean).map((item, i) => (
                    <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded">{item}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
