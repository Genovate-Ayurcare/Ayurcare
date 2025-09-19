/* -------------------------------
   📌 Navigation: Tabs Switching
--------------------------------- */
const navItems = document.querySelectorAll(".nav-item");
const sections = document.querySelectorAll(".content-section");

navItems.forEach(item => {
    item.addEventListener("click", () => {
        // Remove active classes
        navItems.forEach(nav => nav.classList.remove("active"));
        sections.forEach(sec => sec.classList.remove("active"));

        // Add active class to clicked item
        item.classList.add("active");
        const target = document.getElementById(item.dataset.target);
        target.classList.add("active");
    });
});

/* -------------------------------
   🔍 Patient Search & Sort
--------------------------------- */
const searchBar = document.getElementById("searchBar");
const sortOptions = document.getElementById("sortOptions");
const patientsContainer = document.getElementById("patientsContainer");

function getPatients() {
    return Array.from(patientsContainer.getElementsByClassName("patient"));
}

// Search
if (searchBar) {
    searchBar.addEventListener("input", () => {
        const query = searchBar.value.toLowerCase();
        getPatients().forEach(patient => {
            const name = (patient.dataset.name || patient.querySelector("h3")?.textContent || "").toLowerCase();
            patient.style.display = name.includes(query) ? "flex" : "none";
        });
    });
}

// Sorting
if (sortOptions) {
    sortOptions.addEventListener("change", () => {
        let sortedPatients = getPatients();

        switch (sortOptions.value) {
            case "name-asc":
                sortedPatients.sort((a, b) => (a.dataset.name || a.querySelector("h3")?.textContent || "").localeCompare(b.dataset.name || b.querySelector("h3")?.textContent || ""));
                break;
            case "name-desc":
                sortedPatients.sort((a, b) => (b.dataset.name || b.querySelector("h3")?.textContent || "").localeCompare(a.dataset.name || a.querySelector("h3")?.textContent || ""));
                break;
            case "date-asc":
                sortedPatients.sort((a, b) => new Date(a.dataset.date) - new Date(b.dataset.date));
                break;
            case "date-desc":
                sortedPatients.sort((a, b) => new Date(b.dataset.date) - new Date(a.dataset.date));
                break;
        }

        // Re-render sorted patients
        patientsContainer.innerHTML = "";
        sortedPatients.forEach(p => patientsContainer.appendChild(p));
    });
}

// Patient count on load
document.addEventListener("DOMContentLoaded", () => {
    const patientCount = document.querySelectorAll(".patients-container .patient").length;
    const pill = document.getElementById("patientsCount");
    if (pill) pill.textContent = `${patientCount} Active`;
});

/* -------------------------------
   📅 Appointment Status Checker
--------------------------------- */
function checkAppointments() {
    const now = new Date();

    document.querySelectorAll(".appointment").forEach(appointment => {
        const timeStr = appointment.getAttribute("data-time"); // e.g. 2025-09-05T21:45
        if (!timeStr) return;
        const appointmentTime = new Date(timeStr);
        const checkbox = appointment.querySelector(".appointmentCheck");

        if (now > appointmentTime && checkbox) {
            const statusDiv = document.createElement("div");
            statusDiv.style.display = "flex";
            statusDiv.style.alignItems = "center";
            statusDiv.style.gap = "10px";

            const statusSpan = document.createElement("span");
            statusSpan.style.padding = "5px 10px";
            statusSpan.style.borderRadius = "6px";
            statusSpan.style.fontSize = "13px";
            statusSpan.style.fontWeight = "bold";

            if (checkbox.checked) {
                statusSpan.innerText = "Completed";
                statusSpan.style.background = "#C8E6C9";
                statusSpan.style.color = "#2E7D32";
            } else {
                statusSpan.innerText = "Missed";
                statusSpan.style.background = "#FFCDD2";
                statusSpan.style.color = "#C62828";

                // Reschedule button
                const rescheduleBtn = document.createElement("button");
                rescheduleBtn.innerText = "Reschedule";
                Object.assign(rescheduleBtn.style, {
                    padding: "5px 10px",
                    border: "2px solid green",
                    borderRadius: "6px",
                    background: "white",
                    color: "black",
                    cursor: "pointer",
                    fontSize: "14px"
                });

                rescheduleBtn.addEventListener("click", () => {
                    const newDateStr = prompt("Enter new appointment time (YYYY-MM-DD HH:MM):");
                    if (newDateStr) {
                        const newDate = new Date(newDateStr.replace(" ", "T"));
                        if (!isNaN(newDate)) {
                            appointment.setAttribute("data-time", newDate.toISOString());
                            appointment.querySelector("p").innerText =
                                `Rescheduled to: ${newDate.toLocaleString()}`;
                            const newCheckbox = document.createElement("input");
                            newCheckbox.type = "checkbox";
                            newCheckbox.className = "appointmentCheck";
                            statusDiv.replaceWith(newCheckbox);
                        } else {
                            alert("Invalid date format! Use YYYY-MM-DD HH:MM");
                        }
                    }
                });

                statusDiv.appendChild(rescheduleBtn);
            }

            statusDiv.insertBefore(statusSpan, statusDiv.firstChild);
            checkbox.replaceWith(statusDiv);
        }
    });
}

