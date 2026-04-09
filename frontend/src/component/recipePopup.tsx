import "../styles/recipePopup.css"

interface PopupProps {
  onClose: () => void;
}

function RecipePopup({onClose}: PopupProps) {

  return (
    <> 
    <div className="popup-overlay" onClick={onClose}>
        <div className="popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup__title">
                <h1>Edit Recipe</h1>
            </div>
            <div className="popup__input__block">
              <div className="popup__input__title">
                <h2>Recipe Name</h2>
              </div>
              <div className="popup__input__field">
                <input type="text"/>
              </div>
            </div>
            <div className="popup__input__block">
              <div className="popup__input__title">
                <h2>Ingredients</h2>
              </div>
              <div className="popup__input__field">
                <input type="text"/>
              </div>
            </div>
             <div className="popup__input__block">
              <div className="popup__input__title">
                <h2>Steps</h2>
              </div>
              <div className="popup__input__field">
                <input type="text"/>
              </div>
            </div>
             <div className="popup__input__block">
              <div className="popup__input__title">
                <h2>Images / Videos</h2>
              </div>
              <div className="popup__input__field">
                <input type="text"/>
              </div>
            </div>
             <div className="popup__input__block">
              <div className="popup__input__title">
                <h2>Notes</h2>
              </div>
              <div className="popup__input__field">
                <input type="text" className="popup__notes__input"/>
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
