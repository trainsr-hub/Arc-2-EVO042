// src/components/tabs/Stt01/ContractCard.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Zap, Box } from "lucide-react";

// ĐỒNG BỘ ĐĂNG KÝ: Chỉ gọi duy nhất 1 file index đại diện chứa toàn bộ các file FX
import "./styles/index.css";

// Thành phần đếm ngược thời gian thực tế phụ trách tối ưu hóa hiệu năng
function CardTimer({ expirationDate }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(expirationDate) - new Date();
      if (difference <= 0) {
        setTimeLeft("EXPIRED (Quá hạn)");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((difference / 1000 / 60) % 60);
      const secs = Math.floor((difference / 1000) % 60);

      let timeSegments = [];
      if (days > 0) timeSegments.push(`${days}d`);
      if (hrs > 0) timeSegments.push(`${hrs}h`);
      if (mins > 0) timeSegments.push(`${mins}m`);
      if (secs > 0) timeSegments.push(`${secs}s`);
      
      setTimeLeft(timeSegments.length > 0 ? timeSegments.join(" ") : "0s");
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [expirationDate]);

  return <span style={{ color: "#ef4444", fontWeight: "bold" }}>{timeLeft}</span>;
}

export default function ContractCard({ contract, onAction }) {
  const [cardState, setCardState] = useState("state-enter");

  useEffect(() => {
    const timer = setTimeout(() => {
      setCardState("state-idle");
    }, 550);
    return () => clearTimeout(timer);
  }, []);

  // TOÁN TỬ TOKENS HOÁ ĐỘNG: Tự động dịch tên Hệ sang class CSS safe-string viết thường nối vạch ngang
  const elementClass = contract.element_type 
    ? contract.element_type.toLowerCase().replace(/\s+/g, "-") 
    : "";

  // 🎲 THUẬT TOÁN ROLL GACHA MÀU SẮC (Hóa học -> Vũ trụ)
  // useMemo bảo vệ màu không bị re-roll khi cardState thay đổi
  const dynamicFlameStyles = useMemo(() => {
    if (elementClass !== "everlasting-flames") return {};

    const CHEMICAL_FLAMES = [
      '#FF0055', // Lithium (Đỏ hoa cà)
      '#FF2400', // Strontium (Đỏ son)
      '#E55B3C', // Calcium (Đỏ gạch)
      '#FFCC00', // Sodium (Vàng chanh)
      '#8CE634', // Barium (Xanh táo)
      '#00F5D4', // Copper (Lục lam)
      '#00FF66', // Boron (Xanh lá)
      '#D6AEFF', // Potassium (Tím nhạt)
      '#4D4DFF', // Cesium (Xanh lam tím)
      '#4B0082'  // Indium (Xanh chàm)
    ];

    const STELLAR_COLORS = [
      '#FF3300', // M-Class (Sao lùn đỏ)
      '#FF9900', // K-Class (Sao lùn cam)
      '#FFFFCC', // G-Class (Sao lùn vàng)
      '#F0F8FF', // F-Class (Sao trắng vàng)
      '#E0FFFF', // A-Class (Sao trắng)
      '#00FFFF'  // O/B-Class (Sao khổng lồ xanh)
    ];

    const randomStarter = CHEMICAL_FLAMES[Math.floor(Math.random() * CHEMICAL_FLAMES.length)];
    const randomEnder = STELLAR_COLORS[Math.floor(Math.random() * STELLAR_COLORS.length)];

    return {
      '--color-starter': randomStarter,
      '--color-ender': randomEnder,
    };
  }, [contract.contract_id, elementClass]);

  // Thuật toán gom cụm phần thưởng trùng nhau bảo toàn 100%
  const aggregatedRewards = Object.values(
    (contract.rewards || []).reduce((acc, reward) => {
      if (!acc[reward.id]) {
        acc[reward.id] = { ...reward, quantity: 1 };
      } else {
        acc[reward.id].quantity += 1;
      }
      return acc;
    }, {})
  );

  const triggerExitAction = (isSuccess) => {
    setCardState(isSuccess ? "state-claiming" : "state-dropping");
    const executionDelay = isSuccess ? 800 : 450;
    setTimeout(() => {
      onAction(contract.contract_id, isSuccess);
    }, executionDelay);
  };

  return (
    // Inject các biến màu CSS vào wrapper chính thông qua thuộc tính style
    <div 
      className={`cyber-contract-card ${elementClass} ${cardState}`}
      style={dynamicFlameStyles}
    >
      
      {/* 🔮 KHUNG HẠT MA TRẬN VẠN NĂNG (UNIVERSAL FX VIEWPORT) */}
      <div className="element-fx-viewport">
        <div className="fx-background-shroud"></div>
        <div className="fx-wave-layer wl-1"></div>
        <div className="fx-wave-layer wl-2"></div>
        <div className="fx-wave-layer wl-3"></div>
        <div className="fx-center-core"></div>
        <div className="fx-particle-matrix">
          <span className="fx-seed s-1"></span>
          <span className="fx-seed s-2"></span>
          <span className="fx-seed s-3"></span>
          <span className="fx-seed s-4"></span>
          <span className="fx-seed s-5"></span>
          <span className="fx-seed s-6"></span>
          <span className="fx-seed s-7"></span>
          <span className="fx-seed s-8"></span>
        </div>
        <div className="flames-burn-overlay"></div>
        <div className="wave-tsunami-surge"></div>
      </div>

      {/* KHỐI HIỂN THỊ CHỮ NỔI GIAO DIỆN (Z-INDEX CAO) */}
      <div className="card-interactive-content" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "9px", background: "var(--badge-color)", color: "#02040a", padding: "2px 8px", borderRadius: "4px", fontWeight: "bold", textTransform: "uppercase" }}>
            {contract.element_type}
          </span>
          <div style={{ fontSize: "12px" }}>
            <CardTimer expirationDate={contract.expiration_date} />
          </div>
        </div>

        <div style={{ textAlign: "center", margin: "8px 0" }}>
          <h3 style={{ fontSize: "16px", margin: "0 0 6px 0", color: "#f0f3f8", fontWeight: "bold" }}>
            [Rank {contract.rank}] ~ {contract.theme}
          </h3>
          <p style={{ fontSize: "12px", fontStyle: "italic", color: "#cbd5e1", margin: 0, opacity: 0.85 }}>
            {contract.description}
          </p>
        </div>

        <div>
          <span style={{ fontSize: "10px", color: "#4b5975", fontWeight: "bold", display: "block", marginBottom: "8px" }}>REWARDS COMPILING SPACE:</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {aggregatedRewards.map((reward, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.04)", border: "1px solid #1f293d", padding: "6px 12px", borderRadius: "4px", fontSize: "11px" }}>
                {reward.type === "PACK" ? <Box size={12} color="#ec4899" /> : <Zap size={12} color="#a855f7" />}
                <span style={{ color: reward.type === "PACK" ? "#ec4899" : "#cbd5e1" }}>
                  {reward.name}
                </span>
                <span style={{ color: "#4b5975" }}>{reward.quantity > 1 ? `(x${reward.quantity * reward.perserving})` : ""}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px" }}>
          <button onClick={() => triggerExitAction(true)} style={{ padding: "8px 18px", background: "#10b981", color: "#02040a", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" }}>Claim Harvest</button>
          <button onClick={() => triggerExitAction(false)} style={{ padding: "8px 18px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer", fontSize: "12px" }}>Drop Plan</button>
        </div>

      </div>
    </div>
  );
}