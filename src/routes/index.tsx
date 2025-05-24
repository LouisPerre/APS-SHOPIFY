import {
    Route,
    RootRoute,
    Router,
    RouterProvider,
} from '@tanstack/react-router';
import App from '../App';
import Products from "@/pages/Products.tsx";
import {AuthContext, useAuthProvider} from "@/hooks/useAuth.ts";
import ProductPage from "@/pages/ProductPage.tsx";
import SearchPage from "@/pages/SearchPage.tsx";
import Home from "@/pages/Home.tsx";

const rootRoute = new RootRoute({
    component: () => {
        const auth = useAuthProvider();
        return (
            <AuthContext.Provider value={auth}>
                <App />
            </AuthContext.Provider>
        );
    },
});

const homeRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Home,
});

const productsRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/products',
    component: Products
})

const productRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/products/$handle',
    component: ProductPage,
});

const searchRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/search',
    component: SearchPage,
    validateSearch: (search: Record<string, unknown>) => {
        return {
            q: search.q as string,
        };
    },
});

const collectionRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/collections/$handle',
    component: () => <div>Page Collection</div>,
});

const cartRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/cart',
    component: () => <div>Page Panier</div>,
});

// Enregistrez les routes
const routeTree = rootRoute.addChildren([
    homeRoute,
    productsRoute,
    productRoute,
    searchRoute,
    collectionRoute,
    cartRoute,
]);

// Création du routeur
const router = new Router({ routeTree });

// Déclaration des types pour le routeur
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

export const Routes = () => {
    return <RouterProvider router={router} />;
};
