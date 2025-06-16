
import "../styles/NavigationBar.css";

export default function NavigationBar() {
  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="container-navBar">
      <ul className="menu">
         <li>
          <button

            className="Fixed"
            id="active"
            onClick={() => handleScroll("combos")}
          >
            Combos
          </button>
        </li>
        <li>
          <button

            className="Fixed"
            id="active"
            onClick={() => handleScroll("hamburgueres")}
          >
            Hamburgueres
          </button>
        </li>
        <li>
          <button
            className="Fixed"
            id="active"
            onClick={() => handleScroll("espetinhos")}
          >
            Espetinhos
          </button>
        </li>
        <li>
          <button
            className="Fixed"
            id="active"
            onClick={() => handleScroll("adicionais")}
          >
            Adicionais
          </button>
        </li>
        <li>
          <button
            className="Fixed"
            id="active"
            onClick={() => handleScroll("bebidas")}
          >
            Bebidas
          </button>
        </li>
        <li>
          <button

            className="Fixed"
            id="active"
            onClick={() => handleScroll("porcoes")}
          >
            Porções
          </button>
        </li>
      </ul>
    </div>
  );
}