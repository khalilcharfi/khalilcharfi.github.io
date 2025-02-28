{
    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        27, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping plane
        1000 // Far clipping plane
    );

    // Renderer Configuration
    const renderer = new THREE.WebGLRenderer({
        alpha: true, // Transparent background
        antialias: true // Smooth edges
    });
    renderer.setSize(window.innerWidth, window.innerHeight); // Set initial size
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio at 2x for performance
    renderer.setClearColor(0x3F3F3F, 1); // Background color (dark gray)
    document.body.appendChild(renderer.domElement); // Add renderer to DOM

    // Responsive Handling
    const onWindowResize = () => {
        // Update camera aspect ratio
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        // Update renderer size and pixel ratio
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Resize 3D objects based on screen dimensions
        resizeSpheres();
    };
    window.addEventListener('resize', onWindowResize, false);

    // Objects (3D Shapes)
    const objects = [
        new THREE.Mesh(
            new THREE.OctahedronGeometry(1, 4), // Octahedron shape
            new THREE.MeshBasicMaterial({ color: 0x56544D, wireframe: true }) // Wireframe material
        ),
        new THREE.Mesh(
            new THREE.IcosahedronGeometry(5, 5), // Icosahedron shape
            new THREE.MeshBasicMaterial({ color: 0x4D4D4D, wireframe: true }) // Wireframe material
        )
    ];
    objects.forEach(obj => scene.add(obj)); // Add objects to the scene
    camera.position.z = 5; // Set camera position

    // Function to Resize Spheres Based on Screen Dimensions
    const resizeSpheres = () => {
        const scaleFactor = Math.min(window.innerWidth / 1920, window.innerHeight / 1080); // Scale factor based on screen size
        objects[0].scale.set(scaleFactor, scaleFactor, scaleFactor); // Scale Octahedron
        objects[1].scale.set(scaleFactor * 5, scaleFactor * 5, scaleFactor * 5); // Scale Icosahedron
    };
    resizeSpheres(); // Initial resizing of spheres

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);

        // Rotate objects
        objects[0].rotation.x += 0.005;
        objects[0].rotation.y += 0.0005;
        objects[1].rotation.x += 0.0005;
        objects[1].rotation.y += 0.00005;

        // Render the scene
        renderer.render(scene, camera);
    };

    // Text Morphing Animation
    const chars = ['$', '%', '#', '@', '&', '(', ')', '=', '*', '/']; // Characters for morphing effect
 class Entry {
    constructor(el) {
        this.DOM = { el };
        this.DOM.title = { word: this.DOM.el.querySelector('.content__text') };

        // Apply charming.js to the text
        charming(this.DOM.title.word);

        // Get all letters (spans created by charming.js)
        this.DOM.title.letters = Array.from(this.DOM.title.word.querySelectorAll('span'));

        // Store the initial text for each letter
        this.DOM.title.letters.forEach(letter => letter.dataset.initial = letter.innerHTML);

        // Observe the section for visibility
        observer.observe(this.DOM.el);
    }

    enter() {
        this.DOM.title.word.style.opacity = 1;
        this.timeouts = [];
        let cnt = 0;

        // Animate each letter in RTL order
        const letters = this.DOM.title.letters.reverse(); // Reverse the array for RTL
        letters.forEach((letter, pos) => {
            const timeout = setTimeout(() => {
                letter.innerHTML = chars[Math.floor(Math.random() * chars.length)];
                setTimeout(() => {
                    letter.innerHTML = letter.dataset.initial;
                    if (++cnt === letters.length) this.complete = true;
                }, 100);
            }, pos * 50); // Delay based on position
            this.timeouts.push(timeout);
        });
    }

    exit() {
        this.DOM.title.word.style.opacity = 0;
        this.timeouts.forEach(clearTimeout);
    }
}
    // Intersection Observer for Text Morphing
    let current = -1; // Track the current active section
    const sections = document.querySelectorAll('.content__section'); // Get all sections
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = [...sections].indexOf(entry.target); // Get the index of the intersecting section
                if (index === current) return; // Exit if already active
                if (current >= 0) allEntries[current].exit(); // Exit previous section
                allEntries[index].enter(); // Enter new section
                current = index; // Update current section
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the section is visible

    const allEntries = Array.from(sections).map(section => new Entry(section)); // Create Entry instances for all sections

    // Start Animations
    animate();
}
