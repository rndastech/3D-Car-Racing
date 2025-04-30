// Import UI controller
import { UIController } from './ui.js';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Shared variables with game.js
export let scene, camera, renderer, topview, clouds = [];
export let mcqueen, car1, car2, car3, car4, tank1, tank2;
export let stats;
// Create UI controller instance
export const uiController = new UIController();

// Constants
export const loader = new GLTFLoader();

// Initialize the 3D scene, camera, renderer and environment
export function initGraphics() {
    initScene();
    initCamera();
    initRenderer();
    initLighting();
    createStats();
    
    window.addEventListener('resize', onWindowResize, false);
}

// Initialize the 3D scene
function initScene() {
    scene = new THREE.Scene();
    
    // Create a realistic sky with skybox textures
    const skyTexture = new THREE.CubeTextureLoader()
        .setPath('./textures/')
        .load([
            'vz_classic_right.png', 'vz_classic_left.png',
            'vz_classic_up.png', 'vz_classic_down.png',
            'vz_classic_front.png', 'vz_classic_back.png'
        ]);
    scene.background = skyTexture;
}

// Initialize camera setup
function initCamera() {
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    topview = new THREE.PerspectiveCamera(
        90,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    
    camera.position.y = 10;
    camera.position.x = 270;
    camera.position.z = -20;
    camera.rotation.y = -Math.PI;

    topview.position.set(0, 80, 0);
    topview.lookAt(0, 0, 0);
    camera.add(topview);
}

// Initialize the renderer
function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Enable shadows for more realistic lighting
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    document.body.appendChild(renderer.domElement);
}

// Initialize lighting for the scene
function initLighting() {
    // Main directional light
    const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(0, 100, 150);
    light.castShadow = true;
    
    // Improve shadow quality
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;
    light.shadow.camera.left = -100;
    light.shadow.camera.right = 100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    
    // Ambient light
    const ambient = new THREE.AmbientLight(0x404040);

    // Hemisphere light for better outdoor lighting
    const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x3CB371, 0.6);
    
    scene.add(light);
    scene.add(ambient);
    scene.add(hemisphereLight);
}

// Handle window resizing
export function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    topview.aspect = window.innerWidth / window.innerHeight;
    topview.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
}

// Create performance statistics display
export function createStats() {
    stats = new Stats();
    stats.setMode(0);

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0';
    stats.domElement.style.top = '0';

    document.body.appendChild(stats.domElement);
    
    return stats;
}

