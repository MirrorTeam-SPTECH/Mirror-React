// src/components/CardCarregamento.jsx
"use client";

import React from "react";
import "../styles/CardCarregamento.css";

export default function CardCarregamento() {
  return (
    <div className="w-[350px] h-128 bg-white rounded-2xl shadow-md flex items-center justify-center">
      <div className="spinner"></div>
    </div>
  );
}
