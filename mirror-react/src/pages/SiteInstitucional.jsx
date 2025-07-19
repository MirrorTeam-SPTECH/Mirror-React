// src/pages/SiteInstitucional.jsx
import React from "react";
import { Contact, Moon } from "lucide-react";
import wallpaper from "../assets/img/truckHome2.png";
import logoPortal from "../assets/img/logo.png";
import sobreNos from "../assets/img/sobre nós.png";
import { Link } from "react-router-dom";

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
                <li className="navbarItem hover:text-red-800 transition duration-400">
                  <a href="#AboutUs">Home</a>
                </li>
                <li className="navbarItem hover:text-red-800 transition duration-400 ">
                  <a href="#AboutUs">Sobre Nós</a>
                </li>
                <li className="navbarItem hover:text-red-800 transition duration-400">
                  <a href="#Chefs">Nossos Chefs</a>
                </li>
                <li className="navbarItem hover:text-red-800 transition duration-400">
                  <a href="#Menu">Menu</a>
                </li>
                <li className="navbarItem hover:text-red-800 transition duration-400">
                  <a href="#Contact">Contato</a>
                </li>
              </ul>
            </nav>
            <div className="btns w-[20%] h-20 flex justify-evenly items-center">
              {/* <button className="temas cursor-pointer" id="DarkLight">
                <Moon></Moon>
              </button> */}
              <button className="btnLogin w-[35%] h-[45%] font-semibold cursor-pointer rounded-lg bg-red-600 hover:bg-red-950 transition duration-400">
                <Link to="/login">Login</Link>
              </button>

              <button className="btnCadastro w-[50%] h-[45%] rounded-lg border-2 border-red-600 cursor-pointer text-red-600 font-semibold hover:bg-red-600 hover:text-white transition duration-400">
                <Link to="/cadastro">Cadastre-se</Link>
              </button>
            </div>
          </header>
          <div className="contentHomepage w-[45%] h-[500px] absolute top-[120px] justify-center items-center flex flex-col">
            <div className="WelcomePCS flex flex-col justify-end absolute top-[90px] items-start w-full h-[10%]">
              <span className="text-[22px] !font-corben flex justify-start items-start">
                Food Truck
              </span>
            </div>
            <div className="WelcomePCS flex flex-col justify-end items-end w-full h-[45%]">
              <span className="!-ml-110 text-[69px] !font-rye flex justify-end items-end">
                Portal do Churras
              </span>
            </div>
            <div className="ParagraphHome w-full h-[25%]">
              <span className="text-[20px] text-center font-medium">
                Seja bem-vindo ao nosso espaço sobre rodas, onde o cheiro de
                churrasco na brasa e o som da chapa quente já anunciam: aqui o
                sabor é de verdade!{" "}
              </span>
            </div>
            <div className="MenusAccess w-full h-[25%]">
              <div className="w-full h-full flex justify-start items-start">
                <button className="w-[50%] h-[60%] rounded-lg bg-red-700 text-white font-semibold text-[20px] cursor-pointer hover:bg-red-800 transition duration-300">
                  Acesse o cardápio!
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="AboutUs relative bg-amber-600 !top-[200px] w-full h-[90dvh] z-0">
        <img className="absolute !-top-17" src={sobreNos} alt="" />

        <div className="flex flex-row justify-between items-start gap-10 !pt-[100px] px-14 relative z-10">
          <div className="flex flex-col gap-3 !ml-14 ">
            <div className="flex gap-3 items-end">
              <div className="bg-amber-50 h-[200px] w-[200px] rounded-2xl"></div>
              <div className="bg-amber-50 h-[230px] w-[200px] rounded-2xl"></div>
              <div className="bg-amber-50 h-[200px] w-[350px] rounded-2xl"></div>
            </div>

            <div className="flex gap-3 ">
              <div className="bg-amber-50 h-[200px] w-[275px] rounded-2xl"></div>
              <div className="bg-amber-50 h-[230px] w-[200px] rounded-2xl"></div>
              <div className="bg-amber-50 h-[200px] w-[275px] rounded-2xl"></div>
            </div>
          </div>

          <div className="flex flex-col justify-start items-start !mt-6 !mr-14">
            <span className="text-8xl font-bold text-white">Sobre Nós</span>
            <p className="!mt-6 text-white text-xl max-w-[400px] leading-relaxed">
              Aqui você pode colocar seu texto descritivo. Ele ficará abaixo do
              título, ao lado dos blocos, com espaçamento e alinhamento
              apropriado.
            </p>
          </div>
        </div>
      </section>

      <section className="Chefs relative bg-[#7DCD38] !top-[200px] w-full h-[70dvh] z-0 ">
        <div className="flex flex-row w-full h-[500px] top-[50%] absolute transform -translate-y-1/2 justify-around">
        <div className="flex flex-col justify-center items-center  ">
          <div className="h-[300px] w-[300px] bg-amber-950 rounded-[50%] "></div>
          <span className="text-2xl font-bold text-white !mt-1">Meri</span>
            <p className="text-white text-xl max-w-[400px] leading-relaxed">CEO</p>
        </div>
        <div className="flex flex-col justify-center items-center  ">
                <p className="text-white text-xl max-w-[400px] leading-relaxed">Conheça nossos</p>
                <span className="text-8xl font-bold text-white">Chefs</span>
        </div>
        <div className="flex flex-col justify-center items-center  ">
          <div className="h-[300px] w-[300px] bg-amber-950 rounded-[50%]"></div>
        <span className="text-2xl font-bold text-white !mt-1">Denis</span>
            <p className="text-white text-xl max-w-[400px] leading-relaxed">CEO</p>
        </div>
        </div>
      </section>
      <section className="Menu relative bg-amber-600 !top-[200px] w-full h-[90dvh] z-0 "></section>
      <section className="Contact"></section>
      <section className="Footer"></section>
    </div>
  );
};

export default SiteInstitucional;
