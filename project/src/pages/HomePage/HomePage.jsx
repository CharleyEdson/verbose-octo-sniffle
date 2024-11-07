import React from 'react';
import BudgetForm from '../../components/BudgetForm/BudgetForm';
import BudgetList from '../../components/BudgetList';

function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the Home Page!</p>
      <BudgetForm />
      <BudgetList />
    </div>
  );
}

export default HomePage;