// Initialize racing track
export function initTrack() {
    const geometry = new THREE.RingGeometry(210, 300, 400);
    
    // Create asphalt texture for track
    const asphaltTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg');
    asphaltTexture.wrapS = THREE.RepeatWrapping;
    asphaltTexture.wrapT = THREE.RepeatWrapping;
    asphaltTexture.repeat.set(15, 15);
    
    const material = new THREE.MeshPhongMaterial({ 
        map: asphaltTexture,
        color: 0x333333, 
        side: THREE.DoubleSide,
        bumpMap: asphaltTexture,
        bumpScale: 0.2
    });
    
    const track = new THREE.Mesh(geometry, material);
    track.rotation.x = Math.PI / 2;
    track.position.y = 0;
    track.position.z = 0.01;
    track.receiveShadow = true;
    scene.add(track);

    // Adding track markings
    const points = [];
    points.push(new THREE.Vector3(210, 0.11, 0));
    points.push(new THREE.Vector3(300, 0.11, 0));

    const geometry_line = new THREE.BufferGeometry().setFromPoints(points);
    const material_line = new THREE.LineDashedMaterial({ 
        color: 0xffffff, 
        linewidth: 20, 
        scale: 1, 
        dashSize: 10, 
        gapSize: 5 
    });
    const line = new THREE.Line(geometry_line, material_line);
    scene.add(line);

    let pts = new THREE.Path().absarc(0, 0, 255, 0, Math.PI * 2).getPoints(200);
    let ring_geometry = new THREE.BufferGeometry().setFromPoints(pts);
    ring_geometry.rotateX(Math.PI * 0.5);
    let ring_material = new THREE.LineDashedMaterial({ 
        color: 0xffffff, 
        linewidth: 1, 
        scale: 1, 
        dashSize: 3, 
        gapSize: 3 
    });
    let ring = new THREE.Line(ring_geometry, ring_material);
    ring.computeLineDistances();
    scene.add(ring);

    // Enhanced grass with texture
    const geometry1 = new THREE.RingGeometry(180, 315, 400);
    const grassTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg');
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(30, 30);
    
    const material1 = new THREE.MeshPhongMaterial({ 
        map: grassTexture,
        color: 0x338833, 
        side: THREE.DoubleSide 
    });
    
    const grass = new THREE.Mesh(geometry1, material1);
    grass.rotation.x = Math.PI / 2;
    grass.position.y = -0.1;
    grass.position.z = 0.01;
    grass.receiveShadow = true;
    scene.add(grass);

    // Enhanced sand with texture
    const geometry2 = new THREE.RingGeometry(1, 190, 400);
    const sandTexture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/terrain/grasslight-big.jpg');
    sandTexture.wrapS = THREE.RepeatWrapping;
    sandTexture.wrapT = THREE.RepeatWrapping;
    sandTexture.repeat.set(20, 20);
    
    const material2 = new THREE.MeshPhongMaterial({ 
        map: sandTexture,
        color: 0xd2b48c, 
        side: THREE.DoubleSide 
    });
    
    const sand = new THREE.Mesh(geometry2, material2);
    sand.rotation.x = Math.PI / 2;
    sand.position.y = -0.2;
    sand.position.z = 0.01;
    sand.receiveShadow = true;
    scene.add(sand);

    // Add center islands with 3D models
    loader.load(
        './models/circle/scene.gltf',
        function (gltf) {
            let scale = 26;
            gltf.scene.scale.set(scale, 1, scale);
            gltf.scene.translateY(0.5);
            // Enable shadows for all meshes in the model
            gltf.scene.traverse((object) => {
                if (object.isMesh) {
                    object.castShadow = true;
                    object.receiveShadow = true;
                }
            });
            scene.add(gltf.scene);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        function (error) {
            console.error(error);
        }
    );

    loader.load(
        './models/circle/scene.gltf',
        function (gltf) {
            let scale = 40;
            gltf.scene.scale.set(scale, 1, scale);
            gltf.scene.translateY(0.5);
            // Enable shadows for all meshes in the model
            gltf.scene.traverse((object) => {
                if (object.isMesh) {
                    object.castShadow = true;
                    object.receiveShadow = true;
                }
            });
            scene.add(gltf.scene);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        function (error) {
            console.error(error);
        }
    );
    
    // Add guardrails around the track
    const guardrailGeometry = new THREE.BoxGeometry(1, 1, 1);
    const guardrailMaterial = new THREE.MeshPhongMaterial({ color: 0xAAAAAA });
    
    // Inner guardrail
    for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * Math.PI * 2;
        const x = Math.cos(angle) * 205;
        const z = Math.sin(angle) * 205;
        
        const post = new THREE.Mesh(guardrailGeometry, guardrailMaterial);
        post.position.set(x, 1, z);
        post.scale.set(1, 2, 1);
        post.castShadow = true;
        scene.add(post);
    }
    
    // Outer guardrail
    for (let i = 0; i < 80; i++) {
        const angle = (i / 80) * Math.PI * 2;
        const x = Math.cos(angle) * 305;
        const z = Math.sin(angle) * 305;
        
        const post = new THREE.Mesh(guardrailGeometry, guardrailMaterial);
        post.position.set(x, 1, z);
        post.scale.set(1, 2, 1);
        post.castShadow = true;
        scene.add(post);
    }
}

// Initialize player's car model
export function initPlayerCar() {
    mcqueen = new THREE.Object3D();
    loader.load(
        './models/mcqueen/scene.gltf',
        function (gltf) {
            mcqueen = gltf.scene;
            gltf.scene.translateX(270);
            gltf.scene.translateY(0.1);
            
            // Enable shadows for all meshes in the model
            gltf.scene.traverse((object) => {
                if (object.isMesh) {
                    object.castShadow = true;
                    object.receiveShadow = true;
                    
                    // Add reflective properties to car paint
                    if (object.material && object.material.name.includes('body')) {
                        object.material.envMap = scene.background;
                        object.material.envMapIntensity = 0.5;
                        object.material.needsUpdate = true;
                    }
                }
            });
            
            scene.add(gltf.scene);
            
            // Add headlights
            const headlightRight = new THREE.SpotLight(0xffffff, 2, 50, Math.PI / 6, 0.5, 1);
            headlightRight.position.set(0, 2, -3);
            mcqueen.add(headlightRight);
            
            const headlightLeft = new THREE.SpotLight(0xffffff, 2, 50, Math.PI / 6, 0.5, 1);
            headlightLeft.position.set(0, 2, 3);
            mcqueen.add(headlightLeft);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        function (error) {
            console.error(error);
        }
    );
}

// Create wheels for CPU cars
function createWheels() {
    const geometry = new THREE.BoxGeometry(12, 12, 33);
    const material = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const wheel = new THREE.Mesh(geometry, material);
    return wheel;
}

// Create CPU car model
function createCar(colour, position) {
    const car = new THREE.Group();

    const backWheel = createWheels();
    backWheel.position.y = 6;
    backWheel.position.x = -18;
    car.add(backWheel);

    const frontWheel = createWheels();
    frontWheel.position.y = 6;
    frontWheel.position.x = 18;
    car.add(frontWheel);

    const main = new THREE.Mesh(
        new THREE.BoxGeometry(60, 15, 30),
        new THREE.MeshLambertMaterial({ color: colour })
    );
    main.position.y = 12;
    car.add(main);

    const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(33, 12, 24),
        new THREE.MeshLambertMaterial({ color: 0xffffff })
    );
    cabin.position.x = -6;
    cabin.position.y = 25.5;
    car.add(cabin);

    car.scale.multiplyScalar(0.15);
    car.position.set(position.x, position.y, position.z);
    car.rotateY(-Math.PI / 2);

    return car;
}

// Initialize CPU cars
export function initCars(radius) {
    car1 = createCar(0x523ddb, new THREE.Vector3(radius[0], 1, 0));
    car2 = createCar(0xd62bd9, new THREE.Vector3(radius[1], 0.1, 0));
    car3 = createCar(0x0fbd26, new THREE.Vector3(radius[2], 0.1, 0));
    car4 = createCar(0xc6e334, new THREE.Vector3(radius[3], 0.1, 0));

    scene.add(car1);
    scene.add(car2);
    scene.add(car3);
    scene.add(car4);
    
    return [car1, car2, car3, car4];
}

// Initialize crowd models
export function initPeople() {
    loader.load(
        './models/people/scene.gltf',
        function (gltf) {
            gltf.scene.scale.set(0.2, 0.2, 0.2);
            gltf.scene.translateX(304);
            gltf.scene.rotateY(-Math.PI / 2)
            scene.add(gltf.scene);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        function (error) {
            console.error(error);
        }
    );
    loader.load(
        './models/people/scene.gltf',
        function (gltf) {
            gltf.scene.scale.set(0.2, 0.2, 0.2);
            gltf.scene.translateX(-304);
            gltf.scene.rotateY(Math.PI / 2)
            scene.add(gltf.scene);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        function (error) {
            console.error(error);
        }
    );
    loader.load(
        './models/people/scene.gltf',
        function (gltf) {
            gltf.scene.scale.set(0.2, 0.2, 0.2);
            gltf.scene.translateZ(-304);
            scene.add(gltf.scene);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        function (error) {
            console.error(error);
        }
    );
    loader.load(
        './models/people/scene.gltf',
        function (gltf) {
            gltf.scene.scale.set(0.2, 0.2, 0.2);
            gltf.scene.translateZ(304);
            gltf.scene.rotateY(-Math.PI);
            scene.add(gltf.scene);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        function (error) {
            console.error(error);
        }
    );
    loader.load(
        './models/crowd/scene.gltf',
        function (gltf) {
            let scale = 0.75;
            gltf.scene.scale.set(scale, scale, scale);
            gltf.scene.rotateY(-Math.PI / 2)
            scene.add(gltf.scene);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        function (error) {
            console.error(error);
        }
    );
}

// Initialize environment objects (trees, clouds, mountains)
export function initEnvironment() {
    // Add trees around the outer edge of the track
    const treeGeometry = new THREE.CylinderGeometry(0, 10, 30, 4, 1);
    const treeMaterial = new THREE.MeshPhongMaterial({
        color: 0x33cc33,
        flatShading: true
    });
    
    // Add trees in a circular pattern around the track
    for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const radius = 330;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        const treeTop = new THREE.Mesh(treeGeometry, treeMaterial);
        treeTop.position.set(x, 15, z);
        treeTop.updateMatrix();
        treeTop.matrixAutoUpdate = false;
        scene.add(treeTop);
        
        const trunkGeometry = new THREE.CylinderGeometry(2, 2, 10, 8, 1);
        const trunkMaterial = new THREE.MeshPhongMaterial({
            color: 0x8B4513,
            flatShading: true
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(x, 5, z);
        trunk.updateMatrix();
        trunk.matrixAutoUpdate = false;
        scene.add(trunk);
    }
    
    // Add clouds in the sky
    const cloudGeometry = new THREE.SphereGeometry(10, 15, 15);
    const cloudMaterial = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.8
    });
    
    for (let i = 0; i < 20; i++) {
        const cloud = new THREE.Group();
        
        const cloudParts = Math.floor(Math.random() * 3) + 3;
        for (let j = 0; j < cloudParts; j++) {
            const cloudPiece = new THREE.Mesh(cloudGeometry, cloudMaterial);
            const scale = Math.random() * 0.8 + 0.6;
            cloudPiece.scale.set(scale, scale, scale);
            cloudPiece.position.set(
                j * 7 - (cloudParts * 3.5) / 2,
                Math.random() * 2,
                Math.random() * 5 - 2.5
            );
            cloud.add(cloudPiece);
        }
        
        // Position clouds randomly in the sky
        const angle = Math.random() * Math.PI * 2;
        const cloudRadius = Math.random() * 500 + 400;
        cloud.position.set(
            Math.cos(angle) * cloudRadius,
            Math.random() * 100 + 100,
            Math.sin(angle) * cloudRadius
        );
        
        scene.add(cloud);
        clouds.push(cloud);
    }
    
    // Add mountains in the distance
    const mountainGeometry = new THREE.ConeGeometry(100, 200, 4);
    
    // Load mountain textures
    const mountainTexture = new THREE.TextureLoader().load('./textures/desert-cliff1-albedo.png');
    const mountainNormalMap = new THREE.TextureLoader().load('./textures/desert-cliff1-normal-ogl.png');
    const mountainAOMap = new THREE.TextureLoader().load('./textures/desert-cliff1-ao.png');
    const mountainHeightMap = new THREE.TextureLoader().load('./textures/desert-cliff1-height.png');
    
    // Set texture wrapping and repeat
    mountainTexture.wrapS = mountainTexture.wrapT = THREE.RepeatWrapping;
    mountainNormalMap.wrapS = mountainNormalMap.wrapT = THREE.RepeatWrapping;
    mountainAOMap.wrapS = mountainAOMap.wrapT = THREE.RepeatWrapping;
    mountainHeightMap.wrapS = mountainHeightMap.wrapT = THREE.RepeatWrapping;
    
    mountainTexture.repeat.set(1, 1);
    mountainNormalMap.repeat.set(1, 1);
    mountainAOMap.repeat.set(1, 1);
    mountainHeightMap.repeat.set(1, 1);
    
    const mountainMaterial = new THREE.MeshPhongMaterial({
        map: mountainTexture,
        normalMap: mountainNormalMap,
        aoMap: mountainAOMap,
        displacementMap: mountainHeightMap,
        displacementScale: 10,
        shininess: 10,
        flatShading: false
    });
    
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const mountainRadius = 800;
        const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial.clone());
        
        // Give each mountain a slightly different texture scale for variation
        const textureScale = Math.random() * 0.5 + 0.75;
        mountain.material.map.repeat.set(textureScale, textureScale);
        mountain.material.normalMap.repeat.set(textureScale, textureScale);
        mountain.material.aoMap.repeat.set(textureScale, textureScale);
        mountain.material.displacementMap.repeat.set(textureScale, textureScale);
        
        mountain.position.set(
            Math.cos(angle) * mountainRadius,
            0,
            Math.sin(angle) * mountainRadius
        );
        mountain.scale.set(
            Math.random() * 1.5 + 0.5,
            Math.random() + 0.5,
            Math.random() * 1.5 + 0.5
        );
        
        // Set up UV coordinates for proper texture mapping
        const uvAttribute = mountain.geometry.getAttribute('uv');
        if (uvAttribute) {
            mountain.geometry.setAttribute('uv2', uvAttribute.clone());
        }
        
        scene.add(mountain);
    }
}

// Initialize fuel tank models
export function initFuel(fuels_pos) {
    // Create better looking fuel tank
    const tankGeometry = new THREE.CylinderGeometry(2, 2, 4, 8);
    const tankMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff0000,
        shininess: 80,
        specular: 0xffffff
    });
    
    // Create first fuel tank
    tank1 = new THREE.Mesh(tankGeometry, tankMaterial);
    tank1.castShadow = true;
    tank1.receiveShadow = true;
    
    // Add a glowing effect to make fuel tanks more visible
    const glowGeometry = new THREE.SphereGeometry(3, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0.2
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    tank1.add(glow);
    
    // Set default position
    tank1.position.set(250, 2.5, 0);
    scene.add(tank1);
    
    // Update position if fuel_pos is properly defined
    if (fuels_pos && fuels_pos[0] && fuels_pos[0][0]) {
        tank1.position.set(fuels_pos[0][0].x, fuels_pos[0][0].y, fuels_pos[0][0].z);
    }
    
    // Create second fuel tank
    tank2 = new THREE.Mesh(tankGeometry, tankMaterial);
    tank2.castShadow = true;
    tank2.receiveShadow = true;
    
    const glow2 = new THREE.Mesh(glowGeometry, glowMaterial);
    tank2.add(glow2);
    
    // Set default position
    tank2.position.set(-250, 2.5, 0);
    scene.add(tank2);
    
    // Update position if fuel_pos is properly defined
    if (fuels_pos && fuels_pos[1] && fuels_pos[1][0]) {
        tank2.position.set(fuels_pos[1][0].x, fuels_pos[1][0].y, fuels_pos[1][0].z);
    }
    
    return [tank1, tank2];
}

// Render the scene with multiple viewports (main view and top-down minimap)
export function renderScene() {
    let insetHeight = window.innerHeight / 4;
    let insetWidth = window.innerWidth / 4;

    // Main viewport
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
    
    // Clear depth for the minimap
    renderer.clearDepth();
    
    // Minimap (top-down view)
    renderer.setScissorTest(true);
    renderer.setScissor(
        window.innerWidth - insetWidth - 16,
        window.innerHeight - insetHeight - 16,
        insetWidth,
        insetHeight
    );
    renderer.setViewport(
        window.innerWidth - insetWidth - 16,
        window.innerHeight - insetHeight - 16,
        insetWidth,
        insetHeight
    );
    renderer.render(scene, topview);
    renderer.setScissorTest(false);
}

// Update UI elements with current game stats
export function updateUI(data) {
    // Use our new UI controller to update all UI elements
    uiController.updateUI(data);

    // Game over handling
    if (!data.end && data.countdown == 0) {
        if (data.fuel > 0 && data.health > 0) {
            let time = data.getTime();

            if (time > data.timeCars[0]) {
                data.end = true;
                uiController.showGameOver({
                    ...data,
                    time
                });
            }
            
            if (data.checkpointsz[0] >= data.max_laps && data.checkpointsz[1] >= data.max_laps) {
                if (data.checkpointsx[0] >= data.max_laps && data.checkpointsx[1] >= data.max_laps) {
                    data.end = true;
                    uiController.showGameOver({
                        ...data,
                        time
                    });
                }
            }
        }
        else {
            data.end = true;
            uiController.showGameOver(data);
        }
    }
}

// Display countdown at start of race
export function showCountdown(countdown) {
    uiController.showCountdown(countdown);
}

// Helper to generate random numbers between min and max
export function randomGenerator(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}