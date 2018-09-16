var canvas = document.getElementById('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');

function getRandomColor(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomRGBColor() {
  var r = getRandomColor(0, 255),
      g = getRandomColor(0, 255),
      b = getRandomColor(0, 255),
      color = r + ',' + g + ',' + b;
  return color;
}

var mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

window.addEventListener('mousemove',
    function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

window.addEventListener('touchstart',
    function(event) {
        mouse.x = event.touches[0].clientX;
        mouse.y = event.touches[0].clientY;
    }
);

window.addEventListener('touchmove',
    function(event) {
        mouse.x = event.touches[0].clientX;
        mouse.y = event.touches[0].clientY;
    }
);

function Particle(x, y, dx, dy, r, ttl) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r;
    this.opacity = 1;
    this.shouldRemove = false;
    this.timeToLive = ttl;
    this.randomColor = getRandomRGBColor();


    this.update = function() {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x + this.r >= canvas.width || this.x - this.r <= 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.r >= canvas.height || this.y - this.r <= 0) {
            this.dy = -this.dy;
        }

        this.x = Math.min(Math.max(this.x, 0 + this.r), canvas.width - this.r);
        this.y = Math.min(Math.max(this.y, 0 + this.r), canvas.height - this.r);

        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        c.strokeStyle = 'rgba(' + this.randomColor + ',' + this.opacity + ')';
        c.stroke();
        c.closePath();

        this.opacity -= 1 / (ttl / 0.1);
        this.r -= r / (ttl / 0.1);

        if (this.r < 0) {
            this.r = 0;
        }

        this.timeToLive -= 0.1;
    }


    this.remove = function() {
      return this.timeToLive <= 0;
    }
}

function Explosion(x, y) {
    this.particles = [];    

    this.init = function() {
        var randomVelocity = {
            x: (Math.random() - 0.5) * 3.5,
            y: (Math.random() - 0.5) * 3.5,
        };
        this.particles.push(new Particle(x, y, randomVelocity.x, randomVelocity.y, 30, 8));     
    }

    this.init();

    this.draw = function() {
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].update(); 

            if (this.particles[i].remove() == true) {
                this.particles.splice(i, 1);  
            };
        } 
    }
}

var explosions = [];

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "#1e1e1e";
    c.fillRect(0, 0, canvas.width, canvas.height);

    explosions.push(new Explosion(mouse.x, mouse.y));

    for (var i = 0; i < explosions.length; i++) {
        explosions[i].draw();
    }
}
animate();