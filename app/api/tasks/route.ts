// File: app/api/tasks/route.ts

import { NextRequest, NextResponse } from 'next/server';

interface Task {
    id: number;
    description: string;
    completed: boolean;
    project: string | null;
}

let tasks: Task[] = [
    { id: 1, description: "Review client feedback on Johnson Residence plans", completed: false, project: "Johnson Residence" },
    { id: 2, description: "Prepare 3D renderings for City Center project", completed: false, project: "City Center" },
    { id: 3, description: "Update building code compliance checklist", completed: true, project: null },
    { id: 4, description: "Coordinate with structural engineer on Skyline Tower", completed: false, project: "Skyline Tower" },
    { id: 5, description: "Attend team meeting for project updates", completed: false, project: null },
    { id: 6, description: "Revise sustainable materials list for Green Living Complex", completed: false, project: "Green Living Complex" },
    { id: 7, description: "Submit permit application for Riverfront Development", completed: true, project: "Riverfront Development" },
    { id: 8, description: "Sketch initial concepts for new mall project", completed: false, project: "Metro Mall" },
    { id: 9, description: "Schedule site visit for Heritage Restoration project", completed: false, project: "Heritage Restoration" },
    { id: 10, description: "Research innovative facade systems for Tech Hub design", completed: false, project: "Tech Hub" }
];

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const project = searchParams.get('project');
    const description = searchParams.get('description');

    if (project) {
        const filteredTasks = tasks.filter(task => 
            task.project && task.project.toLowerCase().includes(project.toLowerCase())
        );
        return NextResponse.json(filteredTasks);
    }

    if (description) {
        const filteredTasks = tasks.filter(task => 
            task.description.toLowerCase().includes(description.toLowerCase())
        );
        return NextResponse.json(filteredTasks);
    }

    return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
    const { description, project } = await request.json();
    const newTask: Task = {
        id: Math.max(...tasks.map(t => t.id), 0) + 1,
        description,
        completed: false,
        project: project || null
    };
    tasks.push(newTask);

    return NextResponse.json(newTask, { status: 201 });
}

export async function PUT(request: NextRequest) {
    const { id, description, completed, project } = await request.json();
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            description: description || tasks[taskIndex].description,
            completed: completed !== undefined ? completed : tasks[taskIndex].completed,
            project: project !== undefined ? project : tasks[taskIndex].project
        };
        return NextResponse.json(tasks[taskIndex]);
    } else {
        return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const project = searchParams.get('project');
    const description = searchParams.get('description');

    if (project) {
        const initialLength = tasks.length;
        tasks = tasks.filter(task => !task.project || task.project.toLowerCase() !== project.toLowerCase());
        return NextResponse.json({ success: tasks.length !== initialLength, remainingTasks: tasks.length });
    } else if (description) {
        const initialLength = tasks.length;
        tasks = tasks.filter(t => t.description !== description);
        return NextResponse.json({ success: tasks.length !== initialLength, remainingTasks: tasks.length });
    } else {
        return NextResponse.json({ message: 'Project or description query parameter is required for DELETE' }, { status: 400 });
    }
}