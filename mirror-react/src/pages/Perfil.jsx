"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  LogOut,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { Header } from "../components/Header";
import { SubNavigation } from "../components/SubNavigation";
import axios from "axios";
import "../styles/Perfil.css";

export default function Perfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Estados para controlar visibilidade das senhas
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setFormData({
          name: userData.name || userData.nome || "",
          email: userData.email || "",
          phone: userData.phone || userData.telefone || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        // Se não houver usuário, mostrar erro ao invés de redirecionar
        setError("Você precisa fazer login para acessar seu perfil");
      }
    } catch (err) {
      console.error("Erro ao carregar dados do usuário:", err);
      setError("Erro ao carregar dados do perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      // Validações
      if (!formData.name || !formData.email) {
        setError("Nome e email são obrigatórios");
        return;
      }

      if (formData.newPassword || formData.confirmPassword) {
        if (!formData.currentPassword) {
          setError("Digite sua senha atual para alterar a senha");
          return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
          setError("As senhas não coincidem");
          return;
        }
        if (formData.newPassword.length < 6) {
          setError("A nova senha deve ter no mínimo 6 caracteres");
          return;
        }
      }

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Preparar dados para atualização do perfil
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };

      // Atualizar perfil (nome, email, telefone)
      await axios.put("http://localhost:8080/api/users/me", updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Se está alterando senha, usar endpoint separado
      if (formData.newPassword) {
        await axios.put(
          "http://localhost:8080/api/users/me/password",
          {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      // Atualizar localStorage com os novos dados
      const updatedUser = {
        ...user,
        name: formData.name,
        nome: formData.name,
        email: formData.email,
        phone: formData.phone,
        telefone: formData.phone,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Limpar campos de senha
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      setEditMode(false);
      alert("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setError(err.response?.data?.message || "Erro ao atualizar perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setError(null);
    // Restaurar dados originais
    setFormData({
      name: user.name || user.nome || "",
      email: user.email || "",
      phone: user.phone || user.telefone || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleLogout = () => {
    if (window.confirm("Tem certeza que deseja sair?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="containerProjeto">
        <Header titulo="Perfil" p="Seus dados pessoais" />
        <div className="perfil-loading">
          <div className="spinner"></div>
          <p>Carregando...</p>
        </div>
        <SubNavigation />
      </div>
    );
  }

  // Se não houver usuário, mostrar tela de erro com botão para login
  if (!user) {
    return (
      <div className="containerProjeto">
        <Header titulo="Perfil" p="Seus dados pessoais" />
        <main className="perfil-container">
          <div className="perfil-card">
            <div className="sem-pedidos">
              <div className="icone-vazio">👤</div>
              <h3>Você não está logado</h3>
              <p>Faça login para acessar seu perfil</p>
              {error && (
                <p style={{ color: "#dc0000", marginTop: "10px" }}>{error}</p>
              )}
              <button
                onClick={() => navigate("/login")}
                className="btn-editar"
                style={{ marginTop: "20px" }}
              >
                Ir para Login
              </button>
            </div>
          </div>
        </main>
        <SubNavigation />
      </div>
    );
  }

  return (
    <div className="containerProjeto">
      <Header titulo="Perfil" p="Seus dados pessoais" />

      <main className="perfil-container">
        <div className="perfil-card">
          {/* Avatar */}
          <div className="perfil-avatar">
            <div className="avatar-circle">
              <User size={60} color="#fff" />
            </div>
            <h2 className="perfil-nome">
              {user?.name || user?.nome || "Usuário"}
            </h2>
          </div>

          {/* Erro */}
          {error && (
            <div className="perfil-error">
              <p>{error}</p>
            </div>
          )}

          {/* Formulário */}
          <div className="perfil-form">
            <div className="form-group">
              <label>
                <User size={18} />
                <span>Nome Completo</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!editMode}
                placeholder="Seu nome completo"
              />
            </div>

            <div className="form-group">
              <label>
                <Mail size={18} />
                <span>Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!editMode}
                placeholder="seu@email.com"
              />
            </div>

            <div className="form-group">
              <label>
                <Phone size={18} />
                <span>Telefone</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!editMode}
                placeholder="(11) 99999-9999"
              />
            </div>

            {/* Seção de alteração de senha (só aparece em modo de edição) */}
            {editMode && (
              <div className="senha-section">
                <h3>Alterar Senha (opcional)</h3>

                <div className="form-group">
                  <label>
                    <Lock size={18} />
                    <span>Senha Atual</span>
                  </label>
                  <div className="input-with-icon">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      placeholder="Digite sua senha atual"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <Lock size={18} />
                    <span>Nova Senha</span>
                  </label>
                  <div className="input-with-icon">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Digite a nova senha"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    <Lock size={18} />
                    <span>Confirmar Nova Senha</span>
                  </label>
                  <div className="input-with-icon">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirme a nova senha"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="perfil-actions">
            {!editMode ? (
              <>
                <button
                  className="btn-editar"
                  onClick={() => setEditMode(true)}
                >
                  <Edit2 size={20} />
                  <span>Editar Perfil</span>
                </button>
                <button className="btn-sair" onClick={handleLogout}>
                  <LogOut size={20} />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn-salvar"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save size={20} />
                  <span>{saving ? "Salvando..." : "Salvar"}</span>
                </button>
                <button
                  className="btn-cancelar"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X size={20} />
                  <span>Cancelar</span>
                </button>
              </>
            )}
          </div>
        </div>
      </main>

      <SubNavigation />
    </div>
  );
}
