console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/netflyx/";         // GitHub Pages repo name


let pages = [
  { url: '', title: 'Home' },
  { url: 'contact/', title: 'Contact' },
  { url: 'projects/', title: 'Projects' },
  { url: 'cv.html', title: 'CV' },
  { url: 'https://github.com/netflyx', title: 'GitHub' }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

if (!url.startsWith('http')) {
  url = BASE_PATH + url;
}

for (let p of pages) {
  let url = p.url;
  let title = p.title;
  // next step: create link and add it to nav

  if (!url.startsWith('http')) {
    url = BASE_PATH + url;
  }

  // Create link and add it to nav
  nav.insertAdjacentHTML('beforeend', `<a href="${url}">${title}</a>`);

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

