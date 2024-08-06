'use client'

import React from 'react';
import { useActions, useUIState } from 'ai/rsc';
import { ReactNode } from 'react';

//this is to search for recipe by type

interface RBT {
    id: number;
    name: string;
    tags: string[];
}

export interface RecipeByType {
    recipes: RBT[];
    total: number;
    skip: number;
    limit: number;
}

const TypeCard: React.FC<RBT> = ({ name, tags}) => {

    const { submitUserMessage } = useActions();
    const [_, setMessages] = useUIState();

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
                <div 
                    className='cursor-pointer'
                    onClick={async () => {
                        const display = await submitUserMessage(
                            `searchRecipes ${name}`
                        );
                        setMessages((messages: ReactNode[]) => [...messages, display]);
                    }}
                >
                    <h2 className="text-xl font-semibold mb-2">{name}</h2>
                </div>
                <div className="flex flex-wrap">
                    {tags.map((tag, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 mb-2 px-2.5 py-0.5 rounded">
                        {tag}
                    </span>
                    ))}
                </div>
            </div>
        </div>
    )
};

const RecipeList: React.FC<RecipeByType> = ({ recipes, total, skip, limit }) => {
    return (
        <div>
            <p className='text-sm text-gray-600 mb-4'> Showing {recipes.length} of {total} recipes</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 '>
                {recipes.map((recipe) => (
                    <TypeCard key={recipe.id} {...recipe} />
                ))}
            </div>
        </div>
    )
}


export const RecipeListDisplay: React.FC<RecipeByType> = (props) => {
    return (
        <div className='w-full'>
            <h1 className='text-3xl font-bold mb-6'>Recipe List</h1>
            <RecipeList {...props} />
        </div>
    )
}
