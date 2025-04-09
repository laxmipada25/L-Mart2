"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, LogOut, Menu, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCartStore } from "@/lib/store"

export default function Header() {
  const router = useRouter()
  const { cart } = useCartStore()
  const [mounted, setMounted] = useState(false)

  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  // Calculate total items in cart
  const cartItemCount = mounted ? cart.reduce((total, item) => total + item.quantity, 0) : 0

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/products" className="flex items-center gap-2 text-xl font-bold text-primary">
          <ShoppingBag className="h-6 w-6" />
          <span>L-Mart</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          <Link
            href="/products"
            className="text-sm font-medium transition-colors hover:text-primary relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            Home
          </Link>
          <Link
            href="/cart"
            className="relative text-sm font-medium transition-colors hover:text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
          >
            Cart
            {cartItemCount > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {cartItemCount}
              </span>
            )}
          </Link>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-4 md:hidden">
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground pulse">
                {cartItemCount}
              </span>
            )}
          </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] border-none p-0 sm:w-[300px]">
              <div className="flex h-16 items-center border-b px-6">
                <Link href="/products" className="flex items-center gap-2 text-lg font-bold text-primary">
                  <ShoppingBag className="h-5 w-5" />
                  <span>L-Mart</span>
                </Link>
              </div>
              <nav className="flex flex-col gap-4 p-6">
                <Link href="/products" className="text-lg font-medium transition-colors hover:text-primary">
                  Home
                </Link>
                <Link href="/cart" className="text-lg font-medium transition-colors hover:text-primary">
                  Cart {cartItemCount > 0 && <span className="ml-2 text-primary">({cartItemCount})</span>}
                </Link>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="mt-4 justify-start border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Logout
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
