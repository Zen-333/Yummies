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

  setRecipes(
     try{
      const response = await fetch("/api/recipe/", {
        method: "GET",
        headers:{"Content-Type": "application/json"}, /* The Header: The "Envelope" instructions. It tells the server how to read the body. */
      });
    } catch(error) {
      console.error("Getting recipes failed", error);
    }
  );

  const onDelet = (id: number) => {
    try{
      const response = await fetch("/api/recipe/", {
        method: "DELET",
        headers:{"Content-Type": "application/json"}, /* The Header: The "Envelope" instructions. It tells the server how to read the body. */
        body: JSON.stringify({
          _id: id,
        })
      });
    } catch(error) {
      console.error("Getting recipes failed", error);
    }
  );
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
      {recipes.length > 0 && (<div className='app__recipeCard__list'>{(recipes.map((r, i) => ( <RecipeCard recipe={r} _id={i} onDeletFunc={onDelet}/>)))} </div>)}
      
      {isPopupOpen && (<RecipePopup onClose={togglePopup} onSaveSuccess={triggerMessage}/>)}
    </div>
    </>
  )
}

export default App
