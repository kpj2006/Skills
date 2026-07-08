/* AOSSIE Skill Ecosystem Simulation Logic */

// --- 1. Mock Skills Core File Data ---
const MOCK_FILES = {
    architecture: {
        path: ".agent/core/architecture.md",
        content: `# Core Project Architecture

This repository follows a modular structure:
- **Frontend:** /frontend - React Single Page App
- **Backend:** /backend - Express REST API
- **Database:** Prisma ORM with PostgreSQL

## Architecture Boundaries
1. Frontend communicates with Backend ONLY via REST API calls.
2. Direct database access must happen ONLY through '/backend/models/'.
3. Shared utilities inside '/utils/' must check all callers on edit.`
    },
    "edge-cases": {
        path: ".agent/core/edge-cases.md",
        content: `# Edge Cases & Agent Lessons Learned

## 🔴 Critical - Will Break Things
- **Function Signatures:** If you change any function inside 'utils/', you MUST update all callers.
- **Database Schema:** Never modify Prisma schema without running migrations.

## 🟡 Caution - Common Agent Mistakes
- Do NOT add a '/src' folder. Use '/frontend' or '/backend'.
- Do NOT add new dependencies without checking existing package.json.`
    },
    setup: {
        path: ".agent/instructions/setup.md",
        content: `# Project Setup & Local Development

## Prerequisites
- Node.js 18+
- Docker & Docker Compose

## Local Development Setup
1. Clone repo: git clone https://github.com/AOSSIE-Org/PROJECT.git
2. Install dependencies: npm install
3. Start database: docker-compose up -d
4. Run migrations: npx prisma migrate dev
5. Run dev server: npm run dev`
    },
    testing: {
        path: ".agent/instructions/testing.md",
        content: `# Testing Strategy & Commands

## Test Commands
- Run all tests: npm test
- Run specific file: npm run test -- path/to/file.test.js
- Check lint rules: npm run lint

## Standards
- Every new feature or bug fix MUST include unit tests.
- Test files must mirror source paths.`
    },
    policy: {
        path: "skills/GIT-DIS-AIPolicy/SKILL.md",
        content: `# GIT-DIS-AIPolicy — Agent Behavioral Controller

This skill governs contributor AI agent behavior.
- **Blind Issue Scan Guard:** AI agents must ABORT unguided issue generation to prevent repo spam.
- **Already-Assigned Issues Check:** Before work starts, check GitHub issues board to prevent PR conflicts.
- **AI Disclosure:** Add disclosure tag to all AI-assisted PR descriptions.`
    }
};

// --- 2. State & Step Definitions ---
let activeScenario = 'a';
let scenarioStep = 0;
let connectionsCalculated = false;
let autoplayInterval = null;
let isAutoplay = false;

