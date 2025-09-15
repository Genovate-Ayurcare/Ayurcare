
// Handle login form submission
document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // prevent page reload
       if (window.PageTransitions && PageTransitions.showLoader) {
        PageTransitions.showLoader();
    }

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
             if (window.PageTransitions && PageTransitions.navigateWithFade) {
                PageTransitions.navigateWithFade("/doctor_dashboard");
            } else {
                window.location.replace("/doctor_dashboard");
            }
        } else {
            window.location.replace("/doctor_dashboard");
        }
    } catch (err) {
        console.error("Error:", err);
        alert("Something went wrong. Try again.");
    }
});

