import React from 'react';
import ClassicRecipe from './Versions/ClassicRecipe';
import ModernRecipe from './Versions/ModernRecipe';
import MinimalRecipe from './Versions/MinimalRecipe';
import CardRecipe from './Versions/CardRecipe';
import '../../styles/RecipePopup.css';

const RecipePopup = ({ recipe, version, onClose }) => {
  const renderRecipeVersion = () => {
    const props = { recipe, isPopup: true };
    
    switch (version) {
      case 'classic':
        return <ClassicRecipe {...props} />;
      case 'modern':
        return <ModernRecipe {...props} />;
      case 'minimal':
        return <MinimalRecipe {...props} />;
      case 'card':
        return <CardRecipe {...props} />;
      default:
        return <ClassicRecipe {...props} />;
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="recipe-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        {renderRecipeVersion()}
      </div>
    </div>
  );
};

export default RecipePopup;