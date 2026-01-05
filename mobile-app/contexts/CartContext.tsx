/**
 * KULABOUR - Cart Context
 * Global state management for multi-service cart functionality
 * Allows customers to book multiple workers/services at once
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
export interface CartItem {
    id: string;
    serviceId: string;
    categoryId: string;
    emoji: string;
    hindi: string;
    english: string;
    price: number;
    unit: string;
    quantity: number;
    categoryColor: string;
}

export interface CartState {
    items: CartItem[];
    isLoading: boolean;
}

type CartAction =
    | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'CLEAR_CART' }
    | { type: 'LOAD_CART'; payload: CartItem[] }
    | { type: 'SET_LOADING'; payload: boolean };

interface CartContextType {
    state: CartState;
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getItemCount: () => number;
    getSubtotal: () => number;
    getPlatformFee: () => number;
    getGST: () => number;
    getTotal: () => number;
    isInCart: (serviceId: string) => boolean;
    getItemQuantity: (serviceId: string) => number;
}

const CART_STORAGE_KEY = '@kulabour_cart';
const PLATFORM_FEE = 29;
const GST_RATE = 0.18;

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingItem = state.items.find(item => item.serviceId === action.payload.serviceId);
            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.serviceId === action.payload.serviceId
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            }
            const newItem: CartItem = {
                ...action.payload,
                id: `cart_${Date.now()}_${action.payload.serviceId}`,
                quantity: 1,
            };
            return { ...state, items: [...state.items, newItem] };
        }

        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload),
            };

        case 'UPDATE_QUANTITY': {
            if (action.payload.quantity <= 0) {
                return {
                    ...state,
                    items: state.items.filter(item => item.id !== action.payload.id),
                };
            }
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
            };
        }

        case 'CLEAR_CART':
            return { ...state, items: [] };

        case 'LOAD_CART':
            return { ...state, items: action.payload, isLoading: false };

        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };

        default:
            return state;
    }
}

// Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider
export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, {
        items: [],
        isLoading: true,
    });

    // Load cart from storage on mount
    useEffect(() => {
        loadCart();
    }, []);

    // Save cart to storage whenever it changes
    useEffect(() => {
        if (!state.isLoading) {
            saveCart();
        }
    }, [state.items]);

    const loadCart = async () => {
        try {
            const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
            if (storedCart) {
                dispatch({ type: 'LOAD_CART', payload: JSON.parse(storedCart) });
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        } catch (error) {
            console.error('[Cart] Failed to load cart:', error);
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const saveCart = async () => {
        try {
            await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
        } catch (error) {
            console.error('[Cart] Failed to save cart:', error);
        }
    };

    const addItem = (item: Omit<CartItem, 'quantity'>) => {
        dispatch({ type: 'ADD_ITEM', payload: item });
    };

    const removeItem = (id: string) => {
        dispatch({ type: 'REMOVE_ITEM', payload: id });
    };

    const updateQuantity = (id: string, quantity: number) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const getItemCount = () => {
        return state.items.reduce((sum, item) => sum + item.quantity, 0);
    };

    const getSubtotal = () => {
        return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const getPlatformFee = () => {
        return state.items.length > 0 ? PLATFORM_FEE : 0;
    };

    const getGST = () => {
        const subtotal = getSubtotal();
        return Math.round(subtotal * GST_RATE);
    };

    const getTotal = () => {
        return getSubtotal() + getPlatformFee() + getGST();
    };

    const isInCart = (serviceId: string) => {
        return state.items.some(item => item.serviceId === serviceId);
    };

    const getItemQuantity = (serviceId: string) => {
        const item = state.items.find(i => i.serviceId === serviceId);
        return item?.quantity || 0;
    };

    return (
        <CartContext.Provider
            value={{
                state,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                getItemCount,
                getSubtotal,
                getPlatformFee,
                getGST,
                getTotal,
                isInCart,
                getItemQuantity,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

// Hook
export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

export default CartContext;
