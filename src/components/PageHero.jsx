export default function PageHero({ title, subtitle, image }) {
  return (
    <section className="relative overflow-hidden bg-brand-dark py-24 text-white">
      {image && (
        <div className="absolute inset-0">
          <img src={image} alt="" className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/60 to-brand-dark" />
        </div>
      )}
      <div className="container-x relative text-center">
        <h1 className="font-serif text-4xl font-bold sm:text-5xl">{title}</h1>
        {subtitle && <p className="mx-auto mt-4 max-w-2xl text-slate-300">{subtitle}</p>}
      </div>
    </section>
  )
}
