import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import {useAuth} from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { userId } = useAuth();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        if (userId) {
            const savedCart = localStorage.getItem(`cart_${userId}`);
            setCartItems(savedCart ? JSON.parse(savedCart) : []);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
        }
    }, [cartItems, userId]);

    const addItemToCart = (product) => {
        setCartItems((prevCartItems) => {
            const existingItem = prevCartItems.find(item => item.productId === product.productId);
            if (existingItem) {
                return prevCartItems.map(item =>
                    item.productId === product.productId
                        ? { ...item, quantity: item.quantity + product.quantity }
                        : item
                );
            } else {
                return [...prevCartItems, {
                    productId: product.productId,
                    name: product.name,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    quantity: product.quantity
                }];
            }
        });
    };

    const removeItemFromCart = (productId) => {
        setCartItems((prevCartItems) => prevCartItems.filter(item => item.productId !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const value = useMemo(() => ({
        cartItems,
        addItemToCart,
        removeItemFromCart,
        clearCart,
    }), [cartItems]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);