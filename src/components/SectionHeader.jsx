export default function SectionHeader({ eyebrow, title, subtitle, center = true, light = false }) {
  return (
    <div className={`${center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'} mb-12`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={`heading mt-3 ${light ? 'text-white' : ''}`}>{title}</h2>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed ${light ? 'text-slate-300' : 'text-slate-500'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
