const API = "https://movieflix-backend-ikbt.onrender.com";

function navigateTo(page) {
  window.location.hash = page;
  renderPage();
}

function renderPage() {
  const hash = window.location.hash.replace('#', '') || 'home';
  const app = document.getElementById('app');
  app.innerHTML = ''; // clear existing

  if (hash === 'home') showHome(app);
  else if (hash === 'login') showLogin(app);
  else if (hash === 'register') showRegister(app);
}

async function showHome(app) {
  app.innerHTML = `<h1 class="text-2xl text-cyan-400 mb-4">🎬 Featured Movies</h1>`;
  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-2 sm:grid-cols-3 gap-4';

  try {
    const res = await fetch(`${API}/movies`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Invalid data");

    data.forEach(movie => {
      const card = document.createElement('div');
      card.className = 'glass p-3 rounded';
      card.innerHTML = `
        <img src="${movie.thumbnail || 'https://via.placeholder.com/300x160'}" alt="${movie.title}" class="w-full h-32 object-cover rounded" />
        <h2 class="mt-2 text-sm font-bold">${movie.title}</h2>
        <p class="text-xs text-zinc-300">${movie.category}</p>
      `;
      grid.appendChild(card);
    });

    app.appendChild(grid);
  } catch (err) {
    app.innerHTML = `<p class="text-red-400">Failed to load movies.</p>`;
  }
}

function showLogin(app) {
  app.innerHTML = `
    <form onsubmit="handleLogin(event)" class="glass p-6 rounded space-y-4">
      <h2 class="text-xl font-bold text-cyan-300">Login to MovieFlix</h2>
      <input type="email" name="email" placeholder="Email" class="w-full p-2 rounded bg-zinc-800 text-white" required>
      <input type="password" name="password" placeholder="Password" class="w-full p-2 rounded bg-zinc-800 text-white" required>
      <button type="submit" class="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-2 rounded">Login</button>
    </form>
  `;
}

function showRegister(app) {
  app.innerHTML = `
    <form onsubmit="handleRegister(event)" class="glass p-6 rounded space-y-4">
      <h2 class="text-xl font-bold text-cyan-300">Register an Account</h2>
      <input type="text" name="username" placeholder="Username" class="w-full p-2 rounded bg-zinc-800 text-white" required>
      <input type="email" name="email" placeholder="Email" class="w-full p-2 rounded bg-zinc-800 text-white" required>
      <input type="password" name="password" placeholder="Password" class="w-full p-2 rounded bg-zinc-800 text-white" required>
      <button type="submit" class="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-2 rounded">Register</button>
    </form>
  `;
}

async function handleLogin(e) {
  e.preventDefault();
  const form = new FormData(e.target);
  const data = Object.fromEntries(form.entries());

  const res = await fetch(`${API}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert("Login successful!");
    navigateTo('home');
  } else {
    alert("Login failed.");
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const form = new FormData(e.target);
  const data = Object.fromEntries(form.entries());

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert("Registration successful!");
    navigateTo('login');
  } else {
    alert("Registration failed.");
  }
}

window.addEventListener('load', renderPage);
window.addEventListener('hashchange', renderPage);