// Scenarios Timeline Actions
const SCENARIOS = {
    a: {
        name: "Discord Chat & Gap Flow",
        description: "Controlling queries, mentor-clarification, and gap-signal feedback loop.",
        steps: [
            {
                label: "Submit User Query",
                run: (engine) => {
                    engine.focusCards(['bot']);
                    engine.addLog("User submitted Discord query in #ai-chat: 'How do I deploy this template to production?'", "system");
                    engine.simulateDiscordUserMsg("How do I deploy this template to production?");
                    engine.setCardActive("bot", true);
                    engine.addLog("Skill Bot: Intercepted query. Starting vector index search...", "info");
                }
            },
            {
                label: "Scan Skills Core",
                run: (engine) => {
                    engine.addLog("Skill Bot: Computing similarity embedding for query...", "info");
                    engine.animatePacket("core", "bot", () => {
                        engine.addLog("Skill Bot: Retrieved 'setup.md' and 'architecture.md' embeddings from Skills Core index.", "info");
                        engine.addLog("Skill Bot: Cosine similarity score = 0.45. Confidence threshold is 0.70.", "warn");
                        engine.addLog("Skill Bot: Question is ambiguous (no production rules found in setup.md). Triggering ambiguity classifier...", "warn");
                        
                        // Show Choice Prompt to user in UI
                        document.getElementById("prompt-choices").style.display = "flex";
                        engine.addLog("Skill Bot: Awaiting mentor decision flow step...", "system");
                    });
                }
            },
            {
                label: "Resolve Decision (Gap Flow or Clarify)",
                run: (engine, subOption) => {
                    engine.focusCards(['bot']);
                    // Hide options
                    document.getElementById("prompt-choices").style.display = "none";
                    
                    if (subOption === 'clarify' || !subOption) {
                        // Clarify Option (Roadmap Phase 1)
                        engine.simulateDiscordBotMsg("Are you setting up for a local development build, or deploying to a cloud server like AWS/Vercel?");
                        engine.addLog("Skill Bot [Clarification Flow]: Asked clarifying question to refine intent.", "info");
                        
                        setTimeout(() => {
                            engine.simulateDiscordUserMsg("Deploying to AWS RDS + App Runner");
                            engine.addLog("User replied: 'Deploying to AWS RDS + App Runner'", "system");
                            
                            setTimeout(() => {
                                engine.addLog("Skill Bot: Re-evaluating refined query: 'AWS App Runner setup'...", "info");
                                engine.simulateDiscordBotMsg("Found no specific deployment skill for AWS RDS in Skills Core. However, general Docker containers run via AWS App Runner. Let me write this query to the Gap Logs.");
                                engine.addLog("Skill Bot: Confirmed knowledge gap. Logging GAP SIGNAL to gap_log.json.", "warn");
                                
                                // Send gap packet to updater
                                engine.animatePacket("bot", "updater", () => {
                                    engine.addLog("Skill Updater: Intercepted GAP SIGNAL: {'query': 'AWS App Runner deployment', 'source': 'Discord #ai-chat'}", "success");
                                    engine.setCardActive("updater", true);
                                    engine.setUpdaterStepActive("poll", "Gap Signal Added to Queue");
                                });
                            }, 1200);
                        }, 1200);
                    } else {
                        // Direct LLM fallback and Gap logging
                        engine.simulateDiscordBotMsg("I couldn't find deployment instructions in our Skills Core. Falling back to general LLM guidelines. [Warning: General advice only. Setup may differ.]");
                        engine.addLog("Skill Bot: confidence < 0.70. Emitted fallback response.", "warn");
                        engine.addLog("Skill Bot: Emitting GAP SIGNAL to gap_log.json...", "warn");
                        
                        engine.animatePacket("bot", "updater", () => {
                            engine.addLog("Skill Updater: Intercepted GAP SIGNAL: {'query': 'deploy to production', 'source': 'Discord #ai-chat'}", "success");
                            engine.setCardActive("updater", true);
                            engine.setUpdaterStepActive("poll", "Gap Signal Logged");
                        });
                    }
                }
            }
        ]
    },
    b: {
        name: "PR Analysis & Staleness Flow",
        description: "Evaluating PR CodeRabbit summaries, building DAG merge conflicts, and signaling stale skills.",
        steps: [
            {
                label: "Analyze Open Pull Requests",
                run: (engine) => {
                    engine.focusCards(['dash']);
                    engine.addLog("PR Dashboard: Fetching open PRs from Github API...", "info");
                    engine.addLog("PR Dashboard: Found 2 overlapping PRs: PR #41 (Add Direct PostgreSQL Client) and PR #42 (Setup Prisma ORM)", "info");
                    engine.setCardActive("dash", true);
                }
            },
            {
                label: "Inject Skills Core Context",
                run: (engine) => {
                    engine.addLog("PR Dashboard: Querying ChromaDB vector store of Skills Core...", "info");
                    engine.animatePacket("core", "dash", () => {
                        engine.addLog("PR Dashboard: Matched and injected context from '.agent/core/architecture.md' (rules on Prisma/DB models).", "info");
                        engine.addLog("PR Dashboard: Running local Ollama inference on conflict analysis...", "info");
                    });
                }
            },
            {
                label: "Detect Conflict Graph & Staleness",
                run: (engine) => {
                    // Highlight the conflict Nodes
                    document.getElementById("dag-pr-41").classList.add("active-evaluation");
                    document.getElementById("dag-pr-42").classList.add("active-evaluation");
                    
                    engine.addLog("PR Dashboard: Semantic conflict found. PR #41 bypasses the Prisma model layer specified in architecture.md.", "warn");
                    engine.addLog("PR Dashboard: Generated conflict DAG html report.", "success");
                    
                    // Emitting Staleness signal
                    engine.addLog("PR Dashboard: Stale Skill detected (PR #42 introduces node 20 & npm 10 engines which are undocumented in setup.md). Emitting STALENESS SIGNAL to Skill Updater.", "warn");
                    
                    engine.animatePacket("dash", "updater", () => {
                        engine.addLog("Skill Updater: Received STALENESS SIGNAL: {'file': '.agent/instructions/setup.md', 'type': 'outdated node engine'}", "success");
                        engine.setCardActive("updater", true);
                        engine.setUpdaterStepActive("poll", "Staleness Signal Logged");
                    });
                }
            }
        ]
    },
    c: {
        name: "Discussion to Update Loop",
        description: "BERTopic Semantic clustering on developer chats/logs to patch Skills Core in Git.",
        steps: [
            {
                label: "Poll Signals & Chats",
                run: (engine) => {
                    engine.focusCards(['updater']);
                    engine.addLog("Skill Updater: Fetching unread maintainer Discord conversations...", "info");
                    engine.addLog("Skill Updater: Aggregating active inputs: 1 Discord thread, 1 Gap Signal, 1 Staleness Signal.", "info");
                    engine.setCardActive("updater", true);
                    engine.setUpdaterStepActive("poll", "Polling Active: 3 signals fetched");
                }
            },
            {
                label: "Online Semantic Topic Clustering",
                run: (engine) => {
                    engine.focusCards(['updater']);
                    engine.addLog("Skill Updater: Running BERTopic Incremental Online Clustering...", "info");
                    engine.setUpdaterStepActive("cluster", "BERTopic: Groups formed");
                    
                    setTimeout(() => {
                        engine.addLog("Skill Updater: Grouped 3 signals into Cluster #5: 'development setup dependencies update'.", "success");
                        engine.addLog("Skill Updater: Representative phrase: 'Upgrade local dev server setup details with Node 20 / AWS deployment options'.", "info");
                    }, 500);
                }
            },
            {
                label: "Generate Git Diff Patch",
                run: (engine) => {
                    engine.focusCards(['updater']);
                    engine.addLog("Skill Updater: Prompting local Llama3 model with cluster content...", "info");
                    
                    // Display Git Diff Patch preview
                    const diffContainer = document.getElementById("patch-preview-container");
                    const diffText = document.getElementById("patch-diff-content");
                    diffContainer.style.display = "block";
                    
                    const patchStr = `diff --git a/.agent/instructions/setup.md b/.agent/instructions/setup.md
index a3f821d..b59ec42 100644
--- a/.agent/instructions/setup.md
+++ b/.agent/instructions/setup.md
@@ -9,4 +9,5 @@
  - Node.js 18+ (Node 20 recommended)
  - Docker & Docker Compose
 +- AWS App Runner client (optional for production deployments)
 
  ## Local Development Setup`;
 
                    diffText.textContent = patchStr;
                    engine.addLog("Skill Updater: Generated JSON git-patch structure.", "success");
                    engine.setUpdaterStepActive("patch", "Patch Ready");
                }
            },
            {
                label: "Apply Patch to Skills Core",
                run: (engine) => {
                    engine.addLog("Skill Updater: Executing skill_patcher.py on local Skills Core workspace...", "info");
                    
                    engine.animatePacket("updater", "core", () => {
                        engine.addLog("Skills Core: Patch applied successfully in Git. Created commit 'docs: update setup instructions node version & AWS context'.", "success");
                        
                        // Dynamically update Skills Core file Explorer content!
                        MOCK_FILES.setup.content = `# Project Setup & Local Development

## Prerequisites
- Node.js 18+ (Node 20 recommended)
- Docker & Docker Compose
- AWS App Runner client (optional for production deployments)

## Local Development Setup
1. Clone repo: git clone https://github.com/AOSSIE-Org/PROJECT.git
2. Install dependencies: npm install
3. Start database: docker-compose up -d
4. Run migrations: npx prisma migrate dev
5. Run dev server: npm run dev`;

                        // If "setup" is the active tab in Skills Core card, update editor body with green highlights
                        const activeFile = document.querySelector(".tree-item.active").getAttribute("data-file");
                        if (activeFile === "setup") {
                            renderFile("setup", true);
                        } else {
                            // Select setup file to show update
                            const setupTreeItem = document.querySelector(".tree-item[data-file='setup']");
                            setupTreeItem.click();
                        }
                        
                        engine.addLog("Ecosystem Loop Completed! Skills Core is now updated. Future bot replies and PR reviews will leverage this new context.", "success");
                        engine.setCardActive("core", true);
                    });
                }
            }
        ]
    }
};

