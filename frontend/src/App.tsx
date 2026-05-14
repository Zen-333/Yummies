import { useState, useEffect } from 'react';
import './styles/App.css'
import Header from "./component/header"
import Hero from "./component/hero"
import RecipePopup from './component/recipePopup'
import SuccessMessage from './component/successMessage';
import RecipeCard from './component/recipeCard';
import type { Recipe } from "../../backend/src/types/recipe";
import ActionConfirmation from './component/actionConfirmation';
import RecipeViewer from './component/recipeViewer';

function App() {

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isViewRecipeOpen, setIsViewRecipeOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [showStatus, setShowStatus] = useState<{show: boolean, msg: string, success: boolean}>({
    show: false,
    msg: "",
    success: true
  });

  const [showActionMessage, setShowActionMessage] = useState<{
    show: boolean;
    msg: string;
    onDanger: () => void;
    dangerStr: string;
  }>({
    show: false,
    msg: "",
    onDanger: () => {},
    dangerStr: "",
  });

  const openAddPopup = () => {
    setEditingRecipe(null);
    setIsPopupOpen(true);
  };

  const openEditPopup = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsPopupOpen(true);
  };

  const openRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsViewRecipeOpen(true);
  }

  const closePopup = () => {
    setIsPopupOpen(false);
    setEditingRecipe(null);
  };

  const closeRecipeViewer = () => {
    setIsViewRecipeOpen(false);
  }

  const setShowActionMessageState = (inShow: boolean, inMsg: string, inOnDanger: () => void, inDangerStr: string) => {
    setShowActionMessage({ show: inShow, msg: inMsg, onDanger: inOnDanger, dangerStr: inDangerStr });
  };

  const hideActionMessage = () => {
    setShowActionMessage(prev => ({ ...prev, show: false }));
  };

  const updateRecipes = async() => {
      try{
        const response = await fetch("/api/recipe/");
        if(response.ok){
          const data = await response.json();
          setRecipes(data.recipies);
        }
      }catch(error){
        console.error("Failed to fetch recipes", error);
      }
    };

  useEffect(() => {
    updateRecipes();
  }, []);

  const onDelete = async(id: string) => {
    try{
      const response = await fetch(`/api/recipe/${id}`, {
        method:"DELETE",
      });
      if(response.ok){
        setRecipes(prev => prev.filter(r => r.id !== id));
        triggerMessage("Recipe deleted", true);
      }else {
        triggerMessage("Failed to delete recipe", false);
      }
    } catch(error){
      console.error("Delete failed", error);
      triggerMessage("Network error occured", false);
    }
  };

  const triggerMessage = (message: string, isSuccess: boolean) => {
    setShowStatus({show: true, msg: message, success: isSuccess});

    setTimeout(() => {
      setShowStatus(prev => ({...prev, show: false}));
    }, 3000);
  };

  return (
    <> 
    <div className="app-contain">
      {showStatus.show && (
        <SuccessMessage success={showStatus.success} message={showStatus.msg}/>
      )}
      <Header onAddClick={openAddPopup}/>
      {isViewRecipeOpen && editingRecipe && (<RecipeViewer onClose={closeRecipeViewer} recipe={editingRecipe}/>)}
      {recipes.length === 0 && (<Hero onAddClick={openAddPopup}/>) }
      {recipes.length > 0 && (<div className='app__recipeCard__list'>{(recipes.map((r) => ( <RecipeCard key={r.id} recipe={r} onDeleteFunc={onDelete} showActionMessageState={setShowActionMessageState} showEditPopup={openEditPopup} showRecipe={openRecipe}/>)))} </div>)}
      {showActionMessage.show && (<ActionConfirmation msg={showActionMessage.msg} onDanger={() => {showActionMessage.onDanger(); hideActionMessage();}} onCancel={hideActionMessage} dangerStr={showActionMessage.dangerStr}/>)}
      {isPopupOpen && (<RecipePopup onClose={closePopup} onSaveSuccess={triggerMessage} onRecipeUpdated={updateRecipes} recipeData={editingRecipe ?? undefined}/>)}
    </div>
    </>
  )
}

export default App
