// 1. Create an observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('feature-card')){
                entry.target.classList.add('scrollAnimation');
                setTimeout(() => {
                    entry.target.classList.remove('scrollAnimation');
                },500)
            }
            entry.target.classList.add("visible"); // e.g., start animation
        } else {
            entry.target.classList.remove("visible");
        }
    });
}, {
    root: null, // viewport
    threshold: 0.4 // trigger when 30% of element is visible
});

// 2. Select element(s) to observe
const boxes = document.querySelectorAll('.stagger-item');
boxes.forEach(box => observer.observe(box));
