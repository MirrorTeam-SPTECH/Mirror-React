"use client"

import { useState, useEffect } from "react"
import { Edit2, Check, X } from "lucide-react"

export default function EditCard({ produto = null, onSave, onCancel }) {
  const [form, setForm] = useState({
    id: produto?.id || "",
    nome: produto?.nome || "",
    preco: produto?.preco || 0,
    tempoPreparo: produto?.tempoPreparo || "",
    imagem: produto?.imagem || "",
    descricao: produto?.descricao || "",
  })

  const [editMode, setEditMode] = useState(false)
  const [errors, setErrors] = useState({})
  const [previewImage, setPreviewImage] = useState("")

  // Atualiza o formulário quando o produto muda
  useEffect(() => {
    if (produto) {
      setForm({
        id: produto.id || "",
        nome: produto.nome || "",
        preco: produto.preco || 0,
        tempoPreparo: produto.tempoPreparo || "10-15 min",
        imagem: produto.imagem || "/placeholder.svg",
        descricao: produto.descricao || "",
      })
      setPreviewImage(produto.imagem || "/placeholder.svg")
    }
  }, [produto])

  const handleChange = (e) => {
    const { name, value } = e.target

    // Tratamento especial para preço (aceitar apenas números)
    if (name === "preco") {
      const precoValue = value.replace(/[^0-9.,]/g, "")
      setForm({
        ...form,
        [name]: precoValue === "" ? 0 : Number.parseFloat(precoValue.replace(",", ".")),
      })
    } else {
      setForm({
        ...form,
        [name]: value,
      })
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
        setForm({
          ...form,
          imagem: reader.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!form.nome.trim()) newErrors.nome = "Nome é obrigatório"
    if (!form.preco || form.preco <= 0) newErrors.preco = "Preço deve ser maior que zero"
    if (!form.descricao.trim()) newErrors.descricao = "Descrição é obrigatória"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      onSave({
        ...form,
        preco: Number(form.preco), // Garantir que é um número
      })
      setEditMode(false)
    }
  }

  const toggleEditMode = () => {
    setEditMode(!editMode)
  }

  // Formata o preço para exibição
  const formatarPreco = (preco) => {
    if (typeof preco === "number") {
      return preco.toFixed(2).replace(".", ",")
    }
    return preco
  }

  return (
    <div className="w-[350px] h-128 bg-white rounded-2xl shadow-md flex flex-col font-['Montserrat']">
      <div className="flex justify-between items-center !p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold !m-0 text-gray-800">Detalhes do Produto</h2>
        <button
          className="bg-transparent border-none cursor-pointer text-gray-500 hover:text-[#e30613] flex items-center justify-center !p-0"
          onClick={onCancel}
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="!px-4 !py-2 overflow-y-auto flex-1">
        <div className="!mb-3">
          <label htmlFor="nome" className="block text-xs font-medium text-gray-700 !mb-1">
            Nome do Produto
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            disabled={!editMode}
            className={`w-full !p-2 text-sm border ${
              editMode ? "border-gray-300" : "border-transparent bg-gray-100"
            } rounded-md focus:outline-none focus:ring-1 focus:ring-[#e30613] focus:border-[#e30613] text-gray-800`}
          />
          {errors.nome && editMode && <p className="text-[#e30613] text-xs !mt-1">{errors.nome}</p>}
        </div>

<div className="flex flex-row gap-2">
        <div className="!mb-3">
          <label htmlFor="preco" className="block text-xs font-medium text-gray-700 !mb-1">
            Preço (R$)
          </label>
          <input
            type="text"
            id="preco"
            name="preco"
            value={editMode ? form.preco : formatarPreco(form.preco)}
            onChange={handleChange}
            disabled={!editMode}
            className={`w-full !p-2 text-sm border ${
              editMode ? "border-gray-300" : "border-transparent bg-gray-100"
            } rounded-md focus:outline-none focus:ring-1 focus:ring-[#e30613] focus:border-[#e30613] text-gray-800`}
          />
          {errors.preco && editMode && <p className="text-[#e30613] text-xs !mt-1">{errors.preco}</p>}
        </div>

        <div className="!mb-3">
          <label htmlFor="tempoPreparo" className="block text-xs font-medium text-gray-700 !mb-1">
            Tempo de Preparo
          </label>
          {editMode ? (
            <select
              id="tempoPreparo"
              name="tempoPreparo"
              value={form.tempoPreparo}
              onChange={handleChange}
              className="w-full !p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#e30613] focus:border-[#e30613] text-gray-800"
            >
              <option value="5-10 min">5-10 minutos</option>
              <option value="10-15 min">10-15 minutos</option>
              <option value="15-20 min">15-20 minutos</option>
              <option value="20-30 min">20-30 minutos</option>
              <option value="+30 min">Mais de 30 minutos</option>
            </select>
          ) : (
            <input
              type="text"
              value={form.tempoPreparo}
              disabled
              className="w-full !p-2 text-sm border border-transparent bg-gray-100 rounded-md text-gray-800"
            />
          )}
        </div>
</div>

        <div className="!mb-3">
          <label htmlFor="descricao" className="block text-xs font-medium text-gray-700 !mb-1">
            Descrição
          </label>
          <textarea
            id="descricao"
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            disabled={!editMode}
            className={`w-full !p-2 text-sm border ${
              editMode ? "border-gray-300" : "border-transparent bg-gray-100"
            } rounded-md min-h-[60px] resize-none focus:outline-none focus:ring-1 focus:ring-[#e30613] focus:border-[#e30613] text-gray-800`}
          />
          {errors.descricao && editMode && <p className="text-[#e30613] text-xs !mt-1">{errors.descricao}</p>}
        </div>

        <div className="!mb-3">
          <label className="block text-xs font-medium text-gray-700 !mb-1">Imagem do Produto</label>
          <div className="flex flex-col items-center">
            <div className="w-full h-[80px] border border-gray-300 rounded-md overflow-hidden !mb-1 flex items-center justify-center bg-gray-100">
              <img
                src={previewImage || "/placeholder.svg"}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            {editMode && (
              <input
                type="file"
                id="imagem"
                name="imagem"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-xs text-gray-500 file:mr-2 file:!py-1 file:!px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end !mt-auto !mb-2 gap-2">
          {editMode ? (
            <>
              <button
                type="button"
                className="!px-3 !py-1.5 text-sm border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                onClick={toggleEditMode}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="!px-3 !py-1.5 text-sm border-none bg-[#e30613] text-white rounded-md hover:bg-[#c00] font-medium flex items-center gap-1"
              >
                <Check size={14} /> Salvar
              </button>
            </>
          ) : (
            <button
              type="button"
              className="!px-3 !py-1.5 text-sm border-none bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center gap-1"
              onClick={toggleEditMode}
            >
              <Edit2 size={14} /> Atualizar
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
