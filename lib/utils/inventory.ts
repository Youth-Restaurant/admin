export interface Inventory {
  id: number;
  name: string;
  quantity: number | null;
  status: 'SUFFICIENT' | 'LOW';
}

export async function fetchDrinkInventories(drinks: readonly string[]) {
  try {
    const inventoryPromises = drinks.map((drink) =>
      fetch(`/api/inventory/name/${encodeURIComponent(drink)}`)
        .then((res) => res.json())
        .then((data) => ({ [drink]: data }))
    );

    const results = await Promise.all(inventoryPromises);
    return Object.assign({}, ...results) as Record<string, Inventory>;
  } catch (error) {
    console.error('Failed to fetch drink inventories:', error);
    return {};
  }
}
