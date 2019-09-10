import React from 'react'
import { createFragmentContainer, graphql, commitMutation } from 'react-relay'

function addToBasket(environment, userId, productId) {
  const addToBasketMutation = graphql`
    mutation ProductAddToBasketMutation($userId: ID!, $productId: ID!) {
      addToBasket(userId: $userId, productId: $productId) {
        id
        name
        brand
      }
    }
  `

  commitMutation(
    environment,
    {
      mutation: addToBasketMutation,
      variables: { userId, productId },
      updater: (selector, { addToBasket }) => {
        const basket = selector.get('user:basket')
        const products = basket.getLinkedRecords('products')
        products.push(selector.get(addToBasket.id))
        basket.setLinkedRecords(products, 'products')
      },
      onError: err => console.error(err),
    },
  )
}

const Product = (props) => {
  let buttonBuy = null
  if (props.userId) {
    const onClick = () => addToBasket(
      props.relay.environment,
      props.userId,
      props.product.id,
      props.i
    )
    buttonBuy = (
      <div>
        <button onClick={onClick}>BUY</button>
      </div>
    )
  }

  return (
    <React.Fragment>
      <div>Name: {props.product.name}</div>
      <div>Brand: {props.product.brand}</div>
      <div>Sku: {props.product.id}</div>
      {buttonBuy}
    </React.Fragment>
  )
}

export default createFragmentContainer(Product, {
  product: graphql`
    fragment Product_product on Product {
      id
      name
      brand
  }`
})
