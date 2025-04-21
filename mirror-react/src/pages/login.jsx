import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import imgFundoLogin from "../assets/img/blob 7.svg";
import churrasSideLeft from "../assets/img/9-removebg-preview 1.svg";
import churrasSideRight from "../assets/img/8-removebg-preview 1.svg";
import Ellipse from "../assets/img/Ellipse 208.svg";
import chef from "../assets/img/1-removebg-preview 1.svg";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !senha) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/usuarios", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Nenhum usuário encontrado");
      }

      const data = await response.json();
      const user = data.find(
        (user) => user.email === email && user.senha === senha
      );

      if (!user) {
        alert("Email ou senha inválidos");
        return;
      }

      alert("Login realizado com sucesso");
      navigate("/home");
    } catch (error) {
      console.error("Erro:", error);
      alert("Houve um problema com o login. Tente novamente mais tarde.");
    }
  };

  return (
    <section className="bg-white">
      <div className="container">
        <img id="vermelhoFundo" src={imgFundoLogin} alt="" />
        <img id="churrascoBaixo" src={churrasSideLeft} alt="" />
        <img id="churrascoCima" src={churrasSideRight} alt="" />
        <div className="contentLogin">
          <img src={Ellipse} alt="" />
          <div className="leftLogin">
            <img src={chef} alt="" />
          </div>
          <div className="rightLogin">
            <div className="voltarInicio">
              <a href="/"> <ArrowLeft color="black" />Voltar</a>
            </div>
            <div className="titulosLogin">
              <div className="tituloUm">
                <span>Login</span>
              </div>
              <div className="tituloDois">
                <span>Boas vindas, faça login e acesse</span>
              </div>
            </div>
            <form className="loginBox" onSubmit={handleLogin}>
              <div className="boxesLogin">
                <label htmlFor="input_email">E-mail:</label>
                <input
                  type="email"
                  id="input_email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="input_senha">Senha:</label>
                <input
                  type="password"
                  id="input_senha"
                  placeholder="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>
              <button type="submit">Entrar</button>
              <p>
                Não tem uma conta? <a href="/cadastro" id="ACAD">Cadastre-se</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
