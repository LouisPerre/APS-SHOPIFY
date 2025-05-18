import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import * as React from "react";
import {Outlet} from "@tanstack/react-router";

const queryClient = new QueryClient();

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen flex flex-col">
                <header className="p-4 shadow">
                    <div className="container mx-auto">
                        <h1 className="text-xl font-bold">Ma Boutique Shopify</h1>
                    </div>
                </header>
                <main className="flex-grow container mx-auto px-4 py-8">
                    <Outlet />
                </main>
                <footer className="p-4 bg-gray-100">
                    <div className="container mx-auto text-center text-gray-600">
                        © 2025 Ma Boutique Shopify
                    </div>
                </footer>
            </div>
        </QueryClientProvider>
    )
};

export default App;
