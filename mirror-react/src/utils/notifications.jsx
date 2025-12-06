export const NOTIFS_KEY = "notificacoesPagamentos"
export const HIST_KEY = "historicoPedidos"
const INDEX_IDS_KEY = "notifsIndexIds"
const INDEX_SIGS_KEY = "notifsIndexSigs"
const LAST_BACKFILL_AT = "notifsLastBackfillAt"
function readArray(key) {
  try {
    const raw = localStorage.getItem(key)
    const parsed = JSON.parse(raw || "[]")
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
function writeArray(key, arr) {
  try {
    localStorage.setItem(key, JSON.stringify(arr))
  } catch (e) {
    console.error("Erro ao salvar no localStorage:", e)
  }
}
function readSet(key) {
  try {
    const raw = localStorage.getItem(key)
    const parsed = JSON.parse(raw || "[]")
    return new Set(Array.isArray(parsed) ? parsed.map(String) : [])
  } catch {
    return new Set()
  }
}
function writeSet(key, set) {
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(set)))
  } catch (e) {
    console.error("Erro ao salvar índice:", e)
  }
}
function toNumber(v) {
  if (v == null) return 0
  if (typeof v === "number") return Number.isFinite(v) ? v : 0
  if (typeof v === "string") {
    const clean = v.replace("R$", "").trim().replace(/\./g, "").replace(",", ".")
    const n = Number.parseFloat(clean)
    return Number.isNaN(n) ? 0 : n
  }
  return 0
}

export function formatBRLNumber(n) {
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    })
      .format(toNumber(n))
      .replace("R$ ", "")
      .replace("R$ ", "")
  } catch {
    const fixed = toNumber(n).toFixed(2)
    return fixed.replace(".", ",")
  }
}
function normalizeNotification(n, indexFallback = 0) {
  const id =
    typeof n?.id === "number" || typeof n?.id === "string"
      ? n.id
      : typeof n?.timestamp === "number"
        ? n.timestamp
        : indexFallback
  const timestamp =
    typeof n?.timestamp === "number"
      ? n.timestamp
      : typeof n?.timestamp === "string"
        ? Number(n.timestamp) || Date.now()
        : typeof id === "number"
          ? id
          : Date.now()
  const nomeLanche = n?.nomeLanche ?? n?.nome ?? n?.titulo ?? "Pedido"
  const valorNum =
    typeof n?.valorTotal === "number" ? n.valorTotal : toNumber(n?.valorTotal ?? n?.totalNum ?? n?.total ?? 0)
  return {
    id,
    lida: !!n?.lida,
    timestamp,
    nomeLanche,
    valorTotal: formatBRLNumber(valorNum),
    metodoPagamento: n?.metodoPagamento || "balcao",
  }
}

function signature(n) {
  const cents = Math.round(toNumber(n.valorTotal) * 100)
  const minute = Math.floor(Number(n.timestamp) / 60000)
  return `${n.nomeLanche}|${cents}|${minute}`
}
function deduplicateList(list) {
  const byId = new Map()
  const bySig = new Set()
  for (const item of list) {
    const idKey = String(item.id)
    const sig = signature(item)
    if (byId.has(idKey) || bySig.has(sig)) continue
    byId.set(idKey, item)
    bySig.add(sig)
  }
  return Array.from(byId.values())
}
function updateIndexesWith(list) {
  const idSet = readSet(INDEX_IDS_KEY)
  const sigSet = readSet(INDEX_SIGS_KEY)
  for (const n of list) {
    idSet.add(String(n.id))
    sigSet.add(signature(n))
  }
  writeSet(INDEX_IDS_KEY, idSet)
  writeSet(INDEX_SIGS_KEY, sigSet)
}
export function getNotifications() {
  const raw = readArray(NOTIFS_KEY)
  const normalized = raw.map((n, i) => normalizeNotification(n, i))
  const unique = deduplicateList(normalized).sort((a, b) => b.timestamp - a.timestamp)
  writeArray(NOTIFS_KEY, unique)
  updateIndexesWith(unique)
  return unique
}
export function addPaymentNotification(payment) {
  try {
    const idSet = readSet(INDEX_IDS_KEY)
    const sigSet = readSet(INDEX_SIGS_KEY)
    const timestamp = typeof payment?.timestamp === "number" ? payment.timestamp : Date.now()
    const id = String(timestamp)
    const nomeLanche = payment?.nomeLanche || payment?.nome || payment?.titulo || "Pedido"
    const valorNum =
      typeof payment?.valorTotal === "number" ? payment.valorTotal : toNumber(payment?.totalNum ?? payment?.total ?? 0)
    const novo = normalizeNotification(
      {
        id: timestamp,
        lida: false,
        timestamp,
        nomeLanche,
        valorTotal: valorNum,
        metodoPagamento: payment?.metodoPagamento || "balcao",
      },
      0,
    )
    const sig = signature(novo)

    if (idSet.has(id) || sigSet.has(sig)) {
      return getNotifications()
    }

    const current = getNotifications()
    const existsById = current.some((n) => String(n.id) === id)
    const existsBySig = current.some((n) => signature(n) === sig)
    if (existsById || existsBySig) {
      idSet.add(id)
      sigSet.add(sig)
      writeSet(INDEX_IDS_KEY, idSet)
      writeSet(INDEX_SIGS_KEY, sigSet)
      return current
    }
    const updated = [novo, ...current].sort((a, b) => b.timestamp - a.timestamp)
    writeArray(NOTIFS_KEY, updated)
    idSet.add(id)
    sigSet.add(sig)
    writeSet(INDEX_IDS_KEY, idSet)
    writeSet(INDEX_SIGS_KEY, sigSet)
    try {
      window.dispatchEvent(new Event("novaNotificacao"))
    } catch {}
    return updated
  } catch (e) {
    console.error("Erro ao adicionar notificação:", e)
    return getNotifications()
  }
}

