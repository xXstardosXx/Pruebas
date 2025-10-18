import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Login from './components/Auth/Login';
import Header from './components/Layout/Header';
import RecipeForm from './components/Recipe/RecipeForm';
import RecipeCard from './components/Recipe/RecipeCard';
import RecipePopup from './components/Recipe/RecipePopup';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeVersion, setRecipeVersion] = useState('classic');

  // Verificar autenticación al cargar
  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
    
    const savedRecipes = localStorage.getItem('recipes');
    if (savedRecipes) {
      setRecipes(JSON.parse(savedRecipes));
    }
  }, []);

  // Guardar recetas en localStorage
  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  const handleLogin = (credentials) => {
    // Credenciales hardcodeadas para demo
    if (credentials.username === 'admin' && credentials.password === 'password') {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const handleCreateRecipe = (recipeData) => {
    const newRecipe = {
      id: Date.now(),
      ...recipeData,
      createdAt: new Date().toISOString()
    };
    setRecipes([...recipes, newRecipe]);
    setShowForm(false);
  };

  const handleUpdateRecipe = (recipeData) => {
    setRecipes(recipes.map(recipe => 
      recipe.id === editingRecipe.id ? { ...recipe, ...recipeData } : recipe
    ));
    setEditingRecipe(null);
    setShowForm(false);
  };

  const handleDeleteRecipe = (id) => {
    setRecipes(recipes.filter(recipe => recipe.id !== id));
  };

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  const handleViewRecipe = (recipe) => {
    setSelectedRecipe(recipe);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <Header 
        onLogout={handleLogout}
        onAddRecipe={() => setShowForm(true)}
        recipeVersion={recipeVersion}
        setRecipeVersion={setRecipeVersion}
      />
      
      {showForm && (
        <RecipeForm
          recipe={editingRecipe}
          onSubmit={editingRecipe ? handleUpdateRecipe : handleCreateRecipe}
          onCancel={() => {
            setShowForm(false);
            setEditingRecipe(null);
          }}
        />
      )}

      <div className="recipes-grid">
        {recipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            version={recipeVersion}
            onEdit={() => handleEditRecipe(recipe)}
            onDelete={() => handleDeleteRecipe(recipe.id)}
            onView={() => handleViewRecipe(recipe)}
          />
        ))}
      </div>

      {selectedRecipe && (
        <RecipePopup
          recipe={selectedRecipe}
          version={recipeVersion}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
}

export default App;