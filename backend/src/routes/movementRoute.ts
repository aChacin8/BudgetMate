import express from 'express';
import { MovementController } from '../controllers/movement/MovementController';
import { authValidation } from '../middlewares/auth/authValidation';
import { getLimiter } from '../config/limiter';

export const movementRouter = express.Router();

movementRouter.use(authValidation);

// Get global list of movements (audit logs)
movementRouter.get('/',
    getLimiter,
    MovementController.getMovements
);
