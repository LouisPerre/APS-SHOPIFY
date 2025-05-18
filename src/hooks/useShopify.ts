import {createShopifyClient, PRODUCT_FRAGMENT} from "@/lib/shopify.ts";
import {useQuery} from "@tanstack/react-query";
import type {Product} from "@/types/shopify.ts";

const SHOP_DOMAIN = import.meta.env.VITE_SHOP_DOMAIN
const STOREFRONT_ACCESS_TOKEN = import.meta.env.VITE_STOREFRONT_ACCESS_TOKEN

const client = createShopifyClient(SHOP_DOMAIN, STOREFRONT_ACCESS_TOKEN);

export const useProducts = (first = 20) => {
    return useQuery({
        queryKey: ['products', first],
        queryFn: async () => {
            const query = `
                ${PRODUCT_FRAGMENT}
                query GetProducts($first: Int!) {
                    products(first: $first) {
                        edges {
                            node {
                                ...ProductFragment
                            }
                        }
                    }
                }
            `;

            const data = await client.request(query, { first });
            // @ts-ignore
            return data.products.edges.map((edge: any) => edge.node) as Product[];
        },
    });
};

export const useProduct = (handle: string) => {
    return useQuery({
        queryKey: ['product', handle],
        queryFn: async () => {
            const query = `
                ${PRODUCT_FRAGMENT}
                query GetProduct($handle: String!) {
                    product(handle: $handle) {
                        ...ProductFragment
                    }
                }
            `;

            const data = await client.request(query, { handle })
            // @ts-ignore
            return data.product as Product;
        },
        enabled: !!handle
    })
};

export const useProductByType = (productType: string, first = 20) => {
    return useQuery({
        queryKey: ['productsByType', productType, first],
        queryFn: async () => {
            const query = `
                ${PRODUCT_FRAGMENT}
                query GetProductsByType($query: String!, $first: Int!) {
                  products(query: $query, first: $first) {
                    edges {
                      node {
                        ...ProductFragment
                      }
                    }
                  }
                }
           `;

            const data = await client.request(query, {
                query: `product_type:${productType}`,
                first
            });
            // @ts-ignore
            return data.products.edges.map((edge: any) => edge.node) as Product[];
        },
        enabled: !!productType,
    });
};

export const useCollections = (first = 10) => {
    return useQuery({
        queryKey: ['collections', first],
        queryFn: async () => {
            const query = `
        query GetCollections($first: Int!) {
          collections(first: $first) {
            edges {
              node {
                id
                title
                handle
                description
                image {
                  id
                  url
                  altText
                  width
                  height
                }
                products(first: 5) {
                  edges {
                    node {
                      id
                      title
                      handle
                    }
                  }
                }
              }
            }
          }
        }
      `;

            const data = await client.request(query, { first });
            // @ts-ignore
            return data.collections.edges.map((edge: any) => edge.node);
        },
    });
};

export const useCollectionProducts = (handle: string, first = 20) => {
    return useQuery({
        queryKey: ['collection', handle, first],
        queryFn: async () => {
            const query = `
        ${PRODUCT_FRAGMENT}
        query GetCollectionProducts($handle: String!, $first: Int!) {
          collection(handle: $handle) {
            id
            title
            handle
            description
            image {
              id
              url
              altText
              width
              height
            }
            products(first: $first) {
              edges {
                node {
                  ...ProductFragment
                }
              }
            }
          }
        }
      `;

            const data = await client.request(query, { handle, first });

            // @ts-ignore
            const collection = data.collection;
            collection.products = collection.products.edges.map((edge: any) => edge.node);

            return collection;
        },
        enabled: !!handle,
    });
};

export const useSearchProducts = (searchTerm: string, first = 20) => {
    return useQuery({
        queryKey: ['searchProducts', searchTerm, first],
        queryFn: async () => {
            const query = `
        ${PRODUCT_FRAGMENT}
        query SearchProducts($query: String!, $first: Int!) {
          products(query: $query, first: $first) {
            edges {
              node {
                ...ProductFragment
              }
            }
          }
        }
      `;

            const data = await client.request(query, {
                query: searchTerm,
                first
            });
            // @ts-ignore
            return data.products.edges.map((edge: any) => edge.node) as Product[];
        },
        enabled: !!searchTerm && searchTerm.length > 2,
    });
};
