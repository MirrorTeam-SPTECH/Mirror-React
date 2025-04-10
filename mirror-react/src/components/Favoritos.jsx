import '../styles/Favoritos.css';
import ImgLanche from '../assets/img/hamburguer.png'

export function Favoritos(props) {

    return (
        <div className='favoritos-container'>
            <div className='container_imagem'>
                <img className='imagem' src={ImgLanche} alt="" />
            </div>
            <div className='container_textos'>
                <div>
                    <h2>{props.nome}</h2>
                    <h4>{props.valor}</h4>
                    <h4>{props.descricao}</h4>
                </div>
            </div>
        </div>
    );
}