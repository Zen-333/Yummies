import "../styles/recipePopup.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPlus } from "@fortawesome/free-solid-svg-icons";

interface PopupProps {
  onClose: () => void;
}

function RecipePopup({onClose}: PopupProps) {

  return (
    <> 
    <div className="popup-overlay" onClick={onClose}>
        <div className="popup" onClick={(e) => e.stopPropagation()}>

            <div className="popup__title">
                <p>Edit Recipe</p>
                <button onClick={onClose} className="btn"><FontAwesomeIcon icon={faX} /></button>
            </div>

            <div className="popup__body">

              <div className="popup__input__block">
                <p className="popup__input__lable">Recipe Name</p>
                <input type="text" placeholder="e.g. Classic Pancakes"/>
              </div>

              <div className="popup__input__block">
                <p className="popup__input__lable">Ingredients</p>
                <textarea rows={5} placeholder="e.g. 2 cups floaus&#10;2 egss&#10;1½ cups milk"/>
              </div>

              <div className="popup__input__block">
                <div className="popup__input__lable popup__input__lable--row">
                  <p>Steps</p>
                  <button className="btn btn--secondary">
                    <FontAwesomeIcon icon={faPlus}/> Add Step
                  </button>
                </div>
                <div className="popup__steps">

                </div>
              </div>

              <div className="popup__input__block">
                <div className="popup__input__lable popup__input__lable--row">
                  <p>Images / Videos(URLs)</p>
                    <button className="btn btn--secondary">
                      <FontAwesomeIcon icon={faPlus} /> Add Media
                    </button>
                </div>
                <p className="popup__empty__text">No images or videos added yet</p>
              </div>

              <div className="popup__input__block">
                <p className="popup__input__lable">Notes</p>
                <textarea rows={3} placeholder="Any extra tips or serving suggestions..."></textarea>
              </div>

            </div>
            
            <div className="popup__action__buttons">
              <button onClick={onClose} className="btn btn--primary">Save Changes</button>
              <button onClick={onClose} className="btn btn--secondary">Cancel</button>
            </div>

        </div>
    </div>

    </>
  )
}

export default RecipePopup
