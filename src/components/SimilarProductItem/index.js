import {Link} from 'react-router-dom'

import './index.css'

const ProductCard = props => {
  const {similarItem} = props
  const {title, brand, imageUrl, rating, price, id} = similarItem

  return (
    //   Wrap with Link from react-router-dom
    <Link to={`/products/${id}`} className="link">
      <li className="similar-product-item">
        <img
          src={imageUrl}
          alt="similar product"
          className="similar-thumbnail"
        />
        <h1 className="similar-title">{title}</h1>
        <p className="similar-brand">by {brand}</p>
        <div className="similar-product-details">
          <p className="similar-price">Rs {price}/-</p>
          <div className="similar-rating-container">
            <p className="similar-rating">{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="similar-star"
            />
          </div>
        </div>
      </li>
    </Link>
  )
}
export default ProductCard
