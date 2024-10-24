import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import orderReducer from "../features/order/orderSlice";

export const store = configureStore({
    reducer: {
        order: orderReducer,
        cart: cartReducer,
    },
});