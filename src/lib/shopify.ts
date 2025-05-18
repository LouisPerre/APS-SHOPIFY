import { GraphQLClient } from "graphql-request";

export const createShopifyClient = (shopDomain: string, storefrontAccessToken: string) => {
    const endpoint = `https://${shopDomain}/api/2023-10/graphql.json`;

    const client = new GraphQLClient(endpoint, {
        headers: {
            'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
            'Content-Type': 'application/json',
        },
    });

    return client;
}

export const PRODUCT_FRAGMENT = `
    fragment ProductFragment on Product {
        id
        title
        description
        handle
        productType
        tags
        vendor
        availableForSale
        totalInventory
        collections(first: 5) {
            edges {
                node {
                    id
                    title
                    handle
                }
            }
        }
        priceRange {
            minVariantPrice {
                amount
                currencyCode
            }
            maxVariantPrice {
                amount
                currencyCode
            }
        }
        images(first: 5) {
            edges {
                node {
                    id
                    url
                    altText
                    width
                    height
                }
            }
        }
        variants(first: 100) {
            edges {
                node {
                    id
                    title
                    price {
                        amount
                        currencyCode
                    }
                    availableForSale
                    quantityAvailable
                    sku
                }
            }
        }
    }
`
