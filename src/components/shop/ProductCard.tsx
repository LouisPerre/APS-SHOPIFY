import type {Product} from "@/types/shopify.ts";
import * as React from "react";
import {Link} from "@tanstack/react-router";

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { title, handle, images, priceRange, availableForSale, productType } = product;

    const firstImage = images.edges[0]?.node;
    const imageUrl = firstImage?.url || '/placeholder-product.jpg';
    const imageAlt = firstImage?.altText || title;

    const price = parseFloat(priceRange.minVariantPrice.amount);
    const currency = priceRange.minVariantPrice.currencyCode;

    return (
        <div className="group relative bg-white rounded-lg shadow overflow-hidden transition-all hover:shadow-lg">
            <Link
                to="/products/$handle"
                params={{ handle }}
                className="block"
            >
                <div className="relative h-64 overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={imageAlt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {!availableForSale && (
                        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                            Epuise
                        </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-gray-900 bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                        {productType}
                    </div>
                </div>

                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 mb-1">{title}</h3>
                    <div className="flex justify-between items-center">
                        <p className="font-bold text-gray-900">
                            {price.toFixed(2)} {currency}
                        </p>
                        <div className="text-sm font-medium text-gray-600">
                            {product.collections.edges.length > 0 && (
                                <span>{product.collections.edges[0].node.title}</span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}
