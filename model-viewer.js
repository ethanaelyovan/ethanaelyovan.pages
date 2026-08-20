import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const container = document.getElementById("fedoraModel");

if (container) {
    const width = container.clientWidth || 150;
    const height = container.clientHeight || 150;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // ---- lighting ----
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(2, 3, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-3, -1, 2);
    scene.add(fillLight);

    // ---- model ----
    let model = null;

    new GLTFLoader().load(
        "assets/models/fedoramj.glb",
        (gltf) => {
            model = gltf.scene;

            // Center the model and scale it to fit the small viewport
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);

            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            model.scale.setScalar(1.6 / maxDim);

            scene.add(model);
        },
        undefined,
        (err) => console.error("Failed to load model:", err)
    );

    // ---- scroll-driven rotation (Y axis only) ----
    let targetRotation = 0;
    let currentRotation = 0;
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
        const deltaY = window.scrollY - lastScrollY;
        lastScrollY = window.scrollY;
        targetRotation += deltaY * 0.012;
    }, { passive: true });

    function animate() {
        requestAnimationFrame(animate);

        // Ease toward the scroll-driven target; naturally comes to rest
        // once scrolling stops and currentRotation catches up.
        currentRotation += (targetRotation - currentRotation) * 0.12;

        if (model) {
            model.rotation.y = currentRotation;
        }

        renderer.render(scene, camera);
    }
    animate();

    // ---- resize ----
    window.addEventListener("resize", () => {
        const w = container.clientWidth || 150;
        const h = container.clientHeight || 150;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
}