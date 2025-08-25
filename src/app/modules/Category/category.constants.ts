export const categoryFilterableFields = ['name', 'type'];
export const categorySearchableFields = ['name'];

export const defaultCategories = [
  // 🏠 Essentials / Fixed Expenses
  {
    name: 'Housing (Rent / Mortgage, Property Taxes, HOA fees)',
    type: 'essential',
    icon: '🏠',
  },
  {
    name: 'Utilities (Electric, Gas, Water, Sewer, Trash)',
    type: 'essential',
    icon: '💡',
  },
  { name: 'Internet & Phone', type: 'essential', icon: '📶' },
  {
    name: 'Transportation (Car Payment, Gas, Insurance, Public Transit)',
    type: 'essential',
    icon: '🚗',
  },
  { name: 'Groceries', type: 'essential', icon: '🛒' },
  { name: 'Healthcare / Insurance', type: 'essential', icon: '💊' },
  {
    name: 'Childcare / Education (Tuition, Daycare)',
    type: 'essential',
    icon: '🎓',
  },
  {
    name: 'Debt Payments (Credit Cards, Loans, Student Loan)',
    type: 'debt',
    icon: '💳',
  },

  // 🍔 Variable / Discretionary Spending
  { name: 'Dining Out & Takeout', type: 'non-essential', icon: '🍔' },
  {
    name: 'Entertainment & Subscriptions (Streaming, Music, Games)',
    type: 'non-essential',
    icon: '🎮',
  },
  {
    name: 'Shopping (Clothes, Electronics, Miscellaneous)',
    type: 'non-essential',
    icon: '🛍️',
  },
  { name: 'Travel / Vacations', type: 'non-essential', icon: '✈️' },
  {
    name: 'Personal Care (Salon, Gym, Wellness)',
    type: 'non-essential',
    icon: '💆',
  },
  { name: 'Gifts & Donations', type: 'non-essential', icon: '🎁' },

  // 💰 Financial Goals / Savings
  { name: 'Emergency Fund', type: 'essential', icon: '💰' },
  {
    name: 'Investments (Brokerage, Retirement, Crypto, etc.)',
    type: 'essential',
    icon: '📈',
  },
  {
    name: 'Savings Goals (Down Payment, Vacation Fund, Wedding, College)',
    type: 'essential',
    icon: '🏦',
  },

  // 💼 Income
  { name: 'Salary / Paycheck', type: 'essential', icon: '💼' },
  { name: 'Business Income / Side Hustle', type: 'essential', icon: '🏢' },
  { name: 'Dividends / Interest', type: 'essential', icon: '📊' },
  {
    name: 'Other Income (Refunds, Gifts, etc.)',
    type: 'essential',
    icon: '💵',
  },
];
