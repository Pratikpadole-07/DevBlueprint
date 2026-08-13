import Transaction from "../models/Transaction.js";

export const addTransaction = async (req, res) => {
    try {

        const {
            title,
            amount,
            type,
            category,
            description,
            date
        } = req.body;

        if (!title || !amount || !type || !category) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        const transaction = await Transaction.create({
            title,
            amount,
            type,
            category,
            description,
            date
        });

        res.status(201).json({
            message: "Transaction Added",
            transaction
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

export const getTransactions = async (req, res) => {

    try {

        const transactions = await Transaction.find()
            .sort({ date: -1 });

        res.status(200).json(transactions);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

export const getTransaction = async (req, res) => {

    try {

        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {

            return res.status(404).json({
                message: "Transaction Not Found"
            });

        }

        res.json(transaction);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
export const updateTransaction = async (req, res) => {

    try {

        const transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!transaction) {

            return res.status(404).json({
                message: "Transaction Not Found"
            });

        }

        res.json({
            message: "Updated Successfully",
            transaction
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

export const deleteTransaction = async (req, res) => {

    try {

        const transaction = await Transaction.findByIdAndDelete(
            req.params.id
        );

        if (!transaction) {

            return res.status(404).json({
                message: "Transaction Not Found"
            });

        }

        res.json({
            message: "Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

export const getSummary=async (req,res)=>{
    try{
        const income=await Transaction.aggregate([
            {
                $match: {
                    type:"income"
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$amount"
                    }
                }
            }
        ]);
        const expense = await Transaction.aggregate([
            {
                $match: {
                    type: "expense"
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$amount"
                    }
                }
            }
        ]);

        const totalIncome = income.length ? income[0].total : 0;

        const totalExpense = expense.length ? expense[0].total : 0;

        res.json({

            totalIncome,

            totalExpense,

            balance: totalIncome - totalExpense

        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }
};

export const categorySummary = async (req, res) => {

    try {

        const data = await Transaction.aggregate([

            {
                $match: {
                    type: "expense"
                }
            },

            {
                $group: {

                    _id: "$category",

                    total: {

                        $sum: "$amount"

                    }

                }

            },

            {

                $sort: {

                    total: -1

                }

            }

        ]);

        res.json(data);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

export const monthlyReport = async (req, res) => {

    try {

        const report = await Transaction.aggregate([

            {

                $group: {

                    _id: {

                        month: {

                            $month: "$date"

                        }

                    },

                    totalIncome: {

                        $sum: {

                            $cond: [

                                {

                                    $eq: [

                                        "$type",

                                        "income"

                                    ]

                                },

                                "$amount",

                                0

                            ]

                        }

                    },

                    totalExpense: {

                        $sum: {

                            $cond: [

                                {

                                    $eq: [

                                        "$type",

                                        "expense"

                                    ]

                                },

                                "$amount",

                                0

                            ]

                        }

                    }

                }

            },

            {

                $sort: {

                    "_id.month": 1

                }

            }

        ]);

        res.json(report);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};