
document.addEventListener("DOMContentLoaded", function () {
    let canvas = document.getElementById("bg-canvas");
    if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "bg-canvas";
        document.body.prepend(canvas);
    }

    const ctx = canvas.getContext("2d");
    let width, height;
    let particles = [];

    // Maus Position
    let mouse = { x: -1000, y: -1000 };

    // Konfiguration (Vanta Style)
    const particleCount = 150; // Menge der Partikel
    const colors = ["#38bdf8", "#818cf8", "#c084fc", "#2dd4bf"]; // Cyan, Indigo, Purple, Teal

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 2; // Schnellere Bewegung
            this.vy = (Math.random() - 0.5) * 2;
            this.size = Math.random() * 2 + 1; // Kleine Punkte
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
        }

        update() {
            // Maus Interaktion (Wegstoßen oder Anziehen)
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = 200; // Radius der Mausreaktion
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < maxDistance) {
                // Wegstoßen (Repel)
                this.x -= directionX * 2;
                this.y -= directionY * 2;
                // Oder Anziehen: += statt -=
            } else {
                // Zurück zur "Normalbewegung"
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 10;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 10;
                }
            }

            // Normale Schwarmbewegung
            this.x += this.vx;
            this.y += this.vy;

            // Wände (Bounce)
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        animate();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Verbindungen zeichnen (Optional für Vanta Net Effekt)
        // Hier: Wir lassen sie weg für den "Bird/Swarm" Look, oder machen sie ganz subtil

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Einfache Linien zwischen nahen Partikeln
        connect();

        requestAnimationFrame(animate);
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                    + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
                if (distance < (width / 7) * (height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = 'rgba(56, 189, 248,' + opacityValue * 0.2 + ')'; // Sehr subtil
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    window.addEventListener("resize", resize);

    // Maus Tracking
    window.addEventListener("mousemove", function (e) {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    init();
});
