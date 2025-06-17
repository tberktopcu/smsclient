import React, { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:5252/api";

export default function SmsManager() {
    const [infos, setInfos] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingInfo, setEditingInfo] = useState(null);

    const [smsHeaderId, setSmsHeaderId] = useState("");
    const [isLocked, setIsLocked] = useState(false);
    const [templateName, setTemplateName] = useState("");
    const [smsText, setSmsText] = useState("");

    useEffect(() => {
        fetchHeaders();
        fetchInfos();
    }, []);

    async function fetchHeaders() {
        const res = await fetch(`${API_BASE_URL}/SmsHeader`);
        const data = await res.json();
        setHeaders(data);
    }

    async function fetchInfos() {
        const res = await fetch(`${API_BASE_URL}/Info`);
        const data = await res.json();
        setInfos(data);
    }

    function openModal(info = null) {
        if (info) {
            setEditingInfo(info);
            setSmsHeaderId(info.smsHeaderId);
            setIsLocked(info.isLocked);
            setTemplateName(info.templateName || "");
            setSmsText(info.smsText);
        } else {
            setEditingInfo(null);
            setSmsHeaderId(headers.length > 0 ? headers[0].id : "");
            setIsLocked(false);
            setTemplateName("");
            setSmsText("");
        }
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
    }

    async function handleSave(e) {
        e.preventDefault();

        if (!smsHeaderId || smsText.trim() === "") {
            alert("Lütfen zorunlu alanları doldurun.");
            return;
        }

        const payload = {
            smsHeaderId: Number(smsHeaderId),
            isLocked,
            templateName,
            smsText,
        };

        if (editingInfo) {
            const res = await fetch(`${API_BASE_URL}/Info/${editingInfo.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...payload, id: editingInfo.id }),
            });
            if (res.ok) {
                fetchInfos();
                closeModal();
            } else {
                alert("Güncelleme başarısız.");
            }
        } else {
            const res = await fetch(`${API_BASE_URL}/Info`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                fetchInfos();
                closeModal();
            } else {
                alert("Ekleme başarısız.");
            }
        }
    }

    async function handleDelete(id) {
        if (window.confirm("Silmek istediğinize emin misiniz?")) {
            const res = await fetch(`${API_BASE_URL}/Info/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchInfos();
            } else {
                alert("Silme başarısız.");
            }
        }
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100vw",
                padding: "30px 50px",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                backgroundColor: "#ffffff",
                color: "#000000",
                boxSizing: "border-box",
            }}
        >
            <h1 style={{ marginBottom: 20 }}>SMS Şablonları</h1>

            <button
                onClick={() => openModal()}
                style={{
                    cursor: "pointer",
                    padding: "10px 18px",
                    borderRadius: 6,
                    border: "none",
                    backgroundColor: "#007bff",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 16,
                    marginBottom: 20,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
            >
                + Yeni Ekle
            </button>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    backgroundColor: "white",
                    boxShadow: "0 2px 8px rgb(0 0 0 / 0.1)",
                    color: "#000000",
                }}
            >
                <thead style={{ backgroundColor: "#007bff", color: "white" }}>
                    <tr>
                        <th style={{ padding: 12, textAlign: "left" }}>Sms Başlığı</th>
                        <th style={{ padding: 12, textAlign: "center", width: 100 }}>Kilitli Mi?</th>
                        <th style={{ padding: 12, textAlign: "left" }}>Şablon Adı</th>
                        <th style={{ padding: 12, textAlign: "left" }}>Sms Mesaj Metni</th>
                        <th style={{ padding: 12, textAlign: "center", width: 140 }}>İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {infos.length === 0 && (
                        <tr>
                            <td colSpan={5} style={{ padding: 16, textAlign: "center", color: "#777" }}>
                                Kayıtlı SMS bulunmamaktadır.
                            </td>
                        </tr>
                    )}
                    {infos.map((info) => {
                        const headerObj = headers.find((h) => h.id === info.smsHeaderId);
                        return (
                            <tr
                                key={info.id}
                                style={{
                                    borderBottom: "1px solid #ddd",
                                    cursor: "default",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f7ff")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                            >
                                <td style={{ padding: 12 }}>{headerObj ? headerObj.header : "Bilinmiyor"}</td>
                                <td style={{ padding: 12, textAlign: "center" }}>
                                    {info.isLocked ? "Evet" : "Hayır"}
                                </td>
                                <td style={{ padding: 12 }}>{info.templateName || "-"}</td>
                                <td style={{ padding: 12, whiteSpace: "pre-wrap" }}>{info.smsText}</td>
                                <td
                                    style={{
                                        padding: 12,
                                        textAlign: "center",
                                        display: "flex",
                                        justifyContent: "center",
                                        gap: 10,
                                    }}
                                >
                                    <button
                                        onClick={() => openModal(info)}
                                        style={{
                                            padding: "6px 12px",
                                            borderRadius: 6,
                                            border: "1.5px solid #007bff",
                                            backgroundColor: "white",
                                            color: "#007bff",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            transition: "all 0.2s",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = "#007bff";
                                            e.currentTarget.style.color = "white";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = "white";
                                            e.currentTarget.style.color = "#007bff";
                                        }}
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        onClick={() => handleDelete(info.id)}
                                        style={{
                                            padding: "6px 12px",
                                            borderRadius: 6,
                                            border: "1.5px solid #dc3545",
                                            backgroundColor: "white",
                                            color: "#dc3545",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            transition: "all 0.2s",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = "#dc3545";
                                            e.currentTarget.style.color = "white";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = "white";
                                            e.currentTarget.style.color = "#dc3545";
                                        }}
                                    >
                                        Sil
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Popup */}
            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.3)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                    }}
                    onClick={closeModal}
                >
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            padding: 24,
                            borderRadius: 8,
                            minWidth: 350,
                            maxWidth: "90vw",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
                            color: "#000000",
                            fontWeight: "bold",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{ marginBottom: 16, color: "#000000" }}>
                            {editingInfo ? "Düzenle" : "Yeni Ekle"}
                        </h2>
                        <form onSubmit={handleSave}>
                            <div style={{ marginBottom: 12 }}>
                                <label
                                    htmlFor="smsHeader"
                                    style={{ display: "block", marginBottom: 4, color: "#000000" }}
                                >
                                    Sms Başlığı:
                                </label>
                                <select
                                    id="smsHeader"
                                    value={smsHeaderId}
                                    onChange={(e) => setSmsHeaderId(e.target.value)}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: 8,
                                        borderRadius: 4,
                                        border: "1px solid #ccc",
                                        color: "#000000",
                                        backgroundColor: "#ffffff",
                                    }}
                                >
                                    {headers.map((h) => (
                                        <option key={h.id} value={h.id}>
                                            {h.header}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ marginBottom: 12 }}>
                                <label
                                    htmlFor="isLocked"
                                    style={{ color: "#000000", marginRight: 8, fontWeight: "normal" }}
                                >
                                    Kilitli Mi?:
                                </label>
                                <input
                                    id="isLocked"
                                    type="checkbox"
                                    checked={isLocked}
                                    onChange={(e) => setIsLocked(e.target.checked)}
                                    style={{ transform: "scale(1.3)", cursor: "pointer" }}
                                />
                            </div>

                            <div style={{ marginBottom: 12 }}>
                                <label
                                    htmlFor="templateName"
                                    style={{ display: "block", marginBottom: 4, color: "#000000" }}
                                >
                                    Şablon Adı:
                                </label>
                                <input
                                    id="templateName"
                                    type="text"
                                    value={templateName}
                                    onChange={(e) => setTemplateName(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: 8,
                                        borderRadius: 4,
                                        border: "1px solid #ccc",
                                        color: "#000000",
                                        backgroundColor: "#ffffff",
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: 12 }}>
                                <label
                                    htmlFor="smsText"
                                    style={{ display: "block", marginBottom: 4, color: "#000000" }}
                                >
                                    Sms Mesaj Metni:
                                </label>
                                <textarea
                                    id="smsText"
                                    rows={4}
                                    value={smsText}
                                    onChange={(e) => setSmsText(e.target.value)}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: 8,
                                        borderRadius: 4,
                                        border: "1px solid #ccc",
                                        color: "#000000",
                                        backgroundColor: "#ffffff",
                                        resize: "vertical",
                                    }}
                                />
                            </div>

                            <div style={{ textAlign: "right" }}>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    style={{
                                        marginRight: 12,
                                        padding: "8px 16px",
                                        cursor: "pointer",
                                        backgroundColor: "#ccc",
                                        border: "none",
                                        borderRadius: 4,
                                    }}
                                >
                                    İptal
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: "8px 16px",
                                        cursor: "pointer",
                                        backgroundColor: "#007bff",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: 4,
                                    }}
                                >
                                    {editingInfo ? "Güncelle" : "Ekle"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
