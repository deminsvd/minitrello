import { getState, saveState, renderBoard } from './domtracker.js';

export const addCardToColumn = (colIndex, text) => {
  const state = getState();
  state.columns[colIndex].cards.push(text);
  saveState();
  renderBoard();
};

export const deleteCard = (colIndex, cardIndex) => {
  const state = getState();
  state.columns[colIndex].cards.splice(cardIndex, 1);
  saveState();
  renderBoard();
};