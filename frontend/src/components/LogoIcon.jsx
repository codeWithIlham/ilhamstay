import { useEffect, useState } from 'react'

/**
 * LogoIcon — IlhamStay logo vidéo
 * ILHAMSTAYCLAIR.mp4 en mode clair
 * ILHAMSTAYSOMBRE.mp4 en mode sombre
 */
export default function LogoIcon({ size = 44 }) {
  const checkDark = () =>
    document.documentElement.getAttribute('data-theme') === 'dark' ||
    document.documentElement.classList.contains('dark')

  const [isDark, setIsDark] = useState(checkDark)

  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(checkDark()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] })
    return () => observer.disconnect()
  }, [])

  return (
    <video
      key={isDark ? 'sombre' : 'clair'}
      src={isDark ? '/ILHAMSTAYSOMBRE.mp4' : '/ILHAMSTAYCLAIR.mp4'}
      autoPlay
      loop
      muted
      playsInline
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        borderRadius: '8px',
        display: 'block',
      }}
    />
  )
}
