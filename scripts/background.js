// Reactive schematic layer: drifting node network + cursor crosshair,
// drawn over the static CSS drafting grid.

const canvas = document.getElementById("ambient-canvas");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas && !prefersReducedMotion) {
    const context = canvas.getContext("2d");

    let width = 0;
    let height = 0;
    let nodes = [];
    let palette = getPalette();
    let animationFrame = 0;

    const pointer = {
        x: -1000,
        y: -1000,
        targetX: -1000,
        targetY: -1000,
        active: false
    };

    const NODE_SPACING = 26000; // px^2 of screen area per node
    const LINK_DISTANCE = 150;
    const POINTER_RADIUS = 220;

    function getPalette() {
        const isLight = document.documentElement.dataset.theme === "light";
        return isLight
            ? {
                node: "rgba(30, 70, 140, 0.35)",
                link: "30, 70, 140",
                crosshair: "rgba(193, 77, 0, 0.35)",
                crosshairTick: "rgba(193, 77, 0, 0.55)",
                pointerLink: "193, 77, 0"
            }
            : {
                node: "rgba(230, 238, 250, 0.28)",
                link: "230, 238, 250",
                crosshair: "rgba(255, 178, 36, 0.22)",
                crosshairTick: "rgba(255, 178, 36, 0.5)",
                pointerLink: "255, 178, 36"
            };
    }

    function createNodes() {
        const count = Math.max(24, Math.round((width * height) / NODE_SPACING));
        const list = [];
        for (let i = 0; i < count; i += 1) {
            list.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.28,
                vy: (Math.random() - 0.5) * 0.28,
                size: Math.random() < 0.16 ? 2.4 : 1.4
            });
        }
        return list;
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
        nodes = createNodes();
    }

    function drawNodes() {
        for (const node of nodes) {
            node.x += node.vx;
            node.y += node.vy;

            if (node.x < -20) node.x = width + 20;
            if (node.x > width + 20) node.x = -20;
            if (node.y < -20) node.y = height + 20;
            if (node.y > height + 20) node.y = -20;

            // gentle drift away from the pointer
            if (pointer.active) {
                const dx = node.x - pointer.x;
                const dy = node.y - pointer.y;
                const dist = Math.hypot(dx, dy);
                if (dist > 0 && dist < 90) {
                    node.x += (dx / dist) * 0.6;
                    node.y += (dy / dist) * 0.6;
                }
            }

            context.fillStyle = palette.node;
            context.fillRect(node.x - node.size / 2, node.y - node.size / 2, node.size, node.size);
        }
    }

    function drawLinks() {
        for (let i = 0; i < nodes.length; i += 1) {
            const a = nodes[i];

            for (let j = i + 1; j < nodes.length; j += 1) {
                const b = nodes[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                if (Math.abs(dx) > LINK_DISTANCE || Math.abs(dy) > LINK_DISTANCE) {
                    continue;
                }
                const dist = Math.hypot(dx, dy);
                if (dist < LINK_DISTANCE) {
                    const alpha = (1 - dist / LINK_DISTANCE) * 0.1;
                    context.strokeStyle = `rgba(${palette.link}, ${alpha.toFixed(3)})`;
                    context.lineWidth = 1;
                    context.beginPath();
                    context.moveTo(a.x, a.y);
                    context.lineTo(b.x, b.y);
                    context.stroke();
                }
            }

            // highlight links near the pointer
            if (pointer.active) {
                const pdx = a.x - pointer.x;
                const pdy = a.y - pointer.y;
                const pdist = Math.hypot(pdx, pdy);
                if (pdist < POINTER_RADIUS) {
                    const alpha = (1 - pdist / POINTER_RADIUS) * 0.35;
                    context.strokeStyle = `rgba(${palette.pointerLink}, ${alpha.toFixed(3)})`;
                    context.lineWidth = 1;
                    context.beginPath();
                    context.moveTo(a.x, a.y);
                    context.lineTo(pointer.x, pointer.y);
                    context.stroke();
                }
            }
        }
    }

    function drawCrosshair() {
        if (!pointer.active) {
            return;
        }

        pointer.x += (pointer.targetX - pointer.x) * 0.14;
        pointer.y += (pointer.targetY - pointer.y) * 0.14;

        context.strokeStyle = palette.crosshair;
        context.lineWidth = 1;
        context.setLineDash([2, 6]);

        context.beginPath();
        context.moveTo(0, pointer.y);
        context.lineTo(width, pointer.y);
        context.stroke();

        context.beginPath();
        context.moveTo(pointer.x, 0);
        context.lineTo(pointer.x, height);
        context.stroke();

        context.setLineDash([]);

        // edge ticks marking the pointer's axes
        context.strokeStyle = palette.crosshairTick;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(0, pointer.y);
        context.lineTo(10, pointer.y);
        context.moveTo(width - 10, pointer.y);
        context.lineTo(width, pointer.y);
        context.moveTo(pointer.x, 0);
        context.lineTo(pointer.x, 10);
        context.moveTo(pointer.x, height - 10);
        context.lineTo(pointer.x, height);
        context.stroke();
    }

    function render() {
        context.clearRect(0, 0, width, height);
        drawCrosshair();
        drawLinks();
        drawNodes();
        animationFrame = window.requestAnimationFrame(render);
    }

    resize();
    render();

    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", (event) => {
        if (!pointer.active) {
            pointer.x = event.clientX;
            pointer.y = event.clientY;
        }
        pointer.targetX = event.clientX;
        pointer.targetY = event.clientY;
        pointer.active = true;
    });

    document.addEventListener("mouseleave", () => {
        pointer.active = false;
        pointer.x = -1000;
        pointer.y = -1000;
        pointer.targetX = -1000;
        pointer.targetY = -1000;
    });

    document.addEventListener("themechange", () => {
        palette = getPalette();
    });

    window.addEventListener("beforeunload", () => window.cancelAnimationFrame(animationFrame));
}
