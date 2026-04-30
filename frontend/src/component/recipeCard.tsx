import "../styles/recipeCard.css"
import type { Recipe } from "../../../backend/src/types/recipe"

interface RecipeCard { 
  recipe: Recipe;
  index: Number;
 }

function RecipeCard({recipe, index}: RecipeCard) {

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