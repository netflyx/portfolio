console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const navLinks = $$("nav a");

let currentLink = navLinks.find(
    (a) => a.host === location.host && a.pathname === location.pathname,
  );

currentLink?.classList.add("current");

const currentPage = window.location.pathname.split("/").pop();

const fallbackLink = navLinks.find(link => {
  const linkPage = link.getAttribute("href").split("/").pop();
  return linkPage === currentPage;
});

// if (!currentLink && fallbackLink) {
//   fallbackLink.classList.add("current");
// }


let pages = [
  { url: '', title: 'Home' },
  { url: 'contact/', title: 'Contact' },
  { url: 'projects/', title: 'Projects' },
  { url: 'cv.html', title: 'CV' },
  { url: 'https://github.com/netflyx', title: 'GitHub' }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/netflyx/";         // GitHub Pages repo name

  if (!url.startsWith('http')) {
    url = BASE_PATH + url;
  }

for (let p of pages) {
  let url = p.url;
  let title = p.title;

  // Fix relative links for GitHub Pages
  url = !url.startsWith('http') ? BASE_PATH + url : url;

  // Create and insert link into nav
  nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);
}

  // currentLink?.classList.add("current");
