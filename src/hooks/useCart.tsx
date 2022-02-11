import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: Product) => Promise<void>;
  removeProduct: (product: Product) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
  setCart: (newCart:Product[]) => void
}

const CartContext = createContext<CartContextData>({} as CartContextData); //Criação do Context com sua tipagem

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
     const storagedCart = localStorage.getItem('@RocketShoes:cart') //Buscar dados do localStorage

     if (storagedCart) {
       return JSON.parse(storagedCart);
     }

    return [];
  });

  


  const addProduct = async (product: Product) => { 

    try {
      
      const newCart = [ ... cart, product]

      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
      setCart(newCart)
    } catch {
      // TODO
    }
  };

  const removeProduct = (product: Product) => {
    try {
      

      const newCart = cart.filter(ele => ele.id != product.id)

      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))
      setCart(newCart)

    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount, setCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
