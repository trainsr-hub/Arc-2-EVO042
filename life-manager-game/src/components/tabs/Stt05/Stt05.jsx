// src/components/tabs/Stt05/Stt05.jsx
import React, { useState, useEffect } from "react";

export default function Stt05({ library }) {
  // Trích xuất tự động danh mục độc nhất từ Mock Data
  const libraryTabs = Array.from(new Set(library.map(item => item.category || "UNCLASSIFIED")))
    .map(cat => ({ id: cat, label: cat.toUpperCase() }));

  const [activeLibTab, setActiveLibTab] = useState("");

  // Tự động kích hoạt phân mục đầu tiên khi có dữ liệu đầu vào
  useEffect(() => {
    if (libraryTabs.length > 0 && !activeLibTab) {
      setActiveLibTab(libraryTabs[0].id);
    }
  }, [library, libraryTabs, activeLibTab]);

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", borderBottom: "1px solid #1f293d", paddingBottom: "12px" }}>
        {libraryTabs.map(tab => (<button key={tab.id} onClick={() => setActiveLibTab(tab.id)} style={{ padding: "8px 16px", background: activeLibTab === tab.id ? "#ec4899" : "transparent", color: activeLibTab === tab.id ? "#02040a" : "#8892b0", border: "1px solid #1f293d", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "11px" }}>{tab.label}</button>))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {library.filter(item => (item.category || "UNCLASSIFIED") === activeLibTab).map(item => (
          <div key={item.id} style={{ padding: "14px 18px", background: "#090d16", borderRadius: "6px", border: "1px solid #1f293d", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h4 style={{ fontSize: "14px", margin: 0, color: "#f0f3f8" }}>{item.name}</h4>
              <span style={{ fontSize: "11px", color: "#4b5975" }}>Discovery Epoch logged: {item.unlocked_date}</span>
            </div>
            <span style={{ fontSize: "10px", fontWeight: "bold", padding: "3px 8px", borderRadius: "4px", background: "rgba(236,72,153,0.1)", color: "#ec4899" }}>{item.rarity}</span>
          </div>
        ))}
        {library.filter(item => (item.category || "UNCLASSIFIED") === activeLibTab).length === 0 && (
          <div style={{ padding: "20px", color: "#4b5975" }}>Chưa mở khóa bản ghi dữ liệu lịch sử nào trong phân mục này.</div>
        )}
      </div>
    </div>
  );
}