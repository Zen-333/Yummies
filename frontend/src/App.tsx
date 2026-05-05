import { useState, useEffect } from 'react';
import './styles/App.css'
import Header from "./component/header"
import Hero from "./component/hero"
import RecipePopup from './component/recipePopup'
import SuccessMessage from './component/successMessage';
import RecipeCard from './component/recipeCard';
import type { Recipe } from "../../backend/src/types/recipe";
import ActionConfirmation from './component/actionConfirmation';

function App() {

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showStatus, setShowStatus] = useState<{show: boolean, msg: string, success: boolean}>({
    show: false,
    msg: "",
    success: true
  });

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  const updateRecipes = async() => {
      try{
        const response = await fetch("/api/recipe/");
        if(response.ok){
          const data = await response.json();
          setRecipes([]);
          setRecipes(data.recipies);
        }
      }catch(error){
        console.error("Failed to fetch recipes", error);
      }
    };

  useEffect(() => {
    const fetchRecipes = async() => {
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
    fetchRecipes();
  },[]);

  const onDelete = async(id: string) => {
    try{
      const response = await fetch(`/api/recipe/${id}`, {
        method:"DELETE",
      });
      if(response.ok){
        setRecipes(prev => prev.filter(r => r._id !== id));
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
      <Header onAddClick={togglePopup}/>
      { recipes.length === 0 && (<Hero onAddClick={togglePopup}/>) }
      {recipes.length > 0 && (<div className='app__recipeCard__list'>{(recipes.map((r) => ( <RecipeCard key={r._id} recipe={r} onDeleteFunc={onDelete}/>)))} </div>)}
      <ActionConfirmation/>
      {isPopupOpen && (<RecipePopup onClose={togglePopup} onSaveSuccess={triggerMessage} onRecipeUpdated={updateRecipes}/>)}
    </div>
    </>
  )
}

export default App
