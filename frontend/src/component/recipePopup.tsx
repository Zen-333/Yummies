import "../styles/recipePopup.css"
import { useState, useRef, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPlus } from "@fortawesome/free-solid-svg-icons";
import type { Recipe } from "../../../backend/src/types/recipe";
import { supabase } from '../lib/supabase'

interface PopupProps {
  onClose: () => void;
  onSaveSuccess: (message: string, isSuccess: boolean) => void;
  onRecipeUpdated: () => void;
  recipeData?: Recipe;
}

interface MediaItem {
  file: File; /* It is a binary object that lives in the browser's memory */
  previewUrl: string;
}

function RecipePopup({onClose, onSaveSuccess, onRecipeUpdated, recipeData}: PopupProps) {

  const isEditMode = recipeData !== undefined;

  const [recipeSteps, setRecipeSteps] = useState<string[]>([""]);
  const [recipeName, setRecipeName] = useState<string>("");
  const [recipeMedia, setRecipeMedia] = useState<MediaItem[]>([]);
  const [recipeIngredients, setRecipeIngredients] = useState<string[]>([""]);
  const [recipeNotes, setRecipeNotes] = useState<string>("");
  const [recipeTimeHr, setRecipeTimeHr] = useState<Number>(0);
  const [recipeTimeMi, setRecipeTimeMi] = useState<Number>(0);
  const [recipeCost, setRecipeCost] = useState<Number>(0);

  const mediaInputRef = useRef<HTMLInputElement>(null); /* You’re telling TypeScript: "This pointer will eventually point to an Input tag." and its initial value is null*/

  useEffect(() => {
   if (isEditMode && recipeData) {
      setRecipeName(recipeData.name);
      setRecipeSteps(recipeData.steps && recipeData.steps.length > 0 ? recipeData.steps : [""]);
      setRecipeIngredients(recipeData.ingredients && recipeData.ingredients.length > 0 ? recipeData.ingredients : [""]);
      setRecipeNotes(recipeData.notes ?? "");
      setRecipeTimeHr(Number(recipeData.time_hr ?? 0));
      setRecipeTimeMi(Number(recipeData.time_mi ?? 0));
      setRecipeCost(Number(recipeData.cost ?? 0));
    }
  }, []);

  const handleMediaAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;

    const previewUrl = URL.createObjectURL(file); // This function creates a unique string pointer that points directly to the file in the browser’s RAM.
    setRecipeMedia((prev) => [...prev, {file, previewUrl}]);
  };

  const removeMedia = (index: number) => {
    URL.revokeObjectURL(recipeMedia[index].previewUrl); // removing the object from the browser's memory
    removeFromArray(setRecipeMedia, index);
  }

/*   we do <T,> with a comma so that the compilar doesnt think that this is an html tag but a template */
  const addToArray = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, defaultValue: T) => {setter((prev) => [...prev, defaultValue])}; 

  const removeFromArray = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number) => {
      setter((prev) => prev.filter((_, i) => i !== index)); /* the filter function gives us 2 values (item, index) so we name it (_,i) developers use an underscore _ as a universal signal for: "I am ignoring this variable."*/
  };

  const updateArray = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, index: number, value: T) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleSave = async () => {
    
    if(!recipeName.trim()){
      onSaveSuccess("Please provide a recipe name", false);
      return;
    }

    const body = JSON.stringify({
      name: recipeName,
      notes: recipeNotes,
      ingredients: recipeIngredients.filter(i => i.trim() !== ""),
      steps: recipeSteps.filter(s => s.trim() !== ""),
      time_hr: recipeTimeHr,
      time_mi: recipeTimeMi,
      cost: recipeCost,
      images_url: []
    });

    const url = isEditMode ? `/api/recipe/${recipeData.id}` : "/api/recipe";
    const method = isEditMode ? "PUT" : "POST";

    const {data: {session}} = await supabase.auth.getSession()
    if(!session) return;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {"Content-Type": "application/json",'Authorization': `Bearer ${session.access_token}`},
        body: body
      });

      if (response.ok) {
        recipeMedia.forEach(item => URL.revokeObjectURL(item.previewUrl));
        onSaveSuccess(isEditMode ? "Recipe updated successfully!" : "Recipe created successfully!", true);
        onRecipeUpdated();
        onClose();
      } else {
        const data = await response.json();
        onSaveSuccess(isEditMode ? "Failed to update recipe" : "Failed to create recipe", false);
        console.error("Save failed:", data.message);
      }
    } catch (error) {
      console.error("Save failed", error);
      onSaveSuccess("Network error occurred", false);
    }
  };


/*  FormData is a built-in Browser Class that handles all that "packaging" for you. 
    Why use it? You cannot put a binary File inside a JSON string. JSON only likes text. If you try to stringify a File, it turns into {} (empty).
    How it works: FormData creates a "Multipart" message. It’s like a shipping container with different compartments: */
