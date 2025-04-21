import styles from "../styles/SubNavigation.module.css";
import { Link } from 'react-router-dom'
import { Heart, House, ShoppingBasket, Truck, UserRound } from "lucide-react";

export function SubNavigation() {
  return (
    <div className={styles.containerSubNavigation}>
      <div className={styles.SubNavigation}>
        <button>
          <Truck color="#1C1C1C" size={20} absoluteStrokeWidth={false} />
        </button>
        <button>
          <ShoppingBasket color="#1C1C1C" size={20} absoluteStrokeWidth={false} />
        </button>
        <button>
          <House color="#1C1C1C" size={20} absoluteStrokeWidth={false} />
        </button>
        <button>
          <Link to={"/favoritos"}>
          <Heart color="#1C1C1C" size={20} absoluteStrokeWidth={false} />
          </Link>
        </button>
        <button>
          <UserRound color="#1C1C1C" size={20} absoluteStrokeWidth={false} />
        </button>
      </div>
    </div>
  );
}
