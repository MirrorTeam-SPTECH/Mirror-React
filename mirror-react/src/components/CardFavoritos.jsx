import HeartButton from "./Shared/HeartButton";
import Vector15 from "../assets/img/Vector15.png";
import Vector16 from "../assets/img/Vector16.png";

export function Favoritos({ id, categoria, nome, valor, descricao, imagem, onRemove }) {
  
  const handleToggle = (isNowFavorite) => {
    if( !isNowFavorite && onRemove){
      onRemove(id, categoria)
    }
  }
  
  return (
    <div className="favoritos-container relative flex flex-col h-[550px] bg-white rounded-2xl shadow-lg overflow-hidden">
      <img
        src={Vector15 || "/placeholder.svg"}
        className="h-80 w-full pointer-events-none"
        alt=""
      />
      <img
        src={Vector16 || "/placeholder.svg"}
        alt=""
        className="!-mt-65 h-50 w-full pointer-events-none"
      />
      <div className=" absolute !ml-80 z-20">
        <HeartButton
          produtoId={id}
          categoria={categoria}
          onToggle={handleToggle}
        />
      </div>
      <div className="flex flex-col items-start z-10 !-mt-75 h-full w-full">
        <div className="container_imagem !mt-20">
          <img
            className="imagem"
            src={imagem || "/assets/img/hamburguer.png"}
            alt={nome}
          />
        </div>
        <div className="container_textos w-full flex flex-col items-start justify-start flex-grow px-2 pt-2 pb-4 !-ml-1 text-left">
          {" "}
          <h2 className="font-bold !text-2xl  font-antonio !mb-0">{nome}</h2>
          <h4 className="font-antonio text-xl !mt-0">{valor}</h4>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-sm font-semibold text-gray-800">Descrição</p>
            <hr className="border-t-2 border-red-600 w-full my-1" />
            <p className="text-sm text-gray-600">{descricao}</p>
          </div>
        </div>
      </div>
    </div>
  );

}
