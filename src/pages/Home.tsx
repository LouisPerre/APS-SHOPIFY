import React from "react";
import { useProducts, useCollections } from "@/hooks/useShopify.ts";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";

const Home: React.FC = () => {
    const { data: products, isLoading: isLoadingProducts } = useProducts(4);
    const { data: collections, isLoading: isLoadingCollections } = useCollections(3);

    if (isLoadingProducts || isLoadingCollections) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="space-y-12">
            <section className="text-center py-12 bg-gray-50 rounded-lg">
                <h1 className="text-4xl font-bold mb-4">Bienvenue dans notre boutique</h1>
                <p className="text-lg mb-6">Découvrez nos derniers produits et collections</p>
                <Button asChild>
                    <Link to="/collections/$handle" params={{ handle: 'all' }}>
                        Voir tous les produits
                    </Link>
                </Button>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-6">Produits populaires</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products?.map((product: any) => (
                        <Card key={product.id}>
                            <CardHeader>
                                <img
                                    src={product.images.edges[0]?.node.url}
                                    alt={product.images.edges[0]?.node.altText || product.title}
                                    className="w-full h-48 object-cover rounded-t-lg"
                                />
                            </CardHeader>
                            <CardContent>
                                <CardTitle>{product.title}</CardTitle>
                                <CardDescription className="line-clamp-2 mt-2">
                                    {product.description}
                                </CardDescription>
                                <p className="font-bold mt-2">
                                    {parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                                    {product.priceRange.minVariantPrice.currencyCode}
                                </p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link to="/products/$handle" params={{ handle: product.handle }}>
                                        Voir le produit
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold mb-6">Collections</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {collections?.map((collection: any) => (
                        <Card key={collection.id} className="overflow-hidden">
                            <div className="relative h-40">
                                {collection.image ? (
                                    <img
                                        src={collection.image.url}
                                        alt={collection.image.altText || collection.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span>Pas d'image</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                    <h3 className="text-white text-xl font-bold">{collection.title}</h3>
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <p className="line-clamp-2 text-sm">{collection.description}</p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild variant="outline" className="w-full">
                                    <Link to="/collections/$handle" params={{ handle: collection.handle }}>
                                        Explorer
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default Home;
