import Task from '../src/models/task.model.js';

// 🟢 CREATE a new task
export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user._id; // Got this from protectRoute middleware!

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const newTask = new Task({
      title,
      user: userId, // Link the task to the logged-in user
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error in createTask:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🔵 READ all tasks for the logged-in user
export const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find all tasks where the 'user' field matches the logged-in user's ID
    // .sort({ createdAt: -1 }) puts the newest tasks at the top!
    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });
    
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error in getTasks:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🟠 UPDATE a task (e.g., mark as completed)
export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user._id;
    const { title, completed } = req.body;

    // Find the task AND make sure it belongs to this user
    const task = await Task.findOne({ _id: taskId, user: userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    // Update the fields if they were provided in the request
    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    console.error('Error in updateTask:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 🔴 DELETE a task
export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user._id;

    // Find and delete the task ONLY if it belongs to this user
    const deletedTask = await Task.findOneAndDelete({ _id: taskId, user: userId });

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error in deleteTask:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};