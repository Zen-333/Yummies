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

  const [existingImages, setExistingImages] = useState<string[]>([]); 
  const [newMedia, setNewMedia] = useState<MediaItem[]>([]);    
  const [recipeSteps, setRecipeSteps] = useState<string[]>([""]);
  const [recipeName, setRecipeName] = useState<string>("");
  const [recipeMedia, setRecipeMedia] = useState<MediaItem[]>([]);
  const [recipeIngredients, setRecipeIngredients] = useState<string[]>([""]);
  const [recipeNotes, setRecipeNotes] = useState<string>("");
  const [recipeTimeHr, setRecipeTimeHr] = useState<Number>(0);
  const [recipeTimeMi, setRecipeTimeMi] = useState<Number>(0);
  const [recipeCost, setRecipeCost] = useState<Number>(0);
  const [isUploading, setIsUploading] = useState(false);

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
      setExistingImages(recipeData.images_url ?? []);
    }
  }, []);

  const handleMediaAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;

    const previewUrl = URL.createObjectURL(file); // This function creates a unique string pointer that points directly to the file in the browser’s RAM.
    setRecipeMedia((prev) => [...prev, {file, previewUrl}]);
    // reset input so the same file can be re-added if needed
    e.target.value = "";
  };

  const removeMedia = (index: number) => {
    URL.revokeObjectURL(recipeMedia[index].previewUrl); // removing the object from the browser's memory
    removeFromArray(setRecipeMedia, index);
  }

   // Removes a URL from the existing (already-saved) images list.
  // NOTE: This does NOT delete from Supabase Storage — it just removes the URL
  // from what gets saved on next submit. You can add Storage deletion here later.

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

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

  const uploadNewImages = async (): Promise<string[]> => {
  if (recipeMedia.length === 0) return [];

  // FIX: get the Supabase session here, not sessionStorage (browser Web Storage)
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];

  const uploadedUrls: string[] = [];

  for (const item of recipeMedia) {
    const ext = item.file.name.split('.').pop() ?? 'jpg';
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    // FIX: use session.user.id, not sessionStorage.user.id
    const filePath = `${session.user.id}/${uniqueName}`;

    const { data, error } = await supabase.storage
      .from('recipe-images')
      .upload(filePath, item.file, { cacheControl: '3600', upsert: false });

    if (error) {
      console.error('Storage upload failed for', item.file.name, error.message);
      continue;
    }

    const { data: urlData } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(data.path);

    uploadedUrls.push(urlData.publicUrl);
  }

  return uploadedUrls;
};

  const handleSave = async () => {
    
    if(!recipeName.trim()){
      onSaveSuccess("Please provide a recipe name", false);
      return;
    }

    setIsUploading(true);

    const newImageUrls = await uploadNewImages();

    const allImageUrls = [...existingImages, ...newImageUrls];

    const {data: {session}} = await supabase.auth.getSession()
    if(!session) 
      {
        setIsUploading(false);
        onSaveSuccess("Not authenticated", false);
        return;
      }
        
      const url = isEditMode ? `/api/recipe/${recipeData.id}` : "/api/recipe";
      const method = isEditMode ? "PUT" : "POST";

    const body = JSON.stringify({
      name: recipeName,
      notes: recipeNotes,
      ingredients: recipeIngredients.filter(i => i.trim() !== ""),
      steps: recipeSteps.filter(s => s.trim() !== ""),
      time_hr: recipeTimeHr,
      time_mi: recipeTimeMi,
      cost: recipeCost,
      images_url: allImageUrls
    });

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
    } finally{
      setIsUploading(false);
    }
  };

  const hasNoMedia = existingImages.length === 0 && recipeMedia.length === 0;

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
              <input type="text" value={recipeName} placeholder="e.g. Classic Pancakes" onChange={(e) => setRecipeName(e.target.value)} />
            </div>
 
            <div className="popup__input__block">
              <div className="popup__input__label popup__input__label--row">
                <p>Ingredients</p>
                <button className="btn btn--secondary" onClick={() => addToArray<string>(setRecipeIngredients, "")}>
                  <FontAwesomeIcon icon={faPlus} /> Add Ingredient
                </button>
              </div>
              <div className="popup__steps">
                {recipeIngredients.map((ingredient, index) => (
                  <div key={index} className="popup__step__row">
                    <span className="popup__step__number">{index + 1}</span>
                    <input type="text" value={ingredient} placeholder={`Ingredient ${index + 1}`}
                      onChange={(e) => updateArray(setRecipeIngredients, index, e.target.value)} />
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
                  <FontAwesomeIcon icon={faPlus} /> Add Step
                </button>
              </div>
              <div className="popup__steps">
                {recipeSteps.map((step, index) => (
                  <div key={index} className="popup__step__row">
                    <span className="popup__step__number">{index + 1}</span>
                    <input type="text" value={step} placeholder={`Step ${index + 1}`}
                      onChange={(e) => updateArray(setRecipeSteps, index, e.target.value)} />
                    <button className="btn btn--icon" onClick={() => removeFromArray(setRecipeSteps, index)}>
                      <FontAwesomeIcon icon={faX} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
 
            <div className="popup__input__block">
              <div className="popup__input__label popup__input__label--row">
                <p>Images / Videos</p>
                <button className="btn btn--secondary" onClick={() => mediaInputRef.current?.click()}>
                  <FontAwesomeIcon icon={faPlus} /> Add Media
                </button>
                <input
                  ref={mediaInputRef}
                  type="file"
                  accept="image/*,video/*"
                  style={{ display: "none" }}
                  onChange={handleMediaAdd}
                />
              </div>
 
              {hasNoMedia ? (
                <p className="popup__empty__text">No images or videos added yet</p>
              ) : (
                <div className="popup__media__list">
 
                  {/* Already-saved images (edit mode): show with a remove button */}
                  {existingImages.map((url, index) => (
                    <div key={`existing-${index}`} className="popup__media__item">
                      <img src={url} alt={`existing ${index}`} className="popup__media__preview" />
                      <button className="btn btn--icon" onClick={() => removeExistingImage(index)}>
                        <FontAwesomeIcon icon={faX} />
                      </button>
                    </div>
                  ))}
 
                  {/* New files picked this session: local blob preview */}
                  {recipeMedia.map((item, index) => (
                    <div key={`new-${index}`} className="popup__media__item popup__media__item--new">
                      {item.file.type.startsWith("video/") ? (
                        <video src={item.previewUrl} controls className="popup__media__preview" />
                      ) : (
                        <img src={item.previewUrl} alt={item.file.name} className="popup__media__preview" />
                      )}
                      <button className="btn btn--icon" onClick={() => removeNewMedia(index)}>
                        <FontAwesomeIcon icon={faX} />
                      </button>
                    </div>
                  ))}
 
                </div>
              )}
            </div>
 
            <div className="popup__input__block">
              <p className="popup__input__label">Time & Cost</p>
              <div className="popup__inline__fields">
                <div className="popup__inline__field">
                  <p className="popup__inline__label">Hours</p>
                  <input type="number" min="0" value={recipeTimeHr} placeholder="0" onChange={(e) => setRecipeTimeHr(Number(e.target.value))} />
                </div>
                <div className="popup__inline__field">
                  <p className="popup__inline__label">Minutes</p>
                  <input type="number" min="0" max="59" value={recipeTimeMi} placeholder="0" onChange={(e) => setRecipeTimeMi(Number(e.target.value))} />
                </div>
                <div className="popup__inline__field">
                  <p className="popup__inline__label">Cost (£)</p>
                  <input type="number" min="0" placeholder="0" value={recipeCost} onChange={(e) => setRecipeCost(Number(e.target.value))} />
                </div>
              </div>
            </div>
 
            <div className="popup__input__block">
              <p className="popup__input__label">Notes</p>
              <textarea rows={3} value={recipeNotes} placeholder="Any extra tips or serving suggestions..." onChange={(e) => setRecipeNotes(e.target.value)} />
            </div>
 
          </div>
 
          <div className="popup__action__buttons">
            <button onClick={handleSave} className="btn btn--primary" disabled={isUploading}>
              {isUploading ? "Saving..." : (isEditMode ? "Save Changes" : "Add Recipe")}
            </button>
            <button onClick={onClose} className="btn btn--secondary" disabled={isUploading}>Cancel</button>
          </div>
 
        </div>
      </div>
    </>
  );
}
 
export default RecipePopup;
