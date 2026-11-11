import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import apiService from '../services/apiService';
import { getApiUrl } from '../config/api';

const TaskContext = createContext();

const showAlert = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setError(null);
      const data = await apiService.getAllTasks();
      setTasks(data);
    } catch (err) {
      console.error('Erreur API :', err);
      setError(err.message || 'Serveur inaccessible');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
  };

  const addTask = async ({ title, description, priority }) => {
    try {
      const newTask = await apiService.createTask({
        title,
        description,
        priority,
        status: 'À faire',
      });
      setTasks((prev) => [newTask, ...prev]);
      setError(null);
      return newTask;
    } catch (err) {
      showAlert(
        'Connexion API Impossible',
        `Impossible de créer la tâche sur le serveur (${getApiUrl()}).\n\nVérifiez que le serveur backend est lancé (npm.cmd start dans le dossier backend).`
      );
      throw err;
    }
  };

  const updateTask = async (id, updatedFields) => {
    try {
      const updated = await apiService.updateTask(id, updatedFields);
      setTasks((prev) => prev.map((t) => (String(t.id) === String(id) ? updated : t)));
      setError(null);
      return updated;
    } catch (err) {
      showAlert(
        'Connexion API Impossible',
        `Impossible de modifier la tâche sur le serveur (${getApiUrl()}).\n\nVérifiez que le serveur backend est lancé.`
      );
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await apiService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => String(t.id) !== String(id)));
      setError(null);
    } catch (err) {
      showAlert(
        'Connexion API Impossible',
        `Impossible de supprimer la tâche sur le serveur (${getApiUrl()}).\n\nVérifiez que le serveur backend est lancé.`
      );
      throw err;
    }
  };

  const getTask = (id) => {
    return tasks.find((t) => String(t.id) === String(id));
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(
      (t) => t.status === 'Terminée' || t.status === 'Terminées'
    ).length;
    const pending = tasks.filter((t) => t.status === 'À faire').length;
    return { total, completed, pending };
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        refreshing,
        error,
        stats,
        onRefresh,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        getTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
