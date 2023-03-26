import { CollectionReference, Firestore } from "firebase-admin/firestore";
import { inject, singleton } from "tsyringe";
import { FIRESTORE_TOKEN } from "../config/firestore";
import { CreateTaskDto } from "./dtos/createTask.dto";
import { SetTaskDoneDto } from "./dtos/setTaskDone.dto";
import { ITask } from "./task.interface";

@singleton()
export default class TasksRepository {
  private readonly tasksCollection: CollectionReference;

  constructor(@inject(FIRESTORE_TOKEN) db: Firestore) {
    this.tasksCollection = db.collection("tasks");
  }

  async getTasks(): Promise<ITask[]> {
    const tasksRef = await this.tasksCollection.get();
    const tasks: ITask[] = [];
    tasksRef.forEach((taskRef) => {
      tasks.push(
        Object.assign({ id: taskRef.id }, taskRef.data() as Omit<ITask, "id">)
      );
    });
    return tasks;
  }

  async createTask({ title }: CreateTaskDto): Promise<ITask> {
    const taskRef = await this.tasksCollection.add({
      title,
      done: false,
    });
    return { id: taskRef.id, title, done: false };
  }

  async setTaskDone(taskId: string, { done }: SetTaskDoneDto): Promise<ITask> {
    const taskRef = await this.tasksCollection.doc(taskId).get();
    if (!taskRef.exists) {
      throw new Error("Task not found");
    }
    await taskRef.ref.update({ done });
    return Object.assign(
      { id: taskRef.id },
      taskRef.data() as Omit<ITask, "id">
    );
  }

  async deleteTask(taskId: string): Promise<void> {
    const taskRef = await this.tasksCollection.doc(taskId).get();
    if (!taskRef.exists) {
      throw new Error("Task not found");
    }
    await taskRef.ref.delete();
  }
}
