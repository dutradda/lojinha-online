import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import Head from 'next/head'
import FlexBoxGrid from 'fbgrid-spec-react'

const Grid = props => {
  return <FlexBoxGrid
      spec={props.grid}
      componentsMap={props.componentsMap}
    />
}

export default createFragmentContainer(Grid, {
  grid: graphql`
    fragment Grid_grid on Grid {
      style
      cells {
        component {
          name
          props
        }
      }
  }`
})
