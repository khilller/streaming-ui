'use client'

import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, FolderOpen } from 'lucide-react';

export type Task = {
  id: number;
  description: string;
  completed: boolean;
  project: string | null;
};

type TodoListProps = {
  task: Task;
};

const SingleTask: React.FC<TodoListProps> = ({ task: initialTask }) => {
  const [task, setTask] = useState<Task>(initialTask);

  useEffect(() => {
    setTask(initialTask);
  }, [initialTask]);

  const toggleTask = () => {
    setTask(prevTask => ({
      ...prevTask,
      completed: !prevTask.completed
    }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <ul className="divide-y divide-gray-200">
        <li 
          key={task.id} 
          className="flex items-center px-6 py-4 hover:bg-gray-50 transition-colors duration-150 ease-in-out"
        >
          <button 
            onClick={toggleTask}
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
      </ul>
    </div>
  );
};

export default SingleTask;