import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
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

    console.log("Tentando login com:", { email, senha: "***" });

    try {
      const response = await authService.login({ email, senha });

      console.log("Resposta do login:", response);
      console.log("Usuário:", response.user);
      console.log("Role do usuário:", response.user?.role);

      alert("Login realizado com sucesso");

      // Redirecionar baseado no role do usuário
      const user = response.user;
      if (user && (user.role === "ADMIN" || user.role === "EMPLOYEE")) {
        // Usuários ADMIN ou EMPLOYEE vão para área de gerenciamento
        console.log("Redirecionando para /pedido");
        navigate("/pedido");
      } else {
        // Usuários CUSTOMER vão para home
        console.log("Redirecionando para /home");
        navigate("/home");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Email ou senha inválidos ou houve um problema no login.");
    }
  };

  return (
    <section className="bg-white">
      {/* (SEU HTML CONTINUA IGUAL, só atualizei o form) */}
      <div className="w-screen h-screen flex justify-center items-center relative text-black">
        <img
          id="vermelhoFundo"
          className="absolute bottom-0 w-full z-0"
          src={imgFundoLogin}
          alt=""
        />
        <img
          id="churrascoBaixo"
          className="absolute bottom-0 left-0 z-10 sm:w-[30%] md:w-[20%] lg:w-[18%]"
          src={churrasSideLeft}
          alt=""
        />
        <img
          id="churrascoCima"
          className="absolute top-0 right-0 z-10 sm:w-[35%] md:w-[30%] lg:w-[35%]"
          src={churrasSideRight}
          alt=""
        />

        <div className="flex justify-center items-center relative z-20 bg-white sm:w-[90%] md:w-[70%] lg:w-[65%] shadow-lg h-[75%] overflow-hidden rounded-lg">
          <img
            className="absolute w-[50%] md:w-[60%] lg:w-[70%] left-[-100px] md:left-[-50px]"
            src={Ellipse}
            alt=""
          />

          <div className="relative hidden md:flex w-[40%] h-full justify-center items-center">
            <img
              src={chef}
              alt=""
              className="absolute left-[-20px] w-[600px]"
            />
          </div>

          <div className="relative w-full md:w-[50%] h-[80%] shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,rgba(0,0,0,0.3)_0px_3px_7px_-3px] rounded-lg bg-white">
            <div className="flex items-center justify-start gap-2 h-[5%] p-2 w-full">
              <a href="/" className="flex text-black text-sm md:text-base">
                <ArrowLeft color="black" /> Voltar
              </a>
            </div>

            <div className="flex flex-col w-full h-[20%] px-4">
              <div className="flex items-center justify-center h-[35%]">
                <span className="text-[28px] md:text-[32px] font-bold">
                  Login
                </span>
              </div>
              <div className="flex items-center justify-center h-[25%]">
                <span className="text-[12px] md:text-[15px] font-bold text-center">
                  Boas vindas, faça login e acesse
                </span>
              </div>
            </div>

            <form
              className="flex flex-col items-center justify-center gap-4 w-full h-[70%]"
              onSubmit={handleLogin}
            >
              <div className="flex flex-col justify-center items-start w-[90%] md:w-[70%] h-[70%]">
                <label className="font-semibold text-base">E-mail:</label>
                <input
                  type="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-200 shadow h-[40px] border-none w-full outline-none rounded-[8px] my-2 p-2"
                />
                <label className="font-semibold text-base">Senha:</label>
                <input
                  type="password"
                  placeholder="Senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="bg-gray-200 shadow h-[40px] border-none w-full outline-none rounded-[8px] my-2 p-2"
                />
              </div>
              <button
                type="submit"
                className="bg-[#A2DC00] text-black font-bold text-base rounded-[1px] h-[40px] w-[100px] hover:scale-105"
              >
                Entrar
              </button>
              <p className="font-semibold text-center">
                Não tem uma conta?{" "}
                <a
                  href="/cadastro"
                  className="text-[#008dcf] font-bold underline"
                >
                  Cadastre-se
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
