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
const patients = Array.from(patientsContainer.getElementsByClassName("patient"));

// Search
searchBar.addEventListener("input", () => {
    const query = searchBar.value.toLowerCase();
    patients.forEach(patient => {
        const name = patient.dataset.name.toLowerCase();
        patient.style.display = name.includes(query) ? "flex" : "none";
    });
});

// Sorting
sortOptions.addEventListener("change", () => {
    let sortedPatients = [...patients];

    switch (sortOptions.value) {
        case "name-asc":
            sortedPatients.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
            break;
        case "name-desc":
            sortedPatients.sort((a, b) => b.dataset.name.localeCompare(a.dataset.name));
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

// Patient count on load
document.addEventListener("DOMContentLoaded", () => {
    const patientCount = document.querySelectorAll(".patients-container .patient").length;
    document.getElementById("patientsCount").textContent = `${patientCount} Active`;
});

/* -------------------------------
   📅 Appointment Status Checker
--------------------------------- */
function checkAppointments() {
    const now = new Date();

    document.querySelectorAll(".appointment").forEach(appointment => {
        const timeStr = appointment.getAttribute("data-time"); // e.g. 2025-09-05T21:45
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
   ➕ Add Patient Modal
--------------------------------- */
const modal = document.getElementById("addPatientModal");
const addBtn = document.querySelector(".addPatient");
const closeBtn = document.querySelector(".close-btn");

// Open modal
addBtn.addEventListener("click", () => {
    modal.style.display = "flex";

    // Reset form + generate new code
    document.getElementById("addPatientForm").reset();
    document.getElementById("patientCode").value = generatePatientCode();
});

// Close modal
closeBtn.addEventListener("click", () => (modal.style.display = "none"));
window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
});

// Generate unique patient code
function generatePatientCode() {
    const doctorCode = "DOC123"; // Replace with actual doctor ID
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `${doctorCode}-${datePart}-${randomPart}`;
}

// Form submission
document.getElementById("addPatientForm").addEventListener("submit", e => {
    e.preventDefault();

    const patientName = document.getElementById("patientName").value;
    const patientCode = document.getElementById("patientCode").value;

    alert(`Patient ${patientName} added!\nUnique Code: ${patientCode}`);

    // TODO: Save to backend
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const formattedDate = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
    }); // e.g. 09 Sep, 2025

    // Create patient card (matching your existing format)
    const patientCard = document.createElement("div");
    patientCard.classList.add("patient");
    patientCard.dataset.name = patientName;
    patientCard.dataset.date = today;

    patientCard.innerHTML = `
        <img src="/static/usericon.png" alt="Patient Avatar" class="patient-avatar" />
        <h3>${patientName}</h3>
        <p>Enrolled: ${formattedDate}</p>
        <button class="view-btn">View Details →</button>
    `;

    // Add to patient list
    const patientsContainer = document.getElementById("patientsContainer");
    patientsContainer.appendChild(patientCard);

    // Update patient count
    const patientCount = document.querySelectorAll(".patients-container .patient").length;
    document.getElementById("patientsCount").textContent = `${patientCount} Active`;

    modal.style.display = "none";
    document.getElementById("addPatientForm").reset();
});


