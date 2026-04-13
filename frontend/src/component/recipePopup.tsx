import "../styles/recipePopup.css"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPlus } from "@fortawesome/free-solid-svg-icons";

interface PopupProps {
  onClose: () => void;
}

function RecipePopup({onClose}: PopupProps) {

  const [steps, setSteps] = useState<string[]>([""]);
  
  const addStep = () => setSteps([...steps, ""]);

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, value: string) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
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
                <input type="text" placeholder="e.g. Classic Pancakes"/>
              </div>

              <div className="popup__input__block">
                <p className="popup__input__lable">Ingredients</p>
                <textarea rows={5} placeholder="e.g. 2 cups floaus&#10;2 egss&#10;1½ cups milk"/>
              </div>

              <div className="popup__input__block">
                <div className="popup__input__lable popup__input__lable--row">
                  <p>Steps</p>
                  <button className="btn btn--secondary" onClick={addStep}>
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
                      onChange={(e) => updateStep(index, e.target.value)} />

                      <button className="btn btn--icon" onClick={() => removeStep(index)}>
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
