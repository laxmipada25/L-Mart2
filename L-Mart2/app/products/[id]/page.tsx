"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCartStore } from "@/lib/store"
import Header from "@/components/header"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, ShoppingCart, Star } from "lucide-react"

interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { addToCart } = useCartStore()
  const { toast } = useToast()

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    }
  }, [router])

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${params.id}`)
        if (!response.ok) {
          throw new Error("Product not found")
        }
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </main>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center py-12">
            <p>Product not found.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6 group" onClick={() => router.push("/products")}>
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Products
        </Button>

        <Card className="overflow-hidden border-none shadow-xl">
          <CardContent className="p-0">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="relative flex h-[400px] items-center justify-center bg-white p-6">
                <div className="absolute top-4 left-4 rounded-full bg-primary/10 px-3 py-1">
                  <span className="text-xs font-medium text-primary capitalize">{product.category}</span>
                </div>
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  fill
                  className="object-contain p-8 transition-all duration-300 hover:scale-105"
                />
              </div>

              <div className="flex flex-col p-8">
                <h1 className="text-2xl font-bold sm:text-3xl">{product.title}</h1>

                <div className="mt-2 flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < 4 ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground">(4.0)</span>
                </div>

                <div className="my-6">
                  <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Free shipping</p>
                </div>

                <div className="mb-8 rounded-lg bg-primary/5 p-4">
                  <p className="text-muted-foreground">{product.description}</p>
                </div>

                <Button
                  onClick={() => {
                    addToCart(product)
                    toast({
                      variant: "success",
                      description: `${product.title} added to cart`,
                      duration: 2000,
                    })
                  }}
                  size="lg"
                  className="btn-hover-effect mt-auto rounded-full text-base transition-all hover:shadow-md"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
