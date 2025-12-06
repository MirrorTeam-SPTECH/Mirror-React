export default function Filtros({ label, options = [], value, onChange, children }) {
  if (children) {
    return (
      <div className="h-12 w-50">
        {children}
      </div>
    )
  }
  return (
    <div className="h-12 w-50">
      <select
        className="h-full w-full bg-white rounded-xl shadow-md px-4 text-base text-gray-500 focus:outline-none"
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
      >
        <option value="" disabled>
          {label}
        </option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}