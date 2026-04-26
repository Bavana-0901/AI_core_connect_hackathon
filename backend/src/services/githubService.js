const axios = require('axios');

class GitHubService {
  constructor() {
    this.baseURL = 'https://api.github.com';
    this.token = process.env.GITHUB_TOKEN;
    this.headers = {
      Authorization: `token ${this.token}`,
      Accept: 'application/vnd.github.v3+json',
    };
  }

  async getUserData(username) {
    try {
      const [userRes, reposRes] = await Promise.all([
        axios.get(`${this.baseURL}/users/${username}`, { headers: this.headers }),
        axios.get(`${this.baseURL}/users/${username}/repos?per_page=100`, { headers: this.headers }),
      ]);

      const user = userRes.data;
      const repos = reposRes.data;

      return { user, repos };
    } catch (error) {
      throw new Error('Failed to fetch GitHub data');
    }
  }

  async getCommitActivity(username) {
    try {
      // Get user's repos and fetch commit activity for each
      const reposRes = await axios.get(`${this.baseURL}/users/${username}/repos?per_page=100`, { headers: this.headers });
      const repos = reposRes.data;

      let totalCommits = 0;
      for (const repo of repos.slice(0, 10)) { // Limit to first 10 repos for performance
        try {
          const commitsRes = await axios.get(`${this.baseURL}/repos/${username}/${repo.name}/commits?per_page=100&author=${username}`, { headers: this.headers });
          totalCommits += commitsRes.data.length;
        } catch (e) {
          // Skip repos where user has no commits or access issues
        }
      }

      return totalCommits;
    } catch (error) {
      return 0;
    }
  }

  calculateGitHubScore(data) {
    const { user, repos } = data;
    let score = 0;

    // Repo count (max 20 points)
    const repoScore = Math.min(repos.length * 2, 20);
    score += repoScore;

    // Stars (max 30 points)
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const starScore = Math.min(totalStars * 0.5, 30);
    score += starScore;

    // Forks (max 20 points)
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    const forkScore = Math.min(totalForks * 1, 20);
    score += forkScore;

    // Followers (max 10 points)
    const followerScore = Math.min(user.followers * 0.1, 10);
    score += followerScore;

    // Public repos (max 10 points)
    const publicRepoScore = Math.min(user.public_repos * 0.1, 10);
    score += publicRepoScore;

    // Cap at 100
    score = Math.min(Math.round(score), 100);

    return {
      score,
      breakdown: {
        repoCount: repos.length,
        totalStars,
        totalForks,
        followers: user.followers,
        publicRepos: user.public_repos,
      },
    };
  }

  generateSuggestions(score, breakdown) {
    const suggestions = [];

    if (breakdown.repoCount < 5) {
      suggestions.push('Create more repositories to showcase your work.');
    }

    if (breakdown.totalStars < 10) {
      suggestions.push('Contribute to open-source projects to gain stars.');
    }

    if (breakdown.totalForks < 5) {
      suggestions.push('Fork popular repositories and contribute back.');
    }

    if (breakdown.followers < 10) {
      suggestions.push('Network with other developers and engage on GitHub.');
    }

    if (score < 50) {
      suggestions.push('Focus on quality contributions over quantity.');
    }

    return suggestions;
  }

  async analyzeProfile(username) {
    const data = await this.getUserData(username);
    const commitActivity = await this.getCommitActivity(username);
    const { score, breakdown } = this.calculateGitHubScore(data);
    const suggestions = this.generateSuggestions(score, breakdown);

    return {
      username,
      score,
      breakdown: { ...breakdown, commitActivity },
      suggestions,
    };
  }
}

module.exports = new GitHubService();