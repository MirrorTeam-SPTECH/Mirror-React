import { useOutletContext } from "react-router-dom";
import "../styles/NavigationBar.css";

export default function NavigationBar() {
  const { isGerenciamento } = useOutletContext();

  const scrollToCategory = (categoryId) => {
    const categoryElement = document.getElementById(categoryId);
    if (categoryElement) {
      categoryElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="container-navBar">
      <ul className="menu">
        <li>
          <button
            className={isGerenciamento ? "Use" : "Bold"}
            id={isGerenciamento ? "actived" : "active"}
            onClick={() => scrollToCategory("hamburgueres")}
          >
            Hamburgueres
          </button>
        </li>
        <li>
          <button
            className={isGerenciamento ? "Use" : "Bold"}
            id={isGerenciamento ? "actived" : "active"}
            onClick={() => scrollToCategory("espetinhos")}
          >
            Espetinhos
          </button>
        </li>
        <li>
          <button
            className={isGerenciamento ? "Use" : "Bold"}
            id={isGerenciamento ? "actived" : "active"}
            onClick={() => scrollToCategory("bebidas")}
          >
            Bebidas
          </button>
        </li>
        <li>
          <button
            className={isGerenciamento ? "Use" : "Bold"}
            id={isGerenciamento ? "actived" : "active"}
            onClick={() => scrollToCategory("porcoes")}
          >
            Porções
          </button>
        </li>
      </ul>
    </div>
  );
}