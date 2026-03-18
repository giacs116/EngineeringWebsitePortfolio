const canvas = document.getElementById("ambient-canvas");

if (canvas) {
    const context = canvas.getContext("2d");
    let blobs = createBlobs();
    const pointer = {
        x: window.innerWidth * 0.5,
        y: window.innerHeight * 0.45,
        targetX: window.innerWidth * 0.5,
        targetY: window.innerHeight * 0.45,
        active: false
    };

    let width = 0;
    let height = 0;
    let animationFrame = 0;

    function createBlobs() {
        const isLight = document.documentElement.dataset.theme === "light";
        return isLight
            ? [
                { x: 0.18, y: 0.2, radius: 180, color: "rgba(166, 128, 255, 0.16)", dx: 0.00018, dy: 0.00012 },
                { x: 0.78, y: 0.22, radius: 230, color: "rgba(227, 210, 255, 0.18)", dx: -0.00015, dy: 0.0001 },
                { x: 0.68, y: 0.76, radius: 210, color: "rgba(137, 95, 229, 0.1)", dx: -0.00012, dy: -0.00014 },
                { x: 0.25, y: 0.72, radius: 170, color: "rgba(203, 180, 255, 0.13)", dx: 0.00011, dy: -0.00008 }
            ]
            : [
                { x: 0.18, y: 0.2, radius: 180, color: "rgba(160, 112, 255, 0.17)", dx: 0.00018, dy: 0.00012 },
                { x: 0.78, y: 0.22, radius: 230, color: "rgba(116, 73, 222, 0.15)", dx: -0.00015, dy: 0.0001 },
                { x: 0.68, y: 0.76, radius: 210, color: "rgba(224, 198, 255, 0.1)", dx: -0.00012, dy: -0.00014 },
                { x: 0.25, y: 0.72, radius: 170, color: "rgba(136, 90, 233, 0.12)", dx: 0.00011, dy: -0.00008 }
            ];
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        const ratio = window.devicePixelRatio || 1;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function drawGrid() {
        context.strokeStyle = document.documentElement.dataset.theme === "light"
            ? "rgba(134, 102, 191, 0.08)"
            : "rgba(154, 118, 226, 0.07)";
        context.lineWidth = 1;

        const spacing = 56;
        for (let x = 0; x < width; x += spacing) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, height);
            context.stroke();
        }

        for (let y = 0; y < height; y += spacing) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(width, y);
            context.stroke();
        }
    }

    function drawPointerGlow() {
        pointer.x += (pointer.targetX - pointer.x) * 0.08;
        pointer.y += (pointer.targetY - pointer.y) * 0.08;

        const outerGlow = context.createRadialGradient(
            pointer.x,
            pointer.y,
            0,
            pointer.x,
            pointer.y,
            280
        );
        if (document.documentElement.dataset.theme === "light") {
            outerGlow.addColorStop(0, "rgba(171, 130, 255, 0.16)");
            outerGlow.addColorStop(0.45, "rgba(231, 214, 255, 0.18)");
        } else {
            outerGlow.addColorStop(0, "rgba(166, 121, 255, 0.18)");
            outerGlow.addColorStop(0.45, "rgba(110, 74, 214, 0.14)");
        }
        outerGlow.addColorStop(1, "rgba(8, 12, 20, 0)");

        context.fillStyle = outerGlow;
        context.beginPath();
        context.arc(pointer.x, pointer.y, 280, 0, Math.PI * 2);
        context.fill();

        const innerGlow = context.createRadialGradient(
            pointer.x,
            pointer.y,
            0,
            pointer.x,
            pointer.y,
            120
        );
        innerGlow.addColorStop(0, document.documentElement.dataset.theme === "light"
            ? "rgba(236, 226, 255, 0.22)"
            : "rgba(214, 188, 255, 0.18)");
        innerGlow.addColorStop(1, "rgba(8, 12, 20, 0)");

        context.fillStyle = innerGlow;
        context.beginPath();
        context.arc(pointer.x, pointer.y, 120, 0, Math.PI * 2);
        context.fill();
    }

    function drawBlobs() {
        blobs.forEach((blob) => {
            blob.x += blob.dx;
            blob.y += blob.dy;

            if (blob.x < 0.05 || blob.x > 0.95) blob.dx *= -1;
            if (blob.y < 0.08 || blob.y > 0.92) blob.dy *= -1;

            const gradient = context.createRadialGradient(
                blob.x * width,
                blob.y * height,
                0,
                blob.x * width,
                blob.y * height,
                blob.radius
            );

            gradient.addColorStop(0, blob.color);
            gradient.addColorStop(1, "rgba(8, 12, 20, 0)");
            context.fillStyle = gradient;
            context.beginPath();
            context.arc(blob.x * width, blob.y * height, blob.radius, 0, Math.PI * 2);
            context.fill();
        });
    }

    function render() {
        context.clearRect(0, 0, width, height);
        drawGrid();
        drawPointerGlow();
        drawBlobs();
        animationFrame = window.requestAnimationFrame(render);
    }

    resize();
    render();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (event) => {
        pointer.targetX = event.clientX;
        pointer.targetY = event.clientY;
        pointer.active = true;
    });
    document.addEventListener("themechange", () => {
        blobs = createBlobs();
    });
    window.addEventListener("mouseleave", () => {
        pointer.targetX = width * 0.5;
        pointer.targetY = height * 0.45;
        pointer.active = false;
    });
    window.addEventListener("beforeunload", () => window.cancelAnimationFrame(animationFrame));
}
