console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
  { url: '', title: 'Home' },
  { url: 'contact/', title: 'Contact' },
  { url: 'projects/', title: 'Projects' },
  { url: 'cv.html', title: 'CV' },
  { url: 'https://github.com/netflyx', title: 'GitHub' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/portfolio/";       // GitHub Pages repo name

for (let p of pages) {
  let url = p.url;
  let title = p.title;
  if (!url.startsWith('http')) {
    url = BASE_PATH + url;
  }
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  nav.append(a);
  
  // detect current page
  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add('current');
  }

  // all external links go to new tab
  if (a.host !== location.host) { 
    a.target = '_blank';
  } 
}

const select = document.querySelector("#color-scheme-select");
const html = document.documentElement;

const savedScheme = localStorage.getItem("color-scheme") || "auto";
applyColorScheme(savedScheme);
select.value = savedScheme;

select.addEventListener("change", () => {
  const newScheme = select.value;
  applyColorScheme(newScheme);
  localStorage.setItem("color-scheme", newScheme);
});

function applyColorScheme(scheme) {
  if (scheme === "auto") {
    html.removeAttribute("style");
  } else {
    html.style.colorScheme = scheme;
  }
}

export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    console.log(response);

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, container, headingLevel = 'h2') {
  for (const project of projects) {
    const article = document.createElement('article');

    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.img}" alt="">
      <p>${project.description}</p>
    `;

    container.append(article);
  }
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}


