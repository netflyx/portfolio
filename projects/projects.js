import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';


async function initProjects() {
  const projects = await fetchJSON('../lib/projects.json');
  const projectsContainer = document.querySelector('.projects');
  const projectsTitle = document.querySelector('.projects-title');
  if (projectsTitle) {
    projectsTitle.textContent = `${projects.length} Projects`;
  }
  renderProjects(projects, projectsContainer, 'h2');
}
initProjects();


let data = [
  { value: 1, label: 'apples' },
  { value: 2, label: 'oranges' },
  { value: 3, label: 'mangos' },
  { value: 4, label: 'pears' },
  { value: 5, label: 'limes' },
  { value: 5, label: 'cherries' },
];

let colors = d3.scaleOrdinal(d3.schemeTableau10);

let arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(50);

let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data);

let arcs = arcData.map((d) => arcGenerator(d));

const svg = d3.select("#projects-pie-plot");

arcs.forEach((arc, idx) => {
  svg.append("path")
    .attr("d", arc)
    .attr("fill", colors(idx));
});

let legend = d3.select('.legend');
data.forEach((d, idx) => {
  legend
    .append('li')
    .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
    .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
});



