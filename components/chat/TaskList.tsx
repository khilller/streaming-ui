'use client'

import React, { useState, useEffect } from 'react';
import { PlusCircle, CheckCircle, Circle, FolderOpen } from 'lucide-react';

export type Task = {
  id: number;
  description: string;
  completed: boolean;
  project: string | null;
};

type TodoListProps = {
  initialTasks: Task[] | undefined;
};

const TodoList: React.FC<TodoListProps> = ({ initialTasks = [] }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAllTasks, setShowAllTasks] = useState(false);

  useEffect(() => {
    setTasks(Array.isArray(initialTasks) ? initialTasks : []);
  }, [initialTasks]);

  const toggleTask = (id: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const toggleShowAllTasks = () => {
    setShowAllTasks(!showAllTasks);
  };

  const filteredTasks = showAllTasks ? tasks : tasks.filter(t => !t.completed);
  const completedCount = tasks.filter(t => t.completed).length;

  if (!Array.isArray(tasks)) {
    return <div>Error: Tasks data is not in the correct format.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Tasks</h1>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">Total: {tasks.length}</p>
          <button 
            onClick={toggleShowAllTasks}
            className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            {showAllTasks ? 'Show Uncompleted' : 'Show All'} | Completed: {completedCount}
          </button>
        </div>
      </div>
      <ul className="divide-y divide-gray-200">
        {filteredTasks.map((task) => (
          <li 
            key={task.id} 
            className="flex items-center px-6 py-4 hover:bg-gray-50 transition-colors duration-150 ease-in-out"
          >
            <button 
              onClick={() => toggleTask(task.id)}
              className="flex-shrink-0 mr-3"
            >
              {task.completed ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <Circle className="w-6 h-6 text-gray-400" />
              )}
            </button>
            <div className="flex-grow">
              <p className={`text-sm ${task.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                {task.description}
              </p>
              {task.project && (
                <span className="inline-flex items-center mt-1 text-xs text-gray-500">
                  <FolderOpen className="w-4 h-4 mr-1" />
                  {task.project}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;