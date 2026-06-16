import { useState, useEffect } from 'react';
import './styles/App.css'
import Header from "./component/header"
import Hero from "./component/hero"
import RecipePopup from './component/recipePopup'
import SuccessMessage from './component/successMessage';
import RecipeCard from './component/recipeCard';
import type { Recipe } from "./types/recipe";
import ActionConfirmation from './component/actionConfirmation';
import RecipeViewer from './component/recipeViewer';
import LoginSignUp from "./component/loginSignUp";
import { useAuth } from './context/AuthContext' 
import AccountOptions from './component/accountOptions';
import EditProfile from './component/editProfile';
import { API_BASE_URL } from './config/config';

function App() {
  const { user, session, loading } = useAuth()  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAccountOptionsOpen, setIsAccountOptionsOpen] = useState(false);
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

  const onShowLogin = () => {
    setIsLoginOpen(!isLoginOpen);
  } 

  const onShowAccountOptions = () => {
    setIsAccountOptionsOpen(true);
  }

  const onCloseAccountOptions = () => {
    setIsAccountOptionsOpen(false);
  }

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

  const onShowEditProfile = () => {
    setIsEditProfileOpen(true);
  }

  const onHideEditProfile = () => {
    setIsEditProfileOpen(false);
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
    if(!session) return
      try{
        const response = await fetch(`${API_BASE_URL}/api/recipe`,{
          headers: {'Authorization': `Bearer ${session.access_token}`}
        });
        if(response.ok){
          const data = await response.json();
          setRecipes(data.recipes);
        }
      }catch(error){
        console.error("Failed to fetch recipes", error);
      }
    };

  const onGuestRecipeSave = (recipe: Recipe) => {
  setRecipes(prev => {
    const exists = prev.find(r => r.id === recipe.id);
    if (exists) return prev.map(r => r.id === recipe.id ? recipe : r);
    return [recipe, ...prev];
  });
};

  useEffect(() => {
    if(!user){
      setRecipes([]);
      return;
    }
    updateRecipes();
  }, [user, session]);

  const onDelete = async (id: string) => {
    if (!session) {
      // Guest mode: state-only delete
      setRecipes(prev => prev.filter(r => r.id !== id));
      triggerMessage("Recipe deleted", true);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/recipe/${id}`, {
        method: "DELETE",
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      if (response.ok) {
        setRecipes(prev => prev.filter(r => r.id !== id));
        triggerMessage("Recipe deleted", true);
      } else {
        triggerMessage("Failed to delete recipe", false);
      }
    } catch (error) {
      console.error("Delete failed", error);
      triggerMessage("Network error occurred", false);
    }
  };

  const triggerMessage = (message: string, isSuccess: boolean) => {
    setShowStatus({show: true, msg: message, success: isSuccess});

    setTimeout(() => {
      setShowStatus(prev => ({...prev, show: false}));
    }, 3000);
  };

  if (loading) return null
  return (
    <>
      <div className="app-contain">
        {showStatus.show && (
          <SuccessMessage success={showStatus.success} message={showStatus.msg} />
        )}
        <Header onAddClick={openAddPopup} onShowLogin={onShowLogin} onEditProfile={onShowAccountOptions} />

        {/* Guest mode notice */}
        {!user && (
          <div className="app__guest-banner">
            <span>👋 Browsing as guest data resets on refresh. Login to save your data!</span>
          </div>
        )}

        {isAccountOptionsOpen && (<AccountOptions onClose={onCloseAccountOptions} onEdit={onShowEditProfile} />)}
        {isEditProfileOpen && (<EditProfile onClose={onHideEditProfile} showActionMessageState={setShowActionMessageState} />)}
        {isLoginOpen && (<LoginSignUp onClose={onShowLogin} />)}
        {isViewRecipeOpen && editingRecipe && (<RecipeViewer onClose={closeRecipeViewer} recipe={editingRecipe} />)}
        {recipes.length === 0 && (<Hero onAddClick={openAddPopup} />)}
        {recipes.length > 0 && (
          <div className='app__recipeCard__list'>
            {recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} 
              onDeleteFunc={onDelete} 
              showActionMessageState={setShowActionMessageState} 
              showEditPopup={openEditPopup} 
              showRecipe={openRecipe} />
            ))}
          </div>
        )}
        {showActionMessage.show && (
          <ActionConfirmation msg={showActionMessage.msg} 
          onDanger={() => { showActionMessage.onDanger(); hideActionMessage(); }} 
          onCancel={hideActionMessage} dangerStr={showActionMessage.dangerStr} />
        )}
        {isPopupOpen && (
          <RecipePopup
            onClose={closePopup}
            onSaveSuccess={triggerMessage}
            onRecipeUpdated={updateRecipes}
            onGuestSave={onGuestRecipeSave}  
            recipeData={editingRecipe ?? undefined}
          />
        )}
      </div>
    </>
  )};

export default App;
