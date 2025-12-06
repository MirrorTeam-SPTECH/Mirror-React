import React, { useState } from "react";
const CARD_WIDTH = 450;
const GAP = 20;
const VISIBLE = 3;
const STEP = CARD_WIDTH + GAP;
const WRAPPER_WIDTH = VISIBLE * CARD_WIDTH + (VISIBLE - 1) * GAP;
const items = [
  { nome: "Hamburger 1" },
  { nome: "Hamburger 2" },
  { nome: "Hamburger 3" },
  { nome: "Hamburger 4" },
  { nome: "Hamburger 5" },
  { nome: "Hamburger 6" },
  { nome: "Hamburger 7" },
  { nome: "Hamburger 8" },
  { nome: "Hamburger 9" },
];
export default function MenuCarousel() {
  const [index, setIndex] = useState(0);
  const increment = () => {
  const maxIndex = items.length - VISIBLE;
  setIndex((prev) => Math.min(prev + 1, maxIndex));
};
const decrement = () => {
  setIndex((prev) => Math.max(prev - 1, 0));
};
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex items-center gap-3">
        <button
          className="h-10 w-10 rounded-full bg-gray-400 opacity-60 border-0 flex items-center justify-center text-2xl text-white transition hover:opacity-90"
          disabled={index <= 0}
          onClick={decrement}
        >
          {"<"}
        </button>
        <div className="overflow-hidden mx-auto" style={{ width: `${WRAPPER_WIDTH}px` }}>
          <div
            className="flex transition-transform duration-[1500ms] ease-in-out gap-[20px] items-center"
            style={{
              transform: `translateX(-${index * STEP}px)`,
            }}
          >
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-end w-[450px] h-[300px] bg-[#6B4F4F] rounded-xl flex-shrink-0"
              >
                {}
                <span className="text-white text-lg font-semibold mt-auto mb-2">
                  {item.nome}
                </span>
              </div>
            ))}
          </div>
        </div>
        <button
          className="h-10 w-10 rounded-full bg-gray-400 opacity-60 border-0 flex items-center justify-center text-2xl text-white transition hover:opacity-90"
          disabled={index >= items.length - VISIBLE}
          onClick={increment}
        >
          {">"}
        </button>
      </div>
      <div className="flex mt-6">
        {Array.from({ length: Math.ceil(items.length / VISIBLE) }).map((_, idx) => (
  <div
    key={idx}
    className={`h-3 w-3 border border-transparent rounded-full mx-3 ${
      idx === Math.floor(index / VISIBLE) ? "bg-transparent" : ""
    }`}
  ></div>
))}
      </div>
    </div>
  );
}