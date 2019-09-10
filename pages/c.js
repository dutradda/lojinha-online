import React, { Component } from 'react'
import { graphql, commitMutation, RecordProxy } from 'react-relay'
import Link from 'next/link'
import Router from 'next/router'
import store from 'store'
import withData from '../lib/withData'
import Cms from '../components/Cms'

function setTitle(environment, title) {
  const setTitleMutation = graphql`
    mutation cSetTitleMutation($title: String) {
      setTitle(title: $title)
    }
  `

  commitMutation(
    environment,
    {
      mutation: setTitleMutation,
      variables: { title },
      updater: (selector, response) => {
        const source = selector.get('infoTest1')
        source.setValue(
          response.setTitle,
          'title'
        )
      },
      onError: err => console.error(err),
    },
  )
}

function setUser(environment, userId) {
  const setUserMutation = graphql`
    mutation cSetUserMutation($userId: ID!) {
      setUser(uniqueId: $userId) {
        id
        uniqueId
        basket {
          id
          userId
          products {
            id
            name
            brand
          }
        }
      }
    }
  `

  commitMutation(
    environment,
    {
      mutation: setUserMutation,
      variables: { userId },
      // updater: (selector, { setUser }) => {
      //   const catalog = selector.get('catalog', 'Catalog')
      //   catalog.setValue(setUser.uniqueId, 'userId')
      //   const user = selector.get('user', 'User')
      //   const basket = user.getLinkedRecord('basket')
      //   const products = basket.getLinkedRecords('products')
      //   basket.setLinkedRecords([selector.get('test1', 'Product')], 'products')
      // },
      onError: errors => {
        console.error(errors[0].message)
        alert(errors[0].message)
      },
    },
  )
}

class CatalogPage extends Component {
  static displayName = `CatalogPage`;

  static async getInitialProps(context) {
    const relayVariables = { userId: (context.query.userId || store.get('userId') || '') }

    if (context.query.c1) {
      relayVariables.c1 = context.query.c1
    }

    if (context.query.c2) {
      relayVariables.c2 = context.query.c2
    }

    if (context.query.c3) {
      relayVariables.c3 = context.query.c3
    }

    return {
      relayVariables
    }
  }

  constructor() {
    super()
    this.newTitle = 'New CMS Page Title'
    this.updatePageWithUser = this.updatePageWithUser.bind(this)
    this.updatePageReplacingUser = this.updatePageReplacingUser.bind(this)
    this.state = {
      userId: ''
    }
  }

  componentDidMount() {
    const userId = store.get('userId')

    if (Router.query.userId) {
      store.set('userId', Router.query.userId)
    } else if (userId) {
      this.updatePageWithUser(userId)
    }
  }

  componentDidUpdate() {
    this.componentDidMount()
  }

  updatePageWithUser(userId) {
    let url = Router.asPath

    if (Object.keys(Router.query).length > 0) {
      url += '&'
    } else {
      url += '?'
    }

    url += `userId=${userId}`
    Router.push(url)
  }

  updatePageReplacingUser(userId) {
    if (userId) {
      Router.query.userId = userId
    } else {
      delete Router.query.userId
    }

    let queryUri = Object.keys(Router.query).map(key => `${key}=${Router.query[key]}`).join('&')
    if (queryUri) {
      queryUri = `?${queryUri}`
    }
    Router.push(`${Router.pathname}${queryUri}`)
  }

  render () {
    const componentsPropsMap = {
      Catalog: {
        catalog: this.props.viewer.catalog
      },
      Basket: {
        basket: this.props.viewer.user.basket
      },
    }

    const getKeyUp = (e) => {
      this.newTitle = e.target.value
    }

    const setUserKeyUp = (e) => {
      this.setState({userId: e.target.value})
    }

    const changePageOnClick = () => {
      setTitle(this.props.environment, this.newTitle)
    }

    const login = () => {
      if (this.state.userId) {
        store.set('userId', this.state.userId)
        setUser(this.props.environment, this.state.userId)

        if (this.state.userId && Router.query.userId === undefined) {
          this.updatePageWithUser(this.state.userId)
        } else {
          this.updatePageReplacingUser(this.state.userId)
        }
      } else {
        alert('Please, set an username before click!')
      }
    }

    const logout = () => {
      const userId = store.get('userId')
      if (userId) {
        store.remove('userId')
        this.updatePageReplacingUser()
      }
    }

    const userId = store.get('userId')
    let userIdParam = ''
    let userIdParamAll = ''

    if (userId) {
      userIdParam = `&userId=${userId}`
      userIdParamAll = `?userId=${userId}`
    }

    return (
      <div>
        <h1>Products Store</h1>
        <br />
        <input type="text" onKeyUp={getKeyUp} placeholder={this.newTitle} />
        <br />
        <button onClick={changePageOnClick}>
          {'Change the page\'s title'}
        </button>
        <br />
        <br />
        <input type="text" onChange={setUserKeyUp} value={this.state.userId} placeholder="Set an username.." />
        <button onClick={login}>
          {'Login'}
        </button>
        <br />
        <br />
        <button onClick={logout}>
          {'Logout'}
        </button>
        <br /><br />
        <Link href={`/c?c1=category1&c2=subcategory1${userIdParam}`}>
          <a>{'Subcategory 1'}</a>
        </Link>
        <br /><br />
        <Link href={`/c?c1=category1&c2=subcategory2${userIdParam}`}>
          <a>{'Subcategory 2'}</a>
        </Link>
        <br /><br />
        <Link href={`/c${userIdParamAll}`}>
          <a>{'All Products'}</a>
        </Link>
        <Cms cms={this.props.viewer.cms} componentsPropsMap={componentsPropsMap} />
      </div>
    )
  }
}

export default withData(CatalogPage, {
  query: graphql`
    query c_Query($c1: String, $c2: String, $c3: String, $userId: ID!) {
      viewer {
        cms(c1: $c1, c2: $c2, c3: $c3) {
          ...Cms_cms
        }
        catalog(c1: $c1, c2: $c2, c3: $c3, userId: $userId) {
          ...Catalog_catalog
        }
        user(id: $userId) {
          id
          uniqueId
          basket {
            ...Basket_basket
          }
        }
      }
    }
  `
});
