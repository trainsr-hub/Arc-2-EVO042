// src/components/tabs/Stt01/useContractLogic.js
import { useData } from "../../../context/DataContext";
import contractConfig from "../../../mockData/contractConfig.json";

export function useContractLogic() {
  // Lấy thẳng biến 'tier' từ dữ liệu trung tâm cung cấp
  const { contracts, setContracts, shopData, setShopData, setConsumablesInventory, setHasUnsavedChanges, tier } = useData();

  const handleTakeRandomContract = () => {
    const validPool = contracts.filter(
      c => c.status === "AVAILABLE" || c.status === "EARNED" || c.status === "CANCELLED" || c.status === "EXPIRED"
    );
    if (validPool.length === 0) return alert("Hệ thống ma trận bận hoặc cạn kiệt tài nguyên khả dụng!");

    const totalWeight = validPool.reduce((sum, c) => sum + c.weight, 0);
    let randomRoll = Math.floor(Math.random() * totalWeight);
    let selectedTemplate = validPool[0];

    for (const contract of validPool) {
      randomRoll -= contract.weight;
      if (randomRoll < 0) { selectedTemplate = contract; break; }
    }

    // Đúc tầng Rank nhiệm vụ dựa trên chỉ số Tier đồng bộ từ Context
    let chosenRank = "I";
    const rankRoll = Math.random() * 100;
    if (tier >= 5.0) {
      if (rankRoll < 10) chosenRank = "II"; 
      else if (rankRoll < 35) chosenRank = "III"; 
      else if (rankRoll < 70) chosenRank = "IV"; 
      else chosenRank = "V";
    } else if (tier >= 2.5) {
      if (rankRoll < 25) chosenRank = "I"; 
      else if (rankRoll < 60) chosenRank = "II"; 
      else if (rankRoll < 90) chosenRank = "III"; 
      else chosenRank = "IV";
    } else {
      if (rankRoll < 55) chosenRank = "I"; 
      else if (rankRoll < 90) chosenRank = "II"; 
      else chosenRank = "III";
    }

    const rankMap = { "I": 1, "II": 2, "III": 3, "IV": 4, "V": 5 };
    const rankNumeric = rankMap[chosenRank];

    const totalPoolSize = contractConfig.base_pool_size * Math.pow(2, rankNumeric - 1);
    let remainingSpace = totalPoolSize;

    const elementEnergyMap = {
      "Everlasting Flames": "energy_flames", "Tidal Waves": "energy_tidal",
      "River of Stars": "energy_stars", "Void": "energy_void", "Polarity": "energy_polarity"
    };
    const specificEnergyId = elementEnergyMap[selectedTemplate.element_type] || "energy";

    const dynamicItemsPool = [
      ...contractConfig.gacha_packs.map(pack => ({ 
        id: pack.id, 
        name: pack.name, 
        type: "PACK", 
        space_cost: pack.space_cost,
        perserving: pack.perserving || 1 
      })),
      ...contractConfig.resources
        .filter(res => res.id === specificEnergyId || res.id === "energy")
        .map(res => ({ 
          id: res.id, 
          name: res.name, 
          type: "ELEMENT", 
          space_cost: res.space_cost,
          perserving: res.perserving || 5 
        }))
    ].sort((a, b) => b.space_cost - a.space_cost);

    const finalRewards = [];

    while (remainingSpace > 0) {
      const viableItems = dynamicItemsPool.filter(item => item.space_cost <= remainingSpace);
      if (viableItems.length === 0) break;

      let chosenItem = null;
      for (const item of viableItems) {
        const spaceLeftIfAdded = remainingSpace - item.space_cost;
        if (spaceLeftIfAdded === 0) { chosenItem = item; break; }

        const rate = 1 - (spaceLeftIfAdded / totalPoolSize);
        if (Math.random() < rate) { chosenItem = item; break; }
      }

      if (!chosenItem) chosenItem = viableItems[viableItems.length - 1];

      finalRewards.push(chosenItem);
      remainingSpace -= chosenItem.space_cost;
    }

    const minHours = 8;
    const maxHours = 72;
    const randomDurationHours = Math.floor(Math.random() * (maxHours - minHours + 1)) + minHours;
    const computedExpirationDate = new Date(Date.now() + randomDurationHours * 60 * 60 * 1000).toISOString();

    setContracts(prev => prev.map(c => 
      c.id === selectedTemplate.id 
        ? {
            ...c,
            contract_id: `rolled_con_${Date.now()}`,
            template_source: selectedTemplate.id,
            status: "IN_PROGRESS",
            title: `${selectedTemplate.theme} [Rank ${chosenRank}]`,
            rank: chosenRank,
            description: selectedTemplate.rank_contents[chosenRank],
            rewards: finalRewards,
            total_space_allocated: totalPoolSize,
            expiration_date: computedExpirationDate
          }
        : c
    ));
    setHasUnsavedChanges(true);
  };

  const handleContractAction = (id, isSuccessAction) => {
    const instance = contracts.find(c => c.contract_id === id);
    if (!instance) return;

    if (isSuccessAction) {
      setConsumablesInventory(prev => {
        let updated = [...prev];
        instance.rewards.forEach(reward => {
          if (reward.type === "PACK") {
            const existing = updated.find(p => p.name === reward.name);
            const dropQty = reward.perserving || 1;
            if (existing) existing.quantity += dropQty;
            else updated.push({ id: `csm_drop_${Date.now()}_${Math.floor(Math.random()*1000)}`, name: reward.name, quantity: dropQty });
          }
        });
        return updated;
      });

      setShopData(prev => {
        const updated = { ...prev };
        instance.rewards.forEach(reward => {
          if (reward.type === "ELEMENT") {
            const dropValue = reward.perserving || 0;
            updated[reward.id] = (updated[reward.id] || 0) + dropValue;
          }
        });
        return updated;
      });
    }

    setContracts(prev => prev.map(c => 
      c.contract_id === id 
        ? {
            id: c.id, theme: c.theme, element_type: c.element_type, weight: c.weight, rank_contents: c.rank_contents,
            status: isSuccessAction ? "EARNED" : "CANCELLED", contract_id: null
          }
        : c
    ));
    setHasUnsavedChanges(true);
  };

  return { contracts, handleTakeRandomContract, handleContractAction };
}