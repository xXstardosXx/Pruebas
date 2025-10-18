import React from 'react';
import '../../../styles/RecipeCard.minimal.css';

const MinimalRecipe = ({ recipe, isPopup = false }) => {
  const maxWidth = isPopup ? '100%' : '280px';
  const maxHeight = isPopup ? '100%' : '350px';

  return (
    <div 
      className={`recipe minimal-recipe ${isPopup ? 'popup-version' : 'card-version'}`}
      style={{ 
        maxWidth, 
        maxHeight,
        overflow: 'hidden'
      }}
    >
      <h3 className="minimal-title">{recipe.title}</h3>
      
      <div className="minimal-ingredients">
        <strong>Ingredientes:</strong>
        <div className="compact-list">
          {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
            <span key={index} className="ingredient-tag">
              {ingredient.quantity} {ingredient.name}
            </span>
          ))}
          {recipe.ingredients.length > 3 && (
            <span className="more-tag">+{recipe.ingredients.length - 3} más</span>
          )}
        </div>
      </div>
      
      <div className="minimal-steps">
        <strong>Pasos:</strong>
        <p className="steps-preview">
          {recipe.steps[0].substring(0, 100)}...
        </p>
      </div>
      
      {isPopup && (
        <div className="minimal-full-content">
          <div className="full-ingredients">
            <h4>Ingredientes Completos:</h4>
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.quantity} {ingredient.name}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="full-steps">
            <h4>Pasos Completos:</h4>
            <ol>
              {recipe.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
          
          {recipe.comments && (
            <div className="full-comments">
              <h4>Comentarios:</h4>
              <p>{recipe.comments}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MinimalRecipe;