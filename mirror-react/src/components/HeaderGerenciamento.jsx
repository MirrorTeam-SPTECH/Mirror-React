import { Link } from 'react-router-dom';  
import LogoPortaldoChurras from "../assets/img/LogoPortaldoChurras.svg"  

export default function HeaderGerenciamento({ activePage }) {  
    const menuItems = [  
        { label: "PEDIDOS", page: "pedidos", href: "/novoPedido" },  
        { label: "COZINHA", page: "cozinha", href: "/cozinha" },  
        { label: "BENEFÍCIOS", page: "beneficios", href: "/beneficios" },  
        { label: "CARDÁPIO", page: "cardapio", href: "/cardapioEditar" },  
        { label: "RELATÓRIOS", page: "relatorios", href: "/relatorios" },  
    ];  

    return (  
        <div className="w-full h-22 flex justify-center items-center">  
            <div className="w-[90%] flex items-center justify-between px-16">  
                <ul className="flex gap-6 text-xs cursor-pointer">  
                    {menuItems.map((item) => (  
                        <li  
                            key={item.page}  
                            className={`transition-all duration-200 ease-in-out ${  
                                activePage === item.page  
                                    ? "text-white font-bold"  
                                    : "text-gray-300 hover:text-white hover:font-semibold"  
                            }`}  
                        >  
                            <Link  
                                to={item.href}  
                                className="no-underline"  
                            >  
                                {item.label}  
                            </Link>  
                        </li>  
                    ))}  
                </ul>  
                <img  
                    src={LogoPortaldoChurras || "/placeholder.svg"}  
                    className="h-16"  
                    alt="Portal do Churras Logo"  
                />  
            </div>  
        </div>  
    );  
}  