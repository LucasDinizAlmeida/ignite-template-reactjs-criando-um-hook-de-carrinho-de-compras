import React from 'react';
import { Link } from 'react-router-dom';
import { MdShoppingBasket } from 'react-icons/md';

import logo from '../../assets/images/logo.svg';
import { Container, Cart } from './styles';
import { useCart } from '../../hooks/useCart';
import { Product } from '../../types';


interface CartItemsAmount {
  [key: number]: number;
}

const Header = (): JSX.Element => {
  const { cart } = useCart();

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

  let cartSize = 0

  for(let i = 1; i <= 6; i++) {
    if(cartItemsAmount[i] != 0)
    cartSize ++
  }
  
  return (
    <Container>
      <Link to="/">
        <img src={logo} alt="Rocketshoes" />
      </Link>

      <Cart to="/cart">
        <div>
          <strong>Meu carrinho</strong>
          <span data-testid="cart-size">
            {cartSize === 1 ? `${cartSize} item` : `${cartSize} itens`}
          </span>
        </div>
        <MdShoppingBasket size={36} color="#FFF" />
      </Cart>
    </Container>
  );
};

export default Header;
