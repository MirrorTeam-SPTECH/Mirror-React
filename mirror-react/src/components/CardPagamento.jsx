import "./CardPagamento.css"

const CardPagamento = () => {
  return (
    <div className="payment-wrapper">
      <div className="payment-card">
        <div className="payment-summary">
          <h2>Finalizar compra</h2>
          <div className="price-row">
            <span>Subtotal</span>
            <span>R$ 69,00</span>
          </div>
          <div className="price-row">
            <span>Taxa de entrega</span>
            <span>R$ 1,00</span>
          </div>
          <div className="total-row">
            <span>Total</span>
            <span>R$ 70,00</span>
          </div>
        </div>

        <div className="payment-methods">
          <p className="question">Como prefere fazer o pagamento?</p>

          <button className="method-button">
            <span className="method-icon">💠</span>
            <span className="method-text">PIX</span>
            <span className="arrow">➜</span>
          </button>

          <button className="method-button">
            <span className="method-icon">💳</span>
            <span className="method-text">Cartão</span>
            <span className="arrow">➜</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardPagamento
