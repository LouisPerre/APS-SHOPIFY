import React from "react";
import { useSearch } from "@tanstack/react-router";
import { useSearchProducts } from "@/hooks/useShopify.ts";
import { ProductCard } from "@/components/shop/ProductCard.tsx";

const SearchPage: React.FC = () => {
    const { q } =  useSearch({ from: '/search' });
    const { data: products, isLoading } = useSearchProducts(q || '', 20);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Recherche en cours...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    Résultats de recherche
                </h1>
                <p className="text-gray-600">
                    {q ? `Résultats pour "${q}"` : 'Aucun terme de recherche'}
                    {products && ` (${products.length} produit ${products.length > 1 ? 's' : ''})`}
                </p>
            </div>

            {products && products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-4">
                        Aucun produit ne correspond à votre recherche
                    </p>
                    <p className="text-gray-400">
                        Essayez avec d'autres mots-clés ou parcourez nos collections.
                    </p>
                </div>
            )}
        </div>
    )
}

export default SearchPage;
