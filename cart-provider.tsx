'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
export type CartLine = { id:string; name:string; slug:string; price_pence:number; image_url?:string|null; quantity:number };
type CartContextValue = { items:CartLine[]; count:number; subtotal:number; add:(item:Omit<CartLine,'quantity'>)=>void; remove:(id:string)=>void; setQuantity:(id:string,n:number)=>void; clear:()=>void };
const CartContext = createContext<CartContextValue|null>(null);
export function CartProvider({children}:{children:React.ReactNode}) {
 const [items,setItems] = useState<CartLine[]>([]); const [ready,setReady] = useState(false);
 useEffect(()=>{ try { const raw=localStorage.getItem('novex-cart'); if(raw) setItems(JSON.parse(raw)); } catch {} setReady(true); },[]);
 useEffect(()=>{ if(ready) localStorage.setItem('novex-cart',JSON.stringify(items)); },[items,ready]);
 const value=useMemo(()=>({items,count:items.reduce((s,x)=>s+x.quantity,0),subtotal:items.reduce((s,x)=>s+x.price_pence*x.quantity,0),add:(p:Omit<CartLine,'quantity'>)=>setItems(old=>{const found=old.find(x=>x.id===p.id);return found?old.map(x=>x.id===p.id?{...x,quantity:x.quantity+1}:x):[...old,{...p,quantity:1}]}),remove:(id:string)=>setItems(old=>old.filter(x=>x.id!==id)),setQuantity:(id:string,n:number)=>setItems(old=>n<=0?old.filter(x=>x.id!==id):old.map(x=>x.id===id?{...x,quantity:Math.min(99,Math.floor(n))}:x)),clear:()=>setItems([])}),[items]);
 return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart(){const v=useContext(CartContext);if(!v)throw new Error('useCart must be inside CartProvider');return v;}
