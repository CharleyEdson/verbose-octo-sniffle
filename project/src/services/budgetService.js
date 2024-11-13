const API_URL = 'https://budget-api-layer.vercel.app/api/budget';

// Fetch all budget entries
export async function getBudgetData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch budget data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching budget data:', error);
    return [];
  }
}

// Add a new budget entry
export async function addBudgetEntry(entry) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    });
    if (!response.ok) {
      throw new Error('Failed to add budget entry');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error adding budget entry:', error);
    return null;
  }
}
