import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let allProjects = []; // we store it here so it's available globally

async function initProjects() {
  allProjects = await fetchJSON('../lib/projects.json');
  const projectsContainer = document.querySelector('.projects');
  const projectsTitle = document.querySelector('.projects-title');

  if (projectsTitle) {
    projectsTitle.textContent = `${allProjects.length} Projects`;
  }

  // Initial render
  renderProjects(allProjects, projectsContainer, 'h2');
  renderPieChart(allProjects);
}

initProjects();

// Set up search input
const searchInput = document.querySelector('.searchBar');
const projectsContainer = document.querySelector('.projects');

searchInput.addEventListener('input', (event) => {
  const query = event.target.value.toLowerCase();

  const filteredProjects = allProjects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query);
  });

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});

// Modular pie + legend renderer
function renderPieChart(projectsGiven) {
  const svg = d3.select("#projects-pie-plot");
  const legend = d3.select('.legend');

  // ✅ Clear previous chart + legend
  svg.selectAll("path").remove();
  legend.selectAll("li").remove();

  // ✅ Aggregate data by year (or change this to project.category etc.)
  const rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  const data = rolledData.map(([year, count]) => ({
    label: year,
    value: count
  }));

  // ✅ Pie + arc generators
  const colors = d3.scaleOrdinal(d3.schemeTableau10);
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  const sliceGenerator = d3.pie().value((d) => d.value);
  const arcData = sliceGenerator(data);

  // ✅ Draw pie slices
  svg.selectAll("path")
    .data(arcData)
    .enter()
    .append("path")
    .attr("d", arcGenerator)
    .attr("fill", (d, i) => colors(i));

  // ✅ Draw legend
  data.forEach((d, i) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(i)}`)
      .attr('class', 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}
