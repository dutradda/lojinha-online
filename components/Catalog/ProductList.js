import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import Product from './Product'

const ProductList = props => {
  return (
    <div>
      {props.productList.products.map((product, i) =>
        <React.Fragment key={i}>
          <Product product={product} userId={props.userId} />
          <br />
        </React.Fragment>
      )}
    </div>
  )
}

export default createFragmentContainer(ProductList, {
  productList: graphql`
    fragment ProductList_productList on ProductList {
      products {
        ...Product_product
      }
  }`
})
