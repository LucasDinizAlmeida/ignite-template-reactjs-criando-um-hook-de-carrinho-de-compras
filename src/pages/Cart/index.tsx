import React from 'react';
import {
  MdDelete,
  MdAddCircleOutline,
  MdRemoveCircleOutline,
  MdProductionQuantityLimits,
} from 'react-icons/md';
import { forEachChild, JsxFlags } from 'typescript';

 import { useCart } from '../../hooks/useCart';
 import { formatPrice } from '../../util/format';
import { Container, ProductTable, Total } from './styles';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Cart = (): JSX.Element => {
   const { cart, removeProduct, updateProductAmount, addProduct, setCart } = useCart();

   const cartFormatted = cart.reduce((sumAmount, product) => {

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

  let cartSize: Product[] = []

  for(let i = 1; i <= 6; i++) {
    if(cartFormatted[i] != 0) {
      const product = cart.find(product => product.id == i)
      cartSize.push(product as Product)
    } 
  }
  


   const total =
     formatPrice(
       cart.reduce((sumTotal, product) => {
         
        sumTotal += product.price

        return sumTotal
       }, 0)
     )

  function handleProductIncrement(product: Product) {
    cartFormatted[product.id] += 1

    addProduct(product)
  }

  function handleProductDecrement(product: Product) {
    cartFormatted[product.id] -= 1

    const sameProducts = cart.filter(el => el.id == product.id) //separando todos os produtos iguais ao escolhido

    const newSameProducts = sameProducts.slice(0,(sameProducts.length - 1)) //retirando um produto do array de produtos iguais

    const cartProductChosen = cart.filter(el => el != product)

    
    localStorage.setItem('@RocketShoes:cart', JSON.stringify([...cartProductChosen, ...newSameProducts]))
    setCart([... cartProductChosen, ... newSameProducts])
    

  }

  function handleRemoveProduct(product: Product) {
    cartFormatted[product.id] = 0

    removeProduct(product)
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th aria-label="product image" />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th aria-label="delete icon" />
          </tr>
        </thead>
        <tbody>
          {
            cartSize.map(product => {
              return(
                <tr data-testid="product" key={product.id}>
                <td>
                  <img src={product?.image} alt={product?.title} />
                </td>
                <td>
                  <strong>{product?.title}</strong>
                  <span>{formatPrice(Number(product?.price))}</span>
                </td>
                <td>
                  <div>
                    <button
                      type="button"
                      data-testid="decrement-product"
                      disabled={cartFormatted[product.id] <= 1}
                      onClick={() => handleProductDecrement(product)}
                    >
                      <MdRemoveCircleOutline size={20} />
                    </button>
                    <input
                      type="text"
                      data-testid="product-amount"
                      readOnly
                      value={cartFormatted[product?.id || 0]}
                    />
                    <button
                      type="button"
                      data-testid="increment-product"
                      onClick={() => handleProductIncrement(product)}
                    >
                      <MdAddCircleOutline size={20} />
                    </button>
                  </div>
                </td>
                <td>
                  <strong>{formatPrice(Number(product?.price) * cartFormatted[product.id])}</strong>
                </td>
                <td>
                  <button
                    type="button"
                    data-testid="remove-product"
                    onClick={() => handleRemoveProduct(product)}
                  >
                    <MdDelete size={20} />
                  </button>
                </td>
              </tr>
              )
            })
             
          }
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
};

export default Cart;
