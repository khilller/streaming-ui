// File: lib/taskClient.ts

interface Task {
    id: number;
    description: string;
    completed: boolean;
    project: string | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_URL = `${BASE_URL}/api/tasks`;

export async function getAllTasks(): Promise<Task[]> {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }
    return response.json();
}

export async function searchTasksByProject(project: string): Promise<Task[]> {
    const response = await fetch(`${API_URL}?project=${encodeURIComponent(project)}`);
    if (!response.ok) {
        throw new Error('Failed to search tasks by project');
    }
    return response.json();
}

export async function searchTasksByDescription(description: string): Promise<Task[]> {
    const response = await fetch(`${API_URL}?description=${encodeURIComponent(description)}`);
    if (!response.ok) {
        throw new Error('Failed to search tasks by description');
    }
    return response.json();
}

export async function addTask(description: string, project: string | null = null): Promise<Task> {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, project }),
    });
    if (!response.ok) {
        throw new Error('Failed to add task');
    }
    return response.json();
}

export async function updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
    });

    if (!response.ok) {
        throw new Error('Failed to update task');
    }
    return response.json();
}

export async function deleteTasksByProject(project: string): Promise<{ success: boolean, remainingTasks: number }> {
    const response = await fetch(`${API_URL}?project=${encodeURIComponent(project)}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete tasks by project');
    }
    return response.json();
}

export async function deleteTaskByDescription(description: string): Promise<{ success: boolean, remainingTasks: number }> {
    const response = await fetch(`${API_URL}?description=${encodeURIComponent(description)}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete task by description');
    }
    return response.json();
}