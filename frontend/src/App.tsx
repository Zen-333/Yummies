import { useState } from 'react';
import './styles/App.css'
import Header from "./component/header"
import Hero from "./component/hero"
import RecipePopup from './component/recipePopup'

function App() {

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  return (
    <> 
    <div className="app-contain">
      <Header onAddClick={togglePopup}/>
      <Hero onAddClick={togglePopup}/> 
      {isPopupOpen && <RecipePopup onClose={togglePopup}/>}
    </div>
    </>
  )
}

export default App
