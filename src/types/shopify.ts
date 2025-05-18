export interface ShopifyImage {
    id: string;
    url: string;
    altText: string | null;
    width: number;
    height: number;
}

export interface ProductVariant {
    id: string;
    title: string;
    price: {
        amount: string;
        currencyCode: string;
    };
    availableForSale: boolean;
    quantityAvailable: number | null;
    sku: string;
}

export interface Product {
    id: string;
    title: string;
    description: string;
    handle: string;
    productType: string;
    tags: string[];
    vendor: string;
    collections: {
        edges: Array<{
            node: {
                id: string;
                title: string;
                handle: string;
            }
        }>
    };
    priceRange: {
        minVariantPrice: {
            amount: string;
            currencyCode: string;
        },
        maxVariantPrice: {
            amount: string;
            currencyCode: string;
        }
    };
    images: {
        edges: Array<{
            node: ShopifyImage
        }>
    };
    variants: {
        edges: Array<{
            node: ProductVariant
        }>
    };
    availableForSale: boolean;
    totalInventory: number;
}
