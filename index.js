import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

async function initLatestProjects() {
    const projects = await fetchJSON('./lib/projects.json');
    const latestProjects = projects.slice(0, 3);
    const projectsContainer = document.querySelector('.projects');
    if (!projectsContainer) {
        console.error('No .projects container found on the homepage.');
        return;
    }
    renderProjects(latestProjects, projectsContainer, 'h2');
  
    const githubData = await fetchGitHubData('netflyx');
    const profileStats = document.querySelector('#profile-stats');
    if (profileStats) {
      profileStats.innerHTML = `
          <dl>
            <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
            <dt>Followers:</dt><dd>${githubData.followers}</dd>
            <dt>Following:</dt><dd>${githubData.following}</dd>
          </dl>
      `;
    }
  }
  initLatestProjects();