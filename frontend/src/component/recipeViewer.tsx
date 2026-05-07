import "../styles/recipeViewer.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
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
                    <button onClick={onClose} className="btn"><FontAwesomeIcon icon={faX} /></button>
                </div>

                <div className="recipeViewer__body">

                    <div className="recipeViewer__section">
                        <div className="recipeViewer__ingredients">

                        </div>
                    </div>

                    <div className="recipeViewer__section">
                        <div className="recipeViewer__steps">

                        </div>
                    </div>

                    <div className="recipeViewer__section">
                        <div className="recipeViewer__media">

                        </div>
                    </div>

                    <div className="recipeViewer__section">
                        <div className="recipeViewer__timeCost">

                        </div>

                    </div>

                    <div className="recipeViewer__section">
                        <div className="recipeViewer__notes">

                        </div>
                    </div>

                </div>
            </div>
        </div>
    </>
  )
}

export default RecipeViewer;