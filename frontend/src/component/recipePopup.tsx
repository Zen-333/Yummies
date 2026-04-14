import "../styles/recipePopup.css"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPlus } from "@fortawesome/free-solid-svg-icons";

interface PopupProps {
  onClose: () => void;
}

function RecipePopup({onClose}: PopupProps) {

  const [steps, setSteps] = useState<string[]>([""]);
  const [recipeName, setRecipeName] = useState<string>("");
  const [recipeMedia, setRecipeMedia] = useState<string[]>([""]);
  const [recipeIngredients, setRecipeIngredients] = useState<string[]>([""]);
  const [recipeNotes, setRecipeNotes] = useState<string>("");

  const addToArray = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, defaultValue: T) => {setter((prev) => [...prev, defaultValue])}; 

  const removeFromArray = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number) => {
      setter((prev) => prev.filter((_, i) => i !== index));
  };

  const updateArray = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number, value: T) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };


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
                <input type="text" placeholder="e.g. Classic Pancakes" onChange={(e) => setRecipeName(e.target.value)}/>
              </div>

              <div className="popup__input__block">
                <p className="popup__input__lable">Ingredients</p>
                <textarea rows={5} placeholder="e.g. 2 cups floaus&#10;2 egss&#10;1½ cups milk"/>
              </div>

              <div className="popup__input__block">
                <div className="popup__input__lable popup__input__lable--row">
                  <p>Steps</p>
                  <button className="btn btn--secondary" onClick={() => addToArray<string>(setSteps, "")}>
                    <FontAwesomeIcon icon={faPlus}/> Add Step
                  </button>
                </div>
                <div className="popup__steps">
                  {steps.map((step, index) => (
                    <div key={index} className="popup__step__row">
                      <span className="popup__step__number">{index + 1}</span>
                      <input type="text" 
                      value={step} 
                      placeholder={`Step ${index + 1}`}
                      onChange={(e) => updateArray(setSteps, index,e.target.value)} />

                      <button className="btn btn--icon" onClick={() => removeFromArray(setSteps, index)}>
                        <FontAwesomeIcon icon={faX} />
                      </button>
                    </div>

                  ))}
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
                <textarea rows={3} placeholder="Any extra tips or serving suggestions..." onChange={(e) => setRecipeNotes(e.target.value)}></textarea>
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
