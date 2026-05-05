import "../styles/recipeCard.css"
import type { Recipe } from "../../../backend/src/types/recipe"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faSterlingSign, faListCheck, faCartShopping, faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";

interface RecipeCardProps { 
  recipe: Recipe;
  onDeleteFunc: (id: string) => void;
  showActionMessageState: (inShow: boolean, inMsg: string, inOnDanger: () => void) => void;
}

function RecipeCard({recipe, onDeleteFunc, showActionMessageState}: RecipeCardProps) {

  if(!recipe) return null;

  return ( 
      <>
      <div className="card">
        <div className="card__container">
          <div className="card__header">
            <div className="card__title">
                {recipe.name}
            </div>
            <div className="card__buttons">
              <button className="btn--secondary btn"><FontAwesomeIcon icon={faPenToSquare} /></button>
              <button className="btn--secondary btn" onClick={() => showActionMessageState(true, `Are you sure you want to delete the "${recipe.name}" recipe?`, () => onDeleteFunc(recipe._id))}><FontAwesomeIcon icon={faTrashCan} /></button>
            </div>
          </div>
          <div className="card__image">
            {recipe.imagesURL && recipe.imagesURL.length > 0 ? (
            <img src={recipe.imagesURL[0]} alt="" />): (<p>No Images Found</p>)}
          </div>
          <div className="card__variables__container">
              <div className="card__variables">
                {recipe.timeHr && recipe.timeMi ? (<div className="card__variable"><FontAwesomeIcon icon={faClock} className="card__variables__icon"/><p> {recipe.timeHr}hr {recipe.timeMi}m </p></div>): (<div className="card__variable"><FontAwesomeIcon icon={faClock} className="card__variables__icon"/><p> 0hr 0m</p></div>)}
                {recipe.cost ? (<div className="card__variable"><p><FontAwesomeIcon icon={faSterlingSign} className="card__variables__icon"/>{recipe.cost}</p></div>): (<div className="card__variable"><p><FontAwesomeIcon icon={faSterlingSign} className="card__variables__icon"/>0</p></div>)}
                {recipe.steps ? (<div className="card__variable"><FontAwesomeIcon icon={faListCheck} className="card__variables__icon"/><p>{recipe.steps.length}</p></div>): (<div className="card__variable"><FontAwesomeIcon icon={faListCheck} className="card__variables__icon"/><p>0</p></div>)}
                {recipe.ingredients ? (<div className="card__variable"><FontAwesomeIcon icon={faCartShopping} className="card__variables__icon"/><p>{recipe.ingredients.length}</p></div>): (<div className="card__variable"><FontAwesomeIcon icon={faCartShopping} className="card__variables__icon"/><p>0</p></div>)}
              </div>
          </div>
        </div>
      </div>
      </>
  );
}

export default RecipeCard;