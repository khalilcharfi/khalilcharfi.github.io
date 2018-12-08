{

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 0.1, 1000);

    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    var renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setSize(window.innerWidth - 3, window.innerHeight - 3);
    renderer.setClearColorHex(0x3F3F3F, 1);
    document.body.appendChild(renderer.domElement);

    var object = [];
    object[0] = new THREE.Mesh(
        new THREE.OctahedronGeometry(1, 4),
        new THREE.MeshBasicMaterial({color: 0x56544D, wireframe: true})
    );
    object[1] = new THREE.Mesh(
        new THREE.IcosahedronGeometry(5, 5),
        new THREE.MeshBasicMaterial({color: 0x4D4D4D, wireframe: true})
    );

    for (var i in object) {
        scene.add(object[i]);
    }

    camera.position.z = 5;

    var render = function () {
        object[0].rotation.x += 0.005;
        object[0].rotation.y += 0.0005;

        object[1].rotation.x += 0.0005;
        object[1].rotation.y += 0.00005;

        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    };

    var animate = function () {
        requestAnimationFrame(animate);
        render();
    }

    document.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    animate();


    const chars = ['$', '%', '#', '@', '&', '(', ')', '=', '*', '/'];
    const charsTotal = chars.length;
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    class Entry {
        constructor(el) {
            this.DOM = {el: el};
            this.DOM.title = {word: this.DOM.el.querySelector('.content__text')};
            charming(this.DOM.title.word);
            this.DOM.title.letters = Array.from(this.DOM.title.word.querySelectorAll('span'));
            this.DOM.title.letters.forEach(letter => letter.dataset.initial = letter.innerHTML);
            this.lettersTotal = this.DOM.title.letters.length;
            observer.observe(this.DOM.el);
        }

        enter(direction = 'down') {
            this.DOM.title.word.style.opacity = 1;

            this.timeouts = [];
            this.complete = false;
            let cnt = 0;
            this.DOM.title.letters.forEach((letter, pos) => {
                const timeout = setTimeout(() => {
                    letter.innerHTML = chars[getRandomInt(0, charsTotal - 1)];
                    setTimeout(() => {
                        letter.innerHTML = letter.dataset.initial;
                        ++cnt;
                        if (cnt === this.lettersTotal) {
                            this.complete = true;
                        }
                    }, 100);
                }, pos * 50);
                this.timeouts.push(timeout);
            });
        }

        exit(direction = 'down') {
            this.DOM.title.word.style.opacity = 0;
            if (this.complete) return;
            for (let i = 0, len = this.timeouts.length; i <= len - 1; ++i) {
                clearTimeout(this.timeouts[i]);
            }
        }
    }

    let observer;
    let current = -1;
    let allentries = [];
    const sections = Array.from(document.querySelectorAll('.content__section'));
    if ('IntersectionObserver' in window) {
        document.body.classList.add('ioapi');

        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.intersectionRatio > 0.5) {
                    const newcurrent = sections.indexOf(entry.target);
                    if (newcurrent === current) return;
                    const direction = newcurrent > current;
                    if (current >= 0) {
                        allentries[current].exit(direction ? 'down' : 'up');
                    }
                    allentries[newcurrent].enter(direction ? 'down' : 'up');
                    current = newcurrent;
                }
            });
        }, {threshold: 0.5});

        sections.forEach(section => allentries.push(new Entry(section)));
    }


}