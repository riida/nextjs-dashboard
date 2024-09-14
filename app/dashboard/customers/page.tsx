import { fetchProducts } from '@/app/lib/data'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Customers',
}

export default async function Page() {
  const products = await fetchProducts()
  console.log(products.data)

  return <p>Customers Page</p>
}
