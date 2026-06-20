// src/App.jsx
import React, { useState } from "react";
import { DataProvider } from "./context/DataContext";
import GameLayout from "./GameLayout";

export default function App() {
  const [currentTab, setCurrentTab] = useState("MAIN");

  return (
    <DataProvider>
      <GameLayout currentTab={currentTab} setCurrentTab={setCurrentTab} />
    </DataProvider>
  );
}