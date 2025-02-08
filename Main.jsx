import React from "react";
import IngredientsList from "./components/IngredientsList";
import ClaudeRecipe from "./components/ClaudeRecipe";
import { getRecipeFromChefClaude, getRecipeFromMistral } from "./ai";

export default function Main() {
  const [ingredients, setIngredients] = React.useState([]);
  const [recipe, setRecipe] = React.useState("");
  const [newIngredient, setNewIngredient] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  async function getRecipe() {
    setIsLoading(true);
    try {
      const recipeMarkdown = await getRecipeFromChefClaude(ingredients);
      setRecipe(recipeMarkdown);
      // Smooth scroll to recipe section
      document.getElementById("recipe-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } catch (error) {
      console.error("Failed to get recipe:", error);
      // Optionally add error handling UI here
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Only add ingredient if there's actually text input
    if (newIngredient.trim()) {
      setIngredients((prevIngredients) => [
        ...prevIngredients,
        newIngredient.trim(),
      ]);
      // Clear the input after adding
      setNewIngredient("");
    }
  }

  function handleInputChange(event) {
    setNewIngredient(event.target.value);
  }

  return (
    <main>
      <form onSubmit={handleSubmit} className="add-ingredient-form">
        <input
          type="text"
          placeholder="e.g. oregano"
          aria-label="Add ingredient"
          name="ingredient"
          value={newIngredient}
          onChange={handleInputChange}
        />
        <button type="submit">Add ingredient</button>
      </form>

      {ingredients.length > 0 && (
        <IngredientsList
          ingredients={ingredients}
          getRecipe={getRecipe}
          isLoading={isLoading}
        />
      )}

      {recipe && <ClaudeRecipe recipe={recipe} />}
    </main>
  );
}
