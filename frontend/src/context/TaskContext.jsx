import { createContext, useContext, useState, useEffect } from "react";
import * as taskService from "../services/taskService";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const fetchTasks = async () => {
    try {
      const data = await taskService.getTask();
      setTasks(data);
    } catch (error) {
      console.error("❌ Error al obtener tareas:", error.message);
    } finally {
      setLoadingTasks(false);
    }
  };

  const addTask = async (taskData) => {
    const newTask = await taskService.createTask(taskData);
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const deleteTask = async (id) => {
    await taskService.deleteTask(id);
    setTasks(prev => prev.filter(task => task._id !== id));
  };

  const updateTask = async (id, updatedData) => {
    const updatedTask = await taskService.updateTask(id, updatedData);
    setTasks(prev =>
      prev.map(task => (task._id === id ? updatedTask : task))
    );
    return updatedTask;
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, fetchTasks, addTask, deleteTask, updateTask, loadingTasks }}>
      {children}
    </TaskContext.Provider>
  );
};


export const useTasks = () => useContext(TaskContext);