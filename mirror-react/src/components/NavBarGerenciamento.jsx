// src/components/NavigationBar.jsx
import "../styles/NavigationBar.css";

export default function NavBar() {
  return (
    <div className="container-navBar">
      <ul className="menu">
        <li><button className="Use" id="actived">Hamburgueres</button></li>
        <li><button className="Use" id="actived">Espetinhos</button></li>
        <li><button className="Use" id="actived">Acompanhamentos</button></li>
        <li><button className="Use" id="actived">Bebidas</button></li>
      </ul>
    </div>
  );
}
