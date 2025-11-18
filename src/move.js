import { getState, saveState, renderBoard } from './domtracker.js';

let draggedCard = null; // элемент карточки (визуальный)
let sourceColIndex = null;
let sourceCardIndex = null;
let placeholder = null; // место вставки
let ghostCard = null; // карточка-«призрак»

document.addEventListener('mousedown', (e) => {
  const card = e.target.closest('.card'); //захват карточки
  if (!card) return;

  sourceColIndex = +card.closest('.column').dataset.colIndex; // определем колонку
  sourceCardIndex = [...card.parentNode.children].indexOf(card);

  draggedCard = card;
  card.style.opacity = '0.5'; // делаем карточку полупрозрачной

  // Создаём ghostCard (копия) - для перемещения копии
  ghostCard = card.cloneNode(true);
  ghostCard.style.position = 'absolute';
  ghostCard.style.zIndex = 1000;
  ghostCard.style.pointerEvents = 'none';
  ghostCard.style.width = card.offsetWidth + 'px';

  document.body.appendChild(ghostCard);
  moveGhost(e.pageX, e.pageY); //

  // Создаём placeholder - освобождаем место под карточку
  placeholder = document.createElement('div');
  placeholder.classList.add('placeholder');
  placeholder.style.height = card.offsetHeight + 'px';
  placeholder.style.background = '#d0f0ff';
  placeholder.style.border = '2px dashed #00aaff';
  placeholder.style.marginBottom = '10px';

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

function moveGhost(pageX, pageY) {
  ghostCard.style.left = pageX - ghostCard.offsetWidth / 2 + 'px';
  ghostCard.style.top = pageY - ghostCard.offsetHeight / 2 + 'px';
}

function onMouseMove(e) {
  moveGhost(e.pageX, e.pageY); //перемещение

  const column = e.target.closest('.column');
  if (column) {
    const cardsContainer = column.querySelector('.cards-container');
    const cards = [...cardsContainer.querySelectorAll('.card')].filter(c => c !== draggedCard);

    let inserted = false;

    for (let card of cards) {
      const rect = card.getBoundingClientRect();
      const middle = rect.top + rect.height / 2;

      if (e.clientY < middle) {
        cardsContainer.insertBefore(placeholder, card);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      cardsContainer.appendChild(placeholder);
    }
  }
}

function onMouseUp() {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);

  if (placeholder && placeholder.parentNode) {
    const targetColIndex = +placeholder.closest('.column').dataset.colIndex;
    const targetCards = getState().columns[targetColIndex].cards;

    const cardText = getState().columns[sourceColIndex].cards[sourceCardIndex];
    // удаляем из исходной колонки
    getState().columns[sourceColIndex].cards.splice(sourceCardIndex, 1);

    // вычисляем новую позицтю
    const newIndex = [...placeholder.parentNode.children].indexOf(placeholder);
    targetCards.splice(newIndex, 0, cardText);

    saveState();
  }

  if (ghostCard) ghostCard.remove();
  if (placeholder) placeholder.remove();

  if (draggedCard) draggedCard.style.opacity = '1';
  draggedCard = null;
  ghostCard = null;
  placeholder = null;

  renderBoard();
}