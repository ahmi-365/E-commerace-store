import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AiOutlineHeart } from "react-icons/ai";
import { BiShoppingBag } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify components
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS

const ProductDetails = ({ addToCart }) => {
  const { id } = useParams();
  const [productDetailItem, setProductDetailItem] = useState({
    imageUrl: "", 
    name: "", 
    brand: "",
    category: "",
    sku: "",
    price: 0,
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for selected size, color, and quantity
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);  

  // Hardcoded size and professional color options
  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = ["#add8e6", "#d3d3d3", "#90ee90", "#e6e6fa", "#ffdab9", "#ffffe0"]; // Professional colors

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        console.log("Fetched product details:", response.data);

        if (response.data) {
          setProductDetailItem(response.data);
        } else {
          setError("Product details not found.");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to fetch product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-danger text-center">{error}</div>;
  }

  const productImage = productDetailItem.imageUrl 
    ? `http://localhost:5000/${productDetailItem.imageUrl}`
    : null;

  // Function to handle adding the product to the cart
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select both size and color before adding to cart.");
      return;
    }

    const cartItem = {
      ...productDetailItem,
      selectedSize,
      selectedColor,
      quantity,
    };
    addToCart(cartItem);

    // Show success message using Toastify
    toast.success(`${productDetailItem.name} added to cart with ${selectedSize} size.`);
  };

  return (
    <section className="container mx-auto my-5">
      <div className="row">
        {/* Product Image */}
        <div className="col-md-6 mb-4">
          {productImage ? (
            <img 
              src={productImage} 
              alt={productDetailItem.name}
              className="img-fluid rounded shadow" 
              style={{ border: '2px solid #f0f0f0', maxHeight: '400px', objectFit: 'cover' }}
            />
          ) : (
            <div className="text-muted">No image available</div>
          )}
        </div>

        {/* Product Description */}
        <div className="col-md-6">
          <div className="bg-light rounded p-4 shadow-sm">
            <h2 className="text-2xl font-bold mb-3">{productDetailItem.name}</h2>
            <p className="fw-bold mb-1">
              Brand: <span className="fw-normal">{productDetailItem.brand}</span>
            </p>
            <p className="fw-bold mb-1">
              Category: <span className="fw-normal">{productDetailItem.category}</span>
            </p>
            <p className="fw-bold mb-1">
              SKU: <span className="fw-normal">{productDetailItem.sku}</span>
            </p>
            <p className="mt-4 display-6 fw-bold text-violet">
              ${productDetailItem.price}
            </p>
            <p className="pt-5 text-muted mb-4">{productDetailItem.description}</p>

            {/* Size Selection */}
            <div className="mb-4">
              <p className="pb-2 text-bold">Size</p>
              <div className="d-flex gap-2">
                {sizes.map((size, index) => (
                  <div
                    key={index}
                    className={`size-option d-flex align-items-center justify-content-center border cursor-pointer ${selectedSize === size ? 'border-primary' : ''}`}
                    style={{ width: '40px', height: '40px', borderRadius: '5px', cursor: 'pointer' }}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-4">
              <p className="pb-2 text-bold">Color</p>
              <div className="d-flex gap-2">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    className={`color-option border cursor-pointer rounded ${selectedColor === color ? 'border-dark' : ''}`}
                    style={{
                      backgroundColor: color,
                      width: '40px', 
                      height: '40px',
                      border: '4px solid black',
                      cursor: 'pointer',
                      transition: 'transform 0.2s', // Hover effect
                    }}
                    onClick={() => setSelectedColor(color)}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />
                ))}
              </div>
            </div>

            {/* Add to Cart and Wishlist Buttons */}
            <div className="mt-4 d-flex gap-3">
              <button 
                className="btn btn-primary w-50 d-flex align-items-center justify-content-center shadow"
                onClick={handleAddToCart}
              >
                <BiShoppingBag className="mx-2" />
                Add to Cart
              </button>
              <button className="btn btn-warning w-50 d-flex align-items-center justify-content-center shadow">
                <AiOutlineHeart className="mx-2" />
                Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast container for showing notifications */}
      <ToastContainer position="top-center" />
    </section>
  );
};

export default ProductDetails;
