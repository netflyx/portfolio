import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import { fetchJSON, renderProjects } from '../global.js';

let query = '';
let selectedIndex = -1;
let initialData = [];
let initialArcs = [];
let filteredProjects = []; 

async function initProjects() {
  const projects = await fetchJSON('../lib/projects.json');
  const projectsContainer = document.querySelector('.projects');
  const projectsTitle = document.querySelector('.projects-title');
  const searchInput = document.querySelector('.searchBar');

  if (projectsTitle) {
    projectsTitle.textContent = `${projects.length} Projects`;
  }
  renderProjects(projects, projectsContainer, 'h2');

  filteredProjects = projects;

  renderPieChart(projects);

  searchInput.addEventListener('input', (event) => {
    query = event.target.value;
    filteredProjects = projects.filter((project) => {
      const values = Object.values(project).join('\n').toLowerCase();
      return values.includes(query.toLowerCase());
    }); 

    renderProjects(filteredProjects, projectsContainer, 'h2');
    updatePieChartFilter(filteredProjects);

    if (selectedIndex !== -1) {
      filteredProjects = filteredProjects.filter(
        (project) => project.year === initialData[selectedIndex].label
      );
      renderProjects(filteredProjects, projectsContainer, 'h2');
      updatePieChartFilter(filteredProjects);
    }
  });

  function renderPieChart(projectsGiven) {
    const svg = d3.select('#projects-pie-plot');
    svg.selectAll('path').remove();
    const legend = d3.select('.legend');
    legend.selectAll('li').remove();

    let rolledData = d3.rollups(
      projectsGiven,
      (v) => v.length,
      (d) => d.year
    );

    initialData = rolledData.map(([year, count]) => {
      return { value: count, label: year };
    });

    let sliceGenerator = d3.pie().value((d) => d.value);
    let slices = sliceGenerator(initialData);
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    initialArcs = slices.map((d) => arcGenerator(d));

    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    initialArcs.forEach((arc, i) => {
      svg
        .append('path')
        .attr('d', arc)
        .attr('fill', colors(i))
        .attr('class', selectedIndex === i ? 'selected' : '')
        .on('click', () => {
          selectedIndex = selectedIndex === i ? -1 : i;

          svg
            .selectAll('path')
            .attr('class', (_, idx) => (selectedIndex === idx ? 'selected' : ''));

          legend
            .selectAll('li')
            .attr('class', (_, idx) =>
              selectedIndex === idx ? 'legend-item selected' : 'legend-item'
            );

          if (selectedIndex === -1) {
            filteredProjects = projects.filter((project) => {
              const values = Object.values(project).join('\n').toLowerCase();
              return values.includes(query.toLowerCase());
            }); 
          } else {
            filteredProjects = projects
              .filter((project) => {
                const values = Object.values(project).join('\n').toLowerCase();
                return values.includes(query.toLowerCase());
              })
              .filter((project) => project.year === initialData[selectedIndex].label);
          }
          renderProjects(filteredProjects, projectsContainer, 'h2');
          updatePieChartFilter(filteredProjects);
        });
    });

    initialData.forEach((d, idx) => {
      legend
        .append('li')
        .attr('class', selectedIndex === idx ? 'legend-item selected' : 'legend-item')
        .attr('style', `--color:${colors(idx)}`)
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
        .on('click', () => {
          selectedIndex = selectedIndex === idx ? -1 : idx;

          svg
            .selectAll('path')
            .attr('class', (_, idx) => (selectedIndex === idx ? 'selected' : ''));

          legend
            .selectAll('li')
            .attr('class', (_, idx) =>
              selectedIndex === idx ? 'legend-item selected' : 'legend-item'
            );

          if (selectedIndex === -1) {
            filteredProjects = projects.filter((project) => {
              const values = Object.values(project).join('\n').toLowerCase();
              return values.includes(query.toLowerCase());
            });
          } else {
            filteredProjects = projects
              .filter((project) => {
                const values = Object.values(project).join('\n').toLowerCase();
                return values.includes(query.toLowerCase());
              })
              .filter((project) => project.year === initialData[selectedIndex].label);
          }
          renderProjects(filteredProjects, projectsContainer, 'h2');
          updatePieChartFilter(filteredProjects);
        });
    });
  }

  function updatePieChartFilter(projectsGiven) {
    const svg = d3.select('#projects-pie-plot');
    let rolledData = d3.rollups(
      projectsGiven,
      (v) => v.length,
      (d) => d.year
    );
    let currentData = rolledData.map(([year, count]) => year);

    svg
      .selectAll('path')
      .attr('class', (d, i) => {
        const year = initialData[i].label;
        return currentData.includes(year) ? (selectedIndex === i ? 'selected' : '') : 'unselected';
      });
  }
}

initProjects();