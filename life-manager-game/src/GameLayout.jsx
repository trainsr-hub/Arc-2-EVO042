// src/GameLayout.jsx
import React from "react";
import { Terminal, ShoppingBag, Package, Receipt, Layers, Award, Zap, Banknote, LogOut } from "lucide-react";

// Kích hoạt cổng kết nối lấy dữ liệu dùng chung cô lập
import { useData } from "./context/DataContext"; 

// Khai báo import các Tab Component phân rã độc lập
import Stt01 from "./components/tabs/Stt01/Stt01";
import Stt02 from "./components/tabs/Stt02/Stt02";
import Stt03 from "./components/tabs/Stt03/Stt03";
import Stt04 from "./components/tabs/Stt04/Stt04";
import Stt05 from "./components/tabs/Stt05/Stt05";

export default function GameLayout({ currentTab, setCurrentTab }) {
  // Rút trực tiếp các lõi dữ liệu cần thiết từ DataContext mà không cần thông qua App.jsx trung gian
  const { 
    username, 
    isDevMode, 
    saveStatus, 
    shopData,
    contracts,
    library,
    itemsInventory,
    consumablesInventory,
    ledgerHistory,
    setShopData,
    setConsumablesInventory,
    setLedgerHistory,
    setHasUnsavedChanges
  } = useData();

  // Tự động tính toán chỉ số Tier phi tuyến tính ngay tại Header dựa trên quỹ thời gian thực
  const timeInYear = shopData?.time_in_year !== undefined ? shopData.time_in_year : 0;
  const computedTier = timeInYear < 0 
    ? Math.log(Math.abs(timeInYear) + 1) * -1.516754 
    : Math.log(timeInYear + 1) * 1.516754;
  const tier = parseFloat((Math.round(computedTier * 10) / 10).toFixed(1));

  // Hàm xử lý đăng xuất cục bộ
  const handleLogoutDatabase = () => {
    if (window.confirm("Ngắt kết nối node dữ liệu mạng lưới và xóa mã định danh memory session?")) {
      localStorage.removeItem("BYODB_USER_ID");
      localStorage.removeItem("BYODB_CONNECTION_URI");
      window.location.reload();
    }
  };

  // --- HÀM CẦU NỐI TẠM THỜI DÀNH CHO CÁC TAB CHƯA PHÂN RÃ HOÀN TOÀN ---
  const handleConvertTimeToMoney = () => {
    if (shopData.time_in_year < 0.0833) return alert("Quỹ thời gian tích lũy không đủ 1 tháng!");
    setShopData(prev => {
      const updated = { ...prev };
      updated.time_in_year -= 0.0833;
      const totalMinutesOwned = prev.time_in_year * 365 * 24 * 60;
      updated.money_vnd += Math.round(totalMinutesOwned * (10000 / 157788));
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  const handlePurchaseShopItem = (itemId) => {
    const itemToBuy = shopData.shop_items.find(i => i.id === itemId);
    if (!itemToBuy || shopData.energy < itemToBuy.cost_energy) return alert("Không đủ năng lượng!");
    setShopData(prev => ({ ...prev, energy: prev.energy - itemToBuy.cost_energy }));
    alert(`Mua thành công: ${itemToBuy.name}`);
    setHasUnsavedChanges(true);
  };

  const handleNewLedgerSpend = (categoryName, resourceType, amountInput, ratioValue) => {
    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) return;
    const actualTimeGain = amount * ratioValue;
    setShopData(prev => ({ ...prev, time_in_year: prev.time_in_year + actualTimeGain }));
    setLedgerHistory(prev => [{ id: `log_${Date.now()}`, category: categoryName, resource_type: "TIME_BOOST", amount: actualTimeGain, timestamp: new Date().toISOString() }, ...prev]);
    setHasUnsavedChanges(true);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", minHeight: "100vh", backgroundColor: "#02040a", color: "#f0f3f8", fontFamily: "monospace" }}>
      
      {/* RÌA TRÁI: DÃY TABS MENU ĐIỀU HƯỚNG DỌC CHÍNH ĐỨNG ĐỘC LẬP */}
      <nav style={{ background: "#090d16", borderRight: "1px solid #1f293d", padding: "30px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
        <button onClick={() => setCurrentTab("MAIN")} style={{ width: "52px", height: "50px", borderRadius: "12px", border: "1px solid #1f293d", background: currentTab === "MAIN" ? "#06b6d4" : "transparent", color: currentTab === "MAIN" ? "#02040a" : "#8892b0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Terminal size={20} /></button>
        <button onClick={() => setCurrentTab("SHOP")} style={{ width: "52px", height: "50px", borderRadius: "12px", border: "1px solid #1f293d", background: currentTab === "SHOP" ? "#a855f7" : "transparent", color: currentTab === "SHOP" ? "#02040a" : "#8892b0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ShoppingBag size={20} /></button>
        <button onClick={() => setCurrentTab("INVENTORY")} style={{ width: "52px", height: "50px", borderRadius: "12px", border: "1px solid #1f293d", background: currentTab === "INVENTORY" ? "#10b981" : "transparent", color: currentTab === "INVENTORY" ? "#02040a" : "#8892b0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Package size={20} /></button>
        <button onClick={() => setCurrentTab("LEDGER")} style={{ width: "52px", height: "50px", borderRadius: "12px", border: "1px solid #1f293d", background: currentTab === "LEDGER" ? "#eab308" : "transparent", color: currentTab === "LEDGER" ? "#02040a" : "#8892b0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Receipt size={20} /></button>
        <button onClick={() => setCurrentTab("LIBRARY")} style={{ width: "52px", height: "50px", borderRadius: "12px", border: "1px solid #1f293d", background: currentTab === "LIBRARY" ? "#ec4899" : "transparent", color: currentTab === "LIBRARY" ? "#02040a" : "#8892b0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Layers size={20} /></button>
      </nav>

      {/* VIEWPORT CONTAINER SECTOR */}
      <div style={{ padding: "40px" }}>
        
        {/* UPPER PANEL HEADER BAR - HIỂN THỊ CHỈ SỐ ĐỘC LẬP TỰ ĐỘNG CHUYỂN HOÀ LÀM SẠCH BUG CRASH */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1f293d", paddingBottom: "20px", marginBottom: "32px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1 style={{ fontSize: "20px", margin: 0, color: "#06b6d4", fontWeight: "bold" }}>NODE // {username}</h1>
              {!isDevMode && (
                <button onClick={handleLogoutDatabase} style={{ background: "transparent", border: "none", color: "#6b7280", cursor: "pointer", display: "flex", alignItems: "center" }} title="Disconnect Node DB"><LogOut size={14}/></button>
              )}
            </div>
            <p style={{ margin: "4px 0 0 0", color: isDevMode ? "#eab308" : "#4b5975", fontSize: "11px" }}>
              Context Mode: {isDevMode ? "DEVELOPER BYPASS (Auto-Save Offline)" : `PIPELINE STATUS: [${saveStatus}]`}
            </p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ background: "#090d16", border: "1px solid #1f293d", padding: "10px 18px", borderRadius: "6px" }}><Award size={14} color="#06b6d4" /><span> Tier: <strong style={{ color: "#06b6d4" }}>{tier.toFixed(1)}</strong></span></div>
            <div style={{ background: "#090d16", border: "1px solid #1f293d", padding: "10px 18px", borderRadius: "6px" }}><Zap size={14} color="#a855f7" /><span> Energy: <strong style={{ color: "#a855f7" }}>{shopData?.energy || 0}E</strong></span></div>
            <div style={{ background: "#090d16", border: "1px solid #1f293d", padding: "10px 14px", borderRadius: "6px" }}><Banknote size={14} color="#10b981" /><span> Money: <strong style={{ color: "#10b981" }}>{(shopData?.money_vnd || 0).toLocaleString()} VND</strong></span></div>
          </div>
        </header>

        {/* PHÂN PHỐI ĐIỀU HƯỚNG THEO TRIẾT LÝ SẠCH CHUẨN KIẾN TRÚC */}
        {/* Tab 01 đã phân rã hoàn chỉnh: Tinh gọn tuyệt đối không cần nhận Props rác */}
        {currentTab === "MAIN" && <Stt01 />}

        {/* Các Tab còn lại được bắc cầu dữ liệu từ Context ra để chờ bạn tự tay refactor tách file tiếp theo */}
        {currentTab === "SHOP" && <Stt02 shopData={shopData} onConvertTime={handleConvertTimeToMoney} onPurchaseItem={handlePurchaseShopItem} />}
        {currentTab === "INVENTORY" && <Stt03 itemsInventory={itemsInventory} consumablesInventory={consumablesInventory} />}
        {currentTab === "LEDGER" && <Stt04 ledgerHistory={ledgerHistory} onAddLedger={handleNewLedgerSpend} />}
        {currentTab === "LIBRARY" && <Stt05 library={library} />}

      </div>
    </div>
  );
}