// src/pages/SiteInstitucional.jsx
import React from "react";
import { Instagram, MessageCircle } from 'lucide-react';
import wallpaper from "../assets/img/truckHome2.png";
import logoPortal from "../assets/img/logo.png";
import sobreNos from "../assets/img/sobre nós.png";
import { Link } from "react-router-dom";
import MenuCarousel from "../components/MenuCarousel";
("../components/MenuCarousel");

const SiteInstitucional = () => {
  return (
    <div className="fullContent relative flex justify-center items-center flex-col">
      <section className="homePage w-screen relative flex justify-center h-[75.5dvh] ">
        <img className="absolute top-10 z-0" src={wallpaper} alt="" />
        <div className="containerHomePage  flex flex-col relative w-[95%] h-full">
          <header className="navbarHomePage absolute w-[100%] h-25 flex justify-center items-center">
            <div className="logoHomePage relative w-[15%] h-20 flex justify-center items-center">
              <img className="absolute top-2.5  !-ml-15" src={logoPortal} alt="" />
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
              <span className="!-ml-110 !mr-2 text-[69px] !font-rye flex justify-end items-end">
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
            <p className="text-white text-xl max-w-[400px] leading-relaxed">
              CEO
            </p>
          </div>
          <div className="flex flex-col justify-center items-center  ">
            <p className="text-white text-xl max-w-[400px] leading-relaxed">
              Conheça nossos
            </p>
            <span className="text-8xl font-bold text-white">Chefs</span>
          </div>
          <div className="flex flex-col justify-center items-center  ">
            <div className="h-[300px] w-[300px] bg-amber-950 rounded-[50%]"></div>
            <span className="text-2xl font-bold text-white !mt-1">Denis</span>
            <p className="text-white text-xl max-w-[400px] leading-relaxed">
              CEO
            </p>
          </div>
        </div>
      </section>
      <section className="Menu relative bg-[#2C0000] !top-[200px] w-full h-[90dvh] z-0 ">
        <div className="flex flex-col justify-start items-center w-full h-full">
          <p className="!mt-10 text-white text-xl max-w-[400px] leading-relaxed">
            Esse é o nosso
          </p>
          <span className="text-8xl font-bold text-white">Menu</span>
          <div className="w-[100%] flex justify-center items-center h-[80%]">
            <MenuCarousel />
          </div>
        </div>
      </section>
      <section className="Contact relative bg-[#FFD940] !top-[200px] w-full h-[35dvh] z-0 ">
        <div className="flex flex-col w-full h-full items-center">
          <span className="text-7xl font-bold text-white !mt-10">
            Contato Rápido!
          </span>
          <div className="flex flex-row gap-5 justify-around items-center !mt-10">
            <input
              type="text"
              className="w-[400px] h-[50px] bg-amber-50 text-black rounded-[8px] border-amber-50 shadow-md focus:outline-none focus:right-0 !px-4 placeholder:text-gray-600"
              placeholder="Nome Completo"
            />
            <input
              type="text"
              className="w-[400px] h-[50px] bg-amber-50 text-black rounded-[8px] border-amber-50 shadow-md focus:outline-none focus:right-0 !px-4 placeholder:text-gray-600"
              placeholder="Nome Completo"
            />
            <button className="w-[150px] h-[50px] bg-[#F4C300] text-black rounded-[8px] shadow-lg text-sm font-bold hover:bg-[#BC9600] transition duration-300">
              Solicitar contato
            </button>
          </div>
        </div>
      </section>
     <section className="Contact relative bg-[#A40000] !top-[200px] w-full h-[65dvh] flex justify-center items-center !px-8">
  <div className="flex flex-row justify-center items-center w-full h-full gap-5">
    {/* Lado esquerdo: Ícone e texto */}
    <div className="flex flex-col items-start justify-center gap-[35px] !-mt-[6%] relative">
      {/* Ícone */}
      <div className="w-[250px] h-[250px] bg-amber-50 !mt-2 "></div>

      {/* Texto */}
      <h2 className="text-[100px] font-bold text-white leading-[1] text-right !-mt-[5%] whitespace-nowrap">
        Nossa<br />Localização
      </h2>
    </div>

    {/* Mapa */}
    <div className="bg-[#f1f1f1] h-[350px] w-[45%] !mt-[10px] rounded-[10px] overflow-hidden">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2165.210150247894!2d-46.71189489120232!3d-23.482309332977163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cef90a69d6b48b%3A0xbdcf6cb742a0539d!2sR.%20Domingos%20Giglio%2C%2081%20-%20Vila%20Miriam%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2002972-010!5e0!3m2!1spt-BR!2sbr!4v1741995970605!5m2!1spt-BR!2sbr"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </div>
</section>

      <section className="Footer relative bg-[#C26700] !top-[200px] w-full h-[65dvh] flex justify-center items-center !px-8">
          <div className="flex flex-col justify-center items-center w-full h-full gap-5">
                <div className="flex flex-row h-[350px] w-[100%] justify-around items-center gap-10">
                  <div className="flex flex-col justify-center items-center w-[100px] h-[90%] bg-red-500">

                  </div>

                  <div className="flex flex-col justify-start items-center w-[100px] h-[90%]  gap-3">
                      <span className="text-1xl font-bold text-white">
                      Social
                  </span>
                  <div className="flex flex-row gap-2 justify-center items-center">
                      <Instagram size={18} />
                       <span className="text-xs font-bold  text-white">
                      ChurrasdoPortal
                  </span>
                  </div>
                  </div>

                  <div className="flex flex-col justify-start items-center w-[100px] h-[90%]  gap-3">
                      <span className="text-1xl font-bold text-white ">
                      Detalhes
                  </span>
                  <ul className="text-xs font-bold text-white flex flex-col justify-center items-start !-ml-2">
                    <li>Home</li>
                    <li>Sobre Nós</li>
                    <li>Menu</li>
                    <li>Contato</li>
                  </ul>
                  </div>

                  <div className="flex flex-col justify-start items-center w-[140px] h-[90%]  gap-3">
                      <span className="text-1xl font-bold text-white">
                      Contato
                  </span>
                  <div className="flex flex-row gap-2 justify-center items-center">
                      <MessageCircle size={18} />
                       <span className="text-xs font-bold text-white">
                      (11) 94802-8922
                  </span>
                  </div>
                  </div>
                </div>
                <div className="flex flex-row h-[50px] w-[100%] justify-center items-center gap-10">
                  <span className="text-1xl font-bold text-white">
                      Todos os direitos reservados | Mirror® 2025
                  </span>
                </div>
          </div>
      </section>
    </div>
  );
};

export default SiteInstitucional;
