import type { Metadata } from 'next'; import './globals.css'; import { CartProvider } from '@/components/cart-provider'; import { Header } from '@/components/header'; import { Footer } from '@/components/footer';
export const metadata:Metadata={title:'Novex Market | Shop Smarter. Play Better.',description:'Discover digital products, script keys and gaming services at Novex Market.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en-GB"><body><CartProvider><Header/><main>{children}</main><Footer/></CartProvider></body></html>}
