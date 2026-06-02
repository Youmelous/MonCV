import fs from 'fs'
import path from 'path'

const templates = [
  { id: 'classic-blue', name: 'Classique Bleu', layout: 'single-column', colors: { primary: '#1e3a5f', secondary: '#3b82f6', accent: '#e2e8f0' } },
  { id: 'modern-teal', name: 'Moderne Sarcelle', layout: 'two-column', colors: { primary: '#0d9488', secondary: '#14b8a6', accent: '#ccfbf1' } },
  { id: 'creative-coral', name: 'Créatif Corail', layout: 'two-column', colors: { primary: '#e11d48', secondary: '#fb7185', accent: '#ffe4e6' } },
  { id: 'minimal-slate', name: 'Minimaliste Ardoise', layout: 'single-column', colors: { primary: '#334155', secondary: '#64748b', accent: '#f1f5f9' } },
  { id: 'elegant-navy', name: 'Élégant Marine', layout: 'single-column', colors: { primary: '#1e293b', secondary: '#f8fafc', accent: '#cbd5e1' } },
  { id: 'fresh-green', name: 'Fresh Vert', layout: 'two-column', colors: { primary: '#166534', secondary: '#22c55e', accent: '#dcfce7' } },
  { id: 'bold-purple', name: 'Bold Violet', layout: 'two-column', colors: { primary: '#6d28d9', secondary: '#8b5cf6', accent: '#ede9fe' } },
  { id: 'clean-ivory', name: 'Clean Ivoire', layout: 'single-column', colors: { primary: '#1c1917', secondary: '#78716c', accent: '#f5f5f4' } },
  { id: 'professional-indigo', name: 'Professionnel Indigo', layout: 'single-column', colors: { primary: '#312e81', secondary: '#6366f1', accent: '#e0e7ff' } },
  { id: 'vibrant-amber', name: 'Vibrant Ambre', layout: 'two-column', colors: { primary: '#92400e', secondary: '#f59e0b', accent: '#fef3c7' } },
  { id: 'side-bar-sapphire', name: 'Barre Latérale Saphir', layout: 'two-column', colors: { primary: '#1e3a8a', secondary: '#3b82f6', accent: '#dbeafe' } },
  { id: 'timeless-charcoal', name: 'Intemporel Charcoal', layout: 'single-column', colors: { primary: '#1f2937', secondary: '#6b7280', accent: '#f3f4f6' } },
  { id: 'europass-inspired', name: 'Europass Modernisé', layout: 'two-column', colors: { primary: '#2c3e50', secondary: '#3498db', accent: '#ecf0f1' } },
  { id: 'ats-friendly', name: 'ATS Friendly', layout: 'single-column', colors: { primary: '#2d3436', secondary: '#636e72', accent: '#f5f6fa' } },
  { id: 'creative-artist', name: 'Créatif Artistique', layout: 'two-column', colors: { primary: '#6c5ce7', secondary: '#fd79a8', accent: '#dfe6e9' } },
  { id: 'fonctionnel', name: 'Fonctionnel', layout: 'single-column', colors: { primary: '#006266', secondary: '#00b894', accent: '#ffeaa7' } },
  { id: 'scientifique', name: 'Scientifique', layout: 'single-column', colors: { primary: '#1b1464', secondary: '#0652DD', accent: '#f1f2f6' } },
  { id: 'informatique', name: 'Informatique / IT', layout: 'two-column', colors: { primary: '#0abde3', secondary: '#10ac84', accent: '#c8d6e5' } },
  { id: 'commercial', name: 'Commercial / Vente', layout: 'two-column', colors: { primary: '#e84118', secondary: '#c23616', accent: '#f5f6fa' } },
  { id: 'medical', name: 'Médical / Santé', layout: 'single-column', colors: { primary: '#0097e6', secondary: '#00a8ff', accent: '#e1f5fe' } },
  { id: 'innovant', name: 'Innovant', layout: 'two-column', colors: { primary: '#130f40', secondary: '#f9ca24', accent: '#7ed6df' } },
  { id: 'traditionnel', name: 'Traditionnel', layout: 'single-column', colors: { primary: '#000000', secondary: '#444444', accent: '#f0f0f0' } },
  { id: 'express', name: 'Express', layout: 'single-column', colors: { primary: '#353b48', secondary: '#7f8fa6', accent: '#dcdde1' } },
  { id: 'master-degree', name: 'Master / Étudiant', layout: 'two-column', colors: { primary: '#574b90', secondary: '#786fa6', accent: '#f3e6ff' } },
  { id: 'stage', name: 'Stage / Alternance', layout: 'single-column', colors: { primary: '#e77f67', secondary: '#f19066', accent: '#faf0e6' } },
  { id: 'detail', name: 'Détaillé', layout: 'single-column', colors: { primary: '#3d3d3d', secondary: '#595959', accent: '#f5f0e1' } },
  { id: 'graphique', name: 'Graphique', layout: 'two-column', colors: { primary: '#30336b', secondary: '#be2edd', accent: '#f0f0ff' } },
  { id: 'photo-ready', name: 'Avec Photo', layout: 'single-column', colors: { primary: '#2f3640', secondary: '#487eb0', accent: '#f5f6fa' } },
  { id: 'magasinier', name: 'Logistique / Magasinier', layout: 'single-column', colors: { primary: '#e1b12c', secondary: '#4cd137', accent: '#f5f6fa' } },
  { id: 'femme', name: 'Élégance', layout: 'two-column', colors: { primary: '#b71540', secondary: '#e77f67', accent: '#fce4ec' } },
]

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

