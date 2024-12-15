const lightColors = [
  '#0EA5E9', 
  '#6366F1', 
  '#8B5CF6', 
  '#EC4899', 
  '#F472B6',
  '#818CF8', 
  '#2DD4BF', 
];

const darkColors = [
  '#38BDF8', 
  '#A5B4FC', 
  '#C4B5FD', 
  '#F9A8D4', 
  '#67E8F9', 
  '#5EEAD4', 
  '#94A3B8', 
];

class Particle {
  constructor(context, width, height, isDark) {
    this.context = context;
    this.width = width;
    this.height = height;
    this.x = Math.random() * width;
    this.y = Math.random() * height - height;
    this.rotation = Math.random() * 360;
    this.color = (isDark ? darkColors : lightColors)[Math.floor(Math.random() * (isDark ? darkColors : lightColors).length)];
    this.size = Math.random() * 8 + 4;
    this.speedY = Math.random() * 3 + 2;
    this.speedX = Math.random() * 2 - 1;
    this.speedRotation = Math.random() * 2 - 1;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.speedRotation;
    
    if (this.y > this.height) {
      this.y = -10;
      this.x = Math.random() * this.width;
    }
  }

  draw() {
    this.context.save();
    this.context.translate(this.x, this.y);
    this.context.rotate((this.rotation * Math.PI) / 180);
    this.context.fillStyle = this.color;
    this.context.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    this.context.restore();
  }
}

export const startConfetti = () => {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const context = canvas.getContext('2d');
  let particles = [];
  let animationFrameId;
  let opacity = 1;
  let startTime;

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const isDark = document.documentElement.classList.contains('dark');

  for (let i = 0; i < 150; i++) {
    particles.push(new Particle(context, canvas.width, canvas.height, isDark));
  }

  const animate = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;

    // Start fading after 1.5 seconds
    if (progress > 1500) {
      opacity = Math.max(0, opacity - 0.02);
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = opacity;

    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    if (opacity <= 0) {
      window.removeEventListener('resize', resizeCanvas);
      canvas.remove();
      return;
    }

    animationFrameId = requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);

  return () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    window.removeEventListener('resize', resizeCanvas);
    canvas.remove();
  };
};