import "../styles/recipeCard.css"
import type { Recipe } from "../../../backend/src/types/recipe"

interface RecipeCardProps { 
  recipe: Recipe;
  index: Number;
 }

function RecipeCard({recipe, index}: RecipeCardProps) {

  if(!recipe) return null;

  return ( 
      <>
      <div className="card">
        <div className="card__container">
            {recipe.name}
        </div>
      </div>
        
      </>
  );
}

export default RecipeCard;