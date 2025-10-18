import React from 'react';
import ClassicRecipe from './Versions/ClassicRecipe';
import ModernRecipe from './Versions/ModernRecipe';
import MinimalRecipe from './Versions/MinimalRecipe';
import CardRecipe from './Versions/CardRecipe';
import '../../styles/RecipeCard.css';

const RecipeCard = ({ recipe, version, onEdit, onDelete, onView }) => {
  const renderRecipeVersion = () => {
    const props = { recipe, isPopup: false };
    
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
    <div className="recipe-card-wrapper">
      {renderRecipeVersion()}
      <div className="recipe-actions">
        <button onClick={onView} className="btn-view">Ver</button>
        <button onClick={onEdit} className="btn-edit">Editar</button>
        <button onClick={onDelete} className="btn-delete">Eliminar</button>
      </div>
    </div>
  );
};

export default RecipeCard;