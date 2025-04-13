import iconeInitialScreen from '../assets/icon/Frame318.png'
import iconeSacola from '../assets/icon/icone-sacola.png'
import iconeHouse from '../assets/icon/Vector.png'
import iconeFav from '../assets/icon/icone-favoritos.png'
import iconePerfil from '../assets/icon/icone-perfil.png'
import styles from '../styles/SubNavigation.module.css';


export function SubNavigation() {
    return (
        <div className={styles.containerSubNavigation}>
            <div className={styles.SubNavigation}>
                <button>
                    <img src={iconeInitialScreen} alt="Botão para a tela Principal" />
                </button>
                <button>
                    <img src={iconeSacola} alt="" />
                </button>
                <button>
                    <img src={iconeHouse} alt="" />
                </button>
                <button>
                    <img src={iconeFav} alt="" />
                </button>
                <button>
                    <img src={iconePerfil} alt="" />
                </button>

            </div>
        </div>
    )
}

