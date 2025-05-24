import React from "react";
import { ArrowLeft } from "lucide-react";


export default function ButtonBack({ onClose }) {
  return (
    <button
      className="
        btn-back
        absolute
        !left-4
        !top-4
        !p-0
        !m-0
        !w-8
        !h-8
        flex
        items-center
        justify-center
        rounded-full
        bg-transparent
        border-none
        text-gray-800
        hover:bg-gray-100
        transition-colors
        z-10
        focus:outline-none
        
      "
      onClick={onClose}
      type="button"
    >
      <ArrowLeft size={20} />
    </button>
  );
}