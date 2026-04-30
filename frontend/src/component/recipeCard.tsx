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
          <div className="card__title">
              {recipe.name}
          </div>
          <div className="card__image">
            {recipe.imagesURL && recipe.imagesURL.length > 0 ? (
            <img src={recipe.imagesURL[0]} alt="" />): (<p>No Image Found</p>)}
          </div>
          <div className="card__variables__container">

          </div>
        </div>
      </div>
      </>
  );
}

export default RecipeCard;