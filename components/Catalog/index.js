import React, { Component } from 'react'
import { QueryRenderer, createFragmentContainer, graphql } from 'react-relay'
import ProductList from './ProductList'

const Catalog = (props) => {
  return (
    <div>
      <h2>Products</h2>
      <br />
      <ProductList productList={props.catalog.productList} userId={props.catalog.userId} />
    </div>
  )
}

export default createFragmentContainer(Catalog, graphql`
  fragment Catalog_catalog on Catalog {
    userId
    productList {
      ...ProductList_productList
    }
  }
`)
