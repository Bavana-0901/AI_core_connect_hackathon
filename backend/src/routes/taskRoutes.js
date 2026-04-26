const express = require('express');
const {
  createTask,
  getTasks,
  getTaskById,
  assignTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All task routes require authentication

router.route('/')
  .get(getTasks)
  .post(authorize('admin'), createTask);

router.route('/:id')
  .get(getTaskById)
  .put(authorize('admin'), updateTask)
  .delete(authorize('admin'), deleteTask);

router.post('/:id/assign', authorize('admin'), assignTask);

module.exports = router;