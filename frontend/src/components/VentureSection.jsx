import { useState } from 'react'
import { Link } from 'react-router-dom'

// Contenu selon le rôle
const ROLE_CONTENT = {
  guest: {
    badge: '✦ IlhamStay · Luxury Stays',
    title: 'Votre séjour',
    titleGold: "d'exception",
    subtitle: 'Des villas privées aux suites d\'hôtels 5 étoiles,\nvivez des moments inoubliables partout dans le monde.',
    cta1: { to: '/search',   label: '✦ Réserver maintenant' },
    cta2: { to: '/ai',       label: '🤖 Assistant IA' },
    stats: [
      { n: '500+', l: 'Villas de luxe' },
      { n: '50+',  l: 'Pays' },
      { n: '4.9',  l: '★ Note moyenne' },
    ],
  },
  traveler: {
    badge: '✈️ Espace Voyageur',
    title: 'Prêt pour',
    titleGold: 'votre prochain voyage ?',
    subtitle: 'Explorez nos logements disponibles,\ngérez vos réservations et découvrez de nouvelles destinations.',
    cta1: { to: '/search',   label: '🔍 Explorer les logements' },
    cta2: { to: '/bookings', label: '📅 Mes réservations' },
    stats: [
      { n: '500+', l: 'Logements' },
      { n: '❤️',   l: 'Favoris disponibles' },
      { n: '24/7', l: 'Assistance IA' },
    ],
  },
  host: {
    badge: '🏠 Espace Hôte',
    title: 'Développez',
    titleGold: 'votre activité',
    subtitle: 'Publiez vos logements, gérez vos réservations\net maximisez vos revenus avec IlhamStay.',
    cta1: { to: '/host',     label: '🏠 Gérer mes logements' },
    cta2: { to: '/search',   label: '🔍 Voir les annonces' },
    stats: [
      { n: '0%',  l: 'Commission' },
      { n: '24h', l: 'Mise en ligne' },
      { n: '4.9', l: '★ Satisfaction hôtes' },
    ],
  },
  admin: {
    badge: '⚡ Administration',
    title: 'Tableau de bord',
    titleGold: 'Admin',
    subtitle: 'Gérez la plateforme, supervisez les utilisateurs\net suivez les performances en temps réel.',
    cta1: { to: '/admin',    label: '⚡ Dashboard Admin' },
    cta2: { to: '/search',   label: '🏠 Voir les annonces' },
    stats: [
      { n: '∞',   l: 'Accès total' },
      { n: '📊',  l: 'Monitoring' },
      { n: '🛡️',  l: 'Sécurité' },
    ],
  },
}

