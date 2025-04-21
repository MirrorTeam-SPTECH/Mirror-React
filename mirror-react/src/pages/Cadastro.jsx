import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../styles/cadastro.css";
import imgFundoCadastro from "../assets/img/Blob 5.png";
import imgFoodTruck from "../assets/img/Design_sem_nome-removebg-preview 1.png";
import imgLeft from "../assets/img/6-removebg-preview 1.png";
import imgRight from "../assets/img/7-removebg-preview 1.png";

const Cadastro = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();

    const arrobaEmail = email.indexOf("@");
    const pontoEmail = email.indexOf(".com");
    const caracteresEspeciais = ["!", "@", "#", "$", "*", "&", "%"];
    const senhaTemEspecial = caracteresEspeciais.some((caractere) =>
      senha.includes(caractere)
    );

    if (!nome || !email || !senha || !confirmacaoSenha) {
      alert("Preencha todos os campos");
    } else if (arrobaEmail < 1) {
      alert("Email precisa ter @!");
    } else if (pontoEmail < 1) {
      alert("Email precisa ter uma extensão de domínio!");
    } else if (senha.length < 6 || confirmacaoSenha.length < 6) {
      alert("Senhas devem ter pelo menos 6 caracteres");
    } else if (!senhaTemEspecial) {
      alert(
        "A senha deve conter pelo menos um caractere especial (!, @, #, $, *, &, %)"
      );
    } else if (senha !== confirmacaoSenha) {
      alert("Senhas precisam ser iguais!");
    } else {
      const novoUsuario = {
        nome,
        email,
        senha,
      };

      try {
        const response = await fetch("http://localhost:3000/usuarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(novoUsuario),
        });

        if (!response.ok) {
          throw new Error("Erro ao cadastrar usuário");
        }

        alert("Cadastro realizado com sucesso");
        navigate("/login");
      } catch (error) {
        console.error("Erro:", error);
        alert("Houve um problema ao cadastrar. Tente novamente mais tarde.");
      }
    }
  };

  return (
    <main className="cadastro">
      <img
        className="img-background"
        src={imgFundoCadastro}
        alt="Background Image"
      />
      <img className="img-right" src={imgRight} alt="Right Image" />
      <section>
        <form onSubmit={handleCadastro}>
          <div className="voltarInicio">
            <Link to="/login">
              <ArrowLeft color="black" />
              Voltar
            </Link>
          </div>
          <div className="textCadastro">
            <h2>Cadastro</h2>
            <p>Boas vindas, cadastre-se e faça login</p>
          </div>
          <div className="parte-cadastro">
            <label htmlFor="input_nome">Nome:</label>
            <input
              type="text"
              id="input_nome"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
            <label htmlFor="input_email">E-mail:</label>
            <input
              type="email"
              id="input_email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="input_senha">Senha:</label>
            <input
              type="password"
              id="input_senha"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <label htmlFor="input_confirmar">Confirmar Senha:</label>
            <input
              type="password"
              id="input_confirmar"
              placeholder="Senha"
              value={confirmacaoSenha}
              onChange={(e) => setConfirmacaoSenha(e.target.value)}
              required
            />
            <button id="Cadastrar" type="submit">
              Cadastrar
            </button>
          </div>
          <div className="parte-login">
            <p>
              Já possui uma conta? Faça login <a href="/login" id="ACAD">Aqui</a>
            </p>
            <p>Cadastre-se com</p>
          </div>
        </form>
        <div className="img-foodTruck">
          <img src={imgFoodTruck} alt="Food Truck Image" />
        </div>
      </section>
      <img className="img-left" src={imgLeft} alt="Left Image" />
    </main>
  );
};

export default Cadastro;