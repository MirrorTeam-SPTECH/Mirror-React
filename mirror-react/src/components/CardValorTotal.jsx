import { Trash2 } from "lucide-react"
import "../styles/CardValorTotal.css"

const CardValorTotal = () => {
  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">Carrinho</div>

        <div className="item-card">
          <div className="item-info">
            <img src="/placeholder.svg?height=70&width=70" alt="Chef's Chicken" />
            <div className="item-details">
              <span className="item-title">Chef's Chicken</span>
              <span className="item-price">R$ 37,00</span>
            </div>
          </div>
          <button className="trash-icon">
            <Trash2 size={18} />
          </button>
        </div>

        <div className="cart-details">
          <h3>Detalhes</h3>

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

          <button className="checkout-btn">Finalizar compra</button>
        </div>
      </div>
    </div>
  )
}

export default CardValorTotal
