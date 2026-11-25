import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CONTINENTS = [
  {
    id: 'europe',
    label: 'Europe',
    emoji: '🏛️',
    color: '#7C3AED',
    cities: ['Paris', 'Nice', 'Lyon', 'Bordeaux', 'Marseille'],
    count: 1240,
    // SVG path simplifié Europe
    path: 'M 480 140 L 500 130 L 520 135 L 540 128 L 555 135 L 565 130 L 580 140 L 575 155 L 590 165 L 585 180 L 570 185 L 560 195 L 545 190 L 535 200 L 520 195 L 510 205 L 495 200 L 485 190 L 475 180 L 470 165 L 478 155 Z',
  },
  {
    id: 'africa',
    label: 'Afrique',
    emoji: '🌍',
    color: '#F59E0B',
    cities: ['Marrakech', 'Casablanca', 'Dakar', 'Tunis', 'Zanzibar'],
    count: 850,
    path: 'M 490 210 L 515 205 L 535 210 L 545 225 L 550 245 L 545 265 L 540 285 L 530 300 L 520 315 L 510 325 L 500 320 L 490 310 L 480 295 L 475 275 L 472 255 L 475 235 L 480 220 Z',
  },
  {
    id: 'asia',
    label: 'Asie',
    emoji: '🏯',
    color: '#EF4444',
    cities: ['Tokyo', 'Bali', 'Bangkok', 'Dubaï', 'Singapour'],
    count: 2300,
    path: 'M 580 130 L 610 120 L 640 115 L 670 118 L 700 125 L 720 135 L 730 150 L 725 165 L 710 175 L 700 185 L 685 180 L 670 190 L 655 185 L 640 175 L 625 170 L 610 160 L 595 155 L 582 148 Z',
  },
  {
    id: 'americas',
    label: 'Amériques',
    emoji: '🗽',
    color: '#10B981',
    cities: ['New York', 'Miami', 'Cancún', 'Rio', 'Buenos Aires'],
    count: 980,
    path: 'M 280 140 L 300 135 L 315 140 L 320 155 L 315 170 L 310 190 L 305 210 L 300 230 L 295 250 L 290 270 L 285 285 L 280 275 L 275 255 L 272 235 L 270 215 L 272 195 L 275 175 L 277 158 Z',
  },
  {
    id: 'oceania',
    label: 'Océanie',
    emoji: '🏄',
    color: '#06B6D4',
    cities: ['Sydney', 'Melbourne', 'Auckland', 'Bali', 'Phuket'],
    count: 420,
    path: 'M 680 260 L 700 255 L 720 258 L 730 268 L 728 280 L 718 288 L 700 290 L 685 285 L 678 275 Z',
  },
]

