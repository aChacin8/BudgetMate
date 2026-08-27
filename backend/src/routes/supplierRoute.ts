import express from 'express';
import { SupplierController } from '../controllers/supplier/SupplierController';
import { validateSupplierInput, validateSupplierExists } from '../middlewares/inventoryValidation';
import { authValidation } from '../middlewares/auth/authValidation';
import { handleInputErrors } from '../middlewares/hadleInputErrors';
import { getLimiter, postLimiter, deleteLimiter } from '../config/limiter';

export const supplierRouter = express.Router();

supplierRouter.use(authValidation);

supplierRouter.post('/',
    postLimiter,
    validateSupplierInput,
    handleInputErrors,
    SupplierController.createSupplier
);

supplierRouter.get('/',
    getLimiter,
    SupplierController.getSuppliers
);

supplierRouter.get('/:supplierId',
    getLimiter,
    validateSupplierExists,
    SupplierController.getSupplierById
);

supplierRouter.put('/:supplierId',
    postLimiter,
    validateSupplierExists,
    validateSupplierInput,
    handleInputErrors,
    SupplierController.updateSupplier
);

supplierRouter.delete('/:supplierId',
    deleteLimiter,
    validateSupplierExists,
    SupplierController.deleteSupplier
);
