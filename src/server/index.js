// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')('sk_test_51Q8JuzAepkvGYigUsKmHJpB31IpydHYuRCWx9F1MaaD5hIbZhzWUvQPtarlTwIrrYDv3C1szAl5JSn59N9gtVQeS00Uov1zkTg');
const endpointSecret = 'whsec_2c45ca9db14792ff20c545c956b0269da301811bb512516f3b04053e69a06bea'; // Your Stripe webhook secret

const app = express();
const PORT = process.env.PORT || 5000;
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
      // Use raw payload directly for Stripe's webhook verification
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      console.log('Webhook verified successfully:', event.id);
  } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      try {
          const order = await Order.findOne({ eventId: session.id });
          if (!order) {
              console.error("Order not found for session ID:", session.id);
              return res.status(404).send("Order not found");
          }

          const payment = new Payment({
              paymentId: session.id,
              orderId: order._id,
              amount: session.amount_total / 100,
              currency: session.currency,
              paymentStatus: 'paid',
              paymentMethod: session.payment_method_types[0],
              receiptUrl: session.receipt_url,
          });

          await payment.save();
          console.log("Payment saved successfully:", payment);

          order.status = 'Payment Succeed';
          await order.save();
          console.log("Order status updated successfully:", order);
      } catch (error) {
          console.error("Error saving payment or updating order:", error.message);
          return res.status(500).send("Error processing webhook");
      }
  }

  res.status(200).send('Webhook received');const cors = require('cors');

  app.use(cors({
    origin: [
      'http://localhost:5173',
      'https://ecommercestore-sigma.vercel.app'
    ]
  }));
  
});


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

// Order Schema
const OrderSchema = new mongoose.Schema({
    orderId: { type: String, default: uuidv4, required: true, unique: true },
    userEmail: { type: String, required: true },
    totalProductPrice: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    shippingCost: { type: Number, required: true, default: 0 },
    couponCode: { type: String, default: null },
    discountPercentage: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, default: Date.now },
    eventId: { type: String, default: null },
    originDate: { type: Date, default: null },
    status: { type: String, default: 'Pending' },
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

// Payment Schema
const PaymentSchema = new mongoose.Schema({
    paymentId: { type: String, required: true, unique: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    receiptUrl: { type: String },
});

const Payment = mongoose.model('Payment', PaymentSchema);

// Middleware for session handling
app.use(session({
  secret: 'ahmad',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Create checkout session
app.post("/api/create-checkout-session", async (req, res) => {
    const { cartItems, userEmail, shippingCost = 0, discountPercentage = 0, couponCode } = req.body;

    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ error: "No items in the cart" });
    }

    try {
        const totalProductPrice = cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        let totalAmount = totalProductPrice + parseFloat(shippingCost);

        if (discountPercentage > 0) {
            const discountAmount = (totalAmount * discountPercentage) / 100;
            totalAmount -= discountAmount;
        }

        const totalAmountInCents = Math.round(totalAmount * 100);

        const lineItems = [
            {
                price_data: {
                    currency: "usd",
                    product_data: { name: "Total Cart Amount" },
                    unit_amount: totalAmountInCents,
                },
                quantity: 1,
            },
        ];

        // Create a new order in the database
        const newOrder = new Order({
            userEmail,
            totalProductPrice,
            totalAmount,
            shippingCost,
            couponCode: couponCode || null,
            discountPercentage,
            status: "Pending",
        });

        await newOrder.save();

        // Create the Stripe checkout session with additional metadata
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
            metadata: {
                user_email: userEmail,
                order_id: newOrder._id.toString(), // Store the order ID in metadata
            },
            success_url: "http://localhost:5173/OrderHistory?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "http://localhost:5173/",
        });

        // Update the order to store the session ID as eventId for reference
        newOrder.eventId = session.id;
        await newOrder.save();

        // Create order items
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
// Use `express.json()` globally for other routes
app.use(express.json());
app.use(bodyParser.json());


// Fetch order details by ID
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

// Fetch all orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error.message);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});
// Delete an order by ID
app.delete("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order removed successfully" });
  } catch (error) {
    console.error("Error removing order:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// Load user and product routes
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
