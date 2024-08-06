import { createAI, streamUI } from "ai/rsc";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { Flights } from "@/components/stream/flights";
import { searchRecipes } from "./recipe";
import { Recipe, RecipeCard } from "@/components/stream/SingleRecipe";
import { searchByType } from "./recipetype";
import { RecipeByType, RecipeListDisplay} from "@/components/stream/RecipesByType";


//this is to search for recipe by ingredient
interface RecipeSearchResults {
    recipes: Recipe[];
    total: number;
    skip: number;
    limit: number;
}




export async function submitUserMessage(input: string) {
    'use server';

    const ui = await streamUI({
        model: openai('gpt-4o'),
        system: 'you are an expert sous chef that can help find a recipe',
        prompt: input,
        text: async ({ content }) => <div>{content}</div>,
        tools: {
            searchForRecipes: {
                description: 'Search for recipes based on a ingredient',
                parameters: z.object({
                    ingredient: z.string().describe('The ingredient to search for'),
                }),
                generate: async function* ({ ingredient }) {
                    yield `Searching for recipes with ${ingredient}...`;
                    const results:RecipeSearchResults  = await searchRecipes(ingredient);

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
                description: 'Search for recipes based on a type',
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

    return ui.value
}


export const AI = createAI<any[], React.ReactNode[]>({
    initialAIState: [],
    initialUIState: [],
    actions: {
        submitUserMessage,
    }
})