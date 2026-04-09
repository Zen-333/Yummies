import "../styles/recipePopup.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

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
                <div className="popup__input__title">
                  <p>Recipe Name</p>
                </div>
                <div className="popup__input__field">
                  <input type="text"/>
                </div>
              </div>
            </div>
            <div className="popup__body">
              <div className="popup__input__block">
                <div className="popup__input__title">
                  <p>Ingredients</p>
                </div>
                <div className="popup__input__field">
                  <input type="text"/>
                </div>
              </div>
            </div>
            <div className="popup__body">
              <div className="popup__input__block">
                <div className="popup__input__title">
                  <p>Steps</p>
                </div>
                <div className="popup__input__field">
                  <input type="text"/>
                </div>
              </div>
            </div>
            <div className="popup__block">
              <div className="popup__input__block">
                <div className="popup__input__title">
                  <p>Images / Videos</p>
                </div>
                <div className="popup__input__field">
                  <input type="text"/>
                </div>
              </div>
            </div>
            <div className="popup_block">
              <div className="popup__input__block">
                <div className="popup__input__title">
                  <p>Notes</p>
                </div>
                <div className="popup__input__field">
                  <input type="text" className="popup__notes__input"/>
                </div>
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
