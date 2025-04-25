import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

{
    "title": "NEW TITLE TEST",
    "img": "https://vis-society.github.io/labs/2/images/empty.svg",
    "description": "This is a new description to test dynamic updating!"
  }
  