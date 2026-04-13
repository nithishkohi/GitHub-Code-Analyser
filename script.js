// script.js
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlEl = document.documentElement;
    
    const form = document.getElementById('analyze-form');
    const githubUrlInput = document.getElementById('github-url');
    
    // Views
    const inputContainer = document.getElementById('input-container');
    const loadingContainer = document.getElementById('loading-container');
    const resultsContainer = document.getElementById('results-container');
    
    // Results
    const repoTitle = document.getElementById('repo-title');
    const newAnalysisBtn = document.getElementById('new-analysis-btn');
    const dynamicContent = document.getElementById('dynamic-content');
    const navItems = document.querySelectorAll('.nav-item');

    // --- State ---
    let currentRepoData = null;

    // --- Theme Management ---
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            htmlEl.setAttribute('data-theme', 'light');
            themeIcon.classList.replace('bx-sun', 'bx-moon');
        } else {
            htmlEl.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('bx-moon', 'bx-sun');
        }
    });

    // --- Navigation Logic ---
    function setActiveNav(sectionId) {
        navItems.forEach(item => {
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            if (!currentRepoData) return; // Prevent navigation if no data
            
            const section = item.getAttribute('data-section');
            setActiveNav(section);
            renderContent(section);
        });
    });

    // --- Core Logic ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const url = githubUrlInput.value.trim();
        if (!url) return;

        // Extract "username/repo" from "https://github.com/username/repo"
        let repoName = url;
        try {
            const urlObj = new URL(url);
            repoName = urlObj.pathname.substring(1); // removes leading slash
        } catch(e) {
            // fallback if it's just "user/repo" string
        }

        startAnalysis(repoName);
    });

    newAnalysisBtn.addEventListener('click', () => {
        githubUrlInput.value = '';
        currentRepoData = null;
        switchView(inputContainer);
    });

    function switchView(viewElement) {
        [inputContainer, loadingContainer, resultsContainer].forEach(el => {
            el.classList.remove('active');
            el.classList.add('hidden');
        });
        viewElement.classList.remove('hidden');
        // small timeout to allow display:block to apply before opacity transition
        setTimeout(() => {
            viewElement.classList.add('active');
        }, 50);
    }

    function startAnalysis(repoName) {
        switchView(loadingContainer);
        repoTitle.textContent = repoName;

        // Simulate Network / AI Analysis Delay (3 seconds)
        setTimeout(() => {
            currentRepoData = generateMockAnalysis(repoName);
            setActiveNav('overview');
            renderContent('overview');
            switchView(resultsContainer);
        }, 3000);
    }

    // --- Rendering Logic ---
    function renderContent(section) {
        const data = currentRepoData[section];
        
        // Reset container
        dynamicContent.innerHTML = '';
        // Add minimal animation jump issue fix by small delay
        dynamicContent.style.opacity = '0';
        
        setTimeout(() => {
            dynamicContent.innerHTML = data;
            dynamicContent.style.opacity = '1';
        }, 100);
    }

    // --- MOCK AI ANALYSIS ENGINE ---
    // In a real app, this would be an API call to Gemini/OpenAI passing the GitHub URL.
    function generateMockAnalysis(repoName) {
        return {
            overview: `
                <div class="card">
                    <div class="card-title">
                        <i class='bx bx-book-open'></i> Project Overview
                    </div>
                    <p><strong>${repoName}</strong> is a modern web application designed for high performance and scalability. It serves as a central platform for real-time data processing and user collaboration.</p>
                    <p>The codebase is structured around a decoupled frontend-backend architecture, utilizing RESTful APIs for communication. It prioritizes clean code practices, making it highly extensible.</p>
                </div>
                <div class="card">
                    <div class="card-title">
                        <i class='bx bx-target-lock'></i> Primary Goals (For Interns)
                    </div>
                    <ul class="styled-list">
                        <li>Understand the <strong>Service Layer</strong> pattern used in the backend.</li>
                        <li>Familiarize yourself with the unified state management in the frontend.</li>
                        <li>Ensure all new features include unit tests in the <code>/tests</code> directory.</li>
                    </ul>
                </div>
            `,
            execution: `
                <div class="card">
                    <div class="card-title">
                        <i class='bx bx-git-repo-forked'></i> Flow of Execution
                    </div>
                    <p>When the application starts, the execution flows through these primary stages:</p>
                    <ul class="styled-list">
                        <li><strong>1. Initialization (index.js):</strong> The entry point loads environment variables and connects to the database pool.</li>
                        <li><strong>2. Middleware & Routing (app.js):</strong> Express.js sets up security headers (Helmet), CORS, and registers API route handlers.</li>
                        <li><strong>3. Controller Layer:</strong> Receives the HTTP request, validates the schema, and calls the appropriate Service function.</li>
                        <li><strong>4. Service Layer:</strong> Contains the core business logic. Performs data transformations and logic checks.</li>
                        <li><strong>5. Data Access Layer (DAL):</strong> Interacts with the PostgreSQL database using Prisma ORM.</li>
                    </ul>
                </div>
            `,
            files: `
                <div class="card">
                    <div class="card-title">
                        <i class='bx bx-sitemap'></i> Change Impact Analysis
                    </div>
                    <p>Here is what happens if you modify key structural files in this repository:</p>
                    <ul class="styled-list">
                        <li><strong>Configuration <code>.env</code> file:</strong> Triggers a restart of the Docker container. Missing variables will cause a hard crash on startup.</li>
                        <li><strong><code>package.json</code>:</strong> If you add dependencies, you must run <code>npm install</code> and update the <code>Dockerfile</code> cache layers.</li>
                        <li><strong><code>src/routes/api.js</code>:</strong> Modifying API contracts here requires updating the OpenAPI/Swagger documentation located in <code>/docs/swagger.yml</code> to avoid breaking frontend clients.</li>
                        <li><strong><code>src/utils/logger.js</code>:</strong> Changing the logging format will break the ELK stack pipeline parsing. Ensure DevOps is notified before altering log shapes.</li>
                    </ul>
                </div>
            `,
            setup: `
                <div class="card">
                    <div class="card-title">
                        <i class='bx bx-terminal'></i> How to Start Running the Program
                    </div>
                    <p>Follow these exact steps to get your local development environment running:</p>
                    
                    <div class="code-block">
                        <span class="comment"># 1. Clone the repository</span><br>
                        <span class="command">git clone</span> https://github.com/${repoName}.git<br>
                        <span class="command">cd</span> ${repoName.split('/')[1] || 'repository'}<br><br>
                        
                        <span class="comment"># 2. Install Dependencies</span><br>
                        <span class="command">npm</span> install<br><br>

                        <span class="comment"># 3. Setup Environment Variables</span><br>
                        <span class="command">cp</span> .env.example .env<br><br>

                        <span class="comment"># 4. Start Local Services (Database, Cache)</span><br>
                        <span class="command">docker-compose</span> up -d<br><br>

                        <span class="comment"># 5. Run Database Migrations</span><br>
                        <span class="command">npx</span> prisma migrate dev<br><br>

                        <span class="comment"># 6. Start the Server</span><br>
                        <span class="command">npm</span> run dev
                    </div>
                    <p>The application will be available at <strong>http://localhost:3000</strong>.</p>
                </div>
            `,
            dependencies: `
                <div class="card">
                    <div class="card-title">
                        <i class='bx bx-package'></i> Core Dependencies
                    </div>
                    <p>The project relies on these primary libraries. Make sure to review their documentation:</p>
                    <ul class="styled-list">
                        <li><strong>Express.js (^4.18.0)</strong> - Web framework for handling HTTP requests and routing.</li>
                        <li><strong>Prisma (^5.0.0)</strong> - Next-generation Node.js and TypeScript ORM for database access.</li>
                        <li><strong>Zod (^3.21.0)</strong> - TypeScript-first schema declaration and validation library.</li>
                        <li><strong>JSONWebToken (^9.0.0)</strong> - Used for stateless authentication mechanisms.</li>
                        <li><strong>Jest (^29.5.0)</strong> - The primary testing framework for unit and integration tests.</li>
                    </ul>
                </div>
            `,
            languages: `
                <div class="card">
                    <div class="card-title">
                        <i class='bx bx-code-alt'></i> Languages & Technologies
                    </div>
                    <div class="tech-chips">
                        <div class="chip"><i class='bx bxl-typescript'></i> TypeScript (75%)</div>
                        <div class="chip"><i class='bx bxl-javascript'></i> JavaScript (15%)</div>
                        <div class="chip"><i class='bx bx-data'></i> SQL (5%)</div>
                        <div class="chip"><i class='bx bxl-docker'></i> Dockerfile (5%)</div>
                    </div>
                    <p style="margin-top: 20px;">The codebase is primarily written in <strong>TypeScript</strong> to ensure type safety and developer productivity. Strict mode is enabled, meaning all intern contributions must have properly defined typings without using the <code>any</code> type.</p>
                </div>
            `
        };
    }
});
