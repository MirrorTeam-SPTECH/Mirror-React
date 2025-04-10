import './App.css';
import { Header } from './components/Header';
import { Pesquisa } from './components/Pesquisa';
import { NavigationBar } from './components/NavigationBar';
import { ListaProdutos } from './components/ListaProdutos';
import { SubNavigation } from './components/SubNavigation';
import { Favoritos } from './components/Favoritos';

const produtos = Array(30).fill({
  nome: "X-Tudo ",
  tempo: "15-20 min",
  preco: "29,00",
  // imagem: imgHamburguer
});

function App() {
  return (
    <div className="bg-[#f3f5fa] min-h-screen p-4">
      <Header titulo="Bem vindos!" p="Vamos fazer seu pedido" />
      <Pesquisa />
      <NavigationBar />
      <ListaProdutos titulo="Hamburgueres" produtos={produtos} />
      <ListaProdutos titulo="Espetinhos" produtos={produtos} />
      <SubNavigation />

      <div className="carrossel-container">
        <div className="div_favoritos-wrapper">
          <button className="btn-carrossel esquerda" onClick={() => scrollCarrossel('esquerda')}>
            <span>&lt;</span>
          </button>

          <div className='div_favoritos' id="carrosselFavoritos">
            <Favoritos nome="Chef's Chicken" valor="R$ 39,90" descricao="Descrição: Pao brioche, Molho especial, Frango empanado, Molho chicken" />
            <Favoritos nome="X-Tudo" valor="R$ 29,90" descricao="Descrição: Pão de hambúrguer, carne, queijo, presunto, bacon, ovo, alface e tomate." />
            <Favoritos nome="X-Bacon" valor="R$ 29,90" descricao="Descrição: Pão de hambúrguer, carne, queijo, presunto, bacon, ovo, alface e tomate." />
            <Favoritos nome="X-Salada" valor="R$ 29,90" descricao="Descrição: Pão de hambúrguer, carne, queijo, presunto, bacon, ovo, alface e tomate." />
            <Favoritos nome="X-Ovo" valor="R$ 29,90" descricao="Descrição: Pão de hambúrguer, carne, queijo, presunto, bacon, ovo, alface e tomate." />
            <Favoritos nome="X-Coxinha" valor="R$ 29,90" descricao="Descrição: Pão de hambúrguer, carne, queijo, presunto, bacon, ovo, alface e tomate." />
            <Favoritos nome="X-Nada" valor="R$ 29,90" descricao="Descrição: Pão de hambúrguer, carne, queijo, presunto, bacon, ovo, alface e tomate." />
          </div>

          <button className="btn-carrossel direita" onClick={() => scrollCarrossel('direita')}>
            <span>&gt;</span>
          </button>
        </div>
      </div>

    </div>
  );
}

export default App;



function scrollCarrossel(direcao) {
  const carrossel = document.getElementById('carrosselFavoritos');
  const larguraCard = 350; 

  if (direcao === 'direita') {
    carrossel.scrollLeft += larguraCard;
  } else {
    carrossel.scrollLeft -= larguraCard;
  }
}
