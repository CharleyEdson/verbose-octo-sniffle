import React, { useEffect, useState } from 'react';
import { getBudgetData } from '../services/budgetService';

const BudgetList = () => {
  const [budgetData, setBudgetData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getBudgetData();
      setBudgetData(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Budget Entries</h2>
      <ul>
        {budgetData.map((entry, index) => (
          <li key={index}>
            {entry[0]} - {entry[1]} - {entry[2]} - ${entry[3]} ({entry[4]})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BudgetList;
