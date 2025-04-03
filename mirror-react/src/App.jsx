

import { useState } from 'react'
import './App.css'
import { Header } from './components/Header'
import { Pesquisa } from './components/Pesquisa'
import { NavigationBar } from './components/NavigationBar';  




function App() {
  
  return (
    <>
      <div>
        {<Header titulo="Bem vindos!" p=" Vamos fazer seu pedido" />}
        {<Pesquisa />}
        {<NavigationBar />}
      </div>
    </>
  )
}

export default App
