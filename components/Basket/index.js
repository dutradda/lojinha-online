import React from 'react'
import { createFragmentContainer, graphql, commitMutation } from 'react-relay'


function removeFromBasket(environment, userId, index) {
  const removeFromBasket = graphql`
    mutation BasketRemoveProductMutation($userId: ID!, $index: Int!) {
      removeFromBasket(userId: $userId, index: $index)
    }
  `

  commitMutation(
    environment,
    {
      mutation: removeFromBasket,
      variables: { userId, index },
      updater: (selector) => {
        const basket = selector.get('user:basket')
        let products = basket.getLinkedRecords('products')
        products.splice(index, 1)
        basket.setLinkedRecords(products, 'products')
      },
      onError: err => console.error(err),
    },
  )
}


const Basket = (props) => {
  if (props.basket.products && props.basket.products.length > 0) {
    const removeOnClick = productIndex => () => removeFromBasket(
      props.relay.environment,
      props.basket.userId,
      productIndex
    )

    return (
      <React.Fragment>
        <br />
        <h2>My Basket</h2>
        <b>Products in Basket: ({props.basket.products.length})</b>
        <br />
        <div>
          {props.basket.products.map((product, index) =>
            <React.Fragment key={index}>
              <div>
                {product.name} - {product.brand}&nbsp;&nbsp;&nbsp;
                <button onClick={removeOnClick(index)}>Remove</button>
              </div>
              <br />
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    )
  }

  return null
}

export default createFragmentContainer(Basket, {
  basket: graphql`
    fragment Basket_basket on Basket {
      id
      userId
      products {
        id
        name
        brand
      }
    }`
})
