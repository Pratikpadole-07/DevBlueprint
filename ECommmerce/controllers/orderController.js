import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";


export const placeOrder=async (req,res)=>{
    try{
        const {shippingAddress}=req.body;

        if(!shippingAddress){
            return res.status(400).json({
                message:"Shipping Address is required"
            });
        }
        const cart=await cart.findOne({
            user:req.user._id
        }).populate("items.product");

        if(!cart || cart.items.length===0){
            return res.status(400).json({
                message:"cart is Empty"
            });
        }
        let totalAmount=0;
        const orderItems=[];

        for(const item of cart.items){
            const product=await Product.findById(item,product._id);

            if(!product){
                return res.status(404).json({
                    message:`Product not Found`
                });
            }
            if (product.stock < item.quantity) {

                return res.status(400).json({
                    message: `${product.name} is out of stock`
                });

            }

            totalAmount += product.price * item.quantity;

            orderItems.push({

                product: product._id,

                quantity: item.quantity,

                price: product.price

            });

        }
        for (const item of cart.items) {

            await Product.findByIdAndUpdate(

                item.product._id,

                {
                    $inc: {
                        stock: -item.quantity
                    }
                }

            );

        }
        const order = await Order.create({

            user: req.user._id,

            items: orderItems,

            totalAmount,

            shippingAddress,

            paymentStatus: "Pending",

            orderStatus: "Placed"

        });

        // Clear Cart
        cart.items = [];

        await cart.save();

        res.status(201).json({

            message: "Order Placed Successfully",

            order

        });
    }
    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

/*
    Get Logged In User Orders
    GET /api/orders
*/
export const getOrders = async (req, res) => {

    try {

        const orders = await Order.find({

            user: req.user._id

        })
        .populate("items.product")
        .sort({ createdAt: -1 });

        res.status(200).json(orders);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};



/*
    Get Order By Id
    GET /api/orders/:id
*/
export const getOrder = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id)
            .populate("items.product")
            .populate("user", "name email");

        if (!order) {

            return res.status(404).json({

                message: "Order Not Found"

            });

        }

        res.status(200).json(order);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};



/*
    Cancel Order
    PUT /api/orders/:id/cancel
*/
export const cancelOrder = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({

                message: "Order Not Found"

            });

        }

        if (order.orderStatus === "Delivered") {

            return res.status(400).json({

                message: "Delivered Order Cannot Be Cancelled"

            });

        }

        // Restore Stock
        for (const item of order.items) {

            await Product.findByIdAndUpdate(

                item.product,

                {

                    $inc: {

                        stock: item.quantity

                    }

                }

            );

        }

        order.orderStatus = "Cancelled";

        await order.save();

        res.status(200).json({

            message: "Order Cancelled Successfully",

            order

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};