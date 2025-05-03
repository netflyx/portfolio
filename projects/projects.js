import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let allProjects = await fetchJSON('../lib/projects.json');
let query = '';
let selectedIndex = -1;

const projectsContainer = document.querySelector('.projects');
const searchInput = document.querySelector('.searchBar');
const svg = d3.select('#projects-pie-plot');
const legend = d3.select('.legend');

searchInput.addEventListener('input', (event) => {
  query = event.target.value.toLowerCase();
  updateView();
});

updateView();

function updateView() {
  const searchFiltered = allProjects.filter(project =>
    Object.values(project).join('\n').toLowerCase().includes(query)
  );

  const finalFiltered =
    selectedIndex === -1
      ? searchFiltered
      : searchFiltered.filter(p => p.year === currentData[selectedIndex].label);

  renderProjects(finalFiltered, projectsContainer, 'h2');
  renderPieChart(searchFiltered);
}

let currentData = [];

function renderPieChart(projectsToUse) {
  const rolledData = d3.rollups(
    projectsToUse,
    (v) => v.length,
    (d) => d.year
  );

  const data = rolledData.map(([year, count]) => ({
    value: count,
    label: year,
  }));

  currentData = data;

  const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  const sliceGenerator = d3.pie().value((d) => d.value);
  const arcData = sliceGenerator(data);

  const colors = d3.scaleOrdinal(d3.schemeTableau10);

  svg.selectAll('path').remove();
  legend.selectAll('li').remove();

  svg
    .selectAll('path')
    .data(arcData)
    .enter()
    .append('path')
    .attr('d', arcGenerator)
    .style('--color', (_, i) => colors(i))
    .style('fill', 'var(--color)')
    .attr('class', (_, i) => (i === selectedIndex ? 'selected' : ''))
    .on('click', (_, i) => {
      selectedIndex = selectedIndex === i ? -1 : i;
      updateView();
    });

  legend
    .selectAll('li')
    .data(data)
    .enter()
    .append('li')
    .attr('style', (_, i) => `--color:${colors(i)}`)
    .attr('class', (_, i) => (i === selectedIndex ? 'legend-item selected' : 'legend-item'))
    .html(d => `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
    .on('click', (_, i) => {
      selectedIndex = selectedIndex === i ? -1 : i;
      updateView();
    });
}
