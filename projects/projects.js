import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let allProjects = [];
let selectedIndex = -1;
let currentQuery = '';
let currentPieData = [];

const searchInput = document.querySelector('.searchBar');
const projectsContainer = document.querySelector('.projects');
const svg = d3.select("#projects-pie-plot");
const legend = d3.select('.legend');

init();

async function init() {
  allProjects = await fetchJSON('../lib/projects.json');
  updateView();
}

searchInput.addEventListener('input', (event) => {
  currentQuery = event.target.value.toLowerCase();
  updateView();
});

function updateView() {
  const filtered = applyFilters(allProjects);
  renderProjects(filtered, projectsContainer, 'h2');
  renderPieChart(filtered);
}

function applyFilters(projects) {
  return projects.filter((p) => {
    const matchQuery = Object.values(p).join('\n').toLowerCase().includes(currentQuery);
    const matchYear = selectedIndex === -1 || p.year === currentPieData[selectedIndex]?.label;
    return matchQuery && matchYear;
  });
}

function renderPieChart(projects) {
  svg.selectAll("path").remove();
  legend.selectAll("li").remove();

  const rolled = d3.rollups(projects, v => v.length, d => d.year);
  const data = rolled.map(([label, value]) => ({ label, value }));
  currentPieData = data;

  const colors = d3.scaleOrdinal(d3.schemeTableau10);
  const arcGen = d3.arc().innerRadius(0).outerRadius(50);
  const pie = d3.pie().value(d => d.value);
  const arcs = pie(data);

  svg.selectAll("path")
    .data(arcs)
    .enter()
    .append("path")
    .attr("d", arcGen)
    .style("fill", (_, i) => `var(--color-${i})`)
    .style("--color", (_, i) => colors(i))
    .style("fill", "var(--color)")
    .attr("class", (_, i) => (i === selectedIndex ? "selected" : null))
    .on("click", (_, i) => {
      selectedIndex = selectedIndex === i ? -1 : i;
      updateView();
    });

  legend.selectAll("li")
    .data(data)
    .enter()
    .append("li")
    .attr("class", (_, i) => i === selectedIndex ? "legend-item selected" : "legend-item")
    .style("--color", (_, i) => colors(i))
    .html((d) => `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
    .on("click", (_, i) => {
      selectedIndex = selectedIndex === i ? -1 : i;
      updateView();
    });
}
