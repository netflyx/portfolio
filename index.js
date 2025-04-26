import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

async function initLatestProjects() {
    const projects = await fetchJSON('./lib/projects.json');
    const latestProjects = projects.slice(0, 3);
    const projectsContainer = document.querySelector('.projects');
    if (!projectsContainer) {
        onsole.error('No .projects container found on the homepage.');
        return;
    }
    renderProjects(latestProjects, projectsContainer, 'h2');
  
    const githubData = await fetchGitHubData('netflyx');
    const profileStats = document.querySelector('#profile-stats');
    if (profileStats) {
      profileStats.innerHTML = `
          <dl>
            <dd>Public Repos:${githubData.public_repos}</dd>
            <dd>Followers:${githubData.followers}</dd>
            <dd>Following:${githubData.following}</dd>
          </dl>
      `;
    }
  }
  initLatestProjects();