import styles from "../styles/SubNavigation.module.css";
import { Link, useLocation } from 'react-router-dom'
import { Heart, House, ShoppingCartIcon, TruckIcon, UserRound } from "lucide-react";

export function SubNavigation() {
  const location = useLocation();

  const navItems = [
    { to: "/historicoPedido", icon: <TruckIcon color="#1C1C1C" size={20} absoluteStrokeWidth={false} />, key: "historicoPedido" },
    { to: "/fidelidade", icon: <ShoppingCartIcon color="#1C1C1C" size={20} absoluteStrokeWidth={false} />, key: "fidelidade" },
    { to: "/home", icon: <House color="#1C1C1C" size={20} absoluteStrokeWidth={false} />, key: "home" },
    { to: "/favoritos", icon: <Heart color="#1C1C1C" size={20} absoluteStrokeWidth={false} />, key: "favoritos" },
    { to: "/perfil", icon: <UserRound color="#1C1C1C" size={20} absoluteStrokeWidth={false} />, key: "perfil" },
  ];

  return (
    <div className={styles.containerSubNavigation}>
      <div className={styles.SubNavigation}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <div
              key={item.key}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
              }}
            >
              <Link
                to={item.to}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {isActive && (
                  <span
                    style={{
                     position: "absolute",
                      width: 35,
                      height: 35,
                      top: 2,
                      left: 2,
                      borderRadius: "50%",
                      background: "#ff5a5f",
                      zIndex: 0,
                      border: "2px solid #e30613",
                    }}
                  />
                )}
                <span style={{ position: "relative", zIndex: 2 }}>
                  {item.icon}
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}