function shouldRunBackfillNow(debounceMs = 3000) {
  try {
    const last = Number(sessionStorage.getItem(LAST_BACKFILL_AT) || "0")
    const now = Date.now()
    if (now - last < debounceMs) return false
    sessionStorage.setItem(LAST_BACKFILL_AT, String(now))
    return true
  } catch {
    return true
  }
}
export function backfillFromHistoricoIfNeeded(bufferMs = 5000) {
  if (!shouldRunBackfillNow(3000)) {

    return getNotifications()
  }
  const now = Date.now()
  const historico = readArray(HIST_KEY)
  if (!Array.isArray(historico) || historico.length === 0) {
    return getNotifications()
  }
  const current = getNotifications()
  const idSet = readSet(INDEX_IDS_KEY)
  const sigSet = readSet(INDEX_SIGS_KEY)
  const maxNotifTs = current.length ? Number(current[0].timestamp) : 0
  const novos = []
  for (const pedido of historico) {
    const ts =
      typeof pedido?.dadosOriginais?.timestamp === "number"
        ? pedido.dadosOriginais.timestamp
        : Date.parse(pedido?.dataPedido) || null
    if (!ts) continue

    if (now - ts < bufferMs) continue

    if (maxNotifTs && Math.abs(ts - maxNotifTs) < bufferMs) continue
    const id = String(ts)
    if (idSet.has(id) || current.some((n) => String(n.id) === id)) continue
    let nomeLanche = "Pedido"
    if (Array.isArray(pedido?.itens) && pedido.itens.length > 0) {
      const principal = pedido.itens.find((i) => i?.tipo === "produto") || pedido.itens[0]
      if (principal?.nome) nomeLanche = principal.nome
    } else if (pedido?.id) {
      nomeLanche = String(pedido.id)
    }
    const valorNum = typeof pedido?.total === "number" ? pedido.total : toNumber(pedido?.total)
    const candidato = normalizeNotification(
      {
        id: ts,
        lida: false,
        timestamp: ts,
        nomeLanche,
        valorTotal: valorNum,
        metodoPagamento: pedido?.metodoPagamento || "balcao",
      },
      0,
    )
    const sig = signature(candidato)
    if (sigSet.has(sig) || current.some((n) => signature(n) === sig)) continue
    novos.push(candidato)
    idSet.add(id)
    sigSet.add(sig)
  }
  if (novos.length > 0) {
    const merged = deduplicateList([...novos, ...current]).sort((a, b) => b.timestamp - a.timestamp)
    writeArray(NOTIFS_KEY, merged)
    writeSet(INDEX_IDS_KEY, idSet)
    writeSet(INDEX_SIGS_KEY, sigSet)
    try {
      window.dispatchEvent(new Event("novaNotificacao"))
    } catch {}
    return merged
  }
  return current
}
export function compactNotificationsStorage() {
  const unique = getNotifications()
  writeArray(NOTIFS_KEY, unique)
  updateIndexesWith(unique)
  return unique
}