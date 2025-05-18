import {
    Route,
    RootRoute,
    Router,
    RouterProvider,
} from '@tanstack/react-router';
import App from '../App';
import Products from "@/pages/Products.tsx";

const rootRoute = new RootRoute({
    component: App,
});

const homeRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <Products />,
});

const productRoute = new Route({
    getParentRoute: () => rootRoute,
    path: '/products/$handle',
    component: () => <div>Page produit</div>,
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
    productRoute,
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
