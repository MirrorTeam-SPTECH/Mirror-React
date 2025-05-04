import { Outlet } from "react-router-dom";

export default function LayoutCliente() {
  return (
    <div className="layout-cliente">
      <Outlet context={{ isGerenciamento: false }} />    
    </div>
  );
}
