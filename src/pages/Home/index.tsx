import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';
import { Product } from '../../types' 

/*
interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}
*/
interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<Product[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {


    sumAmount[product.id] += 1

    return sumAmount
  }, {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  } as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
      const products = await api.get('products')
      
      setProducts(products.data)
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) { 
    // Setar o produto escolhido ao array cart e chamar a função do Context que seta no localStorage

    const productArray = products.filter(transaction => transaction.id == id)

    const product = productArray[0] 

    addProduct(product)
      .then()
  
    
  }

  return (
    <ProductList>
      {
        products.map(product => {

          return(
            <li key={product.id}>
              <img src={product.image} alt={product.title} />
              <strong>{product.title}</strong>
              <span>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(product.price)}
              </span>
              <button
                type="button"
                data-testid="add-product-button"
                onClick={() => handleAddProduct(product.id)}
              >
                <div data-testid="cart-product-quantity">
                  <MdAddShoppingCart size={16} color="#FFF" />
                  {cartItemsAmount[product.id] || 0}
                </div>

                <span>ADICIONAR AO CARRINHO</span>
              </button>
            </li>
          )
        })
      }
    </ProductList>
  );
};

export default Home;
