import express from 'express';
import { ProductController } from '../controllers/product/ProductController';
import { MovementController } from '../controllers/movement/MovementController';
import { validateProductInput, validateProductExists } from '../middlewares/inventoryValidation';
import { authValidation } from '../middlewares/auth/authValidation';
import { handleInputErrors } from '../middlewares/hadleInputErrors';
import { getLimiter, postLimiter, deleteLimiter } from '../config/limiter';

export const productRouter = express.Router();

productRouter.use(authValidation);

productRouter.post('/',
    postLimiter,
    validateProductInput,
    handleInputErrors,
    ProductController.createProduct
);

productRouter.get('/',
    getLimiter,
    ProductController.getProducts
);

productRouter.get('/:productId',
    getLimiter,
    validateProductExists,
    ProductController.getProductById
);

productRouter.put('/:productId',
    postLimiter,
    validateProductExists,
    validateProductInput,
    handleInputErrors,
    ProductController.updateProduct
);

productRouter.delete('/:productId',
    deleteLimiter,
    validateProductExists,
    ProductController.deleteProduct
);

// Register stock movement for a specific product
productRouter.post('/:productId/movements',
    postLimiter,
    validateProductExists,
    MovementController.createMovement
);
