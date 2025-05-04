import { Outlet } from "react-router-dom";

export default function LayoutGerenciamento() {
  return (
    <div className="layout-gerenciamento">
      <Outlet context={{ isGerenciamento: true }} />
    </div>
  );
}
