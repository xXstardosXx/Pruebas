import React, { useState, useEffect } from 'react';
import './styles/App.css';
import Login from './Components/auth/Login';
import Header from './Components/Layout/Header';
import RecipeForm from './Components/recipe/recipeForm';
import RecipeCard from './Components/recipe/RecipeCard';
import RecipePopup from './Components/recipe/RecipePopup';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeVersion, setRecipeVersion] = useState('classic');
  const [currentUser, setCurrentUser] = useState(null);

  // aqui se implementa el localstorage
  useEffect(() => {
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setCurrentUser(null);
  }, []);

  // Cargar recetas para el usuario actual
  useEffect(() => {
    const loadRecipesForUser = () => {
      let initial = [];
      if (currentUser && currentUser.username) {
        const key = `recipes_${currentUser.username}`;
        const userJson = localStorage.getItem(key);
        if (userJson) {
          try { initial = JSON.parse(userJson); } catch (e) { initial = []; }
        } else {
          // migrar recetas globales para usuarios nuevos si existen
          const global = localStorage.getItem('recipes');
          if (global) {
            try { initial = JSON.parse(global); localStorage.setItem(key, global); } catch (e) { initial = []; }
          }
        }
      } else {
        const global = localStorage.getItem('recipes');
        if (global) {
          try { initial = JSON.parse(global); } catch (e) { initial = []; }
        }
      }
      setRecipes(initial);
    };

    loadRecipesForUser();
  }, [currentUser]);

  // Persistir recetas en la clave por usuario (o global si no hay usuario)
  useEffect(() => {
    if (currentUser && currentUser.username) {
      const key = `recipes_${currentUser.username}`;
      try { localStorage.setItem(key, JSON.stringify(recipes)); } catch (e) { console.error('Error saving user recipes', e); }
    } else {
      try { localStorage.setItem('recipes', JSON.stringify(recipes)); } catch (e) { console.error('Error saving recipes', e); }
    }
  }, [recipes, currentUser]);

  const handleLogin = (credentials) => {
    // Pruebe con usuarios registrados de localStorage
    try {
      const usersJson = localStorage.getItem('users');
      if (usersJson) {
        const users = JSON.parse(usersJson);
        const found = users.find(u => u.username === credentials.username && u.password === credentials.password);
        if (found) {
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
            const userToStore = { username: found.username, email: found.email };
            localStorage.setItem('currentUser', JSON.stringify(userToStore));
            setCurrentUser(userToStore);
            return true;
          }
      }
    } catch (e) { console.error('Error parsing users from storage', e); }

    if (credentials.username === 'admin' && credentials.password === 'password') {
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', 'true');
      const adminUser = { username: 'admin', email: null };
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      setCurrentUser(adminUser);
      return true;
    }

    return false;
  };

  const handleRegister = (credentials) => {
    const { username, password, email } = credentials || {};
    if (!username || !password || !email) return { success: false, message: 'Email, usuario y contraseña requeridos' };

    let users = [];
    try {
      const usersJson = localStorage.getItem('users');
      if (usersJson) users = JSON.parse(usersJson);
    } catch (e) { users = []; }

    if (users.some(u => u.username === username || u.email === email)) return { success: false, message: 'El usuario o el correo ya existen' };

    const newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', JSON.stringify({ username, email }));
    setCurrentUser({ username, email });

    return { success: true };
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const handleCreateRecipe = (recipeData) => {
    const newRecipe = { id: Date.now(), ...recipeData, createdAt: new Date().toISOString() };
    setRecipes(prev => [...prev, newRecipe]);
    setShowForm(false);
  };

  const handleUpdateRecipe = (recipeData) => {
    setRecipes(prev => prev.map(r => (r.id === editingRecipe.id ? { ...r, ...recipeData } : r)));
    setEditingRecipe(null);
    setShowForm(false);
  };

  const handleDeleteRecipe = (id) => setRecipes(prev => prev.filter(r => r.id !== id));
  const handleEditRecipe = (recipe) => { setEditingRecipe(recipe); setShowForm(true); };
  const handleViewRecipe = (recipe) => setSelectedRecipe(recipe);

  if (!isAuthenticated) return <Login onLogin={handleLogin} onRegister={handleRegister} />;

  return (
    <div className="App">
      <div className="main-container">
        <Header currentUser={currentUser} onLogout={handleLogout} onAddRecipe={() => setShowForm(true)} recipeVersion={recipeVersion} setRecipeVersion={setRecipeVersion} />
        {showForm && <RecipeForm recipe={editingRecipe} onSubmit={editingRecipe ? handleUpdateRecipe : handleCreateRecipe} onCancel={() => { setShowForm(false); setEditingRecipe(null); }} />}
        <div className="recipes-grid">
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} version={recipeVersion} onEdit={() => handleEditRecipe(recipe)} onDelete={() => handleDeleteRecipe(recipe.id)} onView={() => handleViewRecipe(recipe)} />
          ))}
        </div>
      </div>
      {selectedRecipe && <RecipePopup recipe={selectedRecipe} version={recipeVersion} onClose={() => setSelectedRecipe(null)} />}
    </div>
  );
}
