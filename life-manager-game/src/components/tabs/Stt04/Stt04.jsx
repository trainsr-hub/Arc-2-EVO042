// src/components/tabs/Stt04/Stt04.jsx
import React, { useState } from "react";
import { BarChart3 } from "lucide-react";

export default function Stt04({ ledgerHistory, onAddLedger }) {
  const reportCategories = [
    { name: "Monthly Real Salary Earned (VND)", ratio: 0.00002 },
    { name: "Finished Book Reading Core Blocks (Pages)", ratio: 0.0001 },
    { name: "High-Focus Programming Hours Ticked", ratio: 0.0005 }
  ];

  const [ledgerAmount, setLedgerAmount] = useState("");
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);

  const getLedgerStatistics = () => {
    const totals = {};
    ledgerHistory.forEach(item => {
      totals[item.category] = (totals[item.category] || 0) + item.amount;
    });
    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
  };

  const activeOption = reportCategories[selectedCategoryIdx] || reportCategories[0];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
      <div>
        <h2 style={{ fontSize: "13px", color: "#4b5975", marginBottom: "16px", textTransform: "uppercase" }}>Commit Reality Result Report (Gặt Trái Ngọt)</h2>
        <div style={{ background: "#090d16", padding: "24px", borderRadius: "8px", border: "1px solid #1f293d", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "11px", color: "#8892b0", display: "block", marginBottom: "6px", fontWeight: "bold" }}>1. ANCHOR GENERATED RESOURCE SYSTEM:</label>
            <select disabled style={{ width: "100%", padding: "12px", background: "#111", border: "1px solid #1f293d", color: "#06b6d4", borderRadius: "4px", fontSize: "13px" }}>
              <option value="TIME_GAIN">OMNI CORE TIME ASSET (BƠM TĂNG QUỸ THỜI GIAN)</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: "11px", color: "#8892b0", display: "block", marginBottom: "6px", fontWeight: "bold" }}>2. QUANTIFIABLE RESULT METRIC AMOUNT:</label>
            <input type="number" placeholder="0.00" value={ledgerAmount} onChange={e => setLedgerAmount(e.target.value)} style={{ width: "100%", padding: "12px", background: "#02040a", border: "1px solid #1f293d", color: "#fff", borderRadius: "4px", fontSize: "13px" }}/>
          </div>
          <div>
            <label style={{ fontSize: "11px", color: "#8892b0", display: "block", marginBottom: "6px", fontWeight: "bold" }}>3. TARGET HARVEST FIELD & EMBEDDED RATIO MULTIPLIER:</label>
            <select value={selectedCategoryIdx} onChange={e => setSelectedCategoryIdx(parseInt(e.target.value))} style={{ width: "100%", padding: "12px", background: "#02040a", border: "1px solid #1f293d", color: "#fff", borderRadius: "4px", fontSize: "13px" }}>
              {reportCategories.map((opt, idx) => (<option key={idx} value={idx}>{opt.name} (Preset Ratio: x{opt.ratio})</option>))}
            </select>
          </div>
          <div style={{ background: "rgba(6,182,212,0.04)", border: "1px dashed rgba(6,182,212,0.2)", padding: "12px", borderRadius: "4px", fontSize: "12px", color: "#06b6d4" }}>
            Chrono Formula Yield Calculations: <strong>{(parseFloat(ledgerAmount || 0) * activeOption.ratio).toFixed(6)} Years</strong> sẽ được tiêm trực tiếp vào lõi thời gian.
          </div>
          <button onClick={() => { onAddLedger(activeOption.name, "TIME_GAIN", ledgerAmount, activeOption.ratio); setLedgerAmount(""); }} style={{ width: "100%", padding: "14px", background: "#06b6d4", color: "#02040a", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", fontSize: "13px" }}>Commit Execution Metrics</button>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: "13px", color: "#4b5975", marginBottom: "16px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}><BarChart3 size={15}/> Lifeline Generation Analysis</h2>
        <div style={{ background: "#090d16", padding: "24px", borderRadius: "8px", border: "1px solid #1f293d", marginBottom: "20px" }}>
          <span style={{ fontSize: "11px", color: "#8892b0" }}>TOP SKELETAL TIME GENERATORS SECTORS:</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "14px" }}>
            {getLedgerStatistics().slice(0, 3).map(([key, val], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", paddingBottom: "6px", borderBottom: "1px dashed #1f293d" }}>
                <span style={{ color: "#f0f3f8" }}>{i+1}. {key}</span>
                <span style={{ color: "#10b981", fontWeight: "bold" }}>+{val.toFixed(5)} Years</span>
              </div>
            ))}
          </div>
        </div>

        <h2 style={{ fontSize: "13px", color: "#4b5975", marginBottom: "12px", textTransform: "uppercase" }}>Chrono Injection Logs</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "180px", overflowY: "auto" }}>
          {ledgerHistory.map(log => (
            <div key={log.id} style={{ padding: "10px 14px", background: "#090d16", borderRadius: "4px", fontSize: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #1f293d" }}>
              <span>{log.category}</span>
              <span style={{ color: "#10b981", fontWeight: "bold" }}>+{log.amount.toFixed(5)} Years</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}