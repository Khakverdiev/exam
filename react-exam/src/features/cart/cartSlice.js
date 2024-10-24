import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems: [],
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItemToCart: (state, action) => {
            const existingItem = state.cartItems.find(
                (item) => item.productId === action.payload.productId
            );
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.cartItems.push(action.payload);
            }
            localStorage.setItem(`cart_${action.payload.userId}`, JSON.stringify(state.cartItems));
        },
        removeItemFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(
                (item) => item.productId !== action.payload.productId
            );

            if (state.cartItems.length === 0) {
                localStorage.removeItem(`cart_${action.payload.userId}`);
            } else {
                localStorage.setItem(`cart_${action.payload.userId}`, JSON.stringify(state.cartItems));
            }
        },
        clearCart: (state, action) => {
            state.cartItems = [];
            localStorage.removeItem(`cart_${action.payload.userId}`);
        },
        setCartItems: (state, action) => {
            state.cartItems = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const {
    addItemToCart,
    removeItemFromCart,
    clearCart,
    setCartItems,
    setLoading,
    setError,
} = cartSlice.actions;

export default cartSlice.reducer;