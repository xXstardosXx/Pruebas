import React from 'react';
import comida from '../../imag/comida.svg';

const Header = ({ onLogout, onAddRecipe, recipeVersion, setRecipeVersion, currentUser }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
          <img src={comida} alt="comida" className="header-logo" style={{width:36, height:36}}/>
          <h1> Mi Libro de Recetas</h1>
        </div>
        <div className="header-user">
          {currentUser ? (
            <span className="current-user">Conectado: {currentUser.username || currentUser.email}</span>
          ) : null}
        </div>
        <div className="header-controls">
          <select 
            value={recipeVersion} 
            onChange={(e ) => setRecipeVersion(e.target.value)}
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