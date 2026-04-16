import { useState } from 'react';
import './styles/App.css'
import Header from "./component/header"
import Hero from "./component/hero"
import RecipePopup from './component/recipePopup'
import SuccessMessage from './component/successMessage';

function App() {

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
      <Hero onAddClick={togglePopup}/> 
      {isPopupOpen && (<RecipePopup onClose={togglePopup} onSaveSuccess={triggerMessage}/>)}
    </div>
    </>
  )
}

export default App
