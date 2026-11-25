import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { propertyAPI } from '../services/api'

const CITY_COORDS = {
  'Paris': { lat: 48.85, lon: 2.35 },
  'Nice': { lat: 43.71, lon: 7.26 },
  'Lyon': { lat: 45.75, lon: 4.83 },
  'Bordeaux': { lat: 44.84, lon: -0.58 },
  'Marseille': { lat: 43.30, lon: 5.37 },
  'Chamonix': { lat: 45.92, lon: 6.87 },
  'Strasbourg': { lat: 48.57, lon: 7.75 },
  'Tokyo': { lat: 35.69, lon: 139.69 },
  'Bali': { lat: -8.34, lon: 115.09 },
  'Bangkok': { lat: 13.75, lon: 100.52 },
  'Dubai': { lat: 25.20, lon: 55.27 },
  'Dubaï': { lat: 25.20, lon: 55.27 },
  'Singapore': { lat: 1.35, lon: 103.82 },
  'Singapour': { lat: 1.35, lon: 103.82 },
  'New York': { lat: 40.71, lon: -74.01 },
  'Miami': { lat: 25.77, lon: -80.19 },
  'Los Angeles': { lat: 34.05, lon: -118.24 },
  'Marrakech': { lat: 31.63, lon: -7.99 },
  'Casablanca': { lat: 33.59, lon: -7.62 },
  'London': { lat: 51.51, lon: -0.13 },
  'Londres': { lat: 51.51, lon: -0.13 },
  'Barcelona': { lat: 41.39, lon: 2.15 },
  'Barcelone': { lat: 41.39, lon: 2.15 },
  'Rome': { lat: 41.90, lon: 12.50 },
  'Amsterdam': { lat: 52.37, lon: 4.90 },
  'Berlin': { lat: 52.52, lon: 13.40 },
  'Madrid': { lat: 40.42, lon: -3.70 },
  'Seoul': { lat: 37.57, lon: 126.98 },
  'Séoul': { lat: 37.57, lon: 126.98 },
  'Sydney': { lat: -33.87, lon: 151.21 },
  'Melbourne': { lat: -37.81, lon: 144.96 },
  'Istanbul': { lat: 41.01, lon: 28.95 },
  'Athènes': { lat: 37.98, lon: 23.73 },
  'Lisbonne': { lat: 38.72, lon: -9.14 },
  'Tunis': { lat: 36.82, lon: 10.17 },
  'Dakar': { lat: 14.72, lon: -17.47 },
  'Nairobi': { lat: -1.29, lon: 36.82 },
  'Mumbai': { lat: 19.08, lon: 72.88 },
  'Hong Kong': { lat: 22.32, lon: 114.17 },
  'Phuket': { lat: 7.88, lon: 98.39 },
  'Montréal': { lat: 45.50, lon: -73.57 },
  'Toronto': { lat: 43.65, lon: -79.38 },
  'Cancún': { lat: 21.16, lon: -86.85 },
  'Mykonos': { lat: 37.45, lon: 25.33 },
  'Rio de Janeiro': { lat: -22.91, lon: -43.17 },
  'Buenos Aires': { lat: -34.61, lon: -58.38 },
  'Le Caire': { lat: 30.04, lon: 31.24 },
  'Shanghai': { lat: 31.23, lon: 121.47 },
  'Pékin': { lat: 39.91, lon: 116.39 },
  'Moscou': { lat: 55.75, lon: 37.62 },
}

const ARC_PAIRS = [
  ['Paris', 'New York', '#00d4ff'],
  ['Paris', 'Dubai', '#ff6b6b'],
  ['London', 'Singapore', '#ffd700'],
  ['New York', 'Los Angeles', '#7c3aed'],
  ['Dubai', 'Mumbai', '#10b981'],
  ['Tokyo', 'Shanghai', '#f97316'],
  ['Singapore', 'Bali', '#00d4ff'],
  ['Marrakech', 'Paris', '#ff6b6b'],
  ['Barcelona', 'Rome', '#ffd700'],
  ['Sydney', 'Tokyo', '#10b981'],
  ['Miami', 'Cancún', '#7c3aed'],
  ['Rio de Janeiro', 'Buenos Aires', '#f97316'],
  ['Istanbul', 'Athènes', '#00d4ff'],
  ['Mumbai', 'Bangkok', '#ff6b6b'],
  ['Seoul', 'Tokyo', '#ffd700'],
]

