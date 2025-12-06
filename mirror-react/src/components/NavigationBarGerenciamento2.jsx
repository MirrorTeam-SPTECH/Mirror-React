import "../styles/NavigationBarGerenciamento.css";
export default function NavigationBarGerenciamento2() {
  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="container-navBar-gerenciamento">
      <ul className="menu-gerenciamento">
        <li>
          <button
            className="button-gerenciamento"
            onClick={() => handleScroll("combos")}
          >
            Combos
          </button>
        </li>
        <li>
          <button
            className="button-gerenciamento"
            onClick={() => handleScroll("hamburgueres")}
          >
            Hamburgueres
          </button>
        </li>
        <li>
          <button
            className="button-gerenciamento"
            onClick={() => handleScroll("espetinhos")}
          >
            Espetinhos
          </button>
        </li>
        <li>
          <button
            className="button-gerenciamento"
            onClick={() => handleScroll("adicionais")}
          >
            Adicionais
          </button>
        </li>
        <li>
          <button
            className="button-gerenciamento"
            onClick={() => handleScroll("bebidas")}
          >
            Bebidas
          </button>
        </li>
        <li>
          <button
            className="button-gerenciamento"
            onClick={() => handleScroll("porcoes")}
          >
            Porções
          </button>
        </li>
      </ul>
    </div>
  );
}