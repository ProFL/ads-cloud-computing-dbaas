module.exports = (db) => {
  const tasksCollection = db.collection("tasks");

  return {
    getTasks: async () => {
      const tasksRef = await tasksCollection.get();
      const tasks = [];
      tasksRef.forEach((taskRef) => {
        const task = taskRef.data();
        task.id = taskRef.id;
        tasks.push(task);
      });
      return tasks;
    },

    createTask: async ({ title }) => {
      const taskRef = await tasksCollection.add({
        title,
        done: false,
      });
      return { id: taskRef.id, title, done: false };
    },

    setTaskDone: async (taskId, done) => {
      const taskRef = await tasksCollection.doc(taskId).get();
      if (!taskRef.exists) {
        throw new Error("Task not found");
      }
      await taskRef.ref.update({ done });
      const task = taskRef.data();
      task.id = taskRef.id;
      return task;
    },

    deleteTask: async (taskId) => {
      const taskRef = await tasksCollection.doc(taskId).get();
      if (!taskRef.exists) {
        throw new Error("Task not found");
      }
      await taskRef.ref.delete();
    },
  };
};
