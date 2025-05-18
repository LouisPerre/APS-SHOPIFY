import {useCollections, useProducts} from "@/hooks/useShopify.ts";
import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {ProductCard} from "@/components/shop/ProductCard.tsx";

const Products: React.FC = () => {
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

    const { data: products, isLoading: isLoadingProducts } = useProducts(50);
    const { data: collections, isLoading: isLoadingCollections } = useCollections();

    const productTypes = products ?
        Array.from(new Set(products.map(product => product.productType)))
            .filter(Boolean)
            .sort() :
        []

    const filteredProducts = products ? products.filter(product => {
        if (selectedType && product.productType !== selectedType) {
            return false;
        }

        if (selectedCollection) {
            const inCollection = product.collections.edges.some(
                edge => edge.node.handle === selectedCollection
            );
            if (!inCollection) return false;
        }

        return true
    }) : [];

    if (isLoadingProducts || isLoadingCollections) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Chargement des produits...</div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Tous nos produits</h1>

            <div className="mb-8 bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <h3 className="text-sm font-medium mb-2">Type de produit</h3>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={selectedType === null ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedType(null)}
                            >
                                Tous
                            </Button>

                            {productTypes.map(type => (
                                <Button
                                    key={type}
                                    variant={selectedType === type ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedType(type)}
                                >
                                    {type}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1">
                        <h3 className="text-sm font-medium mb-2">Collection</h3>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={selectedCollection === null ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCollection(null)}
                            >
                                Toutes
                            </Button>

                            {collections?.map((collection: any) => (
                                <Button
                                    key={collection.id}
                                    variant={selectedCollection === collection.handle ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCollection(collection.handle)}
                                >
                                    {collection.title}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-500 text-lg">Aucun produit ne correspond a votre selection.</p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => {
                                setSelectedType(null);
                                setSelectedCollection(null);
                            }}
                        >
                            Reinitialiser les filtres
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Products;
