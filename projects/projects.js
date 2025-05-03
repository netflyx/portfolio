import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let allProjects = [];
let selectedIndex = -1;
let currentQuery = '';
let currentPieData = [];

async function initProjects() {
  allProjects = await fetchJSON('../lib/projects.json');
  updateFilteredView();
}

const searchInput = document.querySelector('.searchBar');
const projectsContainer = document.querySelector('.projects');

searchInput.addEventListener('input', (event) => {
  currentQuery = event.target.value.toLowerCase();
  updateFilteredView();
});

function updateFilteredView() {
  const filtered = applyCombinedFilters(allProjects);
  renderProjects(filtered, projectsContainer, 'h2');
  renderPieChart(filtered);
}

function applyCombinedFilters(projectList) {
  return projectList.filter(p => {
    const matchesQuery = Object.values(p).join('\n').toLowerCase().includes(currentQuery);
    const matchesSelection = selectedIndex === -1 || p.year === currentPieData[selectedIndex].label;
    return matchesQuery && matchesSelection;
  });
}

function renderPieChart(projectsGiven) {
  const svg = d3.select("#projects-pie-plot");
  const legend = d3.select('.legend');

  svg.selectAll("path").remove();
  legend.selectAll("li").remove();

  const rolledData = d3.rollups(
    projectsGiven,
    v => v.length,
    d => d.year
  );

  const data = rolledData.map(([label, value]) => ({ label, value }));
  currentPieData = data;

  const colors = d3.scaleOrdinal(d3.schemeTableau10);
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  const sliceGenerator = d3.pie().value(d => d.value);
  const arcData = sliceGenerator(data);

  arcData.forEach((d, i) => {
    svg.append("path")
      .attr("d", arcGenerator(d))
      .style("--color", colors(i))
      .style("fill", "var(--color)")
      .attr("class", i === selectedIndex ? "selected" : null)
      .on("click", () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        updateFilteredView();
      });
  });

  data.forEach((d, i) => {
    legend.append("li")
      .attr("style", `--color:${colors(i)}`)
      .attr("class", i === selectedIndex ? "legend-item selected" : "legend-item")
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on("click", () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        updateFilteredView();
      });
  });
}
