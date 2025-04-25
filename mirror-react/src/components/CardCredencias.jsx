import "../styles/CardCredenciais.css"

const CardCredenciais = () => {
  return (
    <div className="credentials-wrapper">
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

        <div className="payment-form">
          <label htmlFor="card-number-title">Nº do cartão</label>
          <input type="text" id="card-number-title" placeholder="0000 0000 0000 0000" />

          <div className="row">
            <div className="input-group">
              <label htmlFor="validity">Validade</label>
              <input type="text" id="validity" placeholder="MM/AA" />
            </div>
            <div className="input-group">
              <label htmlFor="cvv">CVV</label>
              <input type="text" id="cvv" placeholder="000" />
            </div>
          </div>

          <button className="checkout-btn">Finalizar compra</button>
        </div>
      </div>
    </div>
  )
}

export default CardCredenciais
