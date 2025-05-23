import {createShopifyClient, PRODUCT_FRAGMENT} from "@/lib/shopify.ts";
import {QueryClient, useMutation, useQuery} from "@tanstack/react-query";
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

export const useCreateCart = () => {
    const queryClient = new QueryClient();

    return useMutation({
        mutationFn: async () => {
            const mutation = `
                mutation CreateCart {
                    cartCreate {
                        cart {
                            id
                            checkoutUrl
                        }
                    }
                }
            `;

            const data = await client.request(mutation);
            // @ts-ignore
            return data.cartCreate.cart;
        },
        onSuccess: (data) => {
            localStorage.setItem('cartId', data.id);
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });
};

export const useCart = () => {
    const cartId = localStorage.getItem('cartId');

    return useQuery({
        queryKey: ['cart', cartId],
        queryFn: async () => {
            if (!cartId) return null;

            const query = `
                query GetCart($cartId: ID!) {
                  cart(id: $cartId) {
                    id
                    lines(first: 100) {
                      edges {
                        node {
                          id
                          quantity
                          merchandise {
                            ... on ProductVariant {
                              id
                              title
                              image {
                                url
                                altText
                              }
                              price {
                                amount
                                currencyCode
                              }
                              product {
                                title
                                handle
                              }
                            }
                          }
                        }
                      }
                    }
                    estimatedCost {
                      totalAmount {
                        amount
                        currencyCode
                      }
                    }
                    checkoutUrl
                  }
                }
            `;

            const data = await client.request(query, { cartId });
            // @ts-ignore
            return data.cart;
        },
        enabled: !!cartId,
    });
};

export const useAddToCart = () => {
    const queryClient = new QueryClient();
    const createCart = useCreateCart();

    return useMutation({
        mutationFn: async ({ variantId, quantity }: { variantId: string; quantity: number }) => {
            let cartId = localStorage.getItem('cartId');

            if (!cartId) {
                const newCart = await createCart.mutateAsync();
                cartId = newCart.id;
            }

            const mutation = `
                mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
                  cartLinesAdd(cartId: $cartId, lines: $lines) {
                    cart {
                      id
                    }
                  }
                }
            `;

            const variables = {
                cartId,
                lines: [
                    {
                        quantity,
                        merchandiseId: variantId,
                    },
                ],
            };

            const data = await client.request(mutation, variables);
            // @ts-ignore
            return data.cartLinesAdd.cart;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    })
}