/*     const formData = new FormData(); 

    formData.append("name", recipeName);
    formData.append("notes", recipeNotes);

    formData.append("ingredients", JSON.stringify(recipeIngredients));
    formData.append("steps", JSON.stringify(recipeSteps));

    recipeMedia.forEach((item) => {
      formData.append("images", item.file);
    });

    try {
      const response = await fetch("/api/recipe/", {
        method: "POST",
        body: formData,
      });

      if(response.ok){
        recipeMedia.forEach(item => URL.revokeObjectURL(item.previewUrl));
        onClose();
      }
    } catch (error) {
      console.error("Save failed", error);
    } */

 /*  }; */

  return (
    <> 
    <div className="popup-overlay" onClick={onClose}>
        <div className="popup" onClick={(e) => e.stopPropagation()}>

            <div className="popup__title">
                <p>{isEditMode ? "Edit Recipe" : "Add Recipe"}</p>
                <button onClick={onClose} className="btn"><FontAwesomeIcon icon={faX} /></button>
            </div>

            <div className="popup__body">

              <div className="popup__input__block">
                <p className="popup__input__label">Recipe Name</p>
                <input type="text" value={recipeName} placeholder="e.g. Classic Pancakes" onChange={(e) => setRecipeName(e.target.value)}/>
              </div>

              <div className="popup__input__block">
                <div className="popup__input__label popup__input__label--row">
                  <p>Ingredients</p>
                  <button className="btn btn--secondary" onClick={() => addToArray<string>(setRecipeIngredients, "")}>
                    <FontAwesomeIcon icon={faPlus}/> Add Ingredient
                  </button>
                </div>
                <div className="popup__steps">
                  {recipeIngredients.map((ingredient, index) => (
                    <div key={index} className="popup__step__row">
                      <span className="popup__step__number">{index + 1}</span>
                      <input type="text" 
                      value={ingredient} 
                      placeholder={`Ingredient ${index + 1}`}
                      onChange={(e) => updateArray(setRecipeIngredients, index,e.target.value)} />

                      <button className="btn btn--icon" onClick={() => removeFromArray(setRecipeIngredients, index)}>
                        <FontAwesomeIcon icon={faX} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="popup__input__block">
                <div className="popup__input__label popup__input__label--row">
                  <p>Steps</p>
                  <button className="btn btn--secondary" onClick={() => addToArray<string>(setRecipeSteps, "")}>
                    <FontAwesomeIcon icon={faPlus}/> Add Step
                  </button>
                </div>
                <div className="popup__steps">
                  {recipeSteps.map((steps, index) => (
                    <div key={index} className="popup__step__row">
                      <span className="popup__step__number">{index + 1}</span>
                      <input type="text" 
                      value={steps} 
                      placeholder={`Step ${index + 1}`}
                      onChange={(e) => updateArray(setRecipeSteps, index,e.target.value)} />

                      <button className="btn btn--icon" onClick={() => removeFromArray(setRecipeSteps, index)}>
                        <FontAwesomeIcon icon={faX} />
                      </button>
                    </div>

                  ))}
                </div>
              </div>

              <div className="popup__input__block">
                <div className="popup__input__label popup__input__label--row">
                  <p>Images / Videos(URLs)</p>
                    <button className="btn btn--secondary" onClick={() => mediaInputRef.current?.click()}> {/* // we pressing on the input field cuz its not visible to the user we check if its valid first */}
                      <FontAwesomeIcon icon={faPlus} /> Add Media
                    </button>

                    <input ref={mediaInputRef} 
                    type="file" 
                    accept="image/*,video/*"
                    style={{display: "none"}}
                    onChange={handleMediaAdd}/>
                </div>
                 { /* why do we have the {} here what does that mean */
                      recipeMedia.length === 0 ? (
                        <p className="popup__empty__text">No images or videos added yet</p>
                      ) : (
                        <div className="popup__media__list">
                          {recipeMedia.map((item, index) => (
                            <div key={index} className="popup__media__item"> {/* // the key is so react knows which DOM element belongs to which data item in your array */}
                              {item.file.type.startsWith("video/") ? (
                                <video src={item.previewUrl} controls className="popup__media__preview"></video>/* // By just writing the word controls, you are telling the browser: "Hey, give the user the standard Play/Pause/Volume buttons." Without this, the video would just be a static image that the user can't interact with. */
                              ) : (
                                <img src={item.previewUrl} alt={item.file.name} className="popup__media__preview" />
                              )}
                              <button className="btn btn--icon" onClick={() => removeMedia(index)}>
                                <FontAwesomeIcon icon={faX} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )
                    }
              </div>
              
            <div className="popup__input__block">
              <p className="popup__input__label">Time & Cost</p>
              <div className="popup__inline__fields">
                <div className="popup__inline__field">
                  <p className="popup__inline__label">Hours</p>
                  <input type="number" min="0" value={recipeTimeHr} placeholder="0" onChange={(e) => setRecipeTimeHr(Number(e.target.value))}/>
                </div>
                <div className="popup__inline__field">
                  <p className="popup__inline__label">Minutes</p>
                  <input type="number" min="0" max="59" value={recipeTimeMi} placeholder="0" onChange={(e) => setRecipeTimeMi(Number(e.target.value))}/>
                </div>
                <div className="popup__inline__field">
                  <p className="popup__inline__label">Cost (£)</p>
                  <input type="number" min="0" placeholder="0" value={recipeCost} onChange={(e) => setRecipeCost(Number(e.target.value))}/>
                </div>
              </div>
            </div>

              <div className="popup__input__block">
                <p className="popup__input__label">Notes</p>
                <textarea rows={3} value={recipeNotes} placeholder="Any extra tips or serving suggestions..." onChange={(e) => setRecipeNotes(e.target.value)}></textarea>
              </div>

            </div>

            <div className="popup__action__buttons">
              <button onClick={handleSave} className="btn btn--primary">{isEditMode ? "Save Changes" : "Add Recipe"}</button>
              <button onClick={onClose} className="btn btn--secondary">Cancel</button>
            </div>

        </div>
    </div>

    </>
  )
}

export default RecipePopup