// --- 3. UI Interaction Engine Class ---
class SimulationEngine {
    constructor() {
        this.terminal = document.getElementById("console-terminal");
    }

    addLog(text, type = 'info') {
        const line = document.createElement("div");
        line.className = `log-line ${type}-log`;
        
        const timestamp = new Date().toLocaleTimeString();
        line.innerHTML = `<span style="color: var(--text-muted)">[${timestamp}]</span> ${text}`;
        
        this.terminal.appendChild(line);
        this.terminal.scrollTop = this.terminal.scrollHeight;
    }

    clearLogs() {
        this.terminal.innerHTML = `<div class="log-line system-log">[SYSTEM] Logs cleared. Select a scenario to start tracing.</div>`;
    }

    setCardActive(cardId, isActive) {
        const card = document.getElementById(`card-${cardId}`);
        if (isActive) {
            card.classList.add("active-glow");
        } else {
            card.classList.remove("active-glow");
        }
    }

    clearAllGlows() {
        ['core', 'bot', 'dash', 'updater'].forEach(id => this.setCardActive(id, false));
    }

    focusCards(cardIds) {
        const allIds = ['core', 'bot', 'dash', 'updater'];
        allIds.forEach(id => {
            const card = document.getElementById(`card-${id}`);
            if (!card) return;
            if (cardIds.includes(id)) {
                card.classList.add("processing");
                card.classList.remove("dimmed");
            } else {
                card.classList.remove("processing");
                card.classList.add("dimmed");
            }
        });
    }

