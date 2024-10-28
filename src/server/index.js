// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const path = require("path");
// const session = require("express-session");
// const { v4: uuidv4 } = require("uuid");
// const stripe = require("stripe")(
//   "sk_test_51Q8JuzAepkvGYigUsKmHJpB31IpydHYuRCWx9F1MaaD5hIbZhzWUvQPtarlTwIrrYDv3C1szAl5JSn59N9gtVQeS00Uov1zkTg"
// );

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware setup
// app.use(cors({ origin: "http://localhost:5173" }));
// app.use(express.json());
// app.use(bodyParser.json());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // MongoDB connection
// mongoose
//   .connect("mongodb://127.0.0.1:27017/Product", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected successfully"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Order Schema
// const OrderSchema = new mongoose.Schema({
//   orderId: { type: String, default: uuidv4, required: true, unique: true },
//   userEmail: { type: String, required: true },
//   totalProductPrice: { type: Number, required: true }, // Price before discount
//   totalAmount: { type: Number, required: true }, // Total after discount and shipping
//   shippingCost: { type: Number, default: 0 }, // Default value if not provided
//   discountPercentage: { type: Number, default: 0 }, // Default value if not provided
//   createdAt: { type: Date, default: Date.now },
//   status: { type: String, default: "Pending" },
//   couponCode: { type: String, default: "" },
// });

// // OrderItem Schema
// const OrderItemSchema = new mongoose.Schema({
//   orderId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Order",
//     required: true,
//   },
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product",
//     required: true,
//   },
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   quantity: { type: Number, required: true },
//   imageUrl: { type: String, required: true },
//   description: String,
//   brand: String,
//   category: String,
//   sku: String,
//   selectedSize: String,
//   selectedColor: String,
// });

// const Order = mongoose.model("Order", OrderSchema);
// const OrderItem = mongoose.model("OrderItem", OrderItemSchema);

// // Session setup
// app.use(
//   session({
//     secret: "ahmad",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false }, // Note: Set secure to true in production
//   })
// );

// // API endpoint for creating checkout session
// app.post("/api/create-checkout-session", async (req, res) => {
//   const {
//     cartItems,
//     userEmail,
//     shippingCost = 0,
//     discountPercentage = 0,
//   } = req.body;

//   if (!cartItems || cartItems.length === 0) {
//     return res.status(400).json({ error: "No items in the cart" });
//   }

//   try {
//     const totalProductPrice = cartItems.reduce(
//       (total, item) => total + item.price * item.quantity,
//       0
//     );

//     let totalAmount = totalProductPrice;
//     totalAmount += parseFloat(shippingCost);

//     if (discountPercentage > 0) {
//       const discountAmount = (totalAmount * discountPercentage) / 100;
//       totalAmount -= discountAmount;
//     }

//     const totalAmountInCents = Math.round(totalAmount * 100);

//     const lineItems = [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: "Total Cart Amount",
//           },
//           unit_amount: totalAmountInCents,
//         },
//         quantity: 1,
//       },
//     ];

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       line_items: lineItems,
//       success_url: "http://localhost:5173/OrderHistory",
//       cancel_url: "http://localhost:5173/",
//     });

//     const newOrder = new Order({
//       userEmail,
//       totalProductPrice,
//       totalAmount,
//       shippingCost,
//       discountPercentage,
//       status: "Pending",
//     });

//     await newOrder.save();

//     const orderItems = cartItems.map((item) => ({
//       orderId: newOrder._id,
//       productId: item._id,
//       name: item.name,
//       price: item.price,
//       quantity: item.quantity,
//       imageUrl: item.imageUrl,
//       description: item.description,
//       brand: item.brand,
//       category: item.category,
//       sku: item.sku,
//       selectedSize: item.selectedSize,
//       selectedColor: item.selectedColor,
//     }));

//     await OrderItem.insertMany(orderItems);

//     res.json({ id: session.id });
//   } catch (error) {
//     console.error("Failed to create Stripe session or save order:", error.message);
//     res.status(500).json({ error: "Failed to create Stripe session or save order" });
//   }
// });
// // Get order by ID
// // Get order by ID, populate order items
// app.get("/api/orders/:id", async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id).populate({
//       path: "items",
//       model: "OrderItem"
//     });
    
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.json(order);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });


