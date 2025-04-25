import "./CardPagamentoRealizado.css"

const CardPagamentoRealizado = () => {
  return (
    <div className="success-wrapper">
      <div className="success-card">
        <div className="icon">✔</div>
        <p className="message">
          Pedido feito com sucesso
          <br />
          será entregue entre 30 a 40 minutos
          <br />
          Obrigado pela preferência
        </p>
        <button className="track-order">Acompanhar Pedido</button>
        <button className="back-home">Voltar para o início</button>
      </div>
    </div>
  )
}

export default CardPagamentoRealizado
