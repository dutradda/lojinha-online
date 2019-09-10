import React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import Head from 'next/head'

const Info = props => {
  return (
    <Head>
      <title>{props.info.title}</title>
      <meta {...props.info.metas[0]} />
      <link {...props.info.links[0]} />
    </Head>
  )
}

export default createFragmentContainer(Info, {
  info: graphql`
    fragment Info_info on Info {
      id
      title
      metas
      links
  }`
})
