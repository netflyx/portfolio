import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let allProjects = [];
let selectedIndex = -1;

async function initProjects() {
  allProjects = await fetchJSON('../lib/projects.json');
  const projectsContainer = document.querySelector('.projects');
  const projectsTitle = document.querySelector('.projects-title');

  if (projectsTitle) {
    projectsTitle.textContent = `${allProjects.length} Projects`;
  }

  renderProjects(allProjects, projectsContainer, 'h2');
  renderPieChart(allProjects);
}

initProjects();

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
      
        svg.selectAll("path")
          .attr("class", (_, idx) => idx === selectedIndex ? "selected" : null);
      
        legend.selectAll("li")
          .attr("class", (_, idx) =>
            idx === selectedIndex ? "legend-item selected" : "legend-item"
          );
      
          if (selectedIndex === -1) {
            renderProjects(allProjects, projectsContainer, 'h2');
            renderPieChart(allProjects);
          } else {
            const selectedLabel = data[selectedIndex].label;
            const filteredProjects = allProjects.filter(p => p.year === selectedLabel);
            renderProjects(filteredProjects, projectsContainer, 'h2');
            renderPieChart(filteredProjects);
          }
          
          
      });
  });

  data.forEach((d, i) => {
    legend.append("li")
      .attr("style", `--color:${colors(i)}`)
      .attr("class", i === selectedIndex ? "legend-item selected" : "legend-item")
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on("click", () => {
        selectedIndex = selectedIndex === i ? -1 : i;
      
        svg.selectAll("path")
          .attr("class", (_, idx) => idx === selectedIndex ? "selected" : null);
      
        legend.selectAll("li")
          .attr("class", (_, idx) =>
            idx === selectedIndex ? "legend-item selected" : "legend-item"
          );
      
        if (selectedIndex === -1) {
          renderProjects(projectsGiven, projectsContainer, 'h2');
        } else {
          const selectedLabel = data[selectedIndex].label;
          const filtered = projectsGiven.filter(p => p.year === selectedLabel);
          renderProjects(filtered, projectsContainer, 'h2');
        }
      });      
  });
}
