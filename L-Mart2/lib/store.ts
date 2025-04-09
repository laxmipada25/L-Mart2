import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
}

interface CartItem extends Product {
  quantity: number
}

interface CartStore {
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],

      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === product.id)

          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
              ),
            }
          }

          return {
            cart: [...state.cart, { ...product, quantity: 1 }],
          }
        }),

      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) => (item.id === productId ? { ...item, quantity } : item)),
        })),

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "cart-storage",
    },
  ),
)
