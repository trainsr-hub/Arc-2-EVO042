// src/components/tabs/Stt03/Stt03.jsx
import React, { useState } from "react";
import { Package } from "lucide-react";

export default function Stt03({ itemsInventory, consumablesInventory }) {
  const inventoryTabs = [
    { id: "ITEMS_INV", label: "Items Inventory (Túi Đồ)" }, 
    { id: "CSM_INV", label: "Consumables Storage (Kho)" }
  ];
  const [activeInvTab, setActiveInventoryTab] = useState("ITEMS_INV");

  return (
    <div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", borderBottom: "1px solid #1f293d", paddingBottom: "12px" }}>
        {inventoryTabs.map(tab => (<button key={tab.id} onClick={() => setActiveInventoryTab(tab.id)} style={{ padding: "8px 16px", background: activeInvTab === tab.id ? "#10b981" : "transparent", color: activeInvTab === tab.id ? "#02040a" : "#8892b0", border: "1px solid #1f293d", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "11px" }}>{tab.label}</button>))}
      </div>

      {activeInvTab === "ITEMS_INV" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {itemsInventory.map(item => (
            <div key={item.id} style={{ padding: "18px", background: "#090d16", borderRadius: "8px", border: "1px solid #1f293d", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h4 style={{ fontSize: "15px", margin: 0, color: "#f0f3f8" }}>{item.name}</h4>
                <span style={{ fontSize: "11px", color: "#4b5975" }}>Required Cast Cost: {item.mana_cost || 15} MP</span>
              </div>
              <span style={{ fontSize: "11px", fontWeight: "bold", background: "rgba(16,185,129,0.1)", color: "#10b981", padding: "4px 10px", borderRadius: "4px" }}>LV {item.level || 1}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {consumablesInventory.map(csm => (
            <div key={csm.id} style={{ padding: "16px", background: "#090d16", borderRadius: "6px", border: "1px solid #1f293d", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Package size={16} color="#10b981"/>
                <span>{csm.name}</span>
              </div>
              <span style={{ fontSize: "12px", color: "#10b981", fontWeight: "bold" }}>Quantity Balance: x{csm.quantity}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}