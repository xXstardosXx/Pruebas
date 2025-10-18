import React, { useState, useEffect } from 'react';
import '../../styles/RecipeForm.css';

const RecipeForm = ({ recipe, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    ingredients: [{ name: '', quantity: '' }],
    steps: [''],
    comments: '',
    prepTime: '',
    difficulty: 'Media',
    servings: ''
  });

  useEffect(() => {
    if (recipe) {
      setFormData({
        title: recipe.title || '',
        category: recipe.category || '',
        ingredients: recipe.ingredients || [{ name: '', quantity: '' }],
        steps: recipe.steps || [''],
        comments: recipe.comments || '',
        prepTime: recipe.prepTime || '',
        difficulty: recipe.difficulty || 'Media',
        servings: recipe.servings || ''
      });
    }
  }, [recipe]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index][field] = value;
    setFormData(prev => ({
      ...prev,
      ingredients: updatedIngredients
    }));
  };

  const handleStepChange = (index, value) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[index] = value;
    setFormData(prev => ({
      ...prev,
      steps: updatedSteps
    }));
  };

  // Helper de auto-ajuste para textareas
  const autoResize = (e) => {
    const el = e.target;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, window.innerHeight * 0.5) + 'px';
  };

  // Asegurar que todos los textareas se ajusten correctamente cuando el modal se abra o cambie el contenido
  useEffect(() => {
    const els = document.querySelectorAll('.recipe-form-modal textarea');
    els.forEach(el => {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, window.innerHeight * 0.5) + 'px';
    });
  }, [formData.steps, formData.comments]);

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '' }]
    }));
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      const updatedIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        ingredients: updatedIngredients
      }));
    }
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }));
  };

  const removeStep = (index) => {
    if (formData.steps.length > 1) {
      const updatedSteps = formData.steps.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        steps: updatedSteps
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filtrar ingredientes y pasos vacíos
    const filteredIngredients = formData.ingredients.filter(ing => 
      ing.name.trim() !== '' && ing.quantity.trim() !== ''
    );
    
    const filteredSteps = formData.steps.filter(step => step.trim() !== '');

    if (filteredIngredients.length === 0 || filteredSteps.length === 0) {
      alert('Debe agregar al menos un ingrediente y un paso');
      return;
    }

    onSubmit({
      ...formData,
      ingredients: filteredIngredients,
      steps: filteredSteps
    });
  };

  return (
    <div className="modal-overlay">
      <div className="recipe-form-modal">
        <h2>{recipe ? 'Editar Receta' : 'Nueva Receta'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Título:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Categoría:</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="Ej: Postres, Italiana, etc."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tiempo de preparación (min):</label>
              <input
                type="number"
                name="prepTime"
                value={formData.prepTime}
                onChange={(e) => {
                  // sanitizar a solo dígitos, prevenir negativos
                  const v = e.target.value.replace(/[^0-9]/g, '');
                  setFormData(prev => ({ ...prev, prepTime: v }));
                }}
                placeholder="Ej: 30"
                min="0"
                step="1"
                inputMode="numeric"
                pattern="\d*"
              />
            </div>
            
            <div className="form-group">
              <label>Dificultad:</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
              >
                <option value="Fácil">Fácil</option>
                <option value="Media">Media</option>
                <option value="Difícil">Difícil</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Porciones:</label>
              <input
                type="number"
                name="servings"
                value={formData.servings}
                onChange={(e) => {
                  const v = e.target.value.replace(/[^0-9]/g, '');
                  setFormData(prev => ({ ...prev, servings: v }));
                }}
                placeholder="Ej: 4"
                min="0"
                step="1"
                inputMode="numeric"
                pattern="\d*"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Ingredientes</h3>
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-row">
                <input
                  type="text"
                  placeholder="Cantidad"
                  value={ingredient.quantity}
                  onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Ingrediente"
                  value={ingredient.name}
                  onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => removeIngredient(index)}
                  disabled={formData.ingredients.length === 1}
                >
                  ✕
                </button>
              </div>
            ))}
            <button type="button" onClick={addIngredient} className="add-btn">
              + Agregar Ingrediente
            </button>
          </div>

          <div className="form-section">
            <h3>Pasos de Preparación</h3>
            {formData.steps.map((step, index) => (
              <div key={index} className="step-row">
                <textarea
                  placeholder={`Paso ${index + 1}`}
                  value={step}
                  onChange={(e) => { handleStepChange(index, e.target.value); }}
                  onInput={autoResize}
                  rows="2"
                />
                <button 
                  type="button" 
                  onClick={() => removeStep(index)}
                  disabled={formData.steps.length === 1}
                >
                  ✕
                </button>
              </div>
            ))}
            <button type="button" onClick={addStep} className="add-btn">
              + Agregar Paso
            </button>
          </div>

          <div className="form-section">
            <h3>Comentarios Adicionales</h3>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              onInput={autoResize}
              placeholder="Notas, sugerencias, variaciones..."
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              {recipe ? 'Actualizar' : 'Crear'} Receta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeForm;