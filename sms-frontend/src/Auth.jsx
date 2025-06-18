import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(null);

    const navigate = useNavigate();

    const handleLogin = async () => {
        setMessage("");
        const res = await fetch(`${baseUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            setMessage("Email veya Şifre hatalı");
            setMessageType("error");
            return;
        }

        const data = await res.json();
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setMessage("Giriş başarılı!");
        setMessageType("success");
        navigate("/sms-manager");
    };

    const handleRegister = async () => {
        setMessage("");
        const res = await fetch(`${baseUrl}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const err = await res.text();
            setMessage("Kayıt başarısız: " + err);
            setMessageType("error");
            return;
        }

        setMessage("Kayıt başarılı, giriş yapabilirsiniz.");
        setMessageType("success");
        setIsLogin(true);
    };

    // Pop-up (modal) stil objeleri
    const modalOverlayStyle = {
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    };

    const modalStyle = {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 8,
        width: 300,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        position: "relative",
        textAlign: "center",
    };

    const closeButtonStyle = {
        position: "absolute",
        top: 8,
        right: 12,
        border: "none",
        background: "transparent",
        fontSize: 20,
        cursor: "pointer",
        fontWeight: "bold",
    };

    const messageTextStyle = {
        color: messageType === "error" ? "#b00020" : "#006400",
        fontWeight: "600",
    };

    // Diğer önceki stiller ve component kodu burada olacak...
    // Sadece modal ve mesaj gösterimini ekliyoruz.

    return (
        <div style={{
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
        }}>
            <div style={{
                width: 360,
                boxShadow: "0 2px 8px rgb(0 0 0 / 0.1)",
                borderRadius: 10,
                padding: 30,
                backgroundColor: "white",
                boxSizing: "border-box",
            }}>
                <h2 style={{ textAlign: "center", marginBottom: 20 }}>
                    {isLogin ? "Giriş Yap" : "Kayıt Ol"}
                </h2>

                <div style={{
                    display: "flex",
                    marginBottom: 25,
                    borderBottom: "2px solid #d0d7ff",
                }}>
                    <div
                        style={{
                            flex: 1,
                            padding: 12,
                            cursor: "pointer",
                            fontWeight: "600",
                            color: isLogin ? "#0047b3" : "#007bff",
                            borderBottom: isLogin ? "3px solid #0047b3" : "3px solid transparent",
                            textAlign: "center",
                            transition: "border-bottom 0.3s",
                            userSelect: "none",
                        }}
                        onClick={() => setIsLogin(true)}
                    >
                        Giriş
                    </div>
                    <div
                        style={{
                            flex: 1,
                            padding: 12,
                            cursor: "pointer",
                            fontWeight: "600",
                            color: !isLogin ? "#0047b3" : "#007bff",
                            borderBottom: !isLogin ? "3px solid #0047b3" : "3px solid transparent",
                            textAlign: "center",
                            transition: "border-bottom 0.3s",
                            userSelect: "none",
                        }}
                        onClick={() => setIsLogin(false)}
                    >
                        Kayıt
                    </div>
                </div>

                <input
                    style={{
                        width: "100%",
                        padding: "10px 12px",
                        marginBottom: 20,
                        fontSize: 15,
                        borderRadius: 6,
                        border: "1.5px solid #d0d7ff",
                        outlineColor: "#007bff",
                        backgroundColor: "white",
                        color: "black",
                        boxSizing: "border-box",
                    }}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                />
                <input
                    style={{
                        width: "100%",
                        padding: "10px 12px",
                        marginBottom: 20,
                        fontSize: 15,
                        borderRadius: 6,
                        border: "1.5px solid #d0d7ff",
                        outlineColor: "#007bff",
                        backgroundColor: "white",
                        color: "black",
                        boxSizing: "border-box",
                    }}
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={isLogin ? "current-password" : "new-password"}
                />

                <button
                    style={{
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
                    }}
                    onClick={isLogin ? handleLogin : handleRegister}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0047b3")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
                >
                    {isLogin ? "Giriş Yap" : "Kayıt Ol"}
                </button>
            </div>

            {/* Mesaj varsa pop-up modal göster */}
            {message && (
                <div style={modalOverlayStyle} onClick={() => setMessage("")}>
                    <div style={modalStyle} onClick={e => e.stopPropagation()}>
                        <button
                            style={closeButtonStyle}
                            onClick={() => setMessage("")}
                            aria-label="Close message"
                        >
                            &times;
                        </button>
                        <div style={messageTextStyle}>{message}</div>
                    </div>
                </div>
            )}
        </div>
    );
}