export default function VentureSection({ role = 'guest' }) {
  const [email, setEmail]           = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const content = ROLE_CONTENT[role] || ROLE_CONTENT.guest

  const handleSub = e => {
    e.preventDefault()
    if (email) { setSubscribed(true); setEmail('') }
  }

  return (
    <div style={{ marginTop: '4rem' }}>
      {/* ── Section vidéo hero ─────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ height: '560px' }}>

        {/* Vidéo en boucle */}
        <video
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.70)' }}>
          <source src="/hotel.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0" style={{
          background: role === 'admin'
            ? 'linear-gradient(135deg, rgba(20,8,60,0.70) 0%, rgba(40,10,80,0.50) 100%)'
            : role === 'host'
            ? 'linear-gradient(135deg, rgba(5,30,20,0.70) 0%, rgba(10,50,30,0.50) 100%)'
            : 'linear-gradient(135deg, rgba(10,5,30,0.65) 0%, rgba(20,10,50,0.45) 50%, rgba(10,5,30,0.75) 100%)'
        }} />

        {/* Particules */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${(i * 137.5) % 100}%`,
              top: `${(i * 97.3) % 100}%`,
              width: `${3 + (i % 3) * 2}px`,
              height: `${3 + (i % 3) * 2}px`,
              borderRadius: '50%',
              background: '#D4AF37',
              opacity: 0.12 + (i % 4) * 0.06,
              animation: `float ${4 + (i % 4)}s ease-in-out ${i * 0.5}s infinite alternate`,
            }} />
          ))}
        </div>

        {/* Contenu */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">

          {/* Badge */}
          <div className="inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full"
            style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.30)', backdropFilter: 'blur(8px)' }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#D4AF37' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#D4AF37', letterSpacing: '0.22em' }}>
              {content.badge}
            </span>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#D4AF37' }} />
          </div>

          {/* Titre */}
          <h2 className="font-display font-black text-white mb-4 leading-none"
            style={{ fontSize: 'clamp(2.2rem, 5.5vw, 4.5rem)', textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
            {content.title}
            <br />
            <span style={{ background: 'linear-gradient(135deg, #D4AF37, #FFF8DC, #D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {content.titleGold}
            </span>
          </h2>

          {/* Sous-titre */}
          <p className="mb-10 max-w-xl" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.0rem', lineHeight: 1.75, textShadow: '0 1px 8px rgba(0,0,0,0.5)', whiteSpace: 'pre-line' }}>
            {content.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to={content.cta1.to}
              className="flex items-center gap-2 px-9 py-4 font-bold text-sm transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#0a0510', letterSpacing: '0.08em', boxShadow: '0 8px 32px rgba(212,175,55,0.40)', borderRadius: '4px' }}>
              {content.cta1.label}
            </Link>
            <Link to={content.cta2.to}
              className="flex items-center gap-2 px-8 py-4 text-sm font-semibold transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.90)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(12px)', letterSpacing: '0.05em', borderRadius: '4px' }}>
              {content.cta2.label}
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-10 mt-12">
            {content.stats.map(s => (
              <div key={s.l} className="text-center">
                <div className="font-black text-xl" style={{ color: '#D4AF37' }}>{s.n}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.50)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dégradé bas */}
        <div className="absolute bottom-0 left-0 right-0 h-24"
          style={{ background: 'linear-gradient(to bottom, transparent, #0c0c14)' }} />
      </div>

      {/* ── Barre footer ─────────────────────────────────────── */}
      <div style={{ background: '#0c0c14', borderTop: '1px solid rgba(212,175,55,0.10)' }}>
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10 items-start">

          {/* Contact */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'rgba(212,175,55,0.55)', letterSpacing: '0.22em' }}>Contact</p>
            <p className="text-sm mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>+33 1 23 45 67 89</p>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>hello@ilhamstay.com</p>
            <div className="flex gap-3">
              {[{ icon: 'f' }, { icon: '📸' }, { icon: '𝕏' }, { icon: '▶' }].map((s, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all hover:scale-110"
                  style={{ border: '1px solid rgba(212,175,55,0.20)', color: 'rgba(212,175,55,0.55)' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = '#D4AF37'; e.currentTarget.style.color = '#D4AF37'; e.currentTarget.style.background = 'rgba(212,175,55,0.08)' }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.20)'; e.currentTarget.style.color = 'rgba(212,175,55,0.55)'; e.currentTarget.style.background = 'transparent' }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Logo */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
              style={{ border: '1px solid rgba(212,175,55,0.30)', background: 'rgba(212,175,55,0.05)' }}>
              <span className="font-black text-xl" style={{ color: '#D4AF37' }}>IS</span>
            </div>
            <p className="font-black text-base mb-0.5" style={{ color: '#fff' }}>
              Ilham<span style={{ color: '#D4AF37' }}>Stay</span>
            </p>
            <p className="text-xs mb-5 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.30)', letterSpacing: '0.2em' }}>Luxury Stays</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { to: '/search',   l: 'Rechercher' },
                { to: '/services', l: 'Services' },
                { to: '/ai',       l: 'IA' },
                ...(role === 'admin' ? [{ to: '/admin', l: 'Admin' }] : []),
                ...(role === 'host'  ? [{ to: '/host',  l: 'Hôte' }]  : []),
              ].map(x => (
                <Link key={x.to} to={x.to}
                  className="text-xs px-3 py-1.5 transition-all hover:scale-105"
                  style={{ border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.40)', borderRadius: '2px' }}
                  onMouseOver={e => { e.currentTarget.style.color = '#D4AF37'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.40)' }}
                  onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.40)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)' }}>
                  {x.l}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(212,175,55,0.55)', letterSpacing: '0.22em' }}>Newsletter VIP</p>
            <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>
              Recevez nos offres exclusives,<br />nouvelles destinations et séjours d'exception.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 px-4 py-3 text-sm"
                style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', color: '#D4AF37', borderRadius: '2px' }}>
                ✦ Bienvenue dans le Club VIP !
              </div>
            ) : (
              <form onSubmit={handleSub} className="flex">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com" required
                  className="flex-1 px-4 py-3 text-sm focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.20)', borderRight: 'none', color: '#fff', borderRadius: '2px 0 0 2px' }} />
                <button type="submit"
                  className="px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #D4AF37, #B8960C)', color: '#0a0510', letterSpacing: '0.08em', borderRadius: '0 2px 2px 0', whiteSpace: 'nowrap' }}>
                  ✦ Rejoindre
                </button>
              </form>
            )}
            <p className="text-xs mt-3" style={{ color: 'rgba(255,255,255,0.25)' }}>🔒 Données privées · Désabonnement gratuit</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.20)' }}>© {new Date().getFullYear()} IlhamStay — Tous droits réservés</p>
          <p className="text-xs" style={{ color: 'rgba(212,175,55,0.40)' }}>✦ Luxury Stays Worldwide</p>
        </div>
      </div>
    </div>
  )
}
