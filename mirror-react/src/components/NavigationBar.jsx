<<<<<<< HEAD
import { useOutletContext } from "react-router-dom";
import "../styles/NavigationBar.css";

export default function NavigationBar() {
  const { isGerenciamento } = useOutletContext();

  const scrollToCategory = (categoryId) => {
    const categoryElement = document.getElementById(categoryId);
    if (categoryElement) {
      categoryElement.scrollIntoView({ behavior: "smooth" });
=======
import "../styles/NavigationBar.css";

export function NavigationBar() {
  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
>>>>>>> ad1df1538022a2859ad4aca6046f61768b682dee
    }
  };

  return (
    <div className="container-navBar">
      <ul className="menu">
        <li>
          <button
<<<<<<< HEAD
            className={isGerenciamento ? "Use" : "Bold"}
            id={isGerenciamento ? "actived" : "active"}
            onClick={() => scrollToCategory("hamburgueres")}
=======
            className="Bold"
            id="active"
            onClick={() => handleScroll("hamburgueres")}
>>>>>>> ad1df1538022a2859ad4aca6046f61768b682dee
          >
            Hamburgueres
          </button>
        </li>
        <li>
          <button
<<<<<<< HEAD
            className={isGerenciamento ? "Use" : "Bold"}
            id={isGerenciamento ? "actived" : "active"}
            onClick={() => scrollToCategory("espetinhos")}
=======
            className="Bold"
            id="active"
            onClick={() => handleScroll("espetinhos")}
>>>>>>> ad1df1538022a2859ad4aca6046f61768b682dee
          >
            Espetinhos
          </button>
        </li>
        <li>
          <button
<<<<<<< HEAD
            className={isGerenciamento ? "Use" : "Bold"}
            id={isGerenciamento ? "actived" : "active"}
            onClick={() => scrollToCategory("bebidas")}
=======
            className="Bold"
            id="active"
            onClick={() => handleScroll("adicionais")}
          >
            Adicionais
          </button>
        </li>
        <li>
          <button
            className="Bold"
            id="active"
            onClick={() => handleScroll("bebidas")}
>>>>>>> ad1df1538022a2859ad4aca6046f61768b682dee
          >
            Bebidas
          </button>
        </li>
        <li>
          <button
<<<<<<< HEAD
            className={isGerenciamento ? "Use" : "Bold"}
            id={isGerenciamento ? "actived" : "active"}
            onClick={() => scrollToCategory("porcoes")}
=======
            className="Bold"
            id="active"
            onClick={() => handleScroll("porcoes")}
>>>>>>> ad1df1538022a2859ad4aca6046f61768b682dee
          >
            Porções
          </button>
        </li>
      </ul>
    </div>
  );
}