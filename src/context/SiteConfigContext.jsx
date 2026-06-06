import { createContext, useContext, useCallback, useEffect, useState } from 'react'
import { list } from '../api/client.js'

const SiteConfigContext = createContext(null)

// Valores padrão usados enquanto a configuração não foi cadastrada no admin.
export const DEFAULT_CONFIG = {
  nameChurch: 'Primeira Igreja Batista de Cafelândia',
  shepherdName: 'Pastor',
  message: 'Uma comunidade de fé, esperança e amor.',
  mission:
    'Anunciar o evangelho de Jesus Cristo, fazer discípulos e servir à nossa cidade com amor.',
  vision: 'Ser uma igreja relevante, acolhedora e comprometida com o Reino de Deus.',
  values: 'Bíblia • Oração • Comunhão • Missões • Família',
  address: 'Cafelândia - PR',
  email: 'contato@pibcafelandia.com.br',
  phone: '',
  whatsapp: '',
  instagram: '',
  youtube: '',
  facebook: '',
  pix: '',
  bankDetail: '',
  primaryColor: '#1e3a5f',
  secondaryColor: '#2c5282',
  accentColor: '#c9a227',
  logoUrl: '',
  heroTitle: 'Bem-vindo à nossa casa',
  heroSubtitle:
    'Um lugar de fé, comunhão e esperança. Venha adorar conosco e faça parte da família.',
  heroImageUrl:
    'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1920&q=80',
  heroCtaText: 'Participe de um culto',
  heroCtaLink: '/agenda',
  aboutTitle: 'Quem somos',
  aboutText:
    'Somos uma igreja que crê na Palavra de Deus e no poder transformador do evangelho. Nosso desejo é ver vidas restauradas e famílias edificadas em Cristo.',
  aboutImageUrl:
    'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80',
  pastorPhotoUrl: '',
  mapsEmbedUrl: '',
  serviceNote: '',
  footerText: '',
  privacyPolicy: '',
}

// Converte "#1e3a5f" -> "30 58 95" (canais usados pelas CSS vars alpha-aware)
function hexToChannels(hex) {
  if (!hex) return null
  let h = hex.trim().replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  if (h.length !== 6) return null
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  if ([r, g, b].some((n) => Number.isNaN(n))) return null
  return `${r} ${g} ${b}`
}

// Escurece um canal "r g b" por um fator (0..1) para gerar a cor "dark"
function darken(channels, factor = 0.7) {
  if (!channels) return null
  return channels
    .split(' ')
    .map((n) => Math.min(255, Math.max(0, Math.round(Number(n) * factor))))
    .join(' ')
}

function applyTheme(cfg) {
  const root = document.documentElement
  const brand = hexToChannels(cfg.primaryColor)
  const secondary = hexToChannels(cfg.secondaryColor)
  const accent = hexToChannels(cfg.accentColor)
  if (brand) {
    root.style.setProperty('--brand', brand)
    root.style.setProperty('--brand-dark', darken(brand, 0.68))
  }
  if (secondary) root.style.setProperty('--brand-light', secondary)
  if (accent) {
    root.style.setProperty('--accent', accent)
    root.style.setProperty('--accent-light', darken(accent, 1.15))
  }
}

export function SiteConfigProvider({ children }) {
  const [config, setConfig] = useState(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const rows = await list('Configuration', { top: 1 })
      if (rows && rows.length) {
        const merged = { ...DEFAULT_CONFIG }
        // Só sobrescreve com valores não vazios vindos do backend
        for (const [k, v] of Object.entries(rows[0])) {
          if (v !== null && v !== undefined && v !== '') merged[k] = v
        }
        setConfig(merged)
        applyTheme(merged)
      } else {
        applyTheme(DEFAULT_CONFIG)
      }
    } catch (e) {
      // Backend offline: mantém defaults para o site não quebrar.
      applyTheme(DEFAULT_CONFIG)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <SiteConfigContext.Provider value={{ config, loading, refresh }}>
      {children}
    </SiteConfigContext.Provider>
  )
}

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext)
  if (!ctx) throw new Error('useSiteConfig deve ser usado dentro de <SiteConfigProvider>')
  return ctx
}
