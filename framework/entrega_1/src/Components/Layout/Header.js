import React from 'react';

const Header = ({ onLogout, onAddRecipe, recipeVersion, setRecipeVersion }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1>🍳 Mi Libro de Recetas</h1>
        
        <div className="header-controls">
          <select 
            value={recipeVersion} 
            onChange={(e) => setRecipeVersion(e.target.value)}
            className="version-selector"
          >
            <option value="classic">Clásico</option>
            <option value="modern">Moderno</option>
            <option value="minimal">Minimalista</option>
            <option value="card">Tarjeta</option>
          </select>
          
          <button onClick={onAddRecipe} className="btn-primary">
            + Nueva Receta
          </button>
          
          <button onClick={onLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;