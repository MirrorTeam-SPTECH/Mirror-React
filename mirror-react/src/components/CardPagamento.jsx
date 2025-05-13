import "../styles/CardPagamento.css"

export default function CardPagamento({
  produto,
  onPix,
  onCartao,
}) {
  // converte string "18,00" para número 18.00
  const precoNum = Number(String(produto.preco).replace(",", "."))
  const valor = isNaN(precoNum) ? 0 : precoNum
  const taxa = 1.0
  const total = valor + taxa

  return (
    <div className="payment-wrapper">
      <div className="payment-card">
        <div className="payment-summary">
          <h2>Finalizar compra</h2>

          <div className="item-line">
            <span>{produto.nome}</span>
            <span>R$ {valor.toFixed(2)}</span>
          </div>

          <div className="item-line">
            <span>Subtotal</span>
            <span>R$ {valor.toFixed(2)}</span>
          </div>

          <hr className="divider" />

          <div className="total-line">
            <span>Total</span>
            <span><strong>R$ {total.toFixed(2)}</strong></span>
          </div>
        </div>

        <div className="payment-methods">
          <p className="question">Como prefere fazer o pagamento?</p>

          <button className="method-button" onClick={onPix}>
            <div className="method-info">
              <span className="method-icon">💠</span>
              <span className="method-text">PIX</span>
            </div>
            <div className="method-arrow">➔</div>
          </button>

          <button className="method-button" onClick={onCartao}>
            <div className="method-info">
              <span className="method-icon">💳</span>
              <span className="method-text">Balcão</span>
            </div>
            <div className="method-arrow">➔</div>
          </button>
        </div>
      </div>
    </div>
  )
}
