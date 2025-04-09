import './App.css';
import { Header } from './components/Header';
import { Pesquisa } from './components/Pesquisa';
import { NavigationBar } from './components/NavigationBar';
import { ListaProdutos } from './components/ListaProdutos';
import { SubNavigation } from './components/SubNavigation';


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
      <SubNavigation/>
    </div>
  );
}

export default App;