    clearFocus() {
        const allIds = ['core', 'bot', 'dash', 'updater'];
        allIds.forEach(id => {
            const card = document.getElementById(`card-${id}`);
            if (card) {
                card.classList.remove("processing");
                card.classList.remove("dimmed");
            }
        });
        
        // Clear active flow on paths
        const paths = ['core-bot', 'core-dash', 'bot-updater', 'dash-updater', 'updater-core'];
        paths.forEach(p => {
            const path = document.getElementById(`path-${p}`);
            if (path) path.classList.remove("active-flow");
        });
    }

    setUpdaterStepActive(stepId, text) {
        const steps = ['poll', 'cluster', 'patch'];
        steps.forEach(id => {
            const el = document.getElementById(`step-${id}`);
            if (el) el.classList.remove("active");
        });
        
        if (!stepId) return;
        
        const activeStep = document.getElementById(`step-${stepId}`);
        if (activeStep) activeStep.classList.add("active");
        
        if (text) {
            let detailId = "";
            if (stepId === "poll") detailId = "updater-input-src";
            else if (stepId === "cluster") detailId = "updater-cluster-info";
            else if (stepId === "patch") detailId = "updater-patch-info";
            
            const detailEl = document.getElementById(detailId);
            if (detailEl) detailEl.textContent = text;
        }
    }

    resetUpdaterSteps() {
        this.setUpdaterStepActive("", "");
        document.getElementById("updater-input-src").textContent = "Idle. Awaiting signal...";
        document.getElementById("updater-cluster-info").textContent = "BERTopic Online Model";
        document.getElementById("updater-patch-info").textContent = "Git-backed commit";
        document.getElementById("patch-preview-container").style.display = "none";
    }

    simulateDiscordUserMsg(text) {
        const box = document.getElementById("discord-messages");
        const msg = document.createElement("div");
        msg.className = "discord-message";
        msg.innerHTML = `
            <div class="avatar user-avatar"><i class="fa-solid fa-user"></i></div>
            <div class="msg-content">
                <div class="author-name">Contributor_XYZ</div>
                <div class="msg-text">${text}</div>
            </div>
        `;
        box.appendChild(msg);
        box.scrollTop = box.scrollHeight;
    }

    simulateDiscordBotMsg(text) {
        const box = document.getElementById("discord-messages");
        const msg = document.createElement("div");
        msg.className = "discord-message bot-msg";
        msg.innerHTML = `
            <div class="avatar bot-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="msg-content">
                <div class="author-name">SkillBot <span class="bot-badge">BOT</span></div>
                <div class="msg-text">${text}</div>
            </div>
        `;
        box.appendChild(msg);
        box.scrollTop = box.scrollHeight;
    }

