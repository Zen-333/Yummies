import "../styles/recipeViewer.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faClock, faSterlingSign, faListCheck, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import type { Recipe } from "../../../backend/src/types/recipe";

interface RecipeViewerProps{
    onClose: () => void;
    recipe: Recipe;
}

function RecipeViewer({onClose, recipe}: RecipeViewerProps) {

  return ( 
      <>
        <div className="recipeViewer-overlay" onClick={onClose}>
            <div className="recipeViewer" onClick={(e) => e.stopPropagation()}>

                <div className="recipeViewer__title">
                    <p>{recipe.name}</p>
                    <button onClick={onClose} className="btn recipeViewer__close-btn"><FontAwesomeIcon icon={faX} /></button>
                </div>

                <div className="recipeViewer__body">

                    {/* Stats Bar */}
                    <div className="recipeViewer__stats">
                        <div className="recipeViewer__stat">
                            <FontAwesomeIcon icon={faClock} className="recipeViewer__stat-icon"/>
                            <span>{Number(recipe.timeHr) > 0 ? `${recipe.timeHr}hr ` : ""}{Number(recipe.timeMi) > 0 ? `${recipe.timeMi}m` : ""}{!recipe.timeHr && !recipe.timeMi ? "—" : ""}</span>
                        </div>
                        <div className="recipeViewer__stat-divider"/>
                        <div className="recipeViewer__stat">
                            <FontAwesomeIcon icon={faSterlingSign} className="recipeViewer__stat-icon"/>
                            <span>{recipe.cost ? `${recipe.cost}` : "—"}</span>
                        </div>
                        <div className="recipeViewer__stat-divider"/>
                        <div className="recipeViewer__stat">
                            <FontAwesomeIcon icon={faCartShopping} className="recipeViewer__stat-icon"/>
                            <span>{recipe.ingredients?.length ?? 0} ingredients</span>
                        </div>
                        <div className="recipeViewer__stat-divider"/>
                        <div className="recipeViewer__stat">
                            <FontAwesomeIcon icon={faListCheck} className="recipeViewer__stat-icon"/>
                            <span>{recipe.steps?.length ?? 0} steps</span>
                        </div>
                    </div>

                    {/* Ingredients */}
                    {recipe.ingredients && recipe.ingredients.length > 0 && (
                        <div className="recipeViewer__section">
                            <div className="recipeViewer__section-title">Ingredients</div>
                            <div className="recipeViewer__ingredients">
                                {recipe.ingredients.map((ingredient, index) => (
                                    <span key={index} className="recipeViewer__ingredient-chip">
                                        {ingredient}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Steps */}
                    {recipe.steps && recipe.steps.length > 0 && (
                        <div className="recipeViewer__section">
                            <div className="recipeViewer__section-title">Steps</div>
                            <div className="recipeViewer__steps">
                                {recipe.steps.map((step, index) => (
                                    <div key={index} className="recipeViewer__step">
                                        <div className="recipeViewer__step-number">{index + 1}</div>
                                        <div className="recipeViewer__step-text">{step}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Images */}
                    {recipe.imagesURL && recipe.imagesURL.length > 0 && (
                        <div className="recipeViewer__section">
                            <div className="recipeViewer__section-title">Images & Videos</div>
                            <div className="recipeViewer__media">
                                {recipe.imagesURL.map((url, index) => (
                                    <img key={index} src={url} alt={`${recipe.name} ${index + 1}`} className="recipeViewer__media-img"/>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {recipe.notes && recipe.notes.trim() !== "" && (
                        <div className="recipeViewer__section">
                            <div className="recipeViewer__section-title">Notes</div>
                            <div className="recipeViewer__notes">
                                {recipe.notes}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    </>
  )
}

export default RecipeViewer;