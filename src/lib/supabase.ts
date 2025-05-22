import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string;
}

export interface Order {
    id: string;
    user_id: string;
    shopify_order_id: string;
    total_amount: number;
    currency: string;
    status: string;
    created_at: string;
    order_items: OrderItem[];
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    variant_id: string;
    quantity: number;
    price: number;
    product_title: string;
}
