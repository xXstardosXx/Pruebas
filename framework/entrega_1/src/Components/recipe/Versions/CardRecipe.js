import React from 'react';
import '../../../styles/RecipeCard.card.css';

const CardRecipe = ({ recipe, isPopup = false }) => {
  const maxWidth = isPopup ? '100%' : '300px';
  const maxHeight = isPopup ? '100%' : '380px';

  return (
    <div 
      className={`recipe card-recipe ${isPopup ? 'popup-version' : 'card-version'}`}
      style={{ 
        maxWidth, 
        maxHeight,
        overflow: 'hidden'
      }}
    >
      <div className="card-recipe-header">
        <div className="recipe-image-placeholder">
          🍳
        </div>
        <h3 className="card-title">{recipe.title}</h3>
        <div className="recipe-meta">
          <span className="meta-item">👥 {recipe.servings || '4'}</span>
          <span className="meta-item">⏱️ {recipe.prepTime || '30min'}</span>
        </div>
      </div>
      
      <div className="card-recipe-body">
        <div className="ingredients-preview">
          <h4>Ingredientes principales:</h4>
          <div className="ingredient-chips">
            {recipe.ingredients.slice(0, 4).map((ingredient, index) => (
              <span key={index} className="ingredient-chip">
                {ingredient.name}
              </span>
            ))}
          </div>
        </div>
        
        {isPopup ? (
          <div className="card-full-content">
            <div className="detailed-ingredients">
              <h4>Lista completa de ingredientes:</h4>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    <strong>{ingredient.quantity}</strong> {ingredient.name}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="detailed-steps">
              <h4>Instrucciones:</h4>
              <div className="steps-container">
                {recipe.steps.map((step, index) => (
                  <div key={index} className="step-card">
                    <div className="step-number">{index + 1}</div>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {recipe.comments && (
              <div className="card-comments">
                <h4>💡 Notas adicionales</h4>
                <p>{recipe.comments}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="steps-preview">
            <p>{(recipe.steps && recipe.steps[0]) ? (recipe.steps[0].length > 80 ? recipe.steps[0].substring(0, 80) + '...' : recipe.steps[0]) : ''}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardRecipe;