// Intro animations
document.addEventListener("DOMContentLoaded", () => {
    const greetingText = document.querySelector(".greeting-text");
    const questionImage = document.querySelector(".question-image");
    const introSection = document.getElementById("intro");
    const questionSection = document.getElementById("question");
    const acceptedSection = document.getElementById("accepted");
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const toGalleryBtn = document.getElementById("toGalleryBtn");
    const gallerySection = document.getElementById("gallery");
    const galleryContainer = gallerySection.querySelector(".gallery-container");

    // Initial state: greeting text slides in from bottom
    setTimeout(() => {
        greetingText.classList.add("slide-in");
    }, 100);

    // After greeting text is visible, slide it out and fade out
    setTimeout(() => {
        greetingText.classList.remove("slide-in");
        greetingText.classList.add("slide-out");
    }, 3000);

    // After greeting text slides out, show question section sliding in from bottom
    setTimeout(() => {
        introSection.classList.add("hidden");
        questionSection.classList.remove("hidden");
        // Trigger slide-in animation for question section
        setTimeout(() => {
            questionSection.classList.add("active");
        }, 50);
    }, 3800);

    // Yes / No logic
    let yesScale = 1;
    const buttonsContainer = document.querySelector(".buttons");
    let buttonsMinHeight = 80; // Starting min-height

    noBtn.addEventListener("click", () => {
        // Each time she clicks "No", make "Yes" bigger
        yesScale += 0.25;
        yesBtn.style.transform = `scale(${yesScale})`;

        // Increase min-height of buttons container by 20px
        buttonsMinHeight += 20;
        buttonsContainer.style.minHeight = `${buttonsMinHeight}px`;

        // Calculate how much the Yes button has expanded
        // Get current width and calculate expansion
        const currentWidth = yesBtn.offsetWidth;
        const baseWidth = currentWidth / yesScale;
        const expansion = currentWidth - baseWidth;
        
        // Push the No button to the right as Yes grows
        const randomX = (Math.random() - 0.5) * 40; // -20 to 20px
        const randomY = (Math.random() - 0.5) * 40;
        
        // Push No button right by the expansion amount plus gap
        const pushAmount = expansion + 16; // 16px for the gap (1rem)
        noBtn.style.transform = `translateX(${pushAmount + randomX}px) translateY(${randomY}px) scale(0.9)`;
        setTimeout(() => {
            noBtn.style.transform = `translateX(${pushAmount + randomX}px) translateY(${randomY}px) scale(1)`;
        }, 200);
    });

    yesBtn.addEventListener("click", () => {
        questionSection.classList.remove("active");
        setTimeout(() => {
            questionSection.classList.add("hidden");
            acceptedSection.classList.remove("hidden");
            setTimeout(() => {
                acceptedSection.classList.add("active");
            }, 50);
        }, 800);
    });

    toGalleryBtn.addEventListener("click", () => {
        // Transition from accepted section to gallery section
        acceptedSection.classList.remove("active");
        setTimeout(() => {
            acceptedSection.classList.add("hidden");
            gallerySection.classList.remove("hidden");
            setTimeout(() => {
                gallerySection.classList.add("active");
            }, 50);
        }, 800);
    });

    // Load gallery images from data.json
    fetch("imgs/data.json")
        .then((res) => res.json())
        .then((photos) => {
            galleryContainer.innerHTML = "";

            // Sort by id (ascending - oldest to newest)
            photos.sort((a, b) => a.id - b.id);

            photos.forEach((photo) => {
                const slide = document.createElement("div");
                slide.className = "slide";
                slide.id = `photo-${photo.id}`;

                const img = document.createElement("img");
                img.src = `imgs/${photo.name}`;
                img.alt = photo.name || "Our memory";
                img.style.cursor = "pointer";

                // Add click handler to open full image
                img.addEventListener("click", () => {
                    openImageModal(`imgs/${photo.name}`, formatPhotoDate(photo.date_created));
                });

                const meta = document.createElement("div");
                meta.className = "slide-meta";
                meta.textContent = formatPhotoDate(photo.date_created);

                slide.appendChild(img);
                slide.appendChild(meta);
                galleryContainer.appendChild(slide);
            });
        })
        .catch((err) => {
            console.error("Error loading imgs/data.json", err);
            galleryContainer.innerHTML =
                '<div class="gallery-loading">Nem sikerült betölteni a képeket 😢</div>';
        });
});

function formatPhotoDate(dateStr) {
    // Expecting format like "2025:04:10 13:00:59"
    if (!dateStr) return "";

    // Convert "2025:04:10 13:00:59" to "2025-04-10T13:00:59" for Date parsing
    const dateFormatted = dateStr.replace(/(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3").replace(" ", "T");
    
    const date = new Date(dateFormatted);
    if (Number.isNaN(date.getTime())) return dateStr;

    // Format to Hungarian locale
    return date.toLocaleDateString("hu-HU", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function openImageModal(imageSrc, dateText) {
    // Create modal overlay
    const modal = document.createElement("div");
    modal.className = "image-modal";
    modal.innerHTML = `
        <div class="image-modal-content">
            <button class="image-modal-close">&times;</button>
            <img src="${imageSrc}" alt="Full image" class="image-modal-img">
            <div class="image-modal-date">${dateText}</div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close on close button click
    const closeBtn = modal.querySelector(".image-modal-close");
    closeBtn.addEventListener("click", () => closeImageModal(modal));

    // Close on overlay click
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeImageModal(modal);
        }
    });

    // Close on ESC key
    const handleEsc = (e) => {
        if (e.key === "Escape") {
            closeImageModal(modal);
            document.removeEventListener("keydown", handleEsc);
        }
    };
    document.addEventListener("keydown", handleEsc);

    // Show modal with animation
    setTimeout(() => {
        modal.classList.add("active");
    }, 10);
}

function closeImageModal(modal) {
    modal.classList.remove("active");
    setTimeout(() => {
        modal.remove();
    }, 300);
}
