import {Component} from 'react'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    errorMsg: '',
    productItem: {},
    quantity: 1,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  productsNotFoundView = errorMsg =>
    this.setState({apiStatus: apiStatusConstants.failure, errorMsg})

  getProductItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/products/${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok) {
      const updatedData = {
        imageUrl: data.image_url,
        title: data.title,
        brand: data.brand,
        price: data.price,
        description: data.description,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: data.similar_products.map(eachItem => ({
          imageUrl: eachItem.image_url,
          title: eachItem.title,
          id: eachItem.id,
          style: eachItem.style,
          price: eachItem.price,
          description: eachItem.description,
          brand: eachItem.brand,
          totalReviews: eachItem.total_reviews,
          rating: eachItem.rating,
          availability: eachItem.availability,
        })),
      }

      this.setState({
        productItem: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.productsNotFoundView(data.error_msg)
    }
  }

  onClickContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  inProgressData = () => (
    <div className="notfound-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={50} width={50} />
    </div>
  )

  onProductNotFound = () => {
    const {errorMsg} = this.state
    return (
      <div className="notfound-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="error-view-product"
        />
        <h1 className="not-found">{errorMsg}</h1>
        <button
          type="button"
          className="shopping-btn"
          onClick={this.onClickContinueShopping}
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  onDecreaseQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onIncreaseQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  similarProductsItems = () => {
    const {productItem} = this.state
    const {similarProducts} = productItem

    return (
      <ul className="similar-products">
        {similarProducts.map(item => (
          <SimilarProductItem similarItem={item} key={item.id} />
        ))}
      </ul>
    )
  }

  onDisplayProductDetails = () => {
    const {productItem, quantity} = this.state
    const {
      imageUrl,
      title,
      totalReviews,
      brand,
      availability,
      rating,
      description,
      price,
    } = productItem

    return (
      <>
        <Header />
        <div className="product-container">
          <img src={imageUrl} alt="product" className="image" />
          <div className="details-container">
            <h1 className="product-title">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="title-review-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <div className="available-container">
              <p className="available">Available:</p>
              <p className="stock"> {availability}</p>
            </div>
            <div className="available-container">
              <p className="available">Brand:</p>
              <p className="stock"> {brand}</p>
            </div>
            <hr className="hr-line" />
            <div className="quantity-container">
              <button
                type="button"
                className="decrease-quantity"
                onClick={this.onDecreaseQuantity}
                testid="minus"
              >
                <BsDashSquare className="decrease-quantity" />
              </button>
              <p className="quantity">{quantity}</p>
              <button
                type="button"
                className="decrease-quantity"
                onClick={this.onIncreaseQuantity}
                testid="plus"
              >
                <BsPlusSquare className="decrease-quantity" />
              </button>
            </div>
            <button className="add-to-cart" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        {this.similarProductsItems()}
      </>
    )
  }

  onDisplayDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.inProgressData()
      case apiStatusConstants.failure:
        return this.onProductNotFound()
      case apiStatusConstants.success:
        return this.onDisplayProductDetails()
      default:
        return null
    }
  }

  render() {
    return <div>{this.onDisplayDetails()}</div>
  }
}

export default ProductItemDetails
