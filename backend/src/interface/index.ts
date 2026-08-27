import User from "../models/user/User";
import Category from "../models/category/Category";
import Supplier from "../models/supplier/Supplier";
import Product from "../models/product/Product";
import StockMovement from "../models/movement/StockMovement";


declare global {
    namespace Express {
        interface Request {
            user?: User;
            foundUser?: User;
            category?: Category;
            supplier?: Supplier;
            product?: Product;
            stockMovement?: StockMovement;
        }
    }
}

