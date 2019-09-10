GraphQLJSON = require('graphql-type-json');

let cmsPageTitle = 'CMS Page Title'
const products = [{
  id: 'test1',
  name: 'Product Test',
  brand: 'Testing'
},{
  id: 'test2',
  name: 'Product Test 2',
  brand: 'Testing'
}]
const userProducts = {
  test: [products[0]]
}
const users = {
  test: {
    id: 'user',
    uniqueId: 'test',
    basket: () => ({
      id: 'user:basket',
      userId: 'test',
      products: userProducts.test
    })
  }
}
const ANONYMOUS = 'anonymous'

module.exports = {
  JSON: GraphQLJSON,
  setTitle: ({ title }) => {
    cmsPageTitle = title
    return cmsPageTitle
  },
  addToBasket: ({ userId, productId }) => {
    const user = users[userId]

    if (user !== undefined) {
      const product = products.filter(item => item.id === productId)

      if (product.length === 1) {
        user.basket().products.push(product[0])
        return product[0]
      }
    }
  },
  removeFromBasket: ({ userId, index }) => {
    const user = users[userId]

    if (user !== undefined) {
      user.basket().products.splice(index, 1)
      return true
    }

    return false
  },
  setUser: ({ uniqueId }) => {
    const id = uniqueId

    if (id === ANONYMOUS) {
      throw Error('Invalid id')
    }

    if (users[id] !== undefined) {
      return users[id]
    }

    if (id !== ANONYMOUS && users[id] === undefined) {
      const prods = [products[0]]
      userProducts[id] = prods
      users[id] = {
        id: 'user',
        uniqueId: id,
        basket: () => ({
          id: `user:basket`,
          userId: id,
          products: prods
        })
      }
    }

    return users[id]
  },
  viewer: () => ({
    id: 'viewerTest',
    cms: () => {
      console.log('get cms')
      return {
        info: () => ({
          id: 'infoTest1',
          title: cmsPageTitle,
          metas: () => [
            {
              name: "description",
              content: "cms desc"
            }
          ],
          links: () => [
            {
              href: "/teste",
              name: "cms link"
            }
          ]
        }),
        grid: () => ({
          id: 'gridTest',
          style: { flexDirection: 'column' },
          cells: () => [
            {
              component: () => ({
                name: 'Catalog'
              })
            },
            {
              component: () => ({
                name: 'Basket'
              })
            }
          ]
        })
      }
    },
    catalog: ({c1, c2, c3, userId}) => {
      console.log('get catalog')
      if (c1 === 'category1' && c2 === 'subcategory1') {
        return {
          id: 'catalog',
          userId,
          productList: () => ({
            products: [products[1]]
          })
        }
      } else if (c1 === 'category1' && c2 === 'subcategory2') {
        return {
          id: 'catalog',
          userId,
          productList: () => ({
            products: [products[0]]
          })
        }
      }

      return {
        id: 'catalog',
        userId,
        productList: () => ({
          products: products
        })
      }
    },
    user: ({ id }) => {
      console.log('get user')
      let user = users[id]

      if (user === undefined) {
        user = {
          id: 'user',
          uniqueId: ANONYMOUS,
          basket: () => ({
            id: 'user:basket',
            userId: ANONYMOUS
          })
        }
      }

      return user
    }
  })
};