    resetDiscordMessages() {
        const box = document.getElementById("discord-messages");
        box.innerHTML = `
            <div class="discord-message">
                <div class="avatar user-avatar"><i class="fa-solid fa-user"></i></div>
                <div class="msg-content">
                    <div class="author-name">Contributor_XYZ</div>
                    <div class="msg-text">How do I set up this repository for development?</div>
                </div>
            </div>
            <div class="discord-message bot-msg">
                <div class="avatar bot-avatar"><i class="fa-solid fa-robot"></i></div>
                <div class="msg-content">
                    <div class="author-name">SkillBot <span class="bot-badge">BOT</span></div>
                    <div class="msg-text">Welcome! Let me check the Skills Core context for setup steps...</div>
                </div>
            </div>
        `;
    }

    resetDashboardPRs() {
        document.getElementById("dag-pr-41").className = "dag-node pr-node conflict";
        document.getElementById("dag-pr-42").className = "dag-node pr-node conflict";
    }

    animatePacket(fromId, toId, onComplete) {
        const packet = document.getElementById(`packet-${fromId}-${toId}`);
        const path = document.getElementById(`path-${fromId}-${toId}`);
        
        if (!packet || !path) {
            if (onComplete) onComplete();
            return;
        }

        // Highlight the path and focus both elements
        path.classList.add("active-flow");
        this.focusCards([fromId, toId]);

        packet.style.display = "block";
        
        const pathLength = path.getTotalLength();
        let start = null;
        const duration = 1200; // 1.2s animation speed

        const self = this;
        function step(timestamp) {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / duration;

            if (progress < 1) {
                // Calculate position along SVG path
                const currentLength = progress * pathLength;
                const point = path.getPointAtLength(currentLength);
                
                packet.setAttribute("cx", point.x);
                packet.setAttribute("cy", point.y);
                
                requestAnimationFrame(step);
            } else {
                packet.style.display = "none";
                path.classList.remove("active-flow");
                
                // Focus only the target card after packet arrives
                self.focusCards([toId]);
                
                if (onComplete) onComplete();
            }
        }
        
        requestAnimationFrame(step);
    }
}

// Instantiate engine
const engine = new SimulationEngine();

// --- 4. Render file content helper ---
function renderFile(fileKey, showAddedDiff = false) {
    const file = MOCK_FILES[fileKey];
    if (!file) return;

    document.getElementById("editor-filename").textContent = file.path;
    
    const body = document.getElementById("editor-body");
    
    if (showAddedDiff && fileKey === 'setup') {
        // Show simulated diff highlights
        const lines = file.content.split('\n');
        body.innerHTML = '';
        lines.forEach(line => {
            const lineSpan = document.createElement("span");
            if (line.startsWith("+ ")) {
                lineSpan.className = "diff-added";
            } else if (line.startsWith("- ")) {
                lineSpan.className = "diff-deleted";
            }
            lineSpan.textContent = line + '\n';
            body.appendChild(lineSpan);
        });
    } else {
        body.textContent = file.content;
    }
}