export default function WorldMap() {
  const [hovered, setHovered] = useState(null)
  const navigate = useNavigate()

  const active = CONTINENTS.find(c => c.id === hovered)

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Titre */}
      <div className="text-center mb-10">
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--secondary)', letterSpacing: '0.25em' }}>
          ✦ Partout dans le monde
        </p>
        <h3 className="font-display text-3xl md:text-4xl font-black" style={{ color: 'var(--txt)' }}>
          🌍 Explorez le <span className="gradient-text">monde</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* ── Carte SVG ────────────────────────────────── */}
        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #07020F, #12053A)', border: '1px solid rgba(124,58,237,0.20)', minHeight: '360px' }}>

          {/* Grille décorative */}
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(124,58,237,0.5)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Carte monde SVG */}
          <svg viewBox="200 100 600 300" className="w-full h-full" style={{ minHeight: '320px' }}>
            {/* Océans */}
            <rect x="200" y="100" width="600" height="300" fill="transparent" />

            {/* Continents */}
            {CONTINENTS.map(c => (
              <g key={c.id}>
                <path
                  d={c.path}
                  fill={hovered === c.id ? c.color : 'rgba(124,58,237,0.25)'}
                  stroke={hovered === c.id ? c.color : 'rgba(139,92,246,0.40)'}
                  strokeWidth={hovered === c.id ? 2 : 1}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    filter: hovered === c.id ? `drop-shadow(0 0 12px ${c.color}88)` : 'none',
                  }}
                  onMouseEnter={() => setHovered(c.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => navigate(`/search?city=${c.cities[0]}`)}
                />
                {/* Label continent */}
                <text
                  x={(() => {
                    const coords = { europe: 525, africa: 510, asia: 655, americas: 295, oceania: 704 }
                    return coords[c.id]
                  })()}
                  y={(() => {
                    const coords = { europe: 168, africa: 265, asia: 153, americas: 210, oceania: 273 }
                    return coords[c.id]
                  })()}
                  textAnchor="middle"
                  fontSize="9"
                  fontWeight="bold"
                  fill={hovered === c.id ? c.color : 'rgba(245,240,255,0.50)'}
                  style={{ transition: 'all 0.3s', pointerEvents: 'none', userSelect: 'none' }}>
                  {c.emoji} {c.label}
                </text>

                {/* Point pulsant sur hover */}
                {hovered === c.id && (
                  <circle
                    cx={(() => {
                      const coords = { europe: 525, africa: 510, asia: 655, americas: 295, oceania: 704 }
                      return coords[c.id]
                    })()}
                    cy={(() => {
                      const coords = { europe: 175, africa: 272, asia: 160, americas: 217, oceania: 278 }
                      return coords[c.id]
                    })()}
                    r="4"
                    fill={c.color}
                    style={{ filter: `drop-shadow(0 0 6px ${c.color})` }}>
                    <animate attributeName="r" values="4;7;4" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            ))}

            {/* Lignes de connexion décoratives */}
            <line x1="315" y1="175" x2="490" y2="165" stroke="rgba(212,175,55,0.15)" strokeWidth="0.8" strokeDasharray="4,4" />
            <line x1="525" y1="168" x2="655" y2="153" stroke="rgba(212,175,55,0.15)" strokeWidth="0.8" strokeDasharray="4,4" />
            <line x1="525" y1="200" x2="510" y2="215" stroke="rgba(212,175,55,0.15)" strokeWidth="0.8" strokeDasharray="4,4" />
          </svg>

          {/* Légende en bas */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
            {CONTINENTS.map(c => (
              <button key={c.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105"
                style={{
                  background: hovered === c.id ? `${c.color}22` : 'rgba(0,0,0,0.40)',
                  border: `1px solid ${hovered === c.id ? c.color : 'rgba(255,255,255,0.10)'}`,
                  color: hovered === c.id ? c.color : 'rgba(245,240,255,0.60)',
                  backdropFilter: 'blur(8px)',
                }}
                onMouseEnter={() => setHovered(c.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => navigate(`/search?city=${c.cities[0]}`)}>
                {c.emoji} {c.label}
                <span style={{ color: 'rgba(255,255,255,0.40)' }}>· {c.count.toLocaleString('fr-FR')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Panel infos continent ─────────────────────── */}
        <div className="flex flex-col gap-4">
          {active ? (
            <div className="rounded-2xl p-6 transition-all"
              style={{ background: `linear-gradient(135deg, ${active.color}14, ${active.color}06)`, border: `1px solid ${active.color}30` }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{active.emoji}</span>
                <div>
                  <h4 className="font-black text-xl" style={{ color: active.color }}>{active.label}</h4>
                  <p className="text-xs font-semibold" style={{ color: 'var(--txt-4)' }}>
                    {active.count.toLocaleString('fr-FR')} logements disponibles
                  </p>
                </div>
              </div>

              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--txt-4)' }}>
                Destinations populaires
              </p>
              <div className="flex flex-col gap-2 mb-5">
                {active.cities.map((city, i) => (
                  <button key={city}
                    onClick={() => navigate(`/search?city=${city}`)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-left transition-all hover:scale-[1.02]"
                    style={{ background: `${active.color}12`, color: 'var(--txt-2)', border: `1px solid ${active.color}20` }}
                    onMouseOver={e => { e.currentTarget.style.background = `${active.color}22`; e.currentTarget.style.color = active.color }}
                    onMouseOut={e => { e.currentTarget.style.background = `${active.color}12`; e.currentTarget.style.color = 'var(--txt-2)' }}>
                    <span className="text-xs font-black" style={{ color: active.color }}>#{i + 1}</span>
                    <span>{city}</span>
                    <span className="ml-auto opacity-40 text-xs">→</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => navigate(`/search?city=${active.cities[0]}`)}
                className="w-full py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${active.color}, ${active.color}99)`, color: '#fff', boxShadow: `0 6px 20px ${active.color}33` }}>
                Explorer {active.label} →
              </button>
            </div>
          ) : (
            // État par défaut
            <div className="rounded-2xl p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <p className="text-center text-3xl mb-3">🌍</p>
              <p className="text-center font-bold mb-2" style={{ color: 'var(--txt)' }}>Survolez un continent</p>
              <p className="text-center text-sm" style={{ color: 'var(--txt-3)' }}>
                Découvrez les destinations disponibles dans chaque région du monde.
              </p>
            </div>
          )}

          {/* Stats rapides */}
          <div className="grid grid-cols-2 gap-3">
            {CONTINENTS.slice(0, 4).map(c => (
              <button key={c.id}
                className="p-4 rounded-2xl text-center transition-all hover:scale-105"
                style={{ background: hovered === c.id ? `${c.color}18` : 'var(--surface)', border: `1px solid ${hovered === c.id ? c.color : 'var(--border)'}` }}
                onMouseEnter={() => setHovered(c.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => navigate(`/search?city=${c.cities[0]}`)}>
                <div className="text-xl mb-1">{c.emoji}</div>
                <div className="text-xs font-black" style={{ color: c.color }}>{c.count.toLocaleString('fr-FR')}</div>
                <div className="text-xs" style={{ color: 'var(--txt-4)' }}>{c.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
