function renderTrackPerformance() {
  const main = document.getElementById("main-content");
  main.innerHTML = `
    <div class="track-container">
      <h1>📊 Track Performance</h1>
      <div class="track-tabs">
        <div class="track-tab active" data-period="weekly">Weekly</div>
        <div class="track-tab" data-period="monthly">Monthly</div>
        <div class="track-tab" data-period="yearly">Yearly</div>
      </div>
      <div class="track-charts" id="track-charts"></div>
    </div>
  `;

  loadCharts("weekly");

  // Tab switching
  document.querySelectorAll(".track-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".track-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      loadCharts(tab.dataset.period);
    });
  });
}

// ====== Chart Loader ======
function loadCharts(period) {
  const chartsDiv = document.getElementById("track-charts");
  chartsDiv.innerHTML = "";
    // ====== SUMMARY CARD ======
  const summaryCard = document.createElement("div");
  summaryCard.className = "summary-card";
  
  // Calculate overall average of all parameters
  const overallData = generateDummyData(period, 6); // 6 params
  const overallAvg = overallData.reduce((a, b) => a + b, 0) / overallData.length;

  // Ayurvedic + Other metrics (dummy for now)
  const weight = (60 + Math.floor(Math.random() * 10)) + " kg";
  const dietBalance = overallAvg >= 70 ? "Excellent 🥗" : overallAvg >= 40 ? "Moderate ⚖️" : "Needs Attention 🍔";
  const improvement = overallAvg >= 70 ? "High ✅" : overallAvg >= 40 ? "Medium ⚠️" : "Low ❌";

  summaryCard.innerHTML = `
    <h2>🌿 Overall Health Summary (${capitalize(period)})</h2>
    <div class="summary-metrics">
      <div><strong>Overall Balance:</strong> ${Math.round(overallAvg)}%</div>
      <div><strong>Improvement:</strong> ${improvement}</div>
      <div><strong>Weight:</strong> ${weight}</div>
      <div><strong>Diet Balance:</strong> ${dietBalance}</div>
    </div>
  `;
  chartsDiv.appendChild(summaryCard);

  const parameters = ["Dosha Balance", "Agni", "Ojas", "Shuddhi", "Nadi", "Manas Bala"];

  parameters.forEach(param => {
    const card = document.createElement("div");
    card.className = "chart-card";
    card.innerHTML = `
      <h3>${param} (${capitalize(period)})</h3>
      <canvas id="${param.replace(/\s+/g, '')}-${period}"></canvas>
      <div class="status" id="${param.replace(/\s+/g, '')}-${period}-status"></div>
    `;
    chartsDiv.appendChild(card);

    // Render Chart
    const ctx = card.querySelector("canvas").getContext("2d");
    const dataValues = generateDummyData(period);

    new Chart(ctx, {
      type: "line",
      data: {
        labels: getLabels(period),
        datasets: [{
          label: param,
          data: dataValues,
          borderColor: "#4caf50",
          backgroundColor: "rgba(76,175,80,0.2)",
          fill: true,
          tension: 0.3
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });

    // Add Status
    const avg = dataValues.reduce((a, b) => a + b, 0) / dataValues.length;
    const statusDiv = document.getElementById(`${param.replace(/\s+/g, '')}-${period}-status`);
    let statusText = "";

    if (avg >= 70) {
      statusText = "Balanced ✅";
      statusDiv.className = "status green";
    } else if (avg >= 40) {
      statusText = "Moderate ⚠️";
      statusDiv.className = "status orange";
    } else {
      statusText = "Not Balanced ❌";
      statusDiv.className = "status red";
    }

    statusDiv.textContent = statusText;
  });
}

function getLabels(period) {
  if (period === "weekly") return ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  if (period === "monthly") return Array.from({length: 30}, (_, i) => i+1);
  if (period === "yearly") return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
}

function generateDummyData(period) {
  const length = period === "weekly" ? 7 : period === "monthly" ? 30 : 12;
  return Array.from({length}, () => Math.floor(Math.random() * 100));
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