// --- 5. SVG Connections Drawing Engine ---
function updateConnections() {
    const canvas = document.getElementById("connections-canvas");
    if (!canvas) return;

    const cards = {
        core: document.getElementById("card-core"),
        bot: document.getElementById("card-bot"),
        dash: document.getElementById("card-dash"),
        updater: document.getElementById("card-updater")
    };

    // Make sure elements exist
    if (!cards.core || !cards.bot || !cards.dash || !cards.updater) return;

    const containerRect = document.querySelector(".app-container").getBoundingClientRect();

    // Helper to get edge connection points relative to container
    function getConnectorPoints(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2,
            left: rect.left - containerRect.left,
            right: rect.right - containerRect.left,
            top: rect.top - containerRect.top,
            bottom: rect.bottom - containerRect.top,
            width: rect.width,
            height: rect.height
        };
    }

    const pts = {
        core: getConnectorPoints(cards.core),
        bot: getConnectorPoints(cards.bot),
        dash: getConnectorPoints(cards.dash),
        updater: getConnectorPoints(cards.updater)
    };

    // Calculate paths
    // 1. Core -> Bot (Context read)
    const dCoreBot = `M ${pts.core.right} ${pts.core.top + 50} H ${pts.bot.left}`;
    document.getElementById("path-core-bot").setAttribute("d", dCoreBot);

    // 2. Core -> Dash (Context injection)
    const dCoreDash = `M ${pts.core.left + 50} ${pts.core.bottom} V ${pts.dash.top}`;
    document.getElementById("path-core-dash").setAttribute("d", dCoreDash);

    // 3. Bot -> Updater (Gap signals)
    const dBotUpdater = `M ${pts.bot.right - 50} ${pts.bot.bottom} V ${pts.updater.top}`;
    document.getElementById("path-bot-updater").setAttribute("d", dBotUpdater);

    // 4. Dash -> Updater (Staleness signals)
    const dDashUpdater = `M ${pts.dash.right} ${pts.dash.bottom - 50} H ${pts.updater.left}`;
    document.getElementById("path-dash-updater").setAttribute("d", dDashUpdater);

    // 5. Updater -> Core (Sync patch)
    // Draw a diagonal curving path around components
    const dUpdaterCore = `M ${pts.updater.left + 30} ${pts.updater.bottom} C ${pts.updater.left - 100} ${pts.updater.bottom + 80}, ${pts.dash.left - 80} ${pts.dash.bottom + 80}, ${pts.core.left} ${pts.core.bottom - 30}`;
    document.getElementById("path-updater-core").setAttribute("d", dUpdaterCore);

    connectionsCalculated = true;
}

// --- 6. Event Listeners & Bootstrapping ---

// File explorer click handler
document.getElementById("file-tree").addEventListener("click", (e) => {
    const item = e.target.closest(".tree-item");
    if (!item) return;

    // Toggle active state
    document.querySelectorAll(".tree-item").forEach(el => el.classList.remove("active"));
    item.classList.add("active");

    const fileKey = item.getAttribute("data-file");
    renderFile(fileKey);
});

// PR Dashboard Tab click handler
document.querySelector(".dashboard-tabs").addEventListener("click", (e) => {
    const tab = e.target.closest(".dash-tab");
    if (!tab) return;

    document.querySelectorAll(".dash-tab").forEach(el => el.classList.remove("active"));
    tab.classList.add("active");

    const tabKey = tab.getAttribute("data-tab");
    if (tabKey === "dag") {
        document.getElementById("panel-dag").style.display = "flex";
        document.getElementById("panel-isolated").style.display = "none";
    } else {
        document.getElementById("panel-dag").style.display = "none";
        document.getElementById("panel-isolated").style.display = "flex";
    }
});

// Scenario Selector Button Click Handler
document.querySelector(".scenario-buttons").addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-scenario");
    if (!btn) return;

    document.querySelectorAll(".btn-scenario").forEach(el => el.classList.remove("active"));
    btn.classList.add("active");

    activeScenario = btn.getAttribute("data-scenario");
    resetSimulation();
});

// Reset Simulation Action
function resetSimulation() {
    stopAutoplay();
    scenarioStep = 0;
    
    // Reset file edits
    MOCK_FILES.setup.content = `# Project Setup & Local Development

## Prerequisites
- Node.js 18+
- Docker & Docker Compose

## Local Development Setup
1. Clone repo: git clone https://github.com/AOSSIE-Org/PROJECT.git
2. Install dependencies: npm install
3. Start database: docker-compose up -d
4. Run migrations: npx prisma migrate dev
5. Run dev server: npm run dev`;

    renderFile("architecture");
    
    // Reset active states
    document.querySelectorAll(".tree-item").forEach(el => el.classList.remove("active"));
    document.querySelector(".tree-item[data-file='architecture']").classList.add("active");

    engine.clearAllGlows();
    engine.resetDiscordMessages();
    engine.resetDashboardPRs();
    engine.resetUpdaterSteps();
    engine.clearLogs();
    
    const nextBtn = document.getElementById("btn-trigger-action");
    nextBtn.disabled = false;
    nextBtn.innerHTML = `<i class="fa-solid fa-bolt"></i> Trigger Step`;
    
    // Hide quick choices if visible
    document.getElementById("prompt-choices").style.display = "none";

    engine.addLog(`Scenario ${activeScenario.toUpperCase()} loaded: ${SCENARIOS[activeScenario].name}. Click "Trigger Step" or "Auto-Play" to execute.`, "system");
}