// Run every minute + on page load
setInterval(checkAppointments, 60 * 1000);
checkAppointments();

/* -------------------------------
   ➕ Add Patient Modal (handled inline in HTML now)
--------------------------------- */
// The add-patient modal open/close and submit logic is implemented inline in DoctorDashboard.html
// to support the success popup, patient details, and AI meal planner flows. This file intentionally
// does not attach duplicate handlers to avoid conflicts.


// Minimal, non-intrusive JS to ensure smooth UX for adding a patient and showing success popup
(function () {
    // Mobile menu toggle
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    const sidebarBackdrop = document.getElementById('sidebarBackdrop');
    function openMenu() { if (sidebar) { sidebar.classList.add('open'); document.body.classList.add('menu-open'); if (sidebarBackdrop) sidebarBackdrop.classList.add('show'); } }
    function closeMenu() { if (sidebar) { sidebar.classList.remove('open'); document.body.classList.remove('menu-open'); if (sidebarBackdrop) sidebarBackdrop.classList.remove('show'); } }
    if (mobileBtn) mobileBtn.addEventListener('click', function () { if (sidebar?.classList.contains('open')) closeMenu(); else openMenu(); });
    if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeMenu);
    document.querySelectorAll('.sidebar .nav-item').forEach(function (btn) { btn.addEventListener('click', closeMenu); });

    const addBtn = document.querySelector('.addPatient');
    const modal = document.getElementById('addPatientModal');
    const modalContent = modal ? modal.querySelector('.modal-content') : null;
    const closeBtn = modal ? modal.querySelector('.close-btn') : null;
    const form = document.getElementById('addPatientForm');
    const patientsContainer = document.getElementById('patientsContainer');
    const patientsCount = document.getElementById('patientsCount');
    const successPopup = document.getElementById('successPopup');
    const closeSuccess = document.getElementById('closeSuccessPopup');
    const dismissSuccess = document.getElementById('dismissSuccess');
    const planMealCta = document.getElementById('planMealCta');

    // Meal planner elements
    const planner = document.getElementById('mealPlanner');
    const plannerClose = document.getElementById('closePlanner');
    const plannerDone = document.getElementById('closeAndDone');
    const plannerSave = document.getElementById('savePlan');
    const aiBtn = document.getElementById('generateAi');
    const lists = {
        breakfast: document.getElementById('breakfastList'),
        lunch: document.getElementById('lunchList'),
        dinner: document.getElementById('dinnerList')
    };

    function setPatientsCount() {
        if (!patientsCount || !patientsContainer) return;
        const count = patientsContainer.querySelectorAll('.patient').length;
        patientsCount.textContent = count + ' Active';
    }

    // Generate unique patient code
    function generatePatientCode() {
        const doctorCode = "DOC123"; // Replace with actual doctor ID
        const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const randomPart = Math.floor(1000 + Math.random() * 9000);
        return `${doctorCode}-${datePart}-${randomPart}`;
    }

    function openModal() {
        if (!modal) return;
        modal.classList.add('show');
        modal.style.display = 'flex';
        document.getElementById("patientCode").value = generatePatientCode();
        const nameInput = document.getElementById('patientName');
        if (nameInput) nameInput.focus();
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('show');
        modal.style.display = 'none';
    }

    function openSuccess() {
        if (!successPopup) return;
        successPopup.classList.add('show');
    }

    function closeSuccessPopup() {
        if (!successPopup) return;
        successPopup.classList.remove('show');
    }

    function createPatientCard(name) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const isoDate = yyyy + '-' + mm + '-' + dd;

        const card = document.createElement('div');
        card.className = 'patient';
        card.setAttribute('data-name', name);
        card.setAttribute('data-date', isoDate);
        card.innerHTML = `
                    <img src="{{ url_for('static', filename='usericon.png') }}" alt="Patient Avatar" class="patient-avatar" />
                    <h3>${name}</h3>
                    <p>Enrolled: ${today.toLocaleString(undefined, { month: 'short' })} ${dd}, ${yyyy}</p>
                    <button class="view-btn">View Details →</button>
                `;
        return card;
    }

    // Wire up events safely even if external JS also binds
    if (addBtn) {
        addBtn.addEventListener('click', function (e) {
            e.preventDefault();
            openModal();
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function (e) {
            if (e.target === modal && !modalContent?.contains(e.target)) closeModal();
        });
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = (document.getElementById('patientName') || {}).value || 'New Patient';
            const patientRecord = {
                code: (document.getElementById('patientCode') || {}).value || String(Date.now()),
                name: name,
                age: (document.getElementById('age') || {}).value || '',
                gender: (document.getElementById('gender') || {}).value || '',
                prakriti: (document.getElementById('prakriti') || {}).value || '',
                vikriti: (document.getElementById('vikriti') || {}).value || '',
                agni: (document.querySelector('input[name="symptom"]:checked') || {}).parentElement?.textContent?.trim() || '',
                allergies: (document.getElementById('Allergies') || {}).value || '',
                condition: (document.getElementById('condition') || {}).value || '',
                prescription: (document.getElementById('prescription') || {}).value || '',
                description: '',
                avatar: ''
            };
            // In a full app, you'd send to backend here
            if (patientsContainer) {
                const card = createPatientCard(name);
                card.setAttribute('data-code', patientRecord.code);
                patientsContainer.prepend(card);
            }
            // store minimal record in element dataset map for demo
            if (!window.__patients) window.__patients = new Map();
            window.__patients.set(patientRecord.code, patientRecord);
            setPatientsCount();
            form.reset();
            closeModal();
            openSuccess();
        });
    }

    if (closeSuccess) closeSuccess.addEventListener('click', closeSuccessPopup);
    if (dismissSuccess) dismissSuccess.addEventListener('click', closeSuccessPopup);
    if (successPopup) successPopup.addEventListener('click', function (e) {
        if (e.target === successPopup) closeSuccessPopup();
    });
    if (planMealCta) {
        planMealCta.addEventListener('click', function () {
            closeSuccessPopup();
            // Navigate to Patient List (meals) and optionally focus a planner trigger if exists
            const targetId = 'meals';
            const navBtn = document.querySelector(`.nav-item[data-target="${targetId}"]`);
            if (navBtn) navBtn.click();
            openPlanner();
        });
    }

    // Initialize count on load
    setPatientsCount();

    // -------- Meal Planner Logic --------
    function openPlanner() {
        if (!planner) return;
        planner.classList.add('show');
    }
    function closePlanner() {
        if (!planner) return;
        planner.classList.remove('show');
    }
    if (planner) {
        planner.addEventListener('click', function (e) {
            if (e.target === planner) closePlanner();
        });
    }
    if (plannerClose) plannerClose.addEventListener('click', closePlanner);
    if (plannerDone) plannerDone.addEventListener('click', closePlanner);

    // Toggle add rows
    document.querySelectorAll('.add-row-toggle').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const target = btn.getAttribute('data-target');
            const adder = document.getElementById('adder-' + target);
            if (adder) adder.style.display = adder.style.display === 'none' ? 'flex' : 'none';
        });
    });
    // Handle manual add
    document.querySelectorAll('.adder button[data-add]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const meal = btn.getAttribute('data-add');
            const container = document.getElementById('adder-' + meal);
            const input = container ? container.querySelector('input') : null;
            if (!input || !input.value.trim()) return;
            appendMealItem(meal, input.value.trim(), true);
            input.value = '';
        });
    });

    function appendMealItem(meal, text, animate) {
        const ul = lists[meal];
        if (!ul) return;
        const li = document.createElement('li');
        li.className = 'meal-item';
        li.textContent = text;
        const remove = document.createElement('button');
        remove.className = 'remove-item';
        remove.setAttribute('aria-label', 'Remove');
        remove.textContent = '×';
        remove.addEventListener('click', function () { li.remove(); });
        li.appendChild(remove);
        ul.appendChild(li);
        if (animate) requestAnimationFrame(function () { li.classList.add('show'); });
    }

    // Simple AI suggestions
    const AI_SUGGESTIONS = {
        breakfast: [
            'Oats with chia and berries',
            'Vegetable poha (low oil)',
            'Moong dal chilla + mint chutney',
            'Greek yogurt with nuts'
        ],
        lunch: [
            'Quinoa khichdi + cucumber raita',
            'Grilled paneer salad bowl',
            'Dal + 1 chapati + mixed veg',
            'Brown rice + rajma + salad'
        ],
        dinner: [
            'Millet upma + sautéed veggies',
            'Tomato soup + multigrain toast',
            'Stir-fry tofu + greens',
            'Lentil soup + salad'
        ]
    };

    function clearLists() {
        Object.values(lists).forEach(function (ul) { ul.innerHTML = ''; });
    }

    function generateWithAI() {
        clearLists();
        const order = ['breakfast', 'lunch', 'dinner'];
        let delay = 0;
        order.forEach(function (meal, idx) {
            const picks = shuffle(AI_SUGGESTIONS[meal]).slice(0, 4);
            picks.forEach(function (item, i) {
                setTimeout(function () { appendMealItem(meal, item, true); }, delay + i * 160);
            });
            delay += 420; // stagger columns so it feels like columns are filling
        });
    }
    function shuffle(arr) {
        return arr.slice().sort(function () { return Math.random() - 0.5; });
    }
    if (aiBtn) aiBtn.addEventListener('click', generateWithAI);

    // -------- Patient Details Logic --------
    const detailsOverlay = document.getElementById('patientDetails');
    const detailsClose = document.getElementById('closeDetails');
    const detailsName = document.getElementById('detailsPatientName');
    const detailsLists = {
        breakfast: document.getElementById('detailsBreakfast'),
        lunch: document.getElementById('detailsLunch'),
        dinner: document.getElementById('detailsDinner')
    };
    const tabs = Array.from(document.querySelectorAll('.tab-btn'));

    // In-memory plan store keyed by patient name (simple demo storage)
    const patientPlans = new Map();
    let currentPatientKey = null;

    function openDetailsForPatient(patientEl) {
        const name = patientEl?.querySelector('h3')?.textContent?.trim() || 'Patient';
        const code = patientEl?.getAttribute('data-code') || name; // fallback to name if not present (seed patients)
        currentPatientKey = code;
        const record = (window.__patients && window.__patients.get(code)) || { name };
        if (detailsName) detailsName.textContent = record.name || name;
        if (detailsLists) {
            // Render info fields
            const setText = function (id, val) { const el = document.getElementById(id); if (el) el.textContent = val || '—'; };
            setText('detailsPatientName', record.name || name);
            setText('detailsName', record.name || name);
            setText('detailsAge', record.age || String(20 + Math.floor(Math.random() * 40)));
            setText('detailsGender', record.gender || ['Male', 'Female', 'Other'][Math.floor(Math.random() * 3)]);
            setText('detailsCode', record.code || code);
            setText('detailsPrakriti', record.prakriti || ['vata', 'pitta', 'kapha'][Math.floor(Math.random() * 3)]);
            setText('detailsVikriti', record.vikriti || ['vata', 'pitta', 'kapha'][Math.floor(Math.random() * 3)]);
            setText('detailsAgni', record.agni || ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]);
            setText('detailsAllergies', record.allergies || 'No known allergies');
            setText('detailsCondition', record.condition || 'General wellness');
            setText('detailsPrescription', record.prescription || 'Maintain balanced diet and hydration.');
            setText('detailsDescription', record.description || 'Active lifestyle, moderate stress; aims to improve energy levels.');
            const avatar = document.getElementById('detailsAvatar');
            if (avatar) avatar.src = record.avatar || "usericon.png";
        }
        // load any existing plan by code
        renderDetailsPlan(patientPlans.get(code));
        // stub performance
        renderPerformanceFor(record);
        if (detailsOverlay) detailsOverlay.classList.add('show');
    }

    function renderPerformanceFor(record) {
        const adherence = document.getElementById('perfAdherence');
        const hydration = document.getElementById('perfHydration');
        const sleep = document.getElementById('perfSleep');
        const suggestions = document.getElementById('perfSuggestions');
        if (adherence) adherence.textContent = Math.floor(70 + Math.random() * 25) + '%';
        if (hydration) hydration.textContent = Math.floor(6 + Math.random() * 3) + ' glasses/day';
        if (sleep) sleep.textContent = (6 + Math.random() * 2).toFixed(1) + ' hrs';
        if (suggestions) {
            suggestions.innerHTML = '';
            ['Add one fruit serving at lunch', 'Increase hydration post-lunch', 'Consider earlier dinner for better sleep'].forEach(function (s) {
                const li = document.createElement('li'); li.textContent = s; suggestions.appendChild(li);
            });
        }
    }
    function closeDetails() {
        if (detailsOverlay) detailsOverlay.classList.remove('show');
    }
    if (detailsClose) detailsClose.addEventListener('click', closeDetails);
    if (detailsOverlay) detailsOverlay.addEventListener('click', function (e) { if (e.target === detailsOverlay) closeDetails(); });

    // Tab switching
    tabs.forEach(function (btn) {
        btn.addEventListener('click', function () {
            tabs.forEach(function (b) { b.classList.remove('active'); });
            document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
            btn.classList.add('active');
            const id = btn.getAttribute('data-tab');
            const panel = document.getElementById(id);
            if (panel) panel.classList.add('active');
        });
    });

    // Wire View Details buttons
    document.querySelectorAll('#patientsContainer .patient .view-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            const card = btn.closest('.patient');
            openDetailsForPatient(card);
        });
    });

    // Auto-open planner when switching to Analyse Diet Plan tab
    const dietTabBtn = tabs.find(function (b) { return b.getAttribute('data-tab') === 'dietTab'; });
    if (dietTabBtn) {
        dietTabBtn.addEventListener('click', function () { openPlanner(); });
    }

    // Save plan actions should persist into patientPlans and reflect in details tab
    function collectPlannerPlan() {
        return {
            breakfast: Array.from(lists.breakfast?.children || []).map(function (li) { return li.textContent; }),
            lunch: Array.from(lists.lunch?.children || []).map(function (li) { return li.textContent; }),
            dinner: Array.from(lists.dinner?.children || []).map(function (li) { return li.textContent; })
        };
    }
    function renderDetailsPlan(plan) {
        ['breakfast', 'lunch', 'dinner'].forEach(function (meal) {
            const ul = detailsLists[meal];
            if (!ul) return;
            ul.innerHTML = '';
            const items = plan?.[meal] || [];
            items.forEach(function (text) {
                const li = document.createElement('li');
                li.className = 'meal-item show';
                li.textContent = text;
                ul.appendChild(li);
            });
        });
    }

    if (plannerSave) plannerSave.addEventListener('click', function () {
        if (!currentPatientKey) return;
        const plan = collectPlannerPlan();
        patientPlans.set(currentPatientKey, plan);
        renderDetailsPlan(plan);
    });
    if (plannerDone) plannerDone.addEventListener('click', function () {
        if (currentPatientKey) {
            const plan = collectPlannerPlan();
            patientPlans.set(currentPatientKey, plan);
            renderDetailsPlan(plan);
        }
        closePlanner();
        if (detailsOverlay && !detailsOverlay.classList.contains('show')) detailsOverlay.classList.add('show');
        // Switch to Details tab to show saved plan
        const detailsTabBtn = tabs.find(function (b) { return b.getAttribute('data-tab') === 'infoTab'; });
        if (detailsTabBtn) detailsTabBtn.click();
    });
})();