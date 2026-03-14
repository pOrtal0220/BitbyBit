import axios from 'axios';

// 1. Create the base instance
const API = axios.create({ 
    baseURL: 'http://localhost:5000/api',
    timeout: 30000
});

// 2. PROJECT CREATION (Employer)
export const createProject = (data) => {
    return API.post('/projects/generate-roadmap', data);
};

// 3. FETCH PROJECTS BY ROLE & ID
export const getMyProjects = (role, userId) => {
    return API.get('/projects/my-projects/' + role + '/' + userId);
};

// 4. FETCH ALL AVAILABLE PROJECTS (Freelancer Explore)
// THIS WAS THE MISSING EXPORT CAUSING YOUR ERROR
export const getExploreProjects = () => {
    return API.get('/projects/explore');
};

// 5. CLAIM/JOIN A PROJECT
export const joinProject = (projectId, freelancerId) => {
    return API.post('/projects/join', { projectId, freelancerId });
};

// 6. FUND/ESCROW HANDSHAKE
export const fundProject = (projectId) => {
    return API.post('/projects/fund', { projectId });
};

// 7. AUDIT & PAYOUT
export const verifyWork = (projectId, milestoneId) => {
    return API.post('/projects/payout', { projectId, milestoneId });
};