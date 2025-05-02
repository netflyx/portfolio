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


let data = [1, 2];
let colors = ['gold', 'purple'];

let arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(50);

let sliceGenerator = d3.pie();
let arcData = sliceGenerator(data);

let arcs = arcData.map((d) => arcGenerator(d));

const svg = d3.select("#projects-pie-plot");

arcs.forEach((arc, idx) => {
  svg.append("path")
    .attr("d", arc)
    .attr("fill", colors[idx]);
});




