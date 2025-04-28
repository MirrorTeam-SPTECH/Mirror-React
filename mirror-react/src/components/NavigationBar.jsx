import React from "react";
import "../styles/NavigationBar.css";

export function NavigationBar({ categorias, onSelectCategoria }) {
  return (
    <div className="container-navBar">
      <ul className="menu">
        {categorias.map((titulo) => (
          <li key={titulo}>
            <button
              className="Bold"
              onClick={() => onSelectCategoria(titulo)}
            >
              {titulo}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
