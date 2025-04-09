"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingCart, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useCartStore } from "@/lib/store"
import Header from "@/components/header"

export default function CartPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore()
  const [mounted, setMounted] = useState(false)

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    }
    setMounted(true)
  }, [router])

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)

  // Update the handleCheckout function to implement the requested behavior
  const handleCheckout = () => {
    clearCart()
    toast({
      variant: "success",
      title: "Order placed successfully!",
      description: "Thank you for your purchase.",
      duration: 4000,
    })
  }

  // Prevent hydration errors by not rendering until mounted
  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-primary">Your Cart</h1>

        {cart.length === 0 ? (
          <Card className="overflow-hidden border-none shadow-xl">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="mb-6 rounded-full bg-primary/10 p-8">
                <ShoppingCart className="h-16 w-16 text-primary" />
              </div>
              <p className="mb-4 text-2xl font-medium">Your cart is empty</p>
              <p className="mb-8 text-center text-muted-foreground">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Button
                onClick={() => router.push("/products")}
                size="lg"
                className="btn-hover-effect rounded-full px-8 text-base transition-all hover:shadow-md"
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="overflow-hidden border-none shadow-xl">
                <CardHeader className="bg-primary/5">
                  <CardTitle>Cart Items ({cart.length})</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {cart.map((item) => (
                    <div key={item.id} className="fade-in border-b p-6 last:border-0">
                      <div className="flex items-start gap-6">
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-white">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            className="object-contain p-2"
                          />
                        </div>

                        <div className="flex-grow">
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <p className="font-medium text-primary">${(item.price * item.quantity).toFixed(2)}</p>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>

                            <span className="w-8 text-center">{item.quantity}</span>

                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-20 overflow-hidden border-none shadow-xl">
                <CardHeader className="bg-primary/5">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-medium">
                      <span>Total</span>
                      <span className="text-primary">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-primary/5 p-6">
                  <Button
                    className="btn-hover-effect w-full rounded-full text-base transition-all hover:shadow-md"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
