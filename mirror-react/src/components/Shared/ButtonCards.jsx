import React from "react"
const VARIANT_CLASSES = {
  primary: "bg-green-500 hover:bg-green-600 text-white",
  secondary: "bg-blue-500 hover:bg-blue-600 text-white",
  error: "bg-red-500 hover:bg-red-600 text-white",
  outline: "bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-800",
}
export function ButtonCards({
  children,
  variant = "primary",
  onClick,
  className = "",
  ...props
}) {
  const base =
    "px-6 py-3 rounded-full font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2"
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary
  return (
    <button
      onClick={onClick}
      className={`${base} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}