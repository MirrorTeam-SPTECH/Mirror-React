import '../styles/NavigationBar.css';


export function NavigationBar() {
    return (
        <div className="container-navBar">
            <ul class="menu ">
                <li><button className="Bold" id='active'>Hamburgueres</button></li>
                <li><button className='Bold' id='active'>Espetinhos</button></li>
                <li><button className='Bold' id='active'>Acompanhamentos</button></li>
                <li><button className='Bold' id='active'>Bebidas</button></li>
            </ul>
        </div>
    );
}
