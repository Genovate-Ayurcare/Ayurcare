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


