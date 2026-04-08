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
                Edit Recipe
            </div>
            <button onClick={onClose} className="btn btn--secondary">Close</button>
        </div>
    </div>

    </>
  )
}

export default RecipePopup
