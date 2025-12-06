"use client"
import { Outlet } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import NotificationModal from "../components/NotificationModal"
export default function LayoutGerenciamento() {
  const lastHandledTimestamp = useRef(0)
  const [currentNotification, setCurrentNotification] = useState(null)
  useEffect(() => {
    const interval = setInterval(() => {
      const data = JSON.parse(localStorage.getItem("novoPagamentoBalcao"))
      if (data && data.timestamp > lastHandledTimestamp.current) {
        lastHandledTimestamp.current = data.timestamp

        const notification = {
          id: `notif_${data.timestamp}`,
          timestamp: data.timestamp,
          nomeLanche: data.nomeLanche ?? "desconhecido",
          valorTotal: data.valorTotal ?? "0,00",
          lida: false,
          tipo: "pagamento_balcao",
        }

        const notificacoes = JSON.parse(localStorage.getItem("notificacoesPagamentos") || "[]")
        notificacoes.push(notification)
        localStorage.setItem("notificacoesPagamentos", JSON.stringify(notificacoes))

        setCurrentNotification(notification)

        window.dispatchEvent(new Event("novaNotificacao"))

        localStorage.removeItem("novoPagamentoBalcao")
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  const handleCloseNotification = () => {
    setCurrentNotification(null)
  }
  return (
    <div className="layout-gerenciamento">
      <Outlet context={{ isGerenciamento: true }} />
      {}
      <NotificationModal notification={currentNotification} onClose={handleCloseNotification} />
    </div>
  )
}