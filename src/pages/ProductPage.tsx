import React, { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useProduct, useAddToCart } from "@/hooks/useShopify.ts";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal.tsx";
import { useAuth } from "@/hooks/useAuth.ts";

const ProductPage: React.FC = () => {
    const { handle } = useParams({ from: '/products/$handle' });
    const { data: product, isLoading } = useProduct(handle);
    const { user } = useAuth();

    const [selectedVariant, setSelectedVariant] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const addToCartMutation = useAddToCart();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-xl text-gray-600">Chargement du produit...</div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h1>
                <p className="text-gray-600">Le produit que vous recherchez n'existe pas.</p>
            </div>
        );
    }

    const currentVariant = product.variants.edges[selectedVariant]?.node;
    const images = product.images.edges;

    const handleAddToCart = async () => {
        if (!currentVariant) return;

        try {
            await addToCartMutation.mutateAsync({
                variantId: currentVariant.id,
                quantity: quantity
            });

            alert('Produit ajouté au panier !');
        } catch (error) {
            console.error('Erreur lors de l\'ajout au panier:', error);
            alert('Error lors de l\'ajout au panier !');
        }
    };

    const incrementQuantity = () => setQuantity(prev => prev + 1);
    const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image du produit */}
                <div className="space-y-4">
                    {/* Image principale */}
                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                        {images[selectedImageIndex] ? (
                            <img
                                src={images[selectedImageIndex].node.url}
                                alt={images[selectedImageIndex].node.altText || product.title}
                                className="w-full h-full object-cover"
                            />
                        ): (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-gray-400">Aucune image</span>
                            </div>
                        )}
                    </div>

                    {/* Miniatures */}
                    {images.length > 1 && (
                        <div className="grid grid-cols-4 gap-2">
                            {images.map((image, index) => (
                                <button
                                    key={image.node.id}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`aspect-square overflow-hidden rounded border-2 ${selectedImageIndex === index ? 'border-primary' : 'border-gray-200'}`}
                                >
                                    <img
                                        src={image.node.url}
                                        alt={image.node.altText || product.title}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Informations du produit */}
                <div className="space-y-6">
                    {/* En-tete */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{product.productType}</Badge>
                            {product.collections.edges[0] && (
                                <Badge variant="outline">
                                    {product.collections.edges[0].node.title}
                                </Badge>
                            )}
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {product.title}
                        </h1>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600">(4.8)</span>
                        </div>
                    </div>

                    {/* Prix */}
                    <div className="text-2xl font-bold text-gray-900">
                        {currentVariant ? (
                            `${parseFloat(currentVariant.price.amount).toFixed(2)} ${currentVariant.price.currencyCode}`
                        ): (
                            `A partir de ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)} ${product.priceRange.minVariantPrice.currencyCode}`
                        )}
                    </div>

                    {/* Description */}
                    <div className="prose prose-sm">
                        <p className="text-gray-600">{product.description}</p>
                    </div>

                    {/* Selection des variantes */}
                    {product.variants.edges.length > 1 && (
                        <div>
                            <h3 className="text-sm font-medium mb-3">Variante</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {product.variants.edges.map((variant, index) => (
                                    <button
                                        key={variant.node.id}
                                        onClick={() => setSelectedVariant(index)}
                                        disabled={!variant.node.availableForSale}
                                        className={`p-3 text-sm border rounded-md transition-colors ${
                                            selectedVariant === index
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-gray-200 hover:border-gray-300'
                                        } ${
                                            !variant.node.availableForSale
                                                ? 'opacity-50 cursor-not-allowed'
                                                : ''
                                        }`}
                                    >
                                        {variant.node.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantite */}
                    <div>
                        <h3 className="text-sm font-medium mb-3">Quantité</h3>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center border rounded-md">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={decrementQuantity}
                                    disabled={quantity <= 1}
                                    className="rounded-r-none"
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                                <span className="px-4 py-2 border-x text-center min-w-[60px]">
                                    {quantity}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={incrementQuantity}
                                    className="rounded-l-none"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="text-sm text-gray-600">
                                {currentVariant?.quantityAvailable !== null && currentVariant?.quantityAvailable !== undefined ? (
                                    `${currentVariant.quantityAvailable} en stock`
                                ) : (
                                    product.availableForSale ? 'En stock' : 'Rupture de stock'
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="space-y-3">
                        {user ? (
                            <Button
                                onClick={handleAddToCart}
                                disabled={!product.availableForSale || !currentVariant?.availableForSale || addToCartMutation.isPending}
                                className="w-full"
                                size="lg"
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                {addToCartMutation.isPending ? 'Ajout en cours...' : 'Ajouter au panier'}
                            </Button>
                        ) : (
                            <AuthModal>
                                <Button className="w-full" size="lg">
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Se connecter pour acheter
                                </Button>
                            </AuthModal>
                        )}

                        <Button variant="outline" className="w-full" size="lg">
                            Acheter maintenant
                        </Button>
                    </div>

                    {/* Informations supplementaires */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Marque:</span>
                                    <span className="font-medium">{product.vendor}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Type:</span>
                                    <span className="font-medium">{product.productType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">SKU:</span>
                                    <span className="font-medium">{currentVariant?.sku || 'N/A'}</span>
                                </div>
                                {product.tags.length > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tags:</span>
                                        <div className="flex flex-wrap gap-1">
                                            {product.tags.slice(0, 3).map(tag => (
                                                <Badge key={tag} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ProductPage;
