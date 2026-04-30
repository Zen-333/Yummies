import { useState } from 'react';
import './styles/App.css'
import Header from "./component/header"
import Hero from "./component/hero"
import RecipePopup from './component/recipePopup'
import SuccessMessage from './component/successMessage';
import RecipeCard from './component/recipeCard';
import type { Recipe } from "../../backend/src/types/recipe";

function App() {

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showStatus, setShowStatus] = useState<{show: boolean, msg: string, success: boolean}>({
    show: false,
    msg: "",
    success: true
  });

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

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
      {recipes.length > 0 && (<div className='app__recipeCard__list'>{(recipes.map((r, i) => ( <RecipeCard recipe={r} index={i}/>)))} </div>)}
      
      {isPopupOpen && (<RecipePopup onClose={togglePopup} onSaveSuccess={triggerMessage} recipeSetArray={setRecipes}/>)}
    </div>
    </>
  )
}

export default App
