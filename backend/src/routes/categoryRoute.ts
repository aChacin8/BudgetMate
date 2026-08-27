import express from 'express';
import { CategoryController } from '../controllers/category/CategoryController';
import { validateCategoryInput, validateCategoryExists } from '../middlewares/inventoryValidation';
import { authValidation } from '../middlewares/auth/authValidation';
import { handleInputErrors } from '../middlewares/hadleInputErrors';
import { getLimiter, postLimiter, deleteLimiter } from '../config/limiter';

export const categoryRouter = express.Router();

categoryRouter.use(authValidation);

categoryRouter.post('/',
    postLimiter,
    validateCategoryInput,
    handleInputErrors,
    CategoryController.createCategory
);

categoryRouter.get('/',
    getLimiter,
    CategoryController.getCategories
);

categoryRouter.get('/:categoryId',
    getLimiter,
    validateCategoryExists,
    CategoryController.getCategoryById
);

categoryRouter.put('/:categoryId',
    postLimiter,
    validateCategoryExists,
    validateCategoryInput,
    handleInputErrors,
    CategoryController.updateCategory
);

categoryRouter.delete('/:categoryId',
    deleteLimiter,
    validateCategoryExists,
    CategoryController.deleteCategory
);
