// Renderiza um campo de formulário conforme a configuração.
export default function Field({ field, value, onChange }) {
  const common = {
    id: field.name,
    name: field.name,
    className: 'input',
    placeholder: field.placeholder || '',
    required: field.required || false,
  }

  function handle(e) {
    const t = e.target
    let v
    if (field.type === 'checkbox') v = t.checked
    else if (field.type === 'number') v = t.value === '' ? null : Number(t.value)
    else v = t.value
    onChange(field.name, v)
  }

  let control
  switch (field.type) {
    case 'textarea':
      control = (
        <textarea {...common} rows={field.rows || 4} value={value ?? ''} onChange={handle} />
      )
      break
    case 'select':
      control = (
        <select {...common} value={value ?? ''} onChange={handle}>
          <option value="">— selecione —</option>
          {(field.options || []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )
      break
    case 'checkbox':
      return (
        <label className="flex cursor-pointer items-center gap-3 py-2">
          <input
            type="checkbox"
            checked={!!value}
            onChange={handle}
            className="h-5 w-5 rounded border-slate-300 text-brand focus:ring-brand"
          />
          <span className="text-sm font-medium text-slate-600">{field.label}</span>
        </label>
      )
    case 'color':
      control = (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={value || '#000000'}
            onChange={handle}
            className="h-10 w-14 cursor-pointer rounded border border-slate-300"
          />
          <input {...common} value={value ?? ''} onChange={handle} className="input flex-1" />
        </div>
      )
      break
    default:
      control = <input {...common} type={field.type || 'text'} value={value ?? ''} onChange={handle} />
  }

  return (
    <div className={field.full ? 'sm:col-span-2' : ''}>
      <label htmlFor={field.name} className="label">
        {field.label}
        {field.required && <span className="text-red-500"> *</span>}
      </label>
      {control}
      {field.help && <p className="mt-1 text-xs text-slate-400">{field.help}</p>}
      {field.type === 'url' && value && (
        <img
          src={value}
          alt=""
          className="mt-2 h-16 w-auto rounded border border-slate-200 object-cover"
          onError={(e) => (e.target.style.display = 'none')}
          onLoad={(e) => (e.target.style.display = '')}
        />
      )}
    </div>
  )
}