function generatePreview(t: typeof templates[0]) {
  const p = t.colors.primary
  const s = t.colors.secondary
  const a = t.colors.accent
  const pRgb = hexToRgb(p)
  const aRgb = hexToRgb(a)

  if (t.layout === 'two-column') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 297" width="210" height="297">
  <rect width="210" height="297" fill="${a}" />
  <rect x="0" y="0" width="70" height="297" fill="${p}" opacity="0.08" />
  <rect x="12" y="12" width="46" height="46" rx="23" fill="${p}" opacity="0.15" />
  <rect x="12" y="66" width="46" height="8" rx="4" fill="${p}" opacity="0.2" />
  <rect x="12" y="78" width="30" height="6" rx="3" fill="${p}" opacity="0.15" />
  <rect x="12" y="94" width="46" height="6" rx="3" fill="${p}" opacity="0.1" />
  <rect x="12" y="104" width="38" height="6" rx="3" fill="${p}" opacity="0.1" />
  <rect x="12" y="114" width="42" height="6" rx="3" fill="${p}" opacity="0.1" />
  <rect x="12" y="134" width="46" height="6" rx="3" fill="${p}" opacity="0.2" />
  <rect x="12" y="144" width="26" height="6" rx="3" fill="${p}" opacity="0.1" />
  <rect x="12" y="154" width="40" height="6" rx="3" fill="${p}" opacity="0.1" />
  <rect x="85" y="14" width="20" height="6" rx="3" fill="${p}" />
  <rect x="85" y="24" width="50" height="6" rx="3" fill="${s}" opacity="0.6" />
  <rect x="85" y="40" width="115" height="4" rx="2" fill="${p}" opacity="0.15" />
  <rect x="85" y="48" width="100" height="4" rx="2" fill="${p}" opacity="0.15" />
  <rect x="85" y="56" width="108" height="4" rx="2" fill="${p}" opacity="0.15" />
  <rect x="85" y="72" width="40" height="5" rx="2.5" fill="${p}" opacity="0.6" />
  <rect x="85" y="82" width="115" height="4" rx="2" fill="${p}" opacity="0.12" />
  <rect x="85" y="90" width="100" height="4" rx="2" fill="${p}" opacity="0.12" />
  <rect x="85" y="98" width="108" height="4" rx="2" fill="${p}" opacity="0.12" />
  <rect x="85" y="108" width="92" height="4" rx="2" fill="${p}" opacity="0.12" />
  <rect x="85" y="124" width="40" height="5" rx="2.5" fill="${p}" opacity="0.6" />
  <rect x="85" y="134" width="115" height="4" rx="2" fill="${p}" opacity="0.12" />
  <rect x="85" y="142" width="100" height="4" rx="2" fill="${p}" opacity="0.12" />
  <rect x="85" y="150" width="108" height="4" rx="2" fill="${p}" opacity="0.12" />
  <rect x="85" y="158" width="92" height="4" rx="2" fill="${p}" opacity="0.12" />
  <rect x="85" y="174" width="40" height="5" rx="2.5" fill="${p}" opacity="0.6" />
  <rect x="85" y="184" width="115" height="4" rx="2" fill="${p}" opacity="0.12" />
  <rect x="85" y="192" width="100" height="4" rx="2" fill="${p}" opacity="0.12" />
  <rect x="85" y="200" width="108" height="4" rx="2" fill="${p}" opacity="0.12" />
  <rect x="12" y="268" width="46" height="8" rx="4" fill="${p}" opacity="0.2" />
  <rect x="12" y="280" width="36" height="5" rx="2.5" fill="${s}" opacity="0.3" />
  <text x="105" y="282" text-anchor="middle" fill="${p}" opacity="0.5" font-size="7" font-family="sans-serif">${t.name}</text>
</svg>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 297" width="210" height="297">
  <rect width="210" height="297" fill="#ffffff" />
  <rect x="0" y="0" width="210" height="70" fill="${p}" opacity="0.06" />
  <rect x="105" y="14" width="20" height="6" rx="3" fill="${p}" opacity="0.4" />
  <rect x="80" y="24" width="50" height="20" rx="10" fill="${p}" opacity="0.08" />
  <rect x="80" y="24" width="50" height="4" rx="2" fill="${p}" />
  <rect x="80" y="34" width="30" height="3" rx="1.5" fill="${s}" opacity="0.6" />
  <rect x="20" y="86" width="170" height="4" rx="2" fill="${p}" opacity="0.12" />
  <rect x="20" y="96" width="170" height="3" rx="1.5" fill="${p}" opacity="0.08" />
  <rect x="20" y="104" width="140" height="3" rx="1.5" fill="${p}" opacity="0.08" />
  <rect x="20" y="112" width="155" height="3" rx="1.5" fill="${p}" opacity="0.08" />
  <rect x="20" y="120" width="130" height="3" rx="1.5" fill="${p}" opacity="0.08" />
  <rect x="20" y="140" width="100" height="4" rx="2" fill="${p}" opacity="0.12" />
  <rect x="20" y="150" width="170" height="3" rx="1.5" fill="${p}" opacity="0.08" />
  <rect x="20" y="158" width="140" height="3" rx="1.5" fill="${p}" opacity="0.08" />
  <rect x="20" y="166" width="155" height="3" rx="1.5" fill="${p}" opacity="0.08" />
  <rect x="20" y="174" width="130" height="3" rx="1.5" fill="${p}" opacity="0.08" />
  <rect x="20" y="194" width="100" height="4" rx="2" fill="${p}" opacity="0.12" />
  <rect x="20" y="204" width="170" height="3" rx="1.5" fill="${p}" opacity="0.08" />
  <rect x="20" y="212" width="140" height="3" rx="1.5" fill="${p}" opacity="0.08" />
  <rect x="20" y="220" width="155" height="3" rx="1.5" fill="${p}" opacity="0.08" />
  <rect x="20" y="228" width="130" height="3" rx="1.5" fill="${p}" opacity="0.08" />
  <rect x="20" y="248" width="80" height="4" rx="2" fill="${p}" opacity="0.12" />
  <rect x="20" y="258" width="170" height="3" rx="1.5" fill="${p}" opacity="0.08" />
  <rect x="20" y="266" width="140" height="3" rx="1.5" fill="${p}" opacity="0.08" />
  <rect x="20" y="274" width="120" height="3" rx="1.5" fill="${p}" opacity="0.08" />
  <text x="105" y="250" text-anchor="middle" fill="${p}" opacity="0.5" font-size="7" font-family="sans-serif">${t.name}</text>
</svg>`
}

const outputDir = path.join(__dirname, '..', '..', '..', 'frontend', 'public', 'previews')
fs.mkdirSync(outputDir, { recursive: true })

const fileNames: string[] = []
for (const t of templates) {
  const svg = generatePreview(t)
  const filename = `${t.id}.svg`
  fs.writeFileSync(path.join(outputDir, filename), svg, 'utf-8')
  fileNames.push(filename)
  console.log(`  ✓ ${filename}`)
}
console.log(`\n✅ ${fileNames.length} previews generated in ${outputDir}`)
