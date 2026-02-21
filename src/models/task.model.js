import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // Removes accidental spaces at the beginning/end
    },
    completed: {
      type: Boolean,
      default: false, // All new tasks start as incomplete
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // 👈 This is the magic link to your User model!
      required: true,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt dates
);

const Task = mongoose.model('Task', taskSchema);

export default Task;