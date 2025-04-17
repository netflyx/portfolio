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