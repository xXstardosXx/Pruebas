import React from 'react';
import '../../../styles/RecipeCard.classic.css';

const ClassicRecipe = ({ recipe, isPopup = false }) => {
  const maxWidth = isPopup ? '100%' : '300px';
  const maxHeight = isPopup ? '100%' : '400px';

  return (
    <div 
      className={`recipe classic-recipe ${isPopup ? 'popup-version' : 'card-version'}`}
      style={{ 
        maxWidth, 
        maxHeight,
        overflow: 'hidden'
      }}
    >
      <div className="recipe-header">
        <h3 className="recipe-title">{recipe.title}</h3>
        <span className="recipe-category">{recipe.category}</span>
      </div>
      
      <div className="recipe-content">
        <div className="ingredients-section">
          <h4>Ingredientes:</h4>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                <span className="quantity">{ingredient.quantity}</span>
                <span className="ingredient-name">{ingredient.name}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="steps-section">
          <h4>Preparación:</h4>
          <ol>
            {recipe.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
        
        {recipe.comments && (
          <div className="comments-section">
            <h4>Notas:</h4>
            <p>{recipe.comments}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassicRecipe;