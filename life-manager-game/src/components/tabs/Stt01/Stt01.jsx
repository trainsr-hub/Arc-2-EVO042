import React from "react";
import { useContractLogic } from "./useContractLogic";
import ContractCard from "./ContractCard";
import "./styles/Stt01Base.css"; // Kích hoạt tệp layout cơ sở cho menu nút bấm triệu hồi

export default function Stt01() {
  const { contracts, handleTakeRandomContract, handleContractAction } = useContractLogic();

  const activeContracts = contracts.filter(c => 
    c.status !== "EARNED" && c.status !== "EXPIRED" && c.status !== "CANCELLED" && c.status !== "AVAILABLE"
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div style={{ textAlign: "left" }}>
          <h2 style={{ fontSize: "14px", color: "#06b6d4", textTransform: "uppercase", margin: 0, fontWeight: "bold" }}>Chamber of Elements Planning</h2>
          <p style={{ margin: "4px 0 0 0", color: "#4b5975", fontSize: "11px" }}>Hệ thống kiến tạo nhiệm vụ tự động hóa từ lõi logic.</p>
        </div>
        <button className="matrix-summon-btn" onClick={handleTakeRandomContract}>
          Take Random Contract (Weight Pool)
        </button>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {activeContracts.map(c => (
          <ContractCard key={c.contract_id} contract={c} onAction={handleContractAction} />
        ))}
        {activeContracts.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#4b5975", border: "1px dashed #1f293d", borderRadius: "8px", fontSize: "13px" }}>
            [SYSTEM]: Trống rỗng. Không có tiến trình hành động nào khả dụng. Kích hoạt nút đúc ngẫu nhiên phía trên để săn ma trận mới.
          </div>
        )}
      </div>
    </div>
  );
}