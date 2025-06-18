import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      alert("Giriş başarısız");
      return;
    }

    const data = await res.json();
    setToken(data.token);
    localStorage.setItem("token", data.token);
    navigate("/sms-manager");
    alert("Giriş başarılı");
  };

  const handleRegister = async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password}),
    });

    if (!res.ok) {
      const err = await res.text();
      alert("Kayıt başarısız: " + err);
      return;
    }

    alert("Kayıt başarılı, giriş yapabilirsiniz.");
    setIsLogin(true);
  };

  // Stil objeleri
  const containerStyle = {
    minHeight: "100vh",
    width: "100vw",
    padding: "30px 50px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#ffffff",
    color: "#000000",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  const boxStyle = {
    width: 360,
    boxShadow: "0 2px 8px rgb(0 0 0 / 0.1)",
    borderRadius: 10,
    padding: 30,
    backgroundColor: "white",
    boxSizing: "border-box",
  };

  const tabContainerStyle = {
    display: "flex",
    marginBottom: 25,
    borderBottom: "2px solid #d0d7ff",
  };

  const tabStyle = (active) => ({
    flex: 1,
    padding: 12,
    cursor: "pointer",
    fontWeight: "600",
    color: active ? "#0047b3" : "#007bff",
    borderBottom: active ? "3px solid #0047b3" : "3px solid transparent",
    textAlign: "center",
    transition: "border-bottom 0.3s",
    userSelect: "none",
  });

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    marginBottom: 20,
    fontSize: 15,
    borderRadius: 6,
    border: "1.5px solid #d0d7ff",
    outlineColor: "#007bff",
    backgroundColor: "white", // Burada arka plan beyaz yapıldı
    color: "black",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    fontSize: 16,
    fontWeight: "700",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.3s",
    userSelect: "none",
  };

  const buttonHoverStyle = {
    backgroundColor: "#0047b3",
  };

  const [btnHover, setBtnHover] = useState(false);

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          {isLogin ? "Giriş Yap" : "Kayıt Ol"}
        </h2>

        <div style={tabContainerStyle}>
          <div
            style={tabStyle(isLogin)}
            onClick={() => setIsLogin(true)}
          >
            Giriş
          </div>
          <div
            style={tabStyle(!isLogin)}
            onClick={() => setIsLogin(false)}
          >
            Kayıt
          </div>
        </div>

        <input
          style={inputStyle}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />
        <input
          style={inputStyle}
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={isLogin ? "current-password" : "new-password"}
        />

        <button
          style={btnHover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          onClick={isLogin ? handleLogin : handleRegister}
        >
          {isLogin ? "Giriş Yap" : "Kayıt Ol"}
        </button>
      </div>
    </div>
  );
}