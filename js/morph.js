{
    // Scene setup
    const scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(27, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x3F3F3F, 1);
    document.body.appendChild(renderer.domElement);

    // Responsive handling
    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onWindowResize, false);

    // Objects
    const objects = [
        new THREE.Mesh(
            new THREE.OctahedronGeometry(1, 4),
            new THREE.MeshBasicMaterial({ color: 0x56544D, wireframe: true })
        ),
        new THREE.Mesh(
            new THREE.IcosahedronGeometry(5, 5),
            new THREE.MeshBasicMaterial({ color: 0x4D4D4D, wireframe: true })
        )
    ];
    objects.forEach(obj => scene.add(obj));
    camera.position.z = 5;

    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        
        // Rotations
        objects[0].rotation.x += 0.005;
        objects[0].rotation.y += 0.0005;
        objects[1].rotation.x += 0.0005;
        objects[1].rotation.y += 0.00005;

        renderer.render(scene, camera);
    };

    // Text morphing
    const chars = ['$', '%', '#', '@', '&', '(', ')', '=', '*', '/'];
    class Entry {
        constructor(el) {
            this.DOM = { el };
            this.DOM.title = { word: this.DOM.el.querySelector('.content__text') };
            charming(this.DOM.title.word);
            this.DOM.title.letters = Array.from(this.DOM.title.word.querySelectorAll('span'));
            this.DOM.title.letters.forEach(letter => letter.dataset.initial = letter.innerHTML);
            observer.observe(this.DOM.el);
        }
        enter() {
            this.DOM.title.word.style.opacity = 1;
            this.timeouts = [];
            let cnt = 0;
            this.DOM.title.letters.forEach((letter, pos) => {
                const timeout = setTimeout(() => {
                    letter.innerHTML = chars[Math.floor(Math.random() * chars.length)];
                    setTimeout(() => {
                        letter.innerHTML = letter.dataset.initial;
                        if (++cnt === this.DOM.title.letters.length) this.complete = true;
                    }, 100);
                }, pos * 50);
                this.timeouts.push(timeout);
            });
        }
        exit() {
            this.DOM.title.word.style.opacity = 0;
            this.timeouts.forEach(clearTimeout);
        }
    }

    // Intersection observer
    let current = -1;
    const sections = document.querySelectorAll('.content__section');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = [...sections].indexOf(entry.target);
                if (index === current) return;
                
                if (current >= 0) allentries[current].exit();
                allentries[index].enter();
                current = index;
            }
        });
    }, { threshold: 0.5 });

    const allentries = Array.from(sections).map(section => new Entry(section));

    // Start animation
    animate();
}
