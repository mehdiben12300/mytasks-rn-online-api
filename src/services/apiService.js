import { getApiUrl } from '../config/api';

export const apiService = {
  // Récupérer la liste des tâches
  async getAllTasks() {
    const url = `${getApiUrl()}/tasks`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Erreur HTTP: ${res.status}`);
    }
    return await res.json();
  },

  // Récupérer une tâche
  async getTaskById(id) {
    const url = `${getApiUrl()}/tasks/${id}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Erreur HTTP: ${res.status}`);
    }
    return await res.json();
  },

  // Créer une nouvelle tâche
  async createTask(taskData) {
    const url = `${getApiUrl()}/tasks`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) {
      throw new Error(`Erreur HTTP: ${res.status}`);
    }
    return await res.json();
  },

  // Mettre à jour une tâche
  async updateTask(id, taskData) {
    const url = `${getApiUrl()}/tasks/${id}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) {
      throw new Error(`Erreur HTTP: ${res.status}`);
    }
    return await res.json();
  },

  // Supprimer une tâche
  async deleteTask(id) {
    const url = `${getApiUrl()}/tasks/${id}`;
    const res = await fetch(url, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error(`Erreur HTTP: ${res.status}`);
    }
    return await res.json();
  },

  // Réinitialiser les données
  async resetTasks() {
    const url = `${getApiUrl()}/tasks/reset`;
    const res = await fetch(url, { method: 'POST' });
    if (!res.ok) {
      throw new Error(`Erreur HTTP: ${res.status}`);
    }
    return await res.json();
  },
};

export default apiService;
