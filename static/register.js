// Prevent caching and handle back-button navigation
window.history.replaceState(null, "", window.location.href);
window.addEventListener("pageshow", function(event) {
    if (event.persisted) {
        window.location.reload();
    }
});

// Subtle falling leaves creation (lightweight and unobtrusive)
// Removed falling leaves; using ambient Ayurvedic visuals in CSS only

// Add realistic floating leaves programmatically for better control
document.addEventListener('DOMContentLoaded', function () {
    var field = document.getElementById('leaf-field');
    if (!field) return;

    var count = 14;
    for (var i = 0; i < count; i++) {
        var leaf = document.createElement('div');
        leaf.className = 'leaf-sprite';

        var left = Math.random() * 100; // vw
        var size = 24 + Math.random() * 14; // 24-38px (bigger)
        var dur = 14 + Math.random() * 8; // 14-22s
        var delay = Math.random() * 10; // 0-10s
        var swayDur = 5 + Math.random() * 4; // 5-9s
        var swayDelay = Math.random() * 3; // 0-3s
        var rot = (Math.random() * 40 - 20) + 'deg';
        var hue = (Math.random() * 16 - 8) + 'deg';
        var opacity = 0.22 + Math.random() * 0.18; // a bit more visible
        var imgVar = Math.random() < 0.33 ? 'var(--leaf-a)' : (Math.random() < 0.5 ? 'var(--leaf-b)' : 'var(--leaf-c)');

        leaf.style.setProperty('--x', left + 'vw');
        leaf.style.setProperty('--size', size + 'px');
        leaf.style.setProperty('--dur', dur + 's');
        leaf.style.setProperty('--delay', delay + 's');
        leaf.style.setProperty('--swayDur', swayDur + 's');
        leaf.style.setProperty('--swayDelay', swayDelay + 's');
        leaf.style.setProperty('--rot', rot);
        leaf.style.setProperty('--hue', hue);
        leaf.style.setProperty('--opacity', opacity);
        leaf.style.setProperty('--img', imgVar);

        field.appendChild(leaf);
    }
});

// Handle register form submission
document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // stop normal form submission

    if (window.PageTransitions && PageTransitions.showLoader) {
        PageTransitions.showLoader();
    }

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const result = await response.json();
        // alert(result.message); // show Flask response

        if (result.success) {
            if (window.PageTransitions && PageTransitions.navigateWithFade) {
                PageTransitions.navigateWithFade("/dashboard");
            } else {
                window.location.href = "/dashboard";
            }
        } else {
            window.location.href = "/register"; // stay on register page
        }
    } catch (error) {
        console.error("Error registering user:", error);
        alert("Something went wrong. Please try again.");
    }
});
