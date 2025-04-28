"use client"

import LogoPortaldoChurras from "../assets/img/LogoPortaldoChurras.svg"
import IconInstagram from "../assets/icon/iconsInstagram.svg"
import IconWhatsapp from "../assets/icon/iconWhatsapp.svg"
import IconAcima from "../assets/icon/iconAcima.png"

const FooterSite = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <section className="w-full min-h-[40rem]">
      <footer className="bg-amber-500 py-12 px-12 text-white">
        <div className="container mx-auto px-3">
          <div className="flex flex-col md:flex-row justify-center items-start gap-8 md:gap-24 -mt-12 text-center">
            <div className="w-full md:w-1/4 p-0 justify-center">
              <img src={LogoPortaldoChurras || "/placeholder.svg"} className="mb-4" alt="Portal do Churras Logo" />
              <p className="text-left text-white font-normal">
                Levando sabor e qualidade onde você estiver! Nosso food truck oferece pratos frescos e deliciosos,
                preparados com ingredientes selecionados para proporcionar uma experiência única de sabor. Siga-nos nas
                redes sociais e descubra nosso cardápio itinerante!
              </p>
            </div>

            <div className="w-full md:w-1/4 p-0 justify-center">
              <h4 className="text-xl text-white mb-5 font-medium relative">Social</h4>
              <ul className="list-none flex flex-col ml-12 md:ml-[50px] -mr-[500px]">
                <li className="my-1 flex items-center">
                  <a
                    href="#"
                    className="text-base capitalize text-white no-underline font-light flex items-center transition-all duration-300 hover:text-amber-300 hover:pl-2.5"
                  >
                    <img src={IconInstagram || "/placeholder.svg"} alt="" className="h-6 mr-2.5" />
                    Portal do Churras
                  </a>
                </li>
              </ul>
            </div>

            <div className="w-full md:w-1/4 p-0 justify-center">
              <h4 className="text-xl text-white mb-5 font-medium relative">Detalhes</h4>
              <ul className="list-none flex flex-col ml-20 md:ml-[80px] -mr-[500px]">
                <li className="my-1 flex items-center">
                  <a
                    href="#"
                    className="text-base capitalize text-white no-underline font-light block transition-all duration-300 hover:text-amber-300 hover:pl-2.5"
                  >
                    Home
                  </a>
                </li>
                <li className="my-1 flex items-center">
                  <a
                    href="#"
                    className="text-base capitalize text-white no-underline font-light block transition-all duration-300 hover:text-amber-300 hover:pl-2.5"
                  >
                    Sobre nós
                  </a>
                </li>
                <li className="my-1 flex items-center">
                  <a
                    href="#"
                    className="text-base capitalize text-white no-underline font-light block transition-all duration-300 hover:text-amber-300 hover:pl-2.5"
                  >
                    Menu
                  </a>
                </li>
                <li className="my-1 flex items-center">
                  <a
                    href="#"
                    className="text-base capitalize text-white no-underline font-light block transition-all duration-300 hover:text-amber-300 hover:pl-2.5"
                  >
                    Contato
                  </a>
                </li>
              </ul>
            </div>

            <div className="w-full md:w-1/4 p-0 justify-center">
              <h4 className="text-xl text-white mb-5 font-medium relative">Contato</h4>
              <ul className="list-none flex flex-col ml-12 md:ml-[50px] -mr-[500px]">
                <li className="my-1 flex items-center">
                  <a
                    href="#"
                    className="text-base capitalize text-white no-underline font-light flex items-center transition-all duration-300 hover:text-amber-300 hover:pl-2.5"
                  >
                    <img src={IconWhatsapp || "/placeholder.svg"} alt="" className="h-6 mr-2.5" />
                    (11)94802-8922
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      <div className="bg-amber-500 text-white relative">
        <div className="flex justify-center pb-6">
          <p>Todos os direitos reservados | Mirror® 2025</p>
        </div>
        <button
          id="scrollToTopBtn"
          onClick={scrollToTop}
          className="absolute bottom-5 right-5 w-[50px] h-[50px] bg-white border-none rounded-full shadow-md cursor-pointer flex items-center justify-center transition-opacity duration-300 hover:opacity-80"
        >
          <img src={IconAcima || "/placeholder.svg"} alt="Scroll to top" className="w-[30px] h-[30px]" />
        </button>
      </div>
    </section>
  )
}

export default FooterSite
