"use client"
import { useState, useEffect } from "react"
export default function ButtonSelect({ produtoId, categoria, onToggle }) {
  const [isSelected, setIsSelected] = useState(false)
  useEffect(() => {

    const checkSelectedStatus = () => {
      const selecionado = JSON.parse(localStorage.getItem("selecionadoUnico"))
      const found = selecionado && selecionado.id === produtoId && selecionado.categoria === categoria
      setIsSelected(found)
    }
    checkSelectedStatus()

    const handleSelecionadosUpdate = () => {
      checkSelectedStatus()
    }
    window.addEventListener("selecionadosAtualizados", handleSelecionadosUpdate)
    return () => window.removeEventListener("selecionadosAtualizados", handleSelecionadosUpdate)
  }, [produtoId, categoria])
  const toggleSelect = (e) => {
    e.stopPropagation()
    const selecionado = JSON.parse(localStorage.getItem("selecionadoUnico"))
    const isAlreadySelected = selecionado && selecionado.id === produtoId && selecionado.categoria === categoria
    if (isAlreadySelected) {

      localStorage.removeItem("selecionadoUnico")
      setIsSelected(false)
      if (onToggle) onToggle(false)
    } else {

      localStorage.setItem("selecionadoUnico", JSON.stringify({ id: produtoId, categoria }))
      setIsSelected(true)
      if (onToggle) onToggle(true)
    }

    window.dispatchEvent(new Event("selecionadosAtualizados"))
  }
  return (
    <button
      type="button"
      onClick={toggleSelect}
      className={`
        absolute
        !top-[15px]
        !right-[15px]
        !p-0
        !m-0
        !w-[30px]
        !h-[30px]
        flex
        items-center
        justify-center
        rounded-full
        border-none
        cursor-pointer
        z-20
        transition-all
        duration-200
        ${isSelected
          ? "bg-[#e46363] scale-110"
          : "bg-[#F4E8E8] hover:bg-[#e46363] hover:scale-110 active:scale-90"}
      `}
      style={{ fontSize: 20 }}
    />
  )
}