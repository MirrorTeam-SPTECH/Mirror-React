import '../styles/NavigationBar.css';

export function NavigationBar() {
    return (
        <div className="container-navBar">
            <ul class="menu">
                <li><button class="active">Hamburgueres</button></li>
                <li><button>Espetinhos</button></li>
                <li><button>Acompanhamentos</button></li>
                <li><button>Bebidas</button></li>
            </ul>
        </div>
    );
}
