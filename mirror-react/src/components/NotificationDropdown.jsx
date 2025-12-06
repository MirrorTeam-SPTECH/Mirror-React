"use client"
import { useEffect, useState, useRef } from "react"
import { Bell, CheckCircle, Clock, X } from "lucide-react"
import { backfillFromHistoricoIfNeeded, compactNotificationsStorage, getNotifications } from "../utils/notifications"
export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef(null)
  const refresh = () => {
    const ordered = getNotifications()
    setNotifications(ordered)
    setUnreadCount(ordered.filter((n) => !n.lida).length)
  }
  const loadNotifications = () => {
    try {

      compactNotificationsStorage()

      backfillFromHistoricoIfNeeded(7000)

      refresh()
    } catch (e) {
      console.error("Erro ao carregar notificações:", e)
      setNotifications([])
      setUnreadCount(0)
    }
  }
  useEffect(() => {
    loadNotifications()
    const handleNewNotification = () => loadNotifications()
    window.addEventListener("novaNotificacao", handleNewNotification)
    return () => window.removeEventListener("novaNotificacao", handleNewNotification)
  }, [])
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])
  const persistAndRefresh = (updated) => {
    try {
      localStorage.setItem("notificacoesPagamentos", JSON.stringify(updated))
    } catch (e) {
      console.error("Erro ao salvar notificações:", e)
    }

    loadNotifications()
  }
  const markAsRead = (id) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, lida: true } : n))
    persistAndRefresh(updated)
  }
  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, lida: true }))
    persistAndRefresh(updated)
  }
  const removeNotification = (id) => {
    const updated = notifications.filter((n) => n.id !== id)
    persistAndRefresh(updated)
  }
  const formatTime = (timestamp) => {
    const now = Date.now()
    const diff = now - Number(timestamp)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (minutes < 1) return "Agora"
    if (minutes < 60) return `${minutes}m atrás`
    if (hours < 24) return `${hours}h atrás`
    return `${days}d atrás`
  }
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:text-gray-200 transition-colors"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
        <span className="sr-only">{"Abrir notificações"}</span>
      </button>
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-50 overflow-hidden"
        >
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between flex-col justify-self-start gap-1">
              <h3 className="font-semibold text-gray-800 mt-1">{"Notificações"}</h3>
              <hr className="w-[320px] bg-gray-800 mb-1" />
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-sm text-blue-600 hover:text-blue-800">
                  {"Marcar todas como lidas"}
                </button>
              )}
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell size={24} className="mx-auto mb-2 opacity-50" />
                <p>{"Nenhuma notificação"}</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b hover:bg-gray-50 transition-colors ${
                    !notification.lida ? "bg-blue-50 border-l-4 border-l-blue-500" : "bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1 gap-3">
                      <CheckCircle
                        className={notification.lida ? "text-gray-400 mt-0.5" : "text-green-500 mt-0.5"}
                        size={16}
                        aria-hidden="true"
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={
                            notification.lida
                              ? "font-medium text-sm text-gray-600"
                              : "font-medium text-sm text-gray-800"
                          }
                        >
                          {notification.metodoPagamento === "pix" ? "Pagamento via PIX" : "Pagamento no Balcão"}
                        </p>
                        <p
                          className={
                            notification.lida ? "text-sm truncate text-gray-500" : "text-sm truncate text-gray-600"
                          }
                        >
                          {notification.nomeLanche}
                        </p>
                        <p className={notification.lida ? "text-xs text-gray-400" : "text-xs text-gray-500"}>
                          {"R$ "}
                          {notification.valorTotal}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock size={12} className="text-gray-400" aria-hidden="true" />
                          <span className="text-xs text-gray-400">{formatTime(notification.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notification.lida && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-800 text-xs whitespace-nowrap"
                        >
                          {"Marcar como lida"}
                        </button>
                      )}
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="text-gray-400 hover:text-red-500 ml-2"
                        aria-label="Excluir notificação"
                      >
                        <X size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}