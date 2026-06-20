// src/context/DataContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

import devConfig from "../mockData/user.json";
import mockContracts from "../mockData/contracts.json";
import mockShop from "../mockData/shop.json";
import mockLibrary from "../mockData/library.json";
import initialItems from "../mockData/items.json";
import initialConsumables from "../mockData/consumables.json";
import initialLedger from "../mockData/ledger.json";

// CHUYỂN DỊCH LOGIC LÕI: Hàm tính toán Tier linh hoạt theo trục thời gian thực
export const calculateTier = (timeInYear) => {
  if (timeInYear === undefined || isNaN(timeInYear)) return 0;
  const computedTier = timeInYear < 0 
    ? Math.log(Math.abs(timeInYear) + 1) * -1.516754 
    : Math.log(timeInYear + 1) * 1.516754;
  return parseFloat((Math.round(computedTier * 10) / 10).toFixed(1));
};

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [isDevMode] = useState(devConfig.is_dev_mode);
  const [isAuthenticated] = useState(() => {
    if (devConfig.is_dev_mode) return true;
    return !!localStorage.getItem("BYODB_CONNECTION_URI");
  });

  const [saveStatus, setSaveStatus] = useState("Synchronized");
  const [contracts, setContracts] = useState([]);
  const [shopData, setShopData] = useState({
    time_in_year: 0, energy: 0, money_vnd: 0,
    energy_flames: 0, energy_tidal: 0, energy_stars: 0, energy_void: 0, energy_polarity: 0,
    shop_items: []
  });
  const [library, setLibrary] = useState([]);
  const [itemsInventory, setItemsInventory] = useState([]);
  const [consumablesInventory, setConsumablesInventory] = useState([]);
  const [ledgerHistory, setLedgerHistory] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Tự động tính toán Tier Single Source of Truth dựa trên shopData thực tế
  const tier = calculateTier(shopData?.time_in_year);

  // LUỒNG KHỞI TẠO ĐA NGUỒN (Giữ nguyên logic API cũ của bạn)
  useEffect(() => {
    if (isDevMode) {
      setContracts(mockContracts.map(c => ({ ...c, status: c.status || "AVAILABLE" })));
      setShopData({
        ...mockShop,
        shop_items: mockShop.shop_items || []
      });
      setLibrary(mockLibrary);
      setItemsInventory(initialItems);
      setConsumablesInventory(initialConsumables);
      setLedgerHistory(initialLedger);
      setSaveStatus("OFFLINE_DEV_MODE");
    } else {
      const fetchDataFromBackend = async () => {
        setSaveStatus("Connecting Cluster...");
        try {
          const response = await fetch("http://localhost:5000/api/get-game-state", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              connectionUri: localStorage.getItem("BYODB_CONNECTION_URI"),
              userId: localStorage.getItem("BYODB_USER_ID")
            })
          });
          const resData = await response.json();
          if (resData.status === "SUCCESS") {
            setContracts(resData.payload.contracts || []);
            setShopData(resData.payload.shopData);
            setLibrary(resData.payload.library || []);
            setItemsInventory(resData.payload.itemsInventory || []);
            setConsumablesInventory(resData.payload.consumablesInventory || []);
            setLedgerHistory(resData.payload.ledgerHistory || []);
            setSaveStatus("Synchronized");
          }
        } catch (err) {
          setSaveStatus("API Error - Fallback to Local Session");
        }
      };
      if (isAuthenticated) fetchDataFromBackend();
    }
  }, [isDevMode, isAuthenticated]);

  // LUỒNG ĐỒNG BỘ AUTO-SAVE (Giữ nguyên logic gốc)
  useEffect(() => {
    if (isDevMode || !isAuthenticated || !hasUnsavedChanges) return;

    setSaveStatus("Saving changes...");
    const saveTimeout = setTimeout(async () => {
      try {
        const response = await fetch("http://localhost:5000/api/save-game", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            connectionUri: localStorage.getItem("BYODB_CONNECTION_URI"),
            userId: localStorage.getItem("BYODB_USER_ID"),
            payload: { shopData, itemsInventory, consumablesInventory, ledgerHistory, contracts }
          })
        });
        const resData = await response.json();
        if (resData.status === "SUCCESS") {
          setHasUnsavedChanges(false);
          setSaveStatus("Synchronized");
        }
      } catch (err) {
        setSaveStatus("Sync Pipeline Interrupted");
      }
    }, 5000);

    return () => clearTimeout(saveTimeout);
  }, [hasUnsavedChanges, shopData, itemsInventory, consumablesInventory, ledgerHistory, contracts, isDevMode, isAuthenticated]);

  const value = {
    isDevMode, isAuthenticated, saveStatus, username: devConfig.dev_username,
    contracts, setContracts, shopData, setShopData, library, itemsInventory, setItemsInventory,
    consumablesInventory, setConsumablesInventory, ledgerHistory, setLedgerHistory, setHasUnsavedChanges,
    tier,          // Cung cấp trực tiếp data Tier đã tính sẵn cho toàn app
    calculateTier  // Cung cấp hàm linh hoạt nếu các component khác muốn "dự phóng" Tier tương lai
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData phải được đặt trong DataProvider");
  return context;
}