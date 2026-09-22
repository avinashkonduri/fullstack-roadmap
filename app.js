(() => {
  const state = {
    progress: JSON.parse(localStorage.getItem("fullstack-roadmap-progress") || "{}"),
    currentTech: null
  };

  const $ = (id) => document.getElementById(id);

  function saveProgress() {
    localStorage.setItem("fullstack-roadmap-progress", JSON.stringify(state.progress));
    updateProgress();
  }

  function allLeafTopics() {
    const list = [];
    Object.values(roadmapData.technologies).forEach(t =>
      t.groups.forEach(g => g.topics.forEach(topic => list.push(topic.id)))
    );
    return list;
  }

  function updateProgress() {
    const total = allLeafTopics().length;
    const done = allLeafTopics().filter(id => state.progress[id]).length;
    const pct = total ? Math.round(done / total * 100) : 0;
    $("progressText").textContent = `${pct}%`;
    $("progressBar").style.width = `${pct}%`;
    document.querySelectorAll("[data-topic-id]").forEach(el => {
      el.classList.toggle("done", !!state.progress[el.dataset.topicId]);
    });
    document.querySelectorAll("[data-tech-id]").forEach(el => {
      const tech = roadmapData.technologies[el.dataset.techId];
      const ids = tech.groups.flatMap(g => g.topics.map(t => t.id));
      el.classList.toggle("completed", ids.length > 0 && ids.every(id => state.progress[id]));
    });
  }

  function nodeMarkup(node, cls = "tree-node") {
    return `<button class="${cls}" data-tech-id="${node.id}">
      <div class="node-title">${node.icon || ""} ${node.title}</div>
      <div class="node-sub">${node.short || ""}</div>
    </button>`;
  }

  function renderMainTree() {
    const techs = roadmapData.technologies;
    const frontend = ["html5","css3","bootstrap","javascript","typescript","angular"];
    const backend = ["java","springboot","rest","security"];
    const data = ["postgresql","testing","git","docker","cicd"];

    const branch = (title, subtitle, ids) => `
      <div class="branch-column">
        <div class="branch-card">
          <h3>${title}</h3><p>${subtitle}</p>
          <div class="branch-nodes">
            ${ids.map(id => nodeMarkup(techs[id])).join("")}
          </div>
        </div>
      </div>`;

    $("mainTree").innerHTML = `
      <div class="tree-root">
        <div class="node-title">🚀 FULL-STACK DEVELOPMENT</div>
        <div class="node-sub">From fundamentals → enterprise application → deployment</div>
      </div>
      <div class="root-line"></div>
      <div class="major-branches">
        ${branch("🎨 Frontend", "User interface & browser applications", frontend)}
        ${branch("⚙️ Backend", "Business logic & APIs", backend)}
        ${branch("🗄️ Data & Delivery", "Database, quality & deployment", data)}
      </div>
      <div class="quality-row">
        <button class="quality-node" data-tech-id="integration">🔗 Full-Stack Integration</button>
        <button class="quality-node" data-tech-id="capstone">🏆 Capstone Project</button>
      </div>
      <div class="capstone">
        <div class="capstone-card">🎯 Production-Ready Full-Stack Developer</div>
      </div>
    `;

    document.querySelectorAll("[data-tech-id]").forEach(el => {
      el.addEventListener("click", () => openTechnology(el.dataset.techId));
    });
    updateProgress();
  }

  function openTechnology(id) {
    const tech = roadmapData.technologies[id];
    if (!tech) return;
    state.currentTech = id;
    $("roadmapView").classList.remove("active");
    $("detailView").classList.add("active");
    $("detailTitle").textContent = `${tech.icon || ""} ${tech.title}`;
    $("detailSummary").textContent = tech.summary;
    $("breadcrumb").textContent = `Full-Stack Development  ›  ${tech.area}  ›  ${tech.title}`;
    renderDetailTree(tech);
    window.scrollTo({top:0, behavior:"smooth"});
  }

  function renderDetailTree(tech) {
    $("detailTree").innerHTML = `
      <div class="mini-root">${nodeMarkup(tech, "tree-node")}</div>
      <div class="mini-line"></div>
      <div class="topic-groups">
        ${tech.groups.map(group => `
          <section class="topic-group">
            <h4>${group.title}</h4>
            <div class="leaf-grid">
              ${group.topics.map(topic => `
                <button class="leaf ${state.progress[topic.id] ? "done" : ""}" data-topic-id="${topic.id}">
                  ${state.progress[topic.id] ? "✓ " : ""}${topic.title}
                </button>`).join("")}
            </div>
          </section>`).join("")}
      </div>
    `;

    $("detailTree").querySelectorAll(".leaf").forEach(el =>
      el.addEventListener("click", () => showTopic(tech, el.dataset.topicId))
    );
    $("detailTree").querySelector(".mini-root .tree-node").addEventListener("click", () => showTechnologyOverview(tech));
    showTechnologyOverview(tech);
  }

  function showTechnologyOverview(tech) {
    $("topicPanel").innerHTML = `
      <div class="topic-header">
        <h3>${tech.icon || ""} ${tech.title}</h3>
        <p>${tech.summary}</p>
        <span class="level-badge">${tech.level}</span>
      </div>
      <div class="topic-section">
        <h4>📚 What you will learn</h4>
        <ul>${tech.learn.map(x => `<li>${x}</li>`).join("")}</ul>
      </div>
      <div class="topic-section">
        <h4>💼 Real-world use</h4>
        <p>${tech.realWorld}</p>
      </div>
      <div class="topic-section">
        <h4>🧭 Learning sequence</h4>
        <p>${tech.sequence}</p>
      </div>
    `;
  }

  function showTopic(tech, topicId) {
    const topic = tech.groups.flatMap(g => g.topics).find(t => t.id === topicId);
    if (!topic) return;

    $("topicPanel").innerHTML = `
      <div class="topic-header">
        <h3>${topic.title}</h3>
        <p>${topic.description}</p>
        <span class="level-badge">${topic.level}</span>
      </div>
      <div class="topic-section">
        <h4>🎯 What you will learn</h4>
        <ul>${topic.learn.map(x => `<li>${x}</li>`).join("")}</ul>
      </div>
      <div class="topic-section">
        <h4>💻 Practical example</h4>
        <pre class="code">${escapeHtml(topic.example)}</pre>
      </div>
      <div class="topic-section">
        <h4>🌍 Real-world use case</h4>
        <p>${topic.realWorld}</p>
      </div>
      <div class="topic-section">
        <h4>📝 Practice exercise</h4>
        <p>${topic.practice}</p>
      </div>
      <div class="topic-section">
        <h4>🎤 Interview questions</h4>
        <ul>${topic.interview.map(x => `<li>${x}</li>`).join("")}</ul>
      </div>
      <div class="topic-section">
        <div class="complete-row">
          <label for="completeTopic">Mark this topic as completed</label>
          <input id="completeTopic" type="checkbox" ${state.progress[topic.id] ? "checked" : ""}>
        </div>
      </div>
    `;

    $("completeTopic").addEventListener("change", e => {
      state.progress[topic.id] = e.target.checked;
      saveProgress();
      const leaf = document.querySelector(`[data-topic-id="${topic.id}"]`);
      if (leaf) {
        leaf.classList.toggle("done", e.target.checked);
        leaf.textContent = `${e.target.checked ? "✓ " : ""}${topic.title}`;
      }
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[c]));
  }

  function search() {
    const q = $("searchInput").value.trim().toLowerCase();
    const box = $("searchResults");
    if (!q) { box.classList.add("hidden"); box.innerHTML=""; return; }

    const results = [];
    Object.values(roadmapData.technologies).forEach(tech => {
      if (`${tech.title} ${tech.summary}`.toLowerCase().includes(q)) {
        results.push({type:"technology", title:tech.title, area:tech.area, id:tech.id});
      }
      tech.groups.forEach(group => group.topics.forEach(topic => {
        if (`${topic.title} ${topic.description} ${topic.learn.join(" ")}`.toLowerCase().includes(q)) {
          results.push({type:"topic", title:topic.title, area:tech.title, id:tech.id, topicId:topic.id});
        }
      }));
    });

    box.classList.remove("hidden");
    box.innerHTML = results.length ? results.slice(0,20).map(r => `
      <div class="result" data-result-tech="${r.id}" data-result-topic="${r.topicId || ""}">
        <strong>${r.title}</strong><small>${r.type === "topic" ? r.area : "Technology"}</small>
      </div>`).join("") :
      `<div class="result"><span>No matching topic found.</span></div>`;

    box.querySelectorAll("[data-result-tech]").forEach(el => {
      el.addEventListener("click", () => {
        openTechnology(el.dataset.resultTech);
        if (el.dataset.resultTopic) {
          setTimeout(() => showTopic(
            roadmapData.technologies[el.dataset.resultTech],
            el.dataset.resultTopic
          ), 50);
        }
      });
    });
  }

  $("backButton").addEventListener("click", () => {
    $("detailView").classList.remove("active");
    $("roadmapView").classList.add("active");
    window.scrollTo({top:0, behavior:"smooth"});
    updateProgress();
  });

  $("searchInput").addEventListener("input", search);
  $("clearSearch").addEventListener("click", () => {
    $("searchInput").value = "";
    search();
  });

  $("themeToggle").addEventListener("click", () => {
    const dark = document.documentElement.dataset.theme === "dark";
    document.documentElement.dataset.theme = dark ? "" : "dark";
    localStorage.setItem("roadmap-theme", dark ? "light" : "dark");
    $("themeToggle").textContent = dark ? "☾" : "☀";
  });

  if (localStorage.getItem("roadmap-theme") === "dark") {
    document.documentElement.dataset.theme = "dark";
    $("themeToggle").textContent = "☀";
  }

  renderMainTree();
})();