// // Get all orders
// app.get('/api/orders', async (req, res) => {
//   try {
//       const orders = await Order.find(); // Fetch all orders
//       res.json(orders);
//   } catch (error) {
//       console.error('Error fetching orders:', error.message);
//       res.status(500).json({ error: 'Failed to fetch orders' });
//   }
// });

// // Delete an order by ID
// app.delete('/api/orders/:id', async (req, res) => {
//   try {
//       const order = await Order.findByIdAndDelete(req.params.id);
//       if (!order) {
//           return res.status(404).json({ message: "Order not found" });
//       }
//       res.status(200).json({ message: "Order removed successfully" });
//   } catch (error) {
//       console.error("Error removing order:", error);
//       res.status(500).json({ message: "Server error" });
//   }
// });

//   const userRoutes = require("./routes/userRoutes");
//   const productRoutes = require("./routes/productRoutes");
//   const couponRoutes = require("./routes/CoupenRoutes");

  
//   app.use("/api/users", userRoutes);
//   app.use("/api/coupons", couponRoutes);
//   app.use("/api/products", productRoutes);  
// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')('sk_test_51Q8JuzAepkvGYigUsKmHJpB31IpydHYuRCWx9F1MaaD5hIbZhzWUvQPtarlTwIrrYDv3C1szAl5JSn59N9gtVQeS00Uov1zkTg');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/Product', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Order schema definition
const OrderSchema = new mongoose.Schema({
    orderId: { type: String, default: uuidv4, required: true, unique: true },
    userEmail: { type: String, required: true },
    totalProductPrice: { type: Number, required: true }, // New field for the price before discount
    totalAmount: { type: Number, required: true }, // Total after discount and shipping
    shippingCost: { type: Number, required: true, default: 0 },
    couponCode: { type: String, default: null }, // New field for coupon code
    discountPercentage: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending' }
});

const OrderItemSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    description: String,
    brand: String,
    category: String,
    sku: String,
    selectedSize: String,
    selectedColor: String,
});

const Order = mongoose.model('Order', OrderSchema);
const OrderItem = mongoose.model('OrderItem', OrderItemSchema);

// Session setup
app.use(session({
    secret: 'ahmad',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Note: Set secure to true in production
}));

// API endpoint for creating checkout session
app.post("/api/create-checkout-session", async (req, res) => {
  const {
    cartItems,
    userEmail,
    shippingCost = 0,
    discountPercentage = 0,
    couponCode
  } = req.body;
  console.log("Received data:", req.body);

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: "No items in the cart" });
  }

  try {
    const totalProductPrice = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    let totalAmount = totalProductPrice;
    totalAmount += parseFloat(shippingCost);

    if (discountPercentage > 0) {
      const discountAmount = (totalAmount * discountPercentage) / 100;
      totalAmount -= discountAmount;
    }

    const totalAmountInCents = Math.round(totalAmount * 100);

    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Total Cart Amount",
          },
          unit_amount: totalAmountInCents,
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: "http://localhost:5173/OrderHistory",
      cancel_url: "http://localhost:5173/",
    });

    const newOrder = new Order({
      userEmail,
      totalProductPrice,
      totalAmount,
      shippingCost,
      couponCode: couponCode || null, // Ensure to set couponCode properly
      discountPercentage,
      status: "Pending",
    });

    await newOrder.save();

    const orderItems = cartItems.map((item) => ({
      orderId: newOrder._id,
      productId: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
      description: item.description,
      brand: item.brand,
      category: item.category,
      sku: item.sku,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor,
    }));

    await OrderItem.insertMany(orderItems);

    res.json({ id: session.id });
  } catch (error) {
    console.error("Failed to create Stripe session or save order:", error.message);
    res.status(500).json({ error: "Failed to create Stripe session or save order" });
  }
});

// API endpoint to get an order by ID
app.get("/api/orders/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        const orderItems = await OrderItem.find({ orderId: order._id });
        res.json({ order, items: orderItems });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// API endpoint to get all orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error.message);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// API endpoint to delete an order by ID
app.delete('/api/orders/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        } 
        await OrderItem.deleteMany({ orderId: order._id }); // Delete associated order items
        res.status(200).json({ message: "Order removed successfully" });
    } catch (error) {
        console.error("Error removing order:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Importing routes
const userRoutes = require('./routes/userRoutes');
const couponRoutes = require("./routes/CoupenRoutes");

const productRoutes = require('./routes/productRoutes');

app.use("/api/coupons", couponRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
