document.addEventListener("DOMContentLoaded", function() {
    const videoLinks = document.querySelectorAll(".video-link");
    const videoFrame = document.getElementById("videoFrame");
    const videoTitle = document.getElementById("videoTitle");
    const videoContent = document.getElementById("videoContent");
    const courseProgress = document.getElementById("courseProgress");
    const courseProgressText = document.getElementById("courseProgressText");
    let totalVideoLength = 0;
    let watchedVideoLength = 0;
    const watchedVideos = new Set();

    videoLinks.forEach((link) => {
        totalVideoLength += parseFloat(link.dataset.videoLength);

        link.addEventListener("click", function(e) {
            e.preventDefault();
            if (e.target.classList.contains("note-icon")) {
                showVideoContent(link.dataset.videoContent);
            } else {
                videoLinks.forEach((l) => l.classList.remove("active"));
                link.classList.add("active");
                const videoUrl = link.dataset.videoUrl;
                const videoLength = parseFloat(link.dataset.videoLength);
                showVideo(videoUrl, link.textContent);
                if (!watchedVideos.has(link)) {
                    watchedVideos.add(link);
                    watchedVideoLength += videoLength;
                    updateProgress();
                }
            }
        });
    });

    function showVideo(videoUrl, title) {
        videoFrame.src = videoUrl;
        videoTitle.textContent = title;
        videoContent.style.display = "none";
        videoFrame.parentElement.style.display = "block";
    }

    function showVideoContent(content) {
        videoContent.textContent = content;
        videoContent.style.display = "block";
        videoFrame.parentElement.style.display = "none";
        videoTitle.textContent = "Notes";
    }

    function updateProgress() {
        const percentage = (watchedVideoLength / totalVideoLength) * 100;
        courseProgress.style.width = `${percentage}%`;
        courseProgressText.textContent = `${Math.floor(percentage)}% (${watchedVideos.size} / ${videoLinks.length} videos)`;

        document.querySelectorAll(".progress-circle").forEach((circle) => {
            const sectionLinks = circle.closest(".accordion-item").querySelectorAll(".video-link");
            const sectionWatched = Array.from(sectionLinks).filter((link) => watchedVideos.has(link));
            const sectionPercentage = (sectionWatched.length / sectionLinks.length) * 100;
            circle.querySelector(".circle").setAttribute("stroke-dasharray", `${sectionPercentage}, 100`);
        });
    }
});
