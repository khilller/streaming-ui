import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { Flights } from "@/components/stream/flights";
import { searchRecipes } from "./recipe";
import { Recipe, RecipeCard } from "@/components/stream/SingleRecipe";
import { searchByType } from "./recipetype";
import { RecipeByType, RecipeListDisplay} from "@/components/stream/RecipesByType";
import { ReactNode } from "react";
import { nanoid } from "nanoid";
import { SystemMessage } from "@/components/chat/SystemMessage";
import { getTasks } from "./taskAction";


//this is to search for recipe by ingredient
interface RecipeSearchResults {
    recipes: Recipe[];
    total: number;
    skip: number;
    limit: number;
}

export type ServerMessage = {
    role: "user" | "assistant";
    content: string;
  }
  
export type ClientMessage = {
    id: number;
    role: "user" | "assistant";
    display: ReactNode;
  }



export async function continueConversation(input: string): Promise<ClientMessage> {
    'use server';

    const histroy = getMutableAIState();

    const ui = await streamUI({
        model: openai('gpt-4o'),
        system: 'you are an expert sous chef that can help find a recipe',
        messages: [...histroy.get(), { role: 'user', content: input }],
        text: ({content, done}) => {
            if (done) {
                const nMessages: ServerMessage[] = [...histroy.get(), {role: 'assistant', content}];
                histroy.done(nMessages);
            }
            return <div>{content}</div>
        },
        tools: {
            searchForRecipes: {
                description: 'Search for recipes based on a ingredient',
                parameters: z.object({
                    ingredient: z.string().describe('The ingredient to search for'),
                }),
                generate: async function* ({ ingredient }) {
                    yield `Searching for recipes with ${ingredient}...`;
                    const results:RecipeSearchResults  = await searchRecipes(ingredient);

                    if (!results.recipes || results.recipes.length === 0) {
                        return (
                            <div className="text-center p-4 bg-yello-100 ronded-lg"> 
                                <p className="text-yellow-700">No recipes found for {ingredient}. Try another ingredient.</p>
                            </div>
                        )
                    }

                    return (
                        <div>
                            {results.recipes.map(recipe=> (
                                <RecipeCard recipe={recipe} key={recipe.id} />
                            ))}
                        </div>
                    )
                }
            },
            searchByType: {
                description: 'Search for recipes based on a recipe type',
                parameters: z.object({
                    type: z.string().describe('The type of recipe to search for'),
                }),
                generate: async function* ({ type}) {
                    yield `Searching for ${type} recipes...`;

                    const results:RecipeByType = await searchByType(type);

                    return (
                        <div className="px-4 py-8 flex flex-col items-start w-full" >
                            <RecipeListDisplay {...results} />
                        </div>
                    )
                }
            }
        }
    })

    return {
        id: Date.now(),
        role: 'assistant',
        display: ui.value
    }
}


export const AI = createAI<ServerMessage[], ClientMessage[]>({
    actions: {
      continueConversation,
      getTasks,
    },
    initialAIState: [],
    initialUIState: [],
  });