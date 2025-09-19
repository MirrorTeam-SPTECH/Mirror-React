import '../styles/Header.css';
import ImgHeader from '../assets/img/ImgHeader.png';
import Logo from '../assets/img/Logo.png';


export function Header(props) {
  return (
    <div className="header-container">
      <img className="imgheader" src={ImgHeader} alt="imagem da Header" />
      <img className="logo" src={Logo} alt="logo do food truck" />
      <div className="text">
        <h1>{props.titulo}</h1>
        <p>{props.p}</p>
      </div>
    </div>
  );
}
