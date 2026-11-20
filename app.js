const USERS_URL = 'https://jsonplaceholder.typicode.com/users';
const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

const loadButton = document.querySelector('#load-button');
const searchInput = document.querySelector('#search-input');
const usersList = document.querySelector('#users-list');
const postsList = document.querySelector('#posts-list');
const message = document.querySelector('#message');

let users = [];

function showMessage(text, type = 'info') {
  message.textContent = text;
  message.className = `message ${type}`;
}

function showEmpty(container, text) {
  const paragraph = document.createElement('p');
  paragraph.className = 'empty-state';
  paragraph.textContent = text;
  container.replaceChildren(paragraph);
}

function renderUsers() {
  const searchText = searchInput.value.trim().toLowerCase();
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchText)
  );

  usersList.replaceChildren();

  if (filteredUsers.length === 0) {
    showEmpty(usersList, 'Пользователи не найдены');
    return;
  }

  filteredUsers.forEach((user) => {
    const card = document.createElement('article');
    card.className = 'user-card';

    const info = document.createElement('div');
    info.className = 'user-info';

    const name = document.createElement('h3');
    name.textContent = user.name;

    const email = document.createElement('p');
    email.textContent = `Email: ${user.email}`;

    const city = document.createElement('p');
    city.textContent = `Город: ${user.address.city}`;

    info.append(name, email, city);

    const postsButton = document.createElement('button');
    postsButton.className = 'button button-secondary';
    postsButton.type = 'button';
    postsButton.textContent = 'Показать публикации';
    postsButton.addEventListener('click', () => loadUserPosts(user.id, postsButton));

    card.append(info, postsButton);
    usersList.append(card);
  });
}

async function loadUsers() {
  loadButton.disabled = true;
  showMessage('Загрузка...', 'info');

  try {
    const response = await fetch(USERS_URL);
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    users = await response.json();
    renderUsers();
    showMessage(`Загружено пользователей: ${users.length}.`, 'success');
  } catch (error) {
    showMessage(`Не удалось загрузить пользователей: ${error.message}. Попробуйте ещё раз.`, 'error');
  } finally {
    loadButton.disabled = false;
  }
}

async function loadUserPosts(userId, button) {
  button.disabled = true;
  showMessage('Загрузка...', 'info');
  showEmpty(postsList, 'Загрузка...');

  try {
    const response = await fetch(`${POSTS_URL}?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const posts = await response.json();
    postsList.replaceChildren();

    posts.slice(0, 3).forEach((post) => {
      const card = document.createElement('article');
      card.className = 'post-card';

      const title = document.createElement('h3');
      title.textContent = post.title;

      const body = document.createElement('p');
      body.textContent = post.body;

      card.append(title, body);
      postsList.append(card);
    });

    if (posts.length === 0) {
      showEmpty(postsList, 'У пользователя нет публикаций.');
    }

    showMessage('Публикации успешно загружены.', 'success');
  } catch (error) {
    showEmpty(postsList, 'Не удалось загрузить публикации.');
    showMessage(`Ошибка загрузки публикаций: ${error.message}. Попробуйте ещё раз.`, 'error');
  } finally {
    button.disabled = false;
  }
}

loadButton.addEventListener('click', loadUsers);
searchInput.addEventListener('input', renderUsers);