document.getElementById("btn-reset").addEventListener("click", resetSimulation);

// Clear logs action
document.getElementById("console-clear").addEventListener("click", () => engine.clearLogs());

// Trigger Step Action click
document.getElementById("btn-trigger-action").addEventListener("click", () => {
    stopAutoplay();
    runNextStep();
});

// Autoplay trigger
document.getElementById("btn-autoplay").addEventListener("click", toggleAutoplay);

// Autoplay functions
function toggleAutoplay() {
    if (isAutoplay) {
        stopAutoplay();
        engine.addLog("Autoplay paused.", "system");
    } else {
        startAutoplay();
    }
}

function startAutoplay() {
    const btn = document.getElementById("btn-autoplay");
    isAutoplay = true;
    btn.innerHTML = `<i class="fa-solid fa-pause"></i> Pause`;
    btn.classList.add("active");
    
    runNextStep();
    
    autoplayInterval = setInterval(() => {
        const scenario = SCENARIOS[activeScenario];
        const steps = scenario.steps;
        
        // If choices are open, pause autoplay so user can make a choice!
        const hasChoicesOpen = document.getElementById("prompt-choices").style.display === "flex";
        if (hasChoicesOpen) {
            stopAutoplay();
            engine.addLog("Autoplay paused. Please select an option in the Skill Bot card to proceed.", "system");
            return;
        }
        
        if (scenarioStep >= steps.length) {
            stopAutoplay();
            return;
        }
        
        runNextStep();
    }, 3000); // 3 seconds delay between steps
}

function stopAutoplay() {
    isAutoplay = false;
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
    const btn = document.getElementById("btn-autoplay");
    if (btn) {
        btn.innerHTML = `<i class="fa-solid fa-play"></i> Auto-Play`;
        btn.classList.remove("active");
    }
}

// Run next step execution
function runNextStep() {
    const scenario = SCENARIOS[activeScenario];
    const steps = scenario.steps;
    
    if (scenarioStep < steps.length) {
        const step = steps[scenarioStep];
        
        // Disable action button temporarily while step is executing
        const triggerBtn = document.getElementById("btn-trigger-action");
        triggerBtn.disabled = true;
        
        engine.addLog(`[STEP ${scenarioStep + 1}/${steps.length}] Running: ${step.label}...`, "system");
        
        // Execute step logic
        step.run(engine);
        
        scenarioStep++;
        
        // Re-enable trigger button after short delay unless scenario is finished or blocking
        setTimeout(() => {
            // Check if scenario requires user input choice and is blocking
            const hasChoicesOpen = document.getElementById("prompt-choices").style.display === "flex";
            
            if (!hasChoicesOpen) {
                if (scenarioStep >= steps.length) {
                    triggerBtn.innerHTML = `<i class="fa-solid fa-check"></i> Scenario Finished`;
                    triggerBtn.disabled = true;
                } else {
                    triggerBtn.disabled = false;
                }
            }
        }, 1300);
    }
}

// Discord Choice Buttons logic (Scenario A Step 3 decision)
document.getElementById("prompt-choices").addEventListener("click", (e) => {
    const choiceBtn = e.target.closest(".choice-btn");
    if (!choiceBtn) return;

    const choice = choiceBtn.getAttribute("data-choice");
    
    // Call Scenario A Step 3 run logic using the choice
    const steps = SCENARIOS[activeScenario].steps;
    steps[2].run(engine, choice);
    
    scenarioStep = 3;
    
    // Re-enable and finish button
    const triggerBtn = document.getElementById("btn-trigger-action");
    triggerBtn.innerHTML = `<i class="fa-solid fa-check"></i> Scenario Finished`;
    triggerBtn.disabled = true;
});

// Initial bootstrapper
window.addEventListener("load", () => {
    renderFile("architecture");
    updateConnections();
    
    // Initial logs greeting
    engine.addLog("AOSSIE Skill Ecosystem Simulation dashboard initialized.", "success");
    engine.addLog("Ollama server online. Model: Llama3 (Inference) and nomic-embed-text (Embeddings) loaded locally.", "info");
    engine.addLog("BERTopic semantic model online.", "info");
    engine.addLog("Ready. Select Scenario A, B, or C to trace data pipelines.", "system");
});

// Window resize updates connection paths dynamically
window.addEventListener("resize", () => {
    updateConnections();
});
