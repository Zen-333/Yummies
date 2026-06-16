import "../styles/hero.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBlender, faPlus } from "@fortawesome/free-solid-svg-icons"

interface HeroProps { onAddClick: () => void;}

function Hero({onAddClick}: HeroProps) {

  return (
    <> 
        <div className="hero">
            <div className="hero__content">
                <FontAwesomeIcon icon={faBlender} className="hero__icon"/>
                <p className="hero__title">No recipies yet</p>
                <p className="hero__p">Start building your collection by adding your first recipe</p>
                <button className="btn btn--primary" onClick={onAddClick}><FontAwesomeIcon icon={faPlus} /> Add your first Recipe</button>
            </div>
        </div>
    </>
  )
}

export default Hero