import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import Info from './Info'
import Grid from './Grid'
import Catalog from '../Catalog'
import Basket from '../Basket'

const Cms = props => {
  const componentsMap = {
    Catalog: () => (
      <Catalog
        relay={props.relay}
        catalog={props.componentsPropsMap.Catalog.catalog}
      />
    ),
    Basket: () => (
      <Basket
        relay={props.relay}
        basket={props.componentsPropsMap.Basket.basket}
      />
    )
  }
  return (
    <React.Fragment>
      <Info info={props.cms.info} />
      <Grid grid={props.cms.grid} componentsMap={componentsMap} />
    </React.Fragment>
  )
}

export default createFragmentContainer(Cms, {
  cms: graphql`
      fragment Cms_cms on Cms {
        info {
          ...Info_info
        }
        grid {
          ...Grid_grid
        }
      }
    `
})
