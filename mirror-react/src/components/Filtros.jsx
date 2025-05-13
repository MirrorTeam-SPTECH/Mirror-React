
export default function Filtro({ label, Icon }) {
  return (
    <div className="flex h-12 w-50 bg-white rounded-xl shadow-md items-center justify-between !px-4">
      <span className="text-gray-500 text-base">{label}</span>
      {Icon && <Icon className="h-5 w-5 text-gray-500 cursor-pointer" />}
    </div>
  );
}   