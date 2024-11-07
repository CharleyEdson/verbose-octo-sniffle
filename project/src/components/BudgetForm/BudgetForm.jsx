import React, { useState } from 'react';
import { addBudgetEntry } from '../../services/budgetService';

const BudgetForm = () => {
  const [formData, setFormData] = useState({
    type: '',
    category: '',
    name: '',
    dollarAmount: '',
    frequency: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await addBudgetEntry(formData);
    if (result) {
      alert('Entry added successfully!');
      setFormData({
        type: '',
        category: '',
        name: '',
        dollarAmount: '',
        frequency: '',
      });
    } else {
      alert('Failed to add entry');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="type" placeholder="Type" value={formData.type} onChange={handleChange} />
      <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
      <input name="dollarAmount" placeholder="Dollar Amount" value={formData.dollarAmount} onChange={handleChange} />
      <input name="frequency" placeholder="Frequency" value={formData.frequency} onChange={handleChange} />
      <button type="submit">Add Entry</button>
    </form>
  );
};

export default BudgetForm;
