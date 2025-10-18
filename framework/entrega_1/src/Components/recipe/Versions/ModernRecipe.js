import React from 'react';
import '../../../styles/RecipeCard.modern.css';

const ModernRecipe = ({ recipe, isPopup = false }) => {
  const maxWidth = isPopup ? '100%' : '320px';
  const maxHeight = isPopup ? '100%' : '450px';

  return (
    <div 
      className={`recipe modern-recipe ${isPopup ? 'popup-version' : 'card-version'}`}
      style={{ 
        maxWidth, 
        maxHeight,
        overflow: 'hidden'
      }}
    >
      <div className="modern-header">
        <div className="recipe-badge">{recipe.difficulty || 'Media'}</div>
        <h3 className="modern-title">{recipe.title}</h3>
        <p className="recipe-time">
          ⏱️ {recipe.prepTime || '30 min'}
        </p>
      </div>
      
      <div className="modern-content">
        <div className="ingredients-grid">
          <h4>🛒 Ingredientes</h4>
          <div className="ingredients-list">
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-item">
                <span className="ingredient-quantity">{ingredient.quantity}</span>
                <span className="ingredient-name">{ingredient.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="steps-timeline">
          <h4>👨‍🍳 Preparación</h4>
          {recipe.steps.map((step, index) => (
            <div key={index} className="step-item">
              <div className="step-number">{index + 1}</div>
              <div className="step-content">{step}</div>
            </div>
          ))}
        </div>
        
        {recipe.comments && (
          <div className="modern-comments">
            <h4>💡 Notas del Chef</h4>
            <p>{recipe.comments}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernRecipe;