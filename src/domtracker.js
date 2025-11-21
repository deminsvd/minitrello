// Загружаем или создаём состояние
let state = JSON.parse(localStorage.getItem('taskState')) || {
  columns: [
    { title: 'Backlog', cards: [] },
    { title: 'In progress', cards: [] },
    { title: 'Done', cards: [] }
  ]
};

export const saveState = () => {
  localStorage.setItem('taskState', JSON.stringify(state));
};

export const getState = () => state;

let activeAddCardColIndex = null; // флаг активной колонки для ввода, для сброса при нажатии в другой колонке

export const renderBoard = () => {
  const container = document.getElementById('board-container');
  container.innerHTML = '';
  container.style.display = 'flex';
  container.style.background = 'lightblue';
  container.style.padding = '20px';
  container.style.gap = '20px';

  state.columns.forEach((col, colIndex) => {
    const column = document.createElement('div');
    column.classList.add('column');
    column.dataset.colIndex = colIndex;

    const title = document.createElement('h2');
    title.textContent = col.title;
    column.appendChild(title);

    const cardsContainer = document.createElement('div');
    cardsContainer.classList.add('cards-container');

    col.cards.forEach((cardText, cardIndex) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.textContent = cardText;

      const deleteBtn = document.createElement('span');
      deleteBtn.classList.add('delete-card');
      deleteBtn.textContent = '✖';
      deleteBtn.onclick = () => {
        col.cards.splice(cardIndex, 1);
        saveState();
        renderBoard();
      };
      card.appendChild(deleteBtn);

      cardsContainer.appendChild(card);
    });

    // Add another card
    if (activeAddCardColIndex === colIndex) {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Enter card text';

      const addBtn = document.createElement('button');
      addBtn.textContent = 'Add card';
      addBtn.style.background = 'green';
      addBtn.style.color = 'white';

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = '✖';

      addBtn.onclick = () => {
        if (input.value.trim()) {
          col.cards.push(input.value.trim());
          activeAddCardColIndex = null; // сброс активной колонки после добавления
          saveState();
          renderBoard();
        }
      };

      cancelBtn.onclick = () => {
        activeAddCardColIndex = null; // сброс активной колонки при отмене
        renderBoard();
      };

      column.appendChild(cardsContainer);
      column.appendChild(input);
      column.appendChild(addBtn);
      column.appendChild(cancelBtn);
    } else {
      const addCardLink = document.createElement('div');
      addCardLink.classList.add('add-card-link');
      addCardLink.textContent = 'Add another card';

      addCardLink.addEventListener('click', () => {
        // если уже идёт добавление в другой колонке - обнулим ввод в другой колонке
        if (activeAddCardColIndex !== null) {
          activeAddCardColIndex = null;
          renderBoard();
        }
   
        activeAddCardColIndex = colIndex; // назначение активной колонки при нажатии кнопки
        renderBoard();
      });

      column.appendChild(cardsContainer);
      column.appendChild(addCardLink);
    }

    container.appendChild(column);
  });
};

renderBoard();