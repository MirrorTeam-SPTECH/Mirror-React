import '../styles/Header.css';
import ImgHeader from '../assets/img/ImgHeader.png';

export function Header(props) {
    return (
        <div className="header-container">
            <img src={ImgHeader} alt="imagem da Header" />
            <div className="text">
                <h1>{props.titulo}</h1>
                <p> {props.p}</p>
            </div>
        </div>
    );
}
