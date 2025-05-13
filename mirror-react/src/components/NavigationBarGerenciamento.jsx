export function NavigationBar() {
  const handleScroll = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-row justify-center m-0 pt-[10px]">
      <ul className="flex gap-[10px] list-none p-[10px]">
        {['Hamburgueres', 'Espetinhos', 'Acompanhamentos', 'Bebidas'].map((item, index) => (
          <li key={index}>
            <button
              className="px-[15px] py-[6px] border-[2px] border-[#c00] rounded-[8px] text-[#c00] font-medium cursor-pointer bg-transparent transition-all duration-300 ease-in-out hover:bg-[#c00] hover:text-white"
              onClick={() => handleScroll(item.toLowerCase())} 
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}