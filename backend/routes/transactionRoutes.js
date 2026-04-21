import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getTransactions, 
  getAnalytics, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction 
} from '../controllers/mainController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTransactions)
  .post(createTransaction);

router.route('/analytics')
  .get(getAnalytics);

router.route('/:id')
  .patch(updateTransaction)
  .delete(deleteTransaction);

export default router;
