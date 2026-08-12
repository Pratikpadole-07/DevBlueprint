import Product from "../models/Product.js";


export const addProduct=async (req,res)=>{
    try{
        const {name,description,price,category,stock,image}=req.body;

        if (
            !name ||
            !description ||
            price == null ||
            !category
        ) {

            return res.status(400).json({
                message: "All required fields are mandatory"
            });

        }

        const product=await Product.create({
            name,
            description,
            price,
            category,
            stock,
            image
        });
        res.status(201).json({
            message:"product Added successfully",
            product
        });

    }
    catch(error){
        res.status(500).josn({
            message:error.message
        })
    }
};

export const getProduct=async (req,res)=>{
    try{
        const{ keyword, 
            category,
            minPrice,
            maxPrice, 
            sort="createdAt", 
            order="desc", 
            page=1,
            limit=10}=req.body;

            let filter={};

            if(keyword){
                filter.name={
                    $regex:keyword,
                    $options:"i"
                };
            }

            if(category){
                filter.category=category;
            }
            if(minPrice || maxPrice){
                filter.price={};

                if(minPrice){
                    filter.price.$gte=Number(minPrice);

                }
                if(maxPrice){
                    filter.price.$gte=Number(maxPrice);
                    
                }

            }

            const products=(await Product.find(filter)).sort({
                [sort]: order==="asc" ? 1 : -1
            }).skip((page-1)*limit)
            .limit(Number(limit));

            const totalProducts=await Product.countDocuments(filter);

            res.status(200).json({

            totalProducts,

            currentPage: Number(page),

            totalPages: Math.ceil(totalProducts / limit),

            products

        });
    }
    catch(error){
        res.status(500).json({
            message: error.message
        });
    }

};


export const getProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({
                message: "Product Not Found"
            });

        }

        res.status(200).json(product);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


/*
    Update Product
    PUT /api/products/:id
*/
export const updateProduct = async (req, res) => {

    try {

        const product = await Product.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new: true,
                runValidators: true
            }

        );

        if (!product) {

            return res.status(404).json({
                message: "Product Not Found"
            });

        }

        res.status(200).json({

            message: "Product Updated",

            product

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


/*
    Delete Product
    DELETE /api/products/:id
*/
export const deleteProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({
                message: "Product Not Found"
            });

        }

        await product.deleteOne();

        res.status(200).json({

            message: "Product Deleted Successfully"

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};