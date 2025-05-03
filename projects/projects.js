import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let allProjects = [];
let selectedIndex = -1;
let currentQuery = '';

async function initProjects() {
  allProjects = await fetchJSON('../lib/projects.json');
  const projectsContainer = document.querySelector('.projects');
  const projectsTitle = document.querySelector('.projects-title');

  if (projectsTitle) {
    projectsTitle.textContent = `${allProjects.length} Projects`;
  }

  const filtered = applyCombinedFilters(allProjects);
  renderProjects(filtered, projectsContainer, 'h2');
  renderPieChart(filtered);
}

initProjects();

const searchInput = document.querySelector('.searchBar');
const projectsContainer = document.querySelector('.projects');

searchInput.addEventListener('input', (event) => {
  currentQuery = event.target.value.toLowerCase();
  const filtered = applyCombinedFilters(allProjects);
  renderProjects(filtered, projectsContainer, 'h2');
  renderPieChart(filtered);
});

function applyCombinedFilters(projectList) {
  return projectList.filter(p => {
    const matchesQuery = Object.values(p).join('\n').toLowerCase().includes(currentQuery);
    const matchesSelection = selectedIndex === -1 || p.year === getSelectedLabel();
    return matchesQuery && matchesSelection;
  });
}

function getSelectedLabel() {
  const rolledData = d3.rollups(
    allProjects,
    (v) => v.length,
    (d) => d.year
  );
  const data = rolledData.map(([year]) => ({ label: year }));
  return selectedIndex >= 0 && selectedIndex < data.length ? data[selectedIndex].label : null;
}

function renderPieChart(projectsGiven) {
  const svg = d3.select("#projects-pie-plot");
  const legend = d3.select('.legend');

  svg.selectAll("path").remove();
  legend.selectAll("li").remove();

  const rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  const data = rolledData.map(([year, count]) => ({
    label: year,
    value: count
  }));

  const colors = d3.scaleOrdinal(d3.schemeTableau10);
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  const sliceGenerator = d3.pie().value((d) => d.value);
  const arcData = sliceGenerator(data);

  arcData.forEach((d, i) => {
    svg.append("path")
      .attr("d", arcGenerator(d))
      .style("--color", colors(i))
      .style("fill", "var(--color)")
      .attr("class", i === selectedIndex ? "selected" : null)
      .on("click", () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        const filtered = applyCombinedFilters(allProjects);
        renderProjects(filtered, projectsContainer, 'h2');
        renderPieChart(filtered);
      });
  });

  data.forEach((d, i) => {
    legend.append("li")
      .attr("style", `--color:${colors(i)}`)
      .attr("class", i === selectedIndex ? "legend-item selected" : "legend-item")
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on("click", () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        const filtered = applyCombinedFilters(allProjects);
        renderProjects(filtered, projectsContainer, 'h2');
        renderPieChart(filtered);
      });
  });
}
