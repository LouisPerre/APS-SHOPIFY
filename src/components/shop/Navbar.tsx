import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingCart, Search, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useCart, useCollections } from "@/hooks/useShopify.ts";
import { useAuth } from "@/hooks/useAuth.ts";
import { AuthModal } from "@/components/auth/AuthModal.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";

const Navbar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const { data: cart } = useCart();
    const { data: collections } = useCollections();
    const { user, signOut } = useAuth();

    const cartItemsCount = cart?.lines?.edges?.length || 0;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate({
                to: '/search',
                search: { q: searchTerm.trim() }
            });
            setSearchTerm('');
        }
    };

    const handleSignOut = async () => {
        await signOut();
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-xl font-bold">
                        Mon Shop
                    </Link>

                    {/* Navigation Desktop - Collections */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="text-sm font-medium hover:text-primary">
                            Accueil
                        </Link>
                        <Link to="/products" className="text-sm font-medium hover:text-primary">
                            Tous les produits
                        </Link>

                        {/* Dropdown Collections */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="text-sm font-medium">
                                    Collections
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-48">
                                {collections?.map((collection: any) => (
                                    <DropdownMenuItem key={collection.id} asChild>
                                        <Link
                                            to="/collections/$handle"
                                            params={{ handle: collection.handle }}
                                            className="cursor-pointer"
                                        >
                                            {collection.title}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>

                    {/* Barre de recherche */}
                    <div className="hidden md:flex flex-1 max-w-sm mx-6">
                        <form onSubmit={handleSearch} className="flex w-full">
                            <Input
                                type="search"
                                placeholder="Rechercher un produit..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="rounded-r-none"
                            />
                            <Button
                                type="submit"
                                variant="outline"
                                size="icon"
                                className="rounded-l-none border-l-0"
                            >
                                <Search className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>

                    {/* Actions utilisateur */}
                    <div className="flex items-center space-x-2">
                        {/* Panier */}
                        <Button asChild variant="ghost" size="icon" className="relative">
                            <Link to="/cart">
                                <ShoppingCart className="h-5 w-5" />
                                {cartItemsCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartItemsCount}
                                    </span>
                                )}
                            </Link>
                        </Button>

                        {/* Utilisateur */}
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <User className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link to="/orders">Mes commandes</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to="/profile">Mon profil</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleSignOut}>
                                        Se déconnecter
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <AuthModal>
                                <Button variant="ghost" size="icon">
                                    <User className="h-5 w-5" />
                                </Button>
                            </AuthModal>
                        )}

                        {/* Menu mobile */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" /> }
                        </Button>
                    </div>
                </div>

                {/* Barre de recherche mobile */}
                <div className="md:hidden pb-4">
                    <form onSubmit={handleSearch} className="flex">
                        <Input
                            type="search"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="rounded-r-none"
                        />
                        <Button
                            type="submit"
                            variant="outline"
                            size="icon"
                            className="rounded-l-none border-l-0"
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>
                </div>

                {/* Menu mobile */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t bg-background py-4">
                        <nav className="flex flex-col space-y-2">
                            <Link
                                to="/"
                                className="text-sm font-medium py-2 hover:text-primary"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Accueil
                            </Link>
                            <Link
                                to="/products"
                                className="text-sm font-medium py-2 hover:text-primary"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Tous les produits
                            </Link>

                            {/* Collections mobile */}
                            <div className="border-t pt-2 mt-2">
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                    Collections
                                </h3>
                                {collections?.map((collection: any) => (
                                    <Link
                                        key={collection.id}
                                        to={'/collections/$handle'}
                                        params={{ handle: collection.handle }}
                                        className="text-sm py-2 block hover:text-primary"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {collection.title}
                                    </Link>
                                ))}
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
