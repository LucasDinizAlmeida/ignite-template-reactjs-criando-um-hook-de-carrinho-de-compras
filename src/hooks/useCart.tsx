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
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
     const storagedCart = localStorage.getItem('@RocketShoes:cart')

     if (storagedCart) {
       return JSON.parse(storagedCart);
     }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      
      const cpCart = [ ...cart] 
      const checkProduct = cpCart.find(product => product.id == productId)

      const amount = checkProduct? checkProduct.amount : 0
      const incrementAmount = amount + 1

      const stock = await api.get(`/stock/${productId}`)

      if(incrementAmount > stock.data.amount) {
        toast.error('Quantidade solicitada fora de estoque')
        return
      }

      if(checkProduct) {
        checkProduct.amount = incrementAmount
      } else {

        const product = await api.get(`/products/${productId}`)
        cpCart.push({ ...product.data, amount: incrementAmount})
      }

      setCart(cpCart)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(cpCart))


    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      
      const checkProduct = cart.find(product => product.id === productId)

      if(!checkProduct) {
        toast.error('Erro na remoção do produto');
        return
      }

      const newCart = cart.filter(product => product.id != productId)

      setCart(newCart)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(newCart))

    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {

      const stock = await api.get(`/stock/${productId}`)

      if(amount <= 0 || amount > stock.data.amount) {
        toast.error('Quantidade solicitada fora de estoque');
        return
      }
      
      const cpCart = [ ...cart] 
      const product = cpCart.find(product => product.id === productId)

      if(product) {
        product.amount = amount
      }

      setCart(cpCart)
      localStorage.setItem('@RocketShoes:cart', JSON.stringify(cpCart))
      
    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}