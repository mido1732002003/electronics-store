import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    maxQuantity: number;
}

interface CartState {
    items: CartItem[];
    couponCode: string | null;
    couponDiscount: number;
    isLoading: boolean;
}

const initialState: CartState = {
    items: [],
    couponCode: null,
    couponDiscount: 0,
    isLoading: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart: (state, action: PayloadAction<{ items: CartItem[]; couponCode?: string; couponDiscount?: number }>) => {
            state.items = action.payload.items;
            state.couponCode = action.payload.couponCode || null;
            state.couponDiscount = action.payload.couponDiscount || 0;
        },
        addItem: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find((item) => item.productId === action.payload.productId);
            if (existingItem) {
                existingItem.quantity = Math.min(
                    existingItem.quantity + action.payload.quantity,
                    existingItem.maxQuantity
                );
            } else {
                state.items.push(action.payload);
            }
        },
        updateItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
            const item = state.items.find((item) => item.id === action.payload.id);
            if (item) {
                item.quantity = Math.min(Math.max(1, action.payload.quantity), item.maxQuantity);
            }
        },
        removeItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
        clearCart: (state) => {
            state.items = [];
            state.couponCode = null;
            state.couponDiscount = 0;
        },
        applyCoupon: (state, action: PayloadAction<{ code: string; discount: number }>) => {
            state.couponCode = action.payload.code;
            state.couponDiscount = action.payload.discount;
        },
        removeCoupon: (state) => {
            state.couponCode = null;
            state.couponDiscount = 0;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartItemCount = (state: { cart: CartState }) =>
    state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectCartSubtotal = (state: { cart: CartState }) =>
    state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectCartTotal = (state: { cart: CartState }) => {
    const subtotal = selectCartSubtotal(state);
    return subtotal - state.cart.couponDiscount;
};

export const {
    setCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    setLoading,
} = cartSlice.actions;

export default cartSlice.reducer;
