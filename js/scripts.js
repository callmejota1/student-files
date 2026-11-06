/* Treehouse FSJS Techdegree
 * Project - Public API Requests
 * scripts.js */

const gallery = document.getElementById('gallery');

// holds the 12 users so the modal can look up the one that was clicked
let users = [];

// the card that opened the modal, so focus can return to it when the modal closes
let lastCard = null;

// builds the HTML for one employee card
function createCard(user) {
  return `
    <div class="card" tabindex="0" role="button">
      <div class="card-img-container">
        <img class="card-img" src="${user.picture.large}" alt="Profile picture of ${user.name.first} ${user.name.last}">
      </div>
      <div class="card-info-container">
        <h3 class="card-name cap">${user.name.first} ${user.name.last}</h3>
        <p class="card-text">${user.email}</p>
        <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
      </div>
    </div>`;
}

// builds the HTML for the modal of one employee
function createModal(user) {
  const [year, month, day] = user.dob.date.slice(0, 10).split('-');
  const { street, city, state, postcode } = user.location;

  return `
    <div class="modal-container">
      <div class="modal" role="dialog" aria-modal="true" aria-label="Employee details">
        <button type="button" id="modal-close-btn" class="modal-close-btn" aria-label="Close"><strong>X</strong></button>
        <div class="modal-info-container">
          <img class="modal-img" src="${user.picture.large}" alt="Profile picture of ${user.name.first} ${user.name.last}">
          <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
          <p class="modal-text">${user.email}</p>
          <p class="modal-text cap">${city}</p>
          <hr>
          <p class="modal-text">${user.cell}</p>
          <p class="modal-text">${street.number} ${street.name}, ${city}, ${state} ${postcode}</p>
          <p class="modal-text">Birthday: ${month}/${day}/${year}</p>
        </div>
      </div>
    </div>`;
}

// opens the modal for the card that was clicked (or focused and activated by keyboard)
function openModal(e) {
  const card = e.target.closest('.card');

  if (!card || document.querySelector('.modal-container')) return;

  lastCard = card;
  const user = users[[...gallery.children].indexOf(card)];

  document.body.insertAdjacentHTML('beforeend', createModal(user));
  document.getElementById('modal-close-btn').focus();
}

// removes the modal and returns focus to the card that opened it
function closeModal() {
  document.querySelector('.modal-container').remove();
  lastCard.focus();
}

// fetches 12 random US users in a single request and displays them
async function getUsers() {
  try {
    const response = await fetch('https://randomuser.me/api/?results=12&nat=us');

    if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

    users = (await response.json()).results;
    gallery.insertAdjacentHTML('beforeend', users.map(createCard).join(''));
  } catch (error) {
    console.error(error);
    gallery.insertAdjacentHTML('beforeend', '<p role="alert">The employee directory could not be loaded. Refresh the page to try again.</p>');
  }
}

// open a card with a click, Enter (on key down) or Space (on key up)
gallery.addEventListener('click', openModal);
gallery.addEventListener('keyup', (e) => e.key === ' ' && openModal(e));
gallery.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') openModal(e);
  if (e.key === 'Enter' || e.key === ' ') e.preventDefault(); // stops scrolling and double activation
});

// close the modal with the X button or by clicking the dark area outside it
document.addEventListener('click', (e) => {
  if (e.target.closest('.modal-close-btn') || e.target.matches('.modal-container')) closeModal();
});

// Escape closes the modal; Tab stays on the close button, the only focusable element inside
document.addEventListener('keydown', (e) => {
  if (!document.querySelector('.modal-container')) return;

  if (e.key === 'Escape') closeModal();
  if (e.key === 'Tab') {
    e.preventDefault();
    document.getElementById('modal-close-btn').focus();
  }
});

getUsers();