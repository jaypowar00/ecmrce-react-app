import React, { PureComponent } from 'react'
import axios from 'axios'
import './styles/Products.css'
import './styles/spinkit.css'

class Products extends PureComponent {

    constructor(props) {
        super(props)
    
        this.state = {
             products: [],
             total_products: 0,
             categories: []
        }
    }
    
    componentDidMount(){
        axios.get('https://ecmrce-suflowapi.herokuapp.com/products/')
        .then(response => {
            let res = response.data.response
            this.setState({
                products: res.products,
                total_products: res.total_products,
                categories: res.categories
            })
            document.getElementById('products-request-loading').innerHTML=``;
        })
        .catch(err => {
            console.log(err);
            document.getElementById('products-request-loading').innerHTML=`failed to retrieve products from server...(try again after sometime or contact developer)`;
        })
    }

    render() {
        const products = this.state.products;
        console.log(this.state);
        return (
            <>
                <div className="product-container">
                    {
                        products.length?
                        products.map(product => {
                            let name = product.name.substring(0,50)+"...";
                        return(
                        <div key={product.productId} className="product-item">
                            <div className="product-thumbnail">
                                <img className="img-adjust-0" src={product.thumbnail} alt={product.name+"'s thumbnail"}></img><br/>
                            </div>
                            <div className="product-detail">
                                <div className="product-detail-text"><b>{name}</b><br/></div>
                                <div className="product-detail-text"><span>price: <b>Rs.{product.price}</b></span></div>
                            </div>
                            {/* <div className="product-detail-btn"><button className="btn btn-success shadow-none add-to-cart-btn">+</button></div> */}
                        </div>
                        )}
                        ):null
                    }
                </div>
                <div id="products-request-loading">
                    <div className="sk-wave sk-center">
                        <div className="sk-wave-rect"></div>
                        <div className="sk-wave-rect"></div>
                        <div className="sk-wave-rect"></div>
                        <div className="sk-wave-rect"></div>
                        <div className="sk-wave-rect"></div>
                    </div><br/>
                </div>
            </>
        )
    }
}

export default Products
