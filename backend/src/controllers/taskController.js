const Joi = require('joi');
const Task = require('../models/Task');
const User = require('../models/User');

const createTaskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).required(),
  points: Joi.number().min(1).required(),
  deadline: Joi.date().greater('now').required(),
  assignedTo: Joi.array().items(Joi.string().hex().length(24)).optional(),
});

const assignTaskSchema = Joi.object({
  taskId: Joi.string().hex().length(24).required(),
  userIds: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
});

const createTask = async (req, res) => {
  try {
    const { error } = createTaskSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { title, description, points, deadline, assignedTo } = req.body;

    const task = await Task.create({
      title,
      description,
      points,
      deadline,
      createdBy: req.user._id,
      assignedTo: assignedTo || [],
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'ambassador') {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query)
      .populate('createdBy', 'name')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('assignedTo', 'name email');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Check if user can view this task
    if (req.user.role === 'ambassador' && !task.assignedTo.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to view this task' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignTask = async (req, res) => {
  try {
    const { error } = assignTaskSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { taskId, userIds } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Check if all users exist and are ambassadors
    const users = await User.find({ _id: { $in: userIds }, role: 'ambassador' });
    if (users.length !== userIds.length) {
      return res.status(400).json({ message: 'Invalid user IDs or users are not ambassadors' });
    }

    task.assignedTo = [...new Set([...task.assignedTo, ...userIds])];
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const allowedFields = ['title', 'description', 'points', 'deadline', 'status'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.remove();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  assignTask,
  updateTask,
  deleteTask,
};