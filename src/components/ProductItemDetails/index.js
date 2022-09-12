import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getProductItemDetails()
  }

  productsNotFoundView = () =>
    this.setState({apiStatus: apiStatusConstants.failure})

  getProductItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/products/:${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)

    if (response.ok) {
      return null
    }
    return this.productsNotFoundView()
  }

  onClickContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  inProgressData = () => (
    <div className="notfound-container">
      <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
    </div>
  )

  onProductNotFound = () => (
    <div className="notfound-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
        className="error-view-product"
      />
      <h1 className="not-found">Product Not Found</h1>
      <button
        type="button"
        className="shopping-btn"
        onClick={this.onClickContinueShopping}
      >
        Continue Shopping
      </button>
    </div>
  )

  onDisplayDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.inProgressData()
      case apiStatusConstants.failure:
        return this.onProductNotFound()
      default:
        return null
    }
  }

  render() {
    return <div>{this.onDisplayDetails()}</div>
  }
}

export default ProductItemDetails
