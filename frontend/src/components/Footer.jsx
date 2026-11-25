import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LogoIcon from './LogoIcon'

export default function Footer() {
  const { isAuth } = useAuth()
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: '#0c0c14', borderTop: '1px solid rgba(212,175,55,0.10)', marginTop: '2rem' }}>
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <LogoIcon size={24} />
          <span className="font-black text-sm" style={{ color: '#fff' }}>
            Ilham<span style={{ color: '#D4AF37' }}>Stay</span>
          </span>
        </div>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.20)' }}>
          © {year} IlhamStay — Tous droits réservés
        </p>
        <p className="text-xs" style={{ color: 'rgba(212,175,55,0.40)' }}>✦ Luxury Stays Worldwide</p>
      </div>
    </footer>
  )
}
