// Define the ShopItem interface
export interface ShopItem {
    id: number | any;
    name: string | any;
    category: string | any;
    price: number | string;
    rarity: string | any;
    role?: string | any;
}

// Declare the shopItemsList class
export declare class shopItemsList {
    private items: ShopItem[];

    constructor();
    addItem(item: ShopItem): void;
    removeItem(itemID: number): void;
    getItems(): ShopItem[];
}
