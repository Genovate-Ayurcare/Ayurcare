// ================== DATA STORAGE ==================

let dailyGoal = parseInt(localStorage.getItem("dailyGoal")) || 8;
let todayIntake = parseInt(localStorage.getItem("todayIntake")) || 0;
let weeklyData = JSON.parse(localStorage.getItem("weeklyData")) || [0, 0, 0, 0, 0, 0, 0];
let lastDate = localStorage.getItem("lastDate") || new Date().toDateString();
let medicines = JSON.parse(localStorage.getItem("medicines")) || [];

// Request notification permission at start
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}


// ================== SAVE DATA ==================
function saveData() {
  localStorage.setItem("dailyGoal", dailyGoal);
  localStorage.setItem("todayIntake", todayIntake);
  localStorage.setItem("weeklyData", JSON.stringify(weeklyData));
  localStorage.setItem("lastDate", new Date().toDateString());
  localStorage.setItem("medicines", JSON.stringify(medicines));
}

// ================== NOTIFICATIONS ==================
function showNotif(title, message) {
  // Browser notification
  if (Notification.permission === "granted") {
    new Notification(title, {
      body: message,
      icon: "https://i.ibb.co/kM4r1nv/logo.png" // replace with your icon
    });
  }

  // In-page flirty notification
  const notifBox = document.createElement("div");
  notifBox.className = "notification";
  notifBox.innerHTML = `<span>${message}</span><span class="close-notif">&times;</span>`;
  document.body.appendChild(notifBox);

  notifBox.querySelector(".close-notif").addEventListener("click", () => notifBox.remove());
  setTimeout(() => notifBox.remove(), 7000);
}

function scheduleMedicineNotifications() {
  medicines.forEach(med => {
    if (!med.time) return;
    const [hour, minute] = med.time.split(":").map(Number);
    const now = new Date();
    const medTime = new Date();
    medTime.setHours(hour, minute, 0, 0);

    let delay = medTime - now;
    if (delay < 0) delay += 24*60*60*1000;

    setTimeout(function notifyMed() {
      showNotif("💊 Medicine Reminder", `Time to take ${med.name} - ${med.dose}`);
      setInterval(() => showNotif("💊 Medicine Reminder", `Time to take ${med.name} - ${med.dose}`), 24*60*60*1000);
    }, delay);
  });
}

const waterTimes = ["02:59","03:00","03:07","02:59"]; // fixed water reminder times
function scheduleWaterReminders() {
  waterTimes.forEach(time => {
    const [hour, minute] = time.split(":").map(Number);
    const now = new Date();
    const waterTime = new Date();
    waterTime.setHours(hour, minute, 0, 0);

    let delay = waterTime - now;
    if (delay < 0) delay += 24*60*60*1000;

    setTimeout(function remindWater() {
      showNotif("💧 Water Reminder", "Time to drink water! Stay hydrated 💚");
      setInterval(() => showNotif("💧 Water Reminder", "Time to drink water! Stay hydrated 💚"), 24*60*60*1000);
    }, delay);
  });
}

// ================== RENDER WELLNESS ==================
function renderWellness() {
  const main = document.getElementById("main-content");
  main.innerHTML = "";
    // ===== PERSONAL WELLNESS HEADING =====
  const heading = document.createElement("h1");
  heading.textContent = "🌿 Your Wellness Buddy 🌿";
  heading.style.textAlign = "center";
  heading.style.color = "#4caf50";
  heading.style.fontFamily = "'Poppins', sans-serif";
  heading.style.marginBottom = "20px";
  main.appendChild(heading)

  const container = document.createElement("div");
  container.className = "wellness-container";
  container.style.flexDirection = "column";

  // ===== WATER TRACKERS =====
  const waterContainer = document.createElement("div");
  waterContainer.className = "water-container";

  const todayWaterDiv = document.createElement("div");
  todayWaterDiv.className = "water-today";
  todayWaterDiv.innerHTML = `
    <h2>💧 Today's Water Intake</h2>
    <div class="glass-container">
      <div class="glass">
        <div class="water-level" id="water-level"></div>
      </div>
      <div id="water-text">${todayIntake} / ${dailyGoal} glasses</div>
    </div>
    <div class="controls">
      <button id="remove-glass">-</button>
      <button id="add-glass">+</button>
    </div>
    <div class="goal-setter">
      <label for="goal-input">Daily Goal:</label>
      <input type="number" id="goal-input" min="1" value="${dailyGoal}">
    </div>
  `;

  const weeklyWaterDiv = document.createElement("div");
  weeklyWaterDiv.className = "water-weekly";
  weeklyWaterDiv.innerHTML = `
    <h2>📅 Weekly Water Intake</h2>
    <div class="weekly-bars" id="weekly-bars"></div>
  `;

  waterContainer.appendChild(todayWaterDiv);
  waterContainer.appendChild(weeklyWaterDiv);
  container.appendChild(waterContainer);

  // ===== MEDICINE CABINET =====
  const medDiv = document.createElement("div");
  medDiv.className = "medicine-container";
  medDiv.innerHTML = `
    <h2>💊 Your Medicine Cabinet</h2>
    <div class="medicine-content">
      <div class="med-left">
        <div class="med-empty">
          <img src="/static/medicine.png" alt="No medicine" class="med-empty-img">
          <p class="med-empty-text">Add a medicine to track</p>
        </div>
        <ul class="med-list"></ul>
        <img src="plus_icon.png" alt="Add Medicine" class="add-med-btn always-visible-plus">
      </div>
      <div class="med-right">
        <h3>Due Medicines</h3>
        <ul class="med-due-list">
          <li>No medicine due</li>
        </ul>
      </div>
    </div>
  `;
  container.appendChild(medDiv);

  main.appendChild(container);

  // ===== EVENT LISTENERS =====
  document.getElementById("add-glass").addEventListener("click", () => updateTodayIntake(1));
  document.getElementById("remove-glass").addEventListener("click", () => updateTodayIntake(-1));
  document.getElementById("goal-input").addEventListener("change", (e) => {
    dailyGoal = parseInt(e.target.value) || 1;
    saveData();
    updateUI();
  });

  const addMedBtn = medDiv.querySelector(".add-med-btn");
  addMedBtn.addEventListener("click", () => openMedicinePopup());

  checkMidnightReset();
  updateUI();
  renderMedicines();
  updateDueMedicines();

  // Schedule notifications after rendering
  scheduleMedicineNotifications();
  scheduleWaterReminders();
}

// ================== WATER TRACKER FUNCTIONS ==================
function updateTodayIntake(change) {
  todayIntake = Math.max(0, todayIntake + change);
  weeklyData[getTodayIndex()] = todayIntake;
  saveData();
  updateUI();
}

function updateUI() {
  const waterLevel = document.getElementById("water-level");
  if (waterLevel) {
    const percentage = (todayIntake / dailyGoal) * 100;
    waterLevel.style.height = Math.min(100, percentage) + "%";
  }

  const waterText = document.getElementById("water-text");
  if (waterText) waterText.textContent = `${todayIntake} / ${dailyGoal} glasses`;

  const weeklyBars = document.getElementById("weekly-bars");
  if (weeklyBars) {
    weeklyBars.innerHTML = "";
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const todayIdx = new Date().getDay();
    const orderedDays = [];
    const orderedData = [];

    for (let i = 6; i >= 0; i--) {
      const idx = (todayIdx - i + 7) % 7;
      orderedDays.push(days[idx]);
      orderedData.push(weeklyData[idx]);
    }

    orderedData.forEach((val, i) => {
      const barContainer = document.createElement("div");
      barContainer.className = "day-bar";

      const barFill = document.createElement("div");
      barFill.className = "bar-fill";
      barFill.style.height = dailyGoal > 0 ? (val / dailyGoal * 100) + "%" : "0%";

      const barValue = document.createElement("div");
      barValue.className = "bar-value";
      barValue.textContent = `${val}/${dailyGoal}`;

      const label = document.createElement("span");
      label.textContent = (i === orderedDays.length - 1) ? "Today" : orderedDays[i];
      if (i === orderedDays.length - 1) label.classList.add("today-label");

      barContainer.appendChild(barValue);
      barContainer.appendChild(barFill);
      barContainer.appendChild(label);

      weeklyBars.appendChild(barContainer);
    });
  }
}

// ================== MEDICINE FUNCTIONS ==================
function renderMedicines() {
  const medContainer = document.querySelector(".medicine-container");
  const medList = medContainer.querySelector(".med-list");
  const medEmpty = medContainer.querySelector(".med-empty");
  medList.innerHTML = "";

  if (medicines.length === 0) {
    medEmpty.style.display = "flex";
    medList.style.display = "none";
  } else {
    medEmpty.style.display = "none";
    medList.style.display = "block";
  }

  medicines.forEach((med, index) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.innerHTML = `
      <span>${med.name} - ${med.type} - ${med.dose} - ${med.time}</span>
      <img src="delete_icon.png" alt="Delete" class="delete-med-btn" style="cursor:pointer; width:20px; height:20px;">
    `;
    medList.appendChild(li);

    const deleteBtn = li.querySelector(".delete-med-btn");
    deleteBtn.addEventListener("click", () => {
      medicines.splice(index, 1);
      saveData();
      renderMedicines();
      updateDueMedicines();
    });
  });
}

