// src/pages/SiteInstitucional.jsx
import React from "react";
import { Contact, Moon } from "lucide-react";
import wallpaper from "../assets/img/truckHome2.png";
import logoPortal from "../assets/img/logo.png";
import sobreNos from "../assets/img/sobre nós.png";

const SiteInstitucional = () => {
  return (
    <div className="fullContent relative flex justify-center items-center flex-col">
      <section className="homePage w-screen relative flex justify-center h-[75.5dvh] ">
        <img className="absolute top-10 z-0" src={wallpaper} alt="" />
        <div className="containerHomePage  flex flex-col relative w-[95%] h-full">
          <header className="navbarHomePage absolute w-[100%] h-25 flex justify-center items-center">
            <div className="logoHomePage relative w-[15%] h-20 flex justify-center items-center">
              <img className="absolute top-2.5" src={logoPortal} alt="" />
            </div>
            <nav className="navbar flex items-center w-[65%] h-20 justify-center">
              <ul className="navbarList font-semibold justify-center flex gap-20 items-center w-full h-full">
                <li className="navbarItem hover:text-red-800">
                  <a href="#AboutUs">Home</a>
                </li>
                <li className="navbarItem hover:text-red-800">
                  <a href="#AboutUs">Sobre Nós</a>
                </li>
                <li className="navbarItem hover:text-red-800">
                  <a href="#Chefs">Nossos Chefs</a>
                </li>
                <li className="navbarItem hover:text-red-800">
                  <a href="#Menu">Menu</a>
                </li>
                <li className="navbarItem hover:text-red-800">
                  <a href="#Contact">Contato</a>
                </li>
              </ul>
            </nav>
            <div className="btns w-[20%] h-20 flex justify-evenly items-center">
              {/* <button className="temas cursor-pointer" id="DarkLight">
                <Moon></Moon>
              </button> */}
              <button className="btnLogin w-[35%] h-[45%] font-semibold cursor-pointer rounded-lg bg-red-600">
                Login
              </button>
              <button className="btnCadastro w-[50%] h-[45%] rounded-lg border-2 border-red-600 cursor-pointer text-red-600 font-semibold">
                Cadastre-se
              </button>
            </div>
          </header>
          <div className="contentHomepage w-[45%] h-[500px] absolute top-[120px] justify-center items-center flex flex-col">
            {/* <div className="WelcomePC text- flex flex-col justify-end items-center w-full h-[10%]">
              <span className="spanWel font-semibold !font-montserrat text-[50px]">Boas Vindas</span>
            </div>
            <div className="WelcomePCS text- flex flex-col justify-start items-center  w-full h-[35%]">
              <span className="spanWel !font-rye text-[70px]">Portal do Churras</span>
            </div>
            <div className="ParagraphHome bg-amber-600 w-full h-[25%]"></div>
            <div className="MenusAccess bg-amber-500  w-full h-[25%]"></div> */}
          </div>
        </div>
      </section>
      <section className="AboutUs relative bg-amber-600 top-[200px] w-full h-[90dvh]">
        <img className="absolute -top-17" src={sobreNos} alt="" />
      </section>
      <section className="Chefs"></section>
      <section className="Menu"></section>
      <section className="Contact"></section>
      <section className="Footer"></section>
    </div>
  );
};

export default SiteInstitucional;
