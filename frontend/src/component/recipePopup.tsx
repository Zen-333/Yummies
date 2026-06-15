import "../styles/recipePopup.css"
import { useState, useRef, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPlus, faImage } from "@fortawesome/free-solid-svg-icons";
import type { Recipe } from "../../../backend/src/types/recipe";
import { supabase } from '../lib/supabase'
import { API_BASE_URL } from '../config/config'
import { useAuth } from '../context/AuthContext'

interface PopupProps {
  onClose: () => void;
  onSaveSuccess: (message: string, isSuccess: boolean) => void;
  onRecipeUpdated: () => void;
  onGuestSave?: (recipe: Recipe) => void;
  recipeData?: Recipe;
}

interface MediaItem {
  file: File;
  previewUrl: string;
}

function RecipePopup({ onClose, onSaveSuccess, onRecipeUpdated, onGuestSave, recipeData }: PopupProps) {
  const { session } = useAuth()
  const isGuest = !session
  const isEditMode = recipeData !== undefined;

  // Cover image state
  const [existingCoverImageUrl, setExistingCoverImageUrl] = useState<string | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  // Gallery state
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [recipeMedia, setRecipeMedia] = useState<MediaItem[]>([]);

  // Recipe fields
  const [recipeSteps, setRecipeSteps] = useState<string[]>([""]);
  const [recipeName, setRecipeName] = useState<string>("");
  const [recipeIngredients, setRecipeIngredients] = useState<string[]>([""]);
  const [recipeNotes, setRecipeNotes] = useState<string>("");
  const [recipeTimeHr, setRecipeTimeHr] = useState<number>(0);
  const [recipeTimeMi, setRecipeTimeMi] = useState<number>(0);
  const [recipeCost, setRecipeCost] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

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
      setExistingCoverImageUrl(recipeData.cover_image_url ?? null);
    }
  }, []);

  // ── Cover image handlers ────────────────────────────────────────────────

  const handleCoverImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (coverImagePreview) URL.revokeObjectURL(coverImagePreview);
    setCoverImageFile(file);
    setCoverImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const removeCoverImage = () => {
    if (coverImagePreview) URL.revokeObjectURL(coverImagePreview);
    setCoverImageFile(null);
    setCoverImagePreview(null);
    setExistingCoverImageUrl(null);
  };

  const uploadCoverImage = async (): Promise<string | null> => {
    // No new file picked — return the existing URL (could be null if removed)
    if (!coverImageFile) return existingCoverImageUrl;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;

    const ext = coverImageFile.name.split('.').pop() ?? 'jpg';
    const uniqueName = `cover-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `${session.user.id}/${uniqueName}`;

    const { data, error } = await supabase.storage
      .from('recipe-images')
      .upload(filePath, coverImageFile, { cacheControl: '3600', upsert: false });

    if (error) {
      console.error('Cover image upload failed:', error.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  // ── Gallery handlers ────────────────────────────────────────────────────

  const handleMediaAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setRecipeMedia((prev) => [...prev, {file, previewUrl}]);
    e.target.value = "";
  };

  const removeMedia = (index: number) => {
    URL.revokeObjectURL(recipeMedia[index].previewUrl);
    removeFromArray(setRecipeMedia, index);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadNewImages = async (): Promise<string[]> => {
    if (recipeMedia.length === 0) return [];

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];

    const uploadedUrls: string[] = [];

    for (const item of recipeMedia) {
      const ext = item.file.name.split('.').pop() ?? 'jpg';
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
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

  // ── Array helpers ───────────────────────────────────────────────────────

  const addToArray = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>, defaultValue: T) => {
    setter((prev) => [...prev, defaultValue]);
  };

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

  // ── Save ────────────────────────────────────────────────────────────────

const handleSave = async () => {
  if (!recipeName.trim()) {
    onSaveSuccess("Please provide a recipe name", false);
    return;
  }

  // Guest mode: no uploads, store blob URLs directly in state
  if (isGuest) {
    const guestRecipe: Recipe = {
      id: isEditMode ? recipeData!.id : crypto.randomUUID(),
      name: recipeName,
      cover_image_url: (coverImagePreview ?? existingCoverImageUrl) ?? undefined,
      notes: recipeNotes || undefined,
      ingredients: recipeIngredients.filter(i => i.trim() !== ""),
      steps: recipeSteps.filter(s => s.trim() !== ""),
      time_hr: recipeTimeHr,
      time_mi: recipeTimeMi,
      cost: recipeCost,
      images_url: [...existingImages, ...recipeMedia.map(m => m.previewUrl)],
    };
    onGuestSave?.(guestRecipe);
    onSaveSuccess(
      isEditMode ? "Recipe updated!" : "Recipe added! Log in to save permanently.",
      true
    );
    onClose();
    return;
    // Note: blob URLs are NOT revoked here — they must stay valid in state
  }

  // Logged-in path: everything below this is unchanged
  setIsUploading(true);
  // ...

    const [coverImageUrl, newImageUrls] = await Promise.all([
      uploadCoverImage(),
      uploadNewImages(),
    ]);

    const allImageUrls = [...existingImages, ...newImageUrls];

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setIsUploading(false);
      onSaveSuccess("Not authenticated", false);
      return;
    }

    const url = isEditMode ? `${API_BASE_URL}/api/recipe/${recipeData.id}` : `${API_BASE_URL}/api/recipe`;
    const method = isEditMode ? "PUT" : "POST";

    const body = JSON.stringify({
      name: recipeName,
      cover_image_url: coverImageUrl,
      notes: recipeNotes,
      ingredients: recipeIngredients.filter(i => i.trim() !== ""),
      steps: recipeSteps.filter(s => s.trim() !== ""),
      time_hr: recipeTimeHr,
      time_mi: recipeTimeMi,
      cost: recipeCost,
      images_url: allImageUrls,
    });

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${session.access_token}` },
        body,
      });

      if (response.ok) {
        recipeMedia.forEach(item => URL.revokeObjectURL(item.previewUrl));
        if (coverImagePreview) URL.revokeObjectURL(coverImagePreview);
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
    } finally {
      setIsUploading(false);
    }
  };

  const showCover = coverImagePreview ?? existingCoverImageUrl;
  const hasNoGalleryMedia = existingImages.length === 0 && recipeMedia.length === 0;

  return (
    <>
      <div className="popup-overlay" onClick={onClose}>
        <div className="popup" onClick={(e) => e.stopPropagation()}>

          <div className="popup__title">
            <p>{isEditMode ? "Edit Recipe" : "Add Recipe"}</p>
            <button onClick={onClose} className="btn"><FontAwesomeIcon icon={faX} /></button>
          </div>

          <div className="popup__body">

            {/* ── Cover Image ── */}
            <div className="popup__input__block">
              <p className="popup__input__label">Cover Image</p>
              <div
                className={`popup__cover${showCover ? " popup__cover--filled" : ""}`}
                onClick={() => coverInputRef.current?.click()}
              >
                {showCover ? (
                  <>
                    <img src={showCover} alt="Cover preview" className="popup__cover__img" />
                    <button
                      className="btn popup__cover__remove"
                      onClick={(e) => { e.stopPropagation(); removeCoverImage(); }}
                    >
                      <FontAwesomeIcon icon={faX} />
                    </button>
                  </>
                ) : (
                  <div className="popup__cover__placeholder">
                    <FontAwesomeIcon icon={faImage} />
                    <span>Click to set a cover image</span>
                  </div>
                )}
              </div>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleCoverImagePick}
              />
            </div>

            {/* ── Recipe Name ── */}
            <div className="popup__input__block">
              <p className="popup__input__label">Recipe Name</p>
              <input type="text" value={recipeName} placeholder="e.g. Classic Pancakes" onChange={(e) => setRecipeName(e.target.value)} />
            </div>

            {/* ── Ingredients ── */}
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

            {/* ── Steps ── */}
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

            {/* ── Gallery Images ── */}
            <div className="popup__input__block">
              <div className="popup__input__label popup__input__label--row">
                <p>Gallery Images</p>
                <button className="btn btn--secondary" onClick={() => mediaInputRef.current?.click()}>
                  <FontAwesomeIcon icon={faPlus} /> Add Image
                </button>
                <input
                  ref={mediaInputRef}
                  type="file"
                  accept="image/*,video/*"
                  style={{ display: "none" }}
                  onChange={handleMediaAdd}
                />
              </div>

              {hasNoGalleryMedia ? (
                <p className="popup__empty__text">No gallery images added yet</p>
              ) : (
                <div className="popup__media__list">
                  {existingImages.map((url, index) => (
                    <div key={`existing-${index}`} className="popup__media__item">
                      <img src={url} alt={`existing ${index}`} className="popup__media__preview" />
                      <button className="btn btn--icon" onClick={() => removeExistingImage(index)}>
                        <FontAwesomeIcon icon={faX} />
                      </button>
                    </div>
                  ))}
                  {recipeMedia.map((item, index) => (
                    <div key={`new-${index}`} className="popup__media__item popup__media__item--new">
                      {item.file.type.startsWith("video/") ? (
                        <video src={item.previewUrl} controls className="popup__media__preview" />
                      ) : (
                        <img src={item.previewUrl} alt={item.file.name} className="popup__media__preview" />
                      )}
                      <button className="btn btn--icon" onClick={() => removeMedia(index)}>
                        <FontAwesomeIcon icon={faX} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Time & Cost ── */}
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

            {/* ── Notes ── */}
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