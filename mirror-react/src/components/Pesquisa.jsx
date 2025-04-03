import '../styles/Pesquisa.css';
import imgSearch from '../assets/icon/search.png';

export function Pesquisa() {
    return (
        
        <div className="flex items-center justify-center">
        <div className="Search">
            <img src={imgSearch} alt="lupa / barra de pesquisa" />
            <input type="text" placeholder="Buscar" className="searchInput" />
        </div>
        </div>
    );
}
