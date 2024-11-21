import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const {username} = useAuth();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        if (username) {
            const savedCart = localStorage.getItem(`cart_${username}`);
            setCartItems(savedCart ? JSON.parse(savedCart) : []);
        }
    }, [username]);

    useEffect(() => {
        if (username) {
            localStorage.setItem(`cart_${username}`, JSON.stringify(cartItems));
        }
    }, [cartItems, username]);

    const addItemToCart = (product) => {
        setCartItems((prevCartItems) => {
            const existingItem = prevCartItems.find(
                (item) => item.productId === product.productId && item.size === product.size
            );
            if (existingItem) {
                return prevCartItems.map((item) =>
                    item.productId === product.productId && item.size === product.size
                        ? { ...item, quantity: item.quantity + product.quantity }
                        : item
                );
            } else {
                return [
                    ...prevCartItems,
                    {
                        productId: product.productId,
                        name: product.name,
                        price: product.price,
                        imageUrl: product.imageUrl,
                        quantity: product.quantity,
                        size: product.size,
                    },
                ];
            }
        });
    };
    

    const removeItemFromCart = (productId) => {
        setCartItems((prevCartItems) => prevCartItems.filter(item => item.productId !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const value = useMemo(() => ({
        cartItems,
        totalPrice,
        addItemToCart,
        removeItemFromCart,
        clearCart,
    }), [cartItems, totalPrice]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);