const STARS = Array.from({ length: 300 }, (_, i) => ({
  x: (i * 137.5) % 1, y: (i * 97.3) % 1,
  r: 0.3 + (i % 5) * 0.35,
  op: 0.2 + (i % 7) * 0.1,
  tw: (i % 11) * 0.7,
}))

function ll2v(lat, lon) {
  const phi = (90 - lat) * (Math.PI / 180)
  const th  = (lon + 180) * (Math.PI / 180)
  return [-Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th)]
}
function rot(v, rx, ry) {
  let [x, y, z] = v
  const cY = Math.cos(ry), sY = Math.sin(ry)
  const x1 = x * cY + z * sY, z1 = -x * sY + z * cY
  const cX = Math.cos(rx), sX = Math.sin(rx)
  return [x1, y * cX - z1 * sX, y * sX + z1 * cX]
}
function proj(v, R, W, H) {
  const fov = 900, [x, y, z] = v
  const s = fov / (fov + z * R)
  return { x: x * R * s + W / 2, y: -y * R * s + H / 2, z, s }
}

// Charge une image avec fallback
function loadImg(urls, cb) {
  let i = 0
  const tryNext = () => {
    if (i >= urls.length) { cb(null); return }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => cb(img)
    img.onerror = () => { i++; tryNext() }
    img.src = urls[i]
    i++
  }
  tryNext()
}

export default function Globe3D() {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)
  const texRef    = useRef(null)
  const rotX      = useRef(0.25)
  const rotY      = useRef(0)
  const velX      = useRef(0)
  const velY      = useRef(0.003)
  const drag      = useRef(false)
  const lastPos   = useRef({ x: 0, y: 0 })
  const [pins, setPins]         = useState([])
  const [hovered, setHovered]   = useState(null)
  const [texState, setTexState] = useState('loading') // loading | ok | fail
  const navigate = useNavigate()

  useEffect(() => {
    loadImg([
      'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
      'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg',
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    ], img => {
      if (img) { texRef.current = img; setTexState('ok') }
      else setTexState('fail')
    })
  }, [])

  useEffect(() => {
    propertyAPI.getAll({ limit: 100 }).then(res => {
      const data = Array.isArray(res.data) ? res.data : []
      const cc = {}
      data.forEach(p => { if (p.city) cc[p.city] = (cc[p.city] || 0) + 1 })
      setPins(Object.entries(cc)
        .map(([city, count]) => { const c = CITY_COORDS[city]; return c ? { city, count, lat: c.lat, lon: c.lon } : null })
        .filter(Boolean).sort((a, b) => b.count - a.count))
    }).catch(() => {})
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) { animRef.current = requestAnimationFrame(draw); return }
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    const R = Math.min(W, H) * 0.40
    const cx = W / 2, cy = H / 2
    const t  = Date.now() / 1000

    if (!drag.current) {
      rotX.current += velX.current; rotY.current += velY.current
      velX.current *= 0.92
      velY.current = velY.current * 0.996 + 0.003 * 0.004
      rotX.current = Math.max(-1.0, Math.min(1.0, rotX.current))
    }

    // ── 1. Fond espace ────────────────────────────────────────
    ctx.fillStyle = '#020008'
    ctx.fillRect(0, 0, W, H)

    // Nébuleuses
    ;[
      [0.2, 0.3, 0.35, 'rgba(60,10,120,0.10)'],
      [0.8, 0.7, 0.30, 'rgba(10,40,120,0.10)'],
      [0.6, 0.1, 0.25, 'rgba(120,50,10,0.06)'],
    ].forEach(([nx, ny, nr, nc]) => {
      const g = ctx.createRadialGradient(nx*W, ny*H, 0, nx*W, ny*H, nr*W)
      g.addColorStop(0, nc); g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H)
    })

    // ── 2. Étoiles ────────────────────────────────────────────
    STARS.forEach(s => {
      const op = s.op * (0.6 + 0.4 * Math.sin(t * 1.5 + s.tw))
      ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${op})`; ctx.fill()
    })

    // ── 3. Halo atmosphérique ─────────────────────────────────
    const atmo1 = ctx.createRadialGradient(cx, cy, R * 0.98, cx, cy, R * 1.28)
    atmo1.addColorStop(0, 'rgba(60,130,255,0.35)')
    atmo1.addColorStop(0.5, 'rgba(30,80,200,0.12)')
    atmo1.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.beginPath(); ctx.arc(cx, cy, R * 1.28, 0, Math.PI * 2)
    ctx.fillStyle = atmo1; ctx.fill()

    // ── 4. Sphère de base (toujours océan bleu) ───────────────
    const ocean = ctx.createRadialGradient(cx - R*0.2, cy - R*0.3, R*0.05, cx, cy, R)
    ocean.addColorStop(0, '#1e5fa0')
    ocean.addColorStop(0.4, '#0f3a70')
    ocean.addColorStop(0.8, '#081c42')
    ocean.addColorStop(1, '#030d20')
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2)
    ctx.fillStyle = ocean; ctx.fill()

    // ── 5. Texture satellite (scanline) ───────────────────────
    const tex = texRef.current
    if (tex && (tex.complete || tex.width)) {
      const tw = tex.naturalWidth || tex.width || 1024
      const th = tex.naturalHeight || tex.height || 512
      const STEP = 1.5

      ctx.save()
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip()

      for (let dy = -R + 1; dy <= R - 1; dy += STEP) {
        const ny = dy / R
        const cny = Math.max(-0.9999, Math.min(0.9999, ny))
        const sLat = Math.asin(cny)
        const rowR = Math.cos(sLat) * R
        if (rowR < 0.5) continue

        const rLat = Math.max(-Math.PI/2, Math.min(Math.PI/2, sLat - rotX.current))
        const texY = Math.max(0, Math.min(th - STEP, (0.5 - rLat / Math.PI) * th))
        const off  = ((-rotY.current % (2*Math.PI) + 2*Math.PI) % (2*Math.PI)) / (2*Math.PI) * tw

        const px = cx - rowR, pw = rowR * 2
        const w1 = Math.max(0, ((tw - off) / tw) * pw)
        if (w1 > 0)
          ctx.drawImage(tex, off, texY, tw - off, STEP, px,      cy + dy, w1,      STEP)
        if (pw - w1 > 0.5 && off > 0)
          ctx.drawImage(tex, 0,   texY, off,      STEP, px + w1, cy + dy, pw - w1, STEP)
      }

      // Côté nuit
      const na = rotY.current + Math.PI
      const nG = ctx.createRadialGradient(
        cx + Math.cos(na) * R * 0.1, cy,
        R * 0.3,
        cx + Math.cos(na) * R * 0.05, cy,
        R * 1.05
      )
      nG.addColorStop(0, 'rgba(0,0,10,0)')
      nG.addColorStop(0.5, 'rgba(0,0,10,0)')
      nG.addColorStop(1, 'rgba(0,0,10,0.60)')
      ctx.fillStyle = nG; ctx.fillRect(cx - R, cy - R, R*2, R*2)

      ctx.restore()
    }

    // ── 6. Projeter les pins ──────────────────────────────────
    const vPins = pins.map(pin => {
      const v = rot(ll2v(pin.lat, pin.lon), rotX.current, rotY.current)
      const p = proj(v, R, W, H)
      return { ...pin, px: p.x, py: p.y, sc: p.s, vz: v[2] }
    }).filter(p => p.vz > 0.04).sort((a, b) => a.vz - b.vz)

    // ── 7. Arcs de connexion animés ───────────────────────────
    ARC_PAIRS.forEach(([ca, cb, col], idx) => {
      const cA = CITY_COORDS[ca], cB = CITY_COORDS[cb]
      if (!cA || !cB) return
      const vA = rot(ll2v(cA.lat, cA.lon), rotX.current, rotY.current)
      const vB = rot(ll2v(cB.lat, cB.lon), rotX.current, rotY.current)
      if (vA[2] < -0.1 || vB[2] < -0.1) return
      const pA = proj(vA, R, W, H)
      const pB = proj(vB, R, W, H)

      const mx = (pA.x + pB.x) / 2
      const my = (pA.y + pB.y) / 2
      const dist = Math.hypot(pB.x - pA.x, pB.y - pA.y)
      const cpX = mx - (pB.y - pA.y) * 0.15
      const cpY = my + (pB.x - pA.x) * 0.15 - dist * 0.25

      // Ligne de base
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(pA.x, pA.y)
      ctx.quadraticCurveTo(cpX, cpY, pB.x, pB.y)
      ctx.strokeStyle = col + '30'
      ctx.lineWidth = 1
      ctx.stroke()

      // Point animé sur l'arc
      const animP = ((t * 0.35 + idx * 0.22) % 1)
      const bx = Math.pow(1-animP,2)*pA.x + 2*(1-animP)*animP*cpX + Math.pow(animP,2)*pB.x
      const by = Math.pow(1-animP,2)*pA.y + 2*(1-animP)*animP*cpY + Math.pow(animP,2)*pB.y

      // Trail du point
      for (let trail = 0; trail < 8; trail++) {
        const tp = Math.max(0, animP - trail * 0.012)
        const tx = Math.pow(1-tp,2)*pA.x + 2*(1-tp)*tp*cpX + Math.pow(tp,2)*pB.x
        const ty = Math.pow(1-tp,2)*pA.y + 2*(1-tp)*tp*cpY + Math.pow(tp,2)*pB.y
        const tr = (8 - trail) / 8
        ctx.beginPath(); ctx.arc(tx, ty, 1.5 * tr, 0, Math.PI * 2)
        ctx.fillStyle = col + Math.floor(tr * 180).toString(16).padStart(2,'0')
        ctx.fill()
      }

      // Halo du point principal
      const glow = ctx.createRadialGradient(bx, by, 0, bx, by, 10)
      glow.addColorStop(0, col + 'ff')
      glow.addColorStop(0.4, col + '80')
      glow.addColorStop(1, col + '00')
      ctx.beginPath(); ctx.arc(bx, by, 10, 0, Math.PI * 2)
      ctx.fillStyle = glow; ctx.fill()
      ctx.beginPath(); ctx.arc(bx, by, 2.5, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'; ctx.fill()

      ctx.restore()
    })

    // ── 8. Pins ───────────────────────────────────────────────
    vPins.forEach(pin => {
      const isH = hovered?.city === pin.city
      const s   = Math.max(2.5, 6 * pin.sc) * (isH ? 1.5 : 1)

      // Halo
      const hG = ctx.createRadialGradient(pin.px, pin.py, 0, pin.px, pin.py, s * (isH ? 5 : 3.5))
      hG.addColorStop(0, `rgba(212,175,55,${isH ? 0.6 : 0.25})`)
      hG.addColorStop(1, 'rgba(212,175,55,0)')
      ctx.beginPath(); ctx.arc(pin.px, pin.py, s * (isH ? 5 : 3.5), 0, Math.PI * 2)
      ctx.fillStyle = hG; ctx.fill()

      // Point central lumineux
      const pG = ctx.createRadialGradient(pin.px - s*0.3, pin.py - s*0.3, 0, pin.px, pin.py, s)
      pG.addColorStop(0, '#fff8dc'); pG.addColorStop(0.5, '#d4af37'); pG.addColorStop(1, '#6b4a10')
      ctx.beginPath(); ctx.arc(pin.px, pin.py, s * (isH ? 1.4 : 1), 0, Math.PI * 2)
      ctx.fillStyle = pG; ctx.fill()
      ctx.strokeStyle = isH ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)'
      ctx.lineWidth = isH ? 1.5 : 0.5; ctx.stroke()

      // Anneau pulsant
      if (isH) {
        const pr = s * (2 + 0.6 * Math.sin(t * 6))
        ctx.beginPath(); ctx.arc(pin.px, pin.py, pr, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(212,175,55,0.5)'; ctx.lineWidth = 1.5; ctx.stroke()
      }

      // Label
      if (isH) {
        ctx.font = 'bold 13px Inter, sans-serif'
        const lb = `${pin.city}  ·  ${pin.count} logement${pin.count > 1 ? 's' : ''}`
        const tw2 = ctx.measureText(lb).width
        const bx2 = pin.px - tw2/2 - 14, by2 = pin.py - s - 42

        ctx.fillStyle = 'rgba(4,2,18,0.94)'
        ctx.beginPath(); ctx.roundRect(bx2, by2, tw2+28, 28, 10); ctx.fill()
        ctx.strokeStyle = 'rgba(212,175,55,0.7)'; ctx.lineWidth = 1.2; ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(pin.px-7, by2+28); ctx.lineTo(pin.px+7, by2+28); ctx.lineTo(pin.px, by2+38)
        ctx.closePath(); ctx.fillStyle = 'rgba(4,2,18,0.94)'; ctx.fill()

        ctx.fillStyle = '#D4AF37'
        ctx.fillText(lb, bx2+14, by2+19)
      }
    })

    // ── 9. Reflet + contour ───────────────────────────────────
    const shine = ctx.createRadialGradient(cx-R*0.35, cy-R*0.38, 0, cx-R*0.25, cy-R*0.28, R*0.6)
    shine.addColorStop(0, 'rgba(255,255,255,0.13)')
    shine.addColorStop(0.5, 'rgba(255,255,255,0.04)')
    shine.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI*2); ctx.clip()
    ctx.fillStyle = shine; ctx.fillRect(cx-R, cy-R, R*2, R*2); ctx.restore()

    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI*2)
    const rim = ctx.createLinearGradient(cx-R, cy-R, cx+R, cy+R)
    rim.addColorStop(0, 'rgba(120,180,255,0.8)')
    rim.addColorStop(0.5, 'rgba(60,100,220,0.3)')
    rim.addColorStop(1, 'rgba(212,175,55,0.6)')
    ctx.strokeStyle = rim; ctx.lineWidth = 2.5; ctx.stroke()

    // Ombre portée
    ctx.save(); ctx.globalAlpha = 0.22
    const shd = ctx.createRadialGradient(cx, cy+R+20, 0, cx, cy+R+20, R*0.72)
    shd.addColorStop(0, 'rgba(60,40,180,0.9)'); shd.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.beginPath(); ctx.ellipse(cx, cy+R+18, R*0.65, R*0.10, 0, 0, Math.PI*2)
    ctx.fillStyle = shd; ctx.fill(); ctx.restore()

    animRef.current = requestAnimationFrame(draw)
  }, [pins, hovered])

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [draw])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      const w = canvas.parentElement.getBoundingClientRect().width
      canvas.width = w; canvas.height = Math.min(w * 0.80, 520)
    }
    resize(); window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  const checkHover = useCallback((mx, my) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const W = canvas.width, H = canvas.height, R = Math.min(W,H)*0.40
    let found = null
    pins.forEach(pin => {
      const v = rot(ll2v(pin.lat, pin.lon), rotX.current, rotY.current)
      if (v[2] < 0.04) return
      const p = proj(v, R, W, H)
      const s = Math.max(2.5, 6 * p.s)
      if (Math.hypot(mx - p.x, my - p.y) < s * 2.5) found = pin
    })
    setHovered(found)
  }, [pins])

  const onMD = e => { drag.current = true; lastPos.current = {x:e.clientX,y:e.clientY}; velX.current=0; velY.current=0 }
  const onMM = e => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) checkHover(e.clientX-rect.left, e.clientY-rect.top)
    if (!drag.current) return
    const dx = e.clientX-lastPos.current.x, dy = e.clientY-lastPos.current.y
    rotY.current += dx*0.006; rotX.current += dy*0.006
    rotX.current = Math.max(-1.0, Math.min(1.0, rotX.current))
    velY.current = dx*0.006; velX.current = dy*0.006
    lastPos.current = {x:e.clientX,y:e.clientY}
  }
  const onMU = () => { drag.current = false }
  const onTouchStart = e => { drag.current=true; lastPos.current={x:e.touches[0].clientX,y:e.touches[0].clientY}; velX.current=0; velY.current=0 }
  const onTouchMove  = e => {
    if (!drag.current) return
    const dx = e.touches[0].clientX-lastPos.current.x, dy=e.touches[0].clientY-lastPos.current.y
    rotY.current+=dx*0.006; rotX.current+=dy*0.006
    rotX.current = Math.max(-1.0, Math.min(1.0, rotX.current))
    velY.current=dx*0.006; velX.current=dy*0.006
    lastPos.current={x:e.touches[0].clientX,y:e.touches[0].clientY}
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--secondary)', letterSpacing: '0.3em' }}>
          ✦ Partout dans le monde
        </p>
        <h3 className="font-display text-3xl md:text-4xl font-black mb-2" style={{ color: 'var(--txt)' }}>
          🌐 Globe <span className="gradient-text">Interactif</span>
        </h3>
        <p className="text-sm" style={{ color: 'var(--txt-3)' }}>
          Glissez dans tous les sens · Survolez un <span style={{ color: '#D4AF37', fontWeight: 700 }}>pin doré</span> pour explorer une destination
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

        {/* Globe canvas */}
        <div className="lg:col-span-2 relative rounded-3xl"
          style={{ background: '#020008', border: '1px solid rgba(100,150,255,0.20)', boxShadow: '0 0 120px rgba(40,80,255,0.15), 0 50px 100px rgba(0,0,0,0.7)' }}>

          {texState === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center z-10 rounded-3xl" style={{ background: 'rgba(2,0,8,0.95)' }}>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-4"
                  style={{ borderColor: 'rgba(100,150,255,0.4)', borderTopColor: '#7c3aed' }} />
                <p className="text-sm font-medium" style={{ color: 'rgba(200,220,255,0.7)' }}>Chargement texture satellite NASA...</p>
              </div>
            </div>
          )}

          <canvas ref={canvasRef}
            style={{ display: 'block', width: '100%', cursor: hovered ? 'pointer' : 'grab', borderRadius: '1.5rem', background: '#020008' }}
            onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU}
            onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onMU}
            onClick={() => { if (hovered) navigate(`/search?city=${hovered.city}`) }}
          />

          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: 'rgba(0,0,0,0.75)', color: 'rgba(200,220,255,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' }}>
            🖱️ Glisser pour tourner
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', backdropFilter: 'blur(12px)', border: '1px solid rgba(212,175,55,0.35)' }}>
            📍 {pins.length} destinations
          </div>

          {/* Légende arcs */}
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            {[['#00d4ff','Routes air'],['#ff6b6b','Liaisons'],['#ffd700','Connexions'],['#7c3aed','Réseau'],['#10b981','Circuits']].map(([col, label]) => (
              <div key={label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', border: `1px solid ${col}40` }}>
                <div className="w-2 h-2 rounded-full" style={{ background: col }} />
                <span style={{ color: 'rgba(255,255,255,0.65)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel droit */}
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl p-6 transition-all duration-300"
            style={{ background: hovered ? 'linear-gradient(135deg,rgba(212,175,55,0.14),rgba(124,58,237,0.10))' : 'var(--surface)', border: `1px solid ${hovered ? 'rgba(212,175,55,0.40)' : 'var(--border)'}`, minHeight: '140px' }}>
            {hovered ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.35)' }}>📍</div>
                  <div>
                    <h4 className="font-black text-xl leading-tight" style={{ color: '#D4AF37' }}>{hovered.city}</h4>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--txt-4)' }}>
                      {hovered.count} logement{hovered.count > 1 ? 's' : ''} disponible{hovered.count > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button onClick={() => navigate(`/search?city=${hovered.city}`)}
                  className="w-full py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg,#7C3AED,#D4AF37)', color: '#fff', boxShadow: '0 6px 20px rgba(124,58,237,0.35)' }}>
                  Explorer {hovered.city} →
                </button>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-4">
                <div className="text-4xl mb-3">🌐</div>
                <p className="font-bold mb-1" style={{ color: 'var(--txt)' }}>Globe Interactif</p>
                <p className="text-xs" style={{ color: 'var(--txt-3)' }}>
                  Survolez un <span style={{ color: '#D4AF37' }}>point doré</span><br />pour voir la destination
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--secondary)' }}>
              📍 Destinations · {pins.length}
            </p>
            <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-1"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(124,58,237,0.4) transparent' }}>
              {pins.map((pin, i) => (
                <button key={pin.city}
                  onClick={() => navigate(`/search?city=${pin.city}`)}
                  onMouseEnter={() => setHovered(pin)}
                  onMouseLeave={() => setHovered(null)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-left transition-all hover:scale-[1.02]"
                  style={{ background: hovered?.city===pin.city ? 'rgba(212,175,55,0.10)' : 'var(--surface-2)', border: `1px solid ${hovered?.city===pin.city ? 'rgba(212,175,55,0.35)' : 'var(--border)'}` }}>
                  <span className="text-xs font-black w-5 text-center shrink-0" style={{ color: i < 3 ? '#D4AF37' : 'var(--txt-4)' }}>
                    {i < 3 ? ['🥇','🥈','🥉'][i] : i+1}
                  </span>
                  <span className="font-medium flex-1" style={{ color: 'var(--txt-2)' }}>{pin.city}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold shrink-0"
                    style={{ background: 'rgba(212,175,55,0.10)', color: '#D4AF37' }}>{pin.count}</span>
                </button>
              ))}
              {pins.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-xs" style={{ color: 'var(--txt-4)' }}>Chargement des destinations...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
