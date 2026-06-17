import "../styles/recipeCard.css"
import type { Recipe } from "../types/recipe"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faSterlingSign, faListCheck, faCartShopping, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";

interface RecipeCardProps { 
  recipe: Recipe;
  onDeleteFunc: (id: string) => void;
  showActionMessageState: (inShow: boolean, inMsg: string, inOnDanger: () => void, inDangerStr: string) => void;
  showEditPopup: (recipe: Recipe) => void;
  showRecipe: (recipe: Recipe) => void;
}

function RecipeCard({recipe, onDeleteFunc, showActionMessageState, showEditPopup, showRecipe}: RecipeCardProps) {

  if(!recipe) return null;

  const cardImage = recipe.cover_image_url ?? recipe.images_url?.[0] ?? null;

  return ( 
      <>
      <div className="card" onClick={() => showRecipe(recipe)}>
        <div className="card__container">
          <div className="card__header">
            <div className="card__title">
                {recipe.name}
            </div>
            <div className="card__buttons">
              <button className="btn--secondary btn" onClick={(e) => 
                {showEditPopup(recipe); e.stopPropagation();}}><FontAwesomeIcon icon={faPenToSquare} /></button>
              <button className="btn--secondary btn" onClick={(e) => 
                {showActionMessageState(true, `Are you sure you want to delete the "${recipe.name}" recipe?`, () => onDeleteFunc(recipe.id), "Delete");
                 e.stopPropagation();}}><FontAwesomeIcon icon={faTrashCan} /></button>
            </div>
          </div>
          <div className="card__image">
            {cardImage
              ? <img src={cardImage} alt={recipe.name} />
              : <p>No Image</p>
            }
          </div>
          <div className="card__variables__container">
              <div className="card__variables">
                <div className="card__variable"><FontAwesomeIcon icon={faClock} className="card__variables__icon"/><p> {recipe.time_hr ?? 0}hr {recipe.time_mi ?? 0}m </p></div>
                <div className="card__variable"><p><FontAwesomeIcon icon={faSterlingSign} className="card__variables__icon"/>{recipe.cost ?? 0}</p></div>
                <div className="card__variable"><FontAwesomeIcon icon={faListCheck} className="card__variables__icon"/><p>{recipe.steps?.length ?? 0}</p></div>
                <div className="card__variable"><FontAwesomeIcon icon={faCartShopping} className="card__variables__icon"/><p>{recipe.ingredients?.length ?? 0}</p></div>
              </div>
          </div>
        </div>
      </div>
      </>
  );
}

export default RecipeCard;