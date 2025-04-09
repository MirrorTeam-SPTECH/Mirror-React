import bntMain from '../assets/icon/Frame318.png'
import styles from '../styles/SubNavigation.module.css';

export function SubNavigation(){
    return(
        <div className="containerSubNavigation">
            <div className="SubNavigation">
                <img src={bntMain} alt="Botão para a tela Principal" />
            </div>
        </div>
    )
}       