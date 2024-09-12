import { openai } from "@ai-sdk/openai";
import { getMutableAIState, streamUI } from "ai/rsc";
import { ClientMessage, ServerMessage } from "./action";
import { z } from "zod";
import { addTask, deleteTaskByDescription, deleteTasksByProject, getAllTasks, searchTasksByDescription, searchTasksByProject } from "@/lib/taskData";
import TodoList from "@/components/chat/TaskList";
import { SpinnerMessage } from "@/components/chat/Spinner";
import SingleTask from "@/components/chat/SingleTask";








export async function getTasks(input: string): Promise<ClientMessage> {
    'use server';

    const history = getMutableAIState();

    const ui = await streamUI({
        model: openai('gpt-4o-mini'),
        initial: <SpinnerMessage />,
        system: 'you are an expert project manager that can help find a task',
        messages: [...history.get(), { role: 'user', content: input }],
        text: ({ content, done }) => {
            if (done) {
                const nMessages: ServerMessage[] = [...history.get(), { role: 'assistant', content }];
                history.done(nMessages);
            }
            return <div>{content}</div>
        },
        tools: {
            searchForTasks: {
                description: 'Search for tasks based on a project or description',
                parameters: z.object({
                    query: z.string().describe('The project or task description to search for'),
                    searchType: z.enum(['project', 'description', 'all']).describe('Whether to search by project, description, or show all tasks')

                }),
                generate: async function* ({ query, searchType }) {
                    let results
                    if (searchType === 'all') {
                        yield "Fetching all tasks...";
                        console.log("Fetching all tasks");
                        const results = await getAllTasks();
                        //console.log(results);
                        return (
                          <TodoList initialTasks={results} />
                        );
                      }

                    yield `Searching for tasks with ${searchType}: "${query}"...`;
                    console.log(`${searchType}: ${query}`);
                    
                    if (searchType === 'project') {
                        results = await searchTasksByProject(query);
                    } else {
                        results = await searchTasksByDescription(query);
                    }
                    
                    console.log(results);
                    return (
                        <TodoList initialTasks={results} />
                    )

                }
            },
            addTask: {
                description: 'Add new task to the list',
                parameters: z.object({
                    description: z.string().describe('The description of the task'),
                    project: z.string().optional().describe('The project associated with the task (optional)'),
                }),
                generate: async function* ({ description, project}) {
                    yield `Adding new task: "${description}" ${project ? `to project "${project}"` : ''}`;

                    const newTask = await addTask(description, project);

                    return (
                        <>
                        <p>Added the new task to the list</p>
                        <br></br>
                        <SingleTask task={newTask} />
                        </>
                    )
                }
            },
            deleteTask: {
                description: 'Delete a task from the list',
                parameters: z.object({
                    query: z.string().describe('The project or task description to search for'),
                    searchType: z.enum(['project', 'description', 'all']).describe('Whether to search by project, description, or show all tasks')

                }),
                generate: async function* ({ query, searchType }) {
                    yield `Searching for tasks with ${searchType}: "${query}"...`;
                    console.log(`${searchType}: ${query}`);

                    let results
                    let allTasks

                    if (searchType === 'project') {
                        results = await deleteTasksByProject(query);
                        allTasks = await getAllTasks();
                    } else {
                        results = await deleteTaskByDescription(query);
                    }

                    return (
                        <>
                        <p>Deleted the task from the list</p>
                        <p>Remaining Tasks: {results.remainingTasks}</p>
                        <br></br>
                        </>
                    )
                }
            },
            updateTask: {
                description: 'Update a task in the list',
                parameters: z.object({
                    query: z.string().describe('The project or task description to update'),
                    searchType: z.enum(['project', 'description']).describe('Whether to search by project, description, or show all tasks')

                }),
                generate: async function* ({ query, searchType }) {
                    yield `Searching for tasks with ${searchType}: "${query}"...`;
                    console.log(`${searchType}: ${query}`);

                    return (
                        <div>
                            <p>Updating the task...</p>
                        </div>
                    )

                }
            }
        },
    });

    return {
        id: Date.now(),
        role: 'assistant',
        display: ui.value
    }
}