import { Link } from 'react-router-dom';
import React from "react";

const HomePortalChurras = () => {
  return <div className="containerHomePC w-screen h-screen bg-red-600">
    <h1 className="text-white text-4xl font-bold">Bem-vindo ao Portal Churras</h1>
    <p className="text-white mt-4">Aqui você encontra tudo para o seu churrasco!</p>
    <div className="mt-8">
      <button className="bg-white text-red-600 px-4 py-2 rounded"><Link to="/favoritos">Sobre</Link></button>
    </div>
  </div>;
};

export default HomePortalChurras;