// ================== MEDICINE POPUP ==================
function openMedicinePopup() {
  const formDiv = document.createElement("div");
  formDiv.className = "medicine-popup";
  formDiv.innerHTML = `
    <div class="popup-content">
      <h3>Add Medicine</h3>
      <label>Name:</label><input type="text" id="med-name" placeholder="Medicine Name">
      <label>Type:</label><input type="text" id="med-type" placeholder="Medicine Type">
      <label>Dose:</label><input type="text" id="med-dose" placeholder="Dosage">
      <label>Remind at:</label><input type="time" id="med-time">
      <div class="popup-buttons">
        <button id="cancel-med">Cancel</button>
        <button id="save-med">Add</button>
      </div>
    </div>
  `;
  document.body.appendChild(formDiv);

  document.getElementById("cancel-med").addEventListener("click", () => formDiv.remove());
  document.getElementById("save-med").addEventListener("click", () => {
    const med = {
      name: document.getElementById("med-name").value.trim(),
      type: document.getElementById("med-type").value.trim(),
      dose: document.getElementById("med-dose").value.trim(),
      time: document.getElementById("med-time").value
    };
    if (med.name) {
      medicines.push(med);
      saveData();
      renderMedicines();
      updateDueMedicines();
      scheduleMedicineNotifications();
      formDiv.remove();
    } else {
      alert("Please enter the medicine name.");
    }
  });
}

// ================== DUE MEDICINES ==================
function updateDueMedicines() {
  const medContainer = document.querySelector(".medicine-container");
  const medDueList = medContainer.querySelector(".med-due-list");

  medDueList.innerHTML = "";
  const now = new Date();
  let anyDue = false;

  medicines.forEach((med, index) => {
    if (!med.time) return;

    const [hour, minute] = med.time.split(":").map(Number);
    const medTime = new Date();
    medTime.setHours(hour, minute, 0, 0);

    if (now >= medTime) {
      anyDue = true;

      const li = document.createElement("li");
      li.style.display = "flex";
      li.style.justifyContent = "space-between";
      li.style.alignItems = "center";
      li.innerHTML = `
        <span>${med.name} - ${med.dose} - ${med.time}</span>
        <img src="track_icon.png" alt="Done" class="track-med-btn" style="cursor:pointer; width:20px; height:20px;">
      `;
      medDueList.appendChild(li);

      const trackBtn = li.querySelector(".track-med-btn");
      trackBtn.addEventListener("click", () => {
        li.remove();
        if (medDueList.children.length === 0) {
          medDueList.innerHTML = "<li>No medicine due</li>";
        }
      });
    }
  });

  if (!anyDue) {
    medDueList.innerHTML = "<li>No medicine due</li>";
  }
}

// Update due medicines every minute
setInterval(updateDueMedicines, 60000);

// ================== UTILS ==================
function getTodayIndex() { return new Date().getDay(); }

function checkMidnightReset() {
  const todayDate = new Date().toDateString();
  if (lastDate !== todayDate) {
    todayIntake = 0;
    weeklyData[getTodayIndex()] = 0;
    lastDate = todayDate;
    saveData();
  }
}
 // ================== GLOBAL NOTIFICATIONS ==================
document.addEventListener("DOMContentLoaded", () => {
  scheduleMedicineNotifications();
  scheduleWaterReminders();
});


// ================== SECTION SWITCH ==================
function showContent(section) {
  const main = document.getElementById("main-content");
  if (section === "wellness") { 
    renderWellness(); 
    return; 
  }
  switch(section) {
    case "meal": renderMealPlanner(); break;
    case "track": renderTrackPerformance(); break;
    case "prescriptions": main.innerHTML = "<h1>Doctor's Prescriptions 💊</h1><p>Prescribed Ayurvedic medicines.</p>"; break;
    case "notes": main.innerHTML = "<h1>Doctor's Notes 📝</h1><p>Advice & lifestyle tips from your doctor.</p>"; break;
    case "reports": main.innerHTML = "<h1>Reports 📄</h1><p>Your health reports and lab results.</p>"; break;
    default: main.innerHTML = "<h1>Welcome to Your Ayurvedic Dashboard 🌿</h1><p>Select a section from the left to view features.</p>";
  }
}
