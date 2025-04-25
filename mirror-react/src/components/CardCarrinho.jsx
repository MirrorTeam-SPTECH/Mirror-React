import { useState } from "react"
import "../styles/CardCarrinho.css";

function CardCarrinho() {
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  return (
    <div className="card">
      <div className="card-image">
        <div className="heart-icon" onClick={toggleFavorite}>
          {isFavorite ? "❤️" : "♡"}
        </div>
        <img src="/placeholder.svg?height=140&width=140" alt="Chef's Chicken" />
      </div>

      <div className="card-content">
        <div className="card-title">
          <h2>Chef's Chicken</h2>
          <p className="price">R$ 37,00</p>
        </div>

        <div className="quantity">
          <button onClick={decreaseQuantity}>-</button>
          <span>{quantity}</span>
          <button onClick={increaseQuantity}>+</button>
        </div>

        <div className="description">
          <strong>Descrição</strong>
          <div className="divider"></div>
          <p>Pão brioche, Molho especial, Frango empanado, Molho chicken</p>
        </div>

        <button className="add-to-cart">Adicionar ao carrinho →</button>
      </div>
    </div>
  )
}

export default CardCarrinho
