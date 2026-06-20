// src/components/tabs/Stt02/Stt02.jsx
import React, { useState } from "react";
import { Clock, RefreshCw } from "lucide-react";

export default function Stt02({ shopData, onConvertTime, onPurchaseItem }) {
  const shopTabs = [
    { id: "GACHA", label: "Gacha Core Terminal" }, 
    { id: "CONSUMABLES", label: "Market Consumables" }, 
    { id: "ITEMS", label: "Market Items" }
  ];
  const [activeShopTab, setActiveShopTab] = useState("GACHA");

  // Hàm chuyển đổi chuỗi tài nguyên thời gian chi tiết
  const formatFullTimeResource = (timeInYear) => {
    const totalDays = timeInYear * 365;
    const years = Math.floor(totalDays / 365);
    const remainingDays = totalDays % 365;
    const months = Math.floor(remainingDays / 30);
    const days = Math.floor(remainingDays % 30);
    const hours = Math.floor((remainingDays % 1) * 24);
    const minutes = Math.floor((((remainingDays % 1) * 24) % 1) * 60);

    const units = [
      { label: "Year", value: years }, 
      { label: "Month", value: months }, 
      { label: "Day", value: days }, 
      { label: "Hour", value: hours }, 
      { label: "Minute", value: minutes }
    ];
    const active = units.filter(u => u.value > 0);
    return active.length === 0 ? "0 Minutes" : active.map(u => `${u.value} ${u.label}${u.value > 1 ? "s" : ""}`).join(", ");
  };

  return (
    <div>
      <div style={{ background: "linear-gradient(180deg, #090d16 0%, #111a2e 100%)", padding: "24px", borderRadius: "10px", border: "1px solid #1f293d", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", color: "#8892b0", fontSize: "11px", fontWeight: "bold" }}><Clock size={13} color="#a855f7" /><span>OMNI TIME CORE RESERVE LIQUIDITY</span></div>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#a855f7" }}>{formatFullTimeResource(shopData.time_in_year)}</div>
        </div>
        <button onClick={onConvertTime} style={{ padding: "12px 18px", background: "transparent", border: "1px solid #10b981", color: "#10b981", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
          <RefreshCw size={14}/> Sacrifice 1 Month to VND Cash
        </button>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", borderBottom: "1px solid #1f293d", paddingBottom: "12px" }}>
        {shopTabs.map(tab => (<button key={tab.id} onClick={() => setActiveShopTab(tab.id)} style={{ padding: "8px 16px", background: activeShopTab === tab.id ? "#a855f7" : "transparent", color: activeShopTab === tab.id ? "#02040a" : "#8892b0", border: "1px solid #1f293d", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "11px" }}>{tab.label}</button>))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {shopData.shop_items.filter(item => item.tab === activeShopTab).map(item => (
          <div key={item.id} style={{ padding: "24px", background: "#090d16", borderRadius: "8px", border: "1px solid #1f293d", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <h3 style={{ fontSize: "15px", margin: 0, color: "#f0f3f8" }}>{item.name}</h3>
            <button onClick={() => onPurchaseItem(item.id)} style={{ marginTop: "20px", width: "100%", padding: "12px", background: "transparent", border: "1px solid #a855f7", color: "#a855f7", borderRadius: "6px", fontWeight: "bold", fontSize: "12px", cursor: "pointer" }}>Deduct {item.cost_energy} Energy</button>
          </div>
        ))}
      </div>
    </div>
  );
}