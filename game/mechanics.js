import * as THREE from 'three';
import * as Graphics from './graphics.js';

// Game state
export let started = false;
export let end = false;
export let countdown = 3;

// Player state
export let camera_position1 = new THREE.Vector3();
export let cameraDirection = new THREE.Vector3();
export let mcqueenDirection = new THREE.Vector3();
export let carSpeed = 0;
export let maxSpeed = 3;
export let Speed = 0;
export let rotateSpeed = 0;

// Game statistics
export let health = 0;
export let score = 0;
export let distance_travelled = 0;
export let fuel = 0;
export let start_time;
export let checkpointz = 1; 
export let checkpointx = 1;
export let checkpointsz = [0, 0];
export let checkpointsx = [0, 0];
export let max_laps = 3;

// CPU car variables
export let currangle = [0, 0, 0, 0];
export let radius = [0, 0, 0, 0];
export let healthCars = [100, 100, 100, 100];
export let timeCars = [0, 0, 0, 0];
export let lasthit = [new Date(), new Date(), new Date(), new Date()];
export let indexradiuschange2 = [[255, 285], [255, 270], [270, 285], [285, 270]];
export let indexradiuschange1 = [[225, 270], [225, 240], [250, 225], [240, 225]]; 
export let indexradiuschange2d = 1;

// Fuel system
export let fuels_pos = [[], []];
export let fuelpoints = [0, 0];
export let lastfuel = [new Date(), new Date()];

// Input handling
export const keys = { w: false, s: false, a: false, d: false, c: true };

// Animation frame id for cancellation on restart
let animationFrameId;

// Reset game state for restart
export function resetGameState() {
    // Reset game flags
    started = false;
    end = false;
    countdown = 3;
    
    // Reset player state
    camera_position1 = new THREE.Vector3();
    cameraDirection = new THREE.Vector3();
    mcqueenDirection = new THREE.Vector3();
    carSpeed = 0;
    Speed = 0;
    rotateSpeed = 0;
    
    // Reset game statistics
    health = 0;
    score = 0;
    distance_travelled = 0;
    fuel = 0;
    checkpointz = 1;
    checkpointx = 1;
    checkpointsz = [0, 0];
    checkpointsx = [0, 0];
    
    // Reset CPU car variables
    currangle = [0, 0, 0, 0];
    radius = [0, 0, 0, 0];
    healthCars = [100, 100, 100, 100];
    timeCars = [0, 0, 0, 0];
    lasthit = [new Date(), new Date(), new Date(), new Date()];
    indexradiuschange2d = 1;
    
    // Reset fuel system
    fuels_pos = [[], []];
    fuelpoints = [0, 0];
    lastfuel = [new Date(), new Date()];
    
    // Reset input handling
    keys.w = false;
    keys.s = false;
    keys.a = false;
    keys.d = false;
    keys.c = true;
    
    // Cancel any existing animation frame
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = undefined;
    }
    
    // Clear event listeners
    window.removeEventListener('keydown', onDocumentKeyDown);
    window.removeEventListener('keyup', onDocumentKeyUp);
}

// Initialize game mechanics
export function initMechanics() {
    // Initialize car positions and parameters
    radius[0] = 225;
    radius[1] = 240;
    radius[2] = 255;
    radius[3] = 285;

    // Initialize car timings
    for (let i = 0; i < 4; i += 1)
        timeCars[i] = max_laps * (2 * Math.PI / (((i + 1) * Math.PI / 1260) * 60));

    // Player stats
    health = 100;
    fuel = 100;
    score = 0;
    distance_travelled = 0;

    // Setup fuel positions
    initFuelPositions();

    // Set camera initial position
    camera_position1 = new THREE.Vector3(
        Graphics.camera.position.x,
        Graphics.camera.position.y,
        Graphics.camera.position.z
    );

    // Add event listeners
    window.addEventListener('keydown', onDocumentKeyDown);
    window.addEventListener('keyup', onDocumentKeyUp);
    document.getElementById("start_button").addEventListener("click", start_game);
}

// Initialize fuel can positions
function initFuelPositions() {
    fuels_pos = [[], []]; // Clear existing positions
    
    let i = 0;
    for (let j = 0; j < max_laps; j += 1) {
        let z = Math.pow(-1, i) * Graphics.randomGenerator(215, 290);
        fuels_pos[i].push(new THREE.Vector3(0, 2.5, z));
    }
    
    i = 1;
    for (let j = 0; j < max_laps; j += 1) {
        let z = Math.pow(-1, i) * Graphics.randomGenerator(215, 290);
        fuels_pos[i].push(new THREE.Vector3(0, 2.5, z));
    }
}

// Time calculation functions
export function getTime() {
    let currtime = new Date;
    return (currtime - start_time) / 1000 - 3;
}

export function convert_min_sec() {
    let sec = getTime();
    return Math.floor(sec / 60).toString() + ":" + Math.floor(sec - 60 * Math.floor(sec / 60)).toString().padStart(2, '0');
}

// Calculate distance to next fuel can
export function nextfuelcan() {
    if (Graphics.mcqueen.position.x > 0 && fuelpoints[0] < max_laps)
        return Math.round(100 * Math.sqrt(Math.pow(Graphics.mcqueen.position.x - Graphics.tank1.position.x, 2) + Math.pow(Graphics.mcqueen.position.z - Graphics.tank1.position.z, 2))) / 100;
    else if (Graphics.mcqueen.position.x < 0 && fuelpoints[1] < max_laps)
        return Math.round(100 * Math.sqrt(Math.pow(Graphics.mcqueen.position.x - Graphics.tank2.position.x, 2) + Math.pow(Graphics.mcqueen.position.z - Graphics.tank2.position.z, 2))) / 100;
    return -1;
}

// Check if player collects fuel
export function checkCollectFuel(tank, index) {
    if (Date.now() < lastfuel[index])
        return -1;
    
    let dist = Math.sqrt(Math.pow(Graphics.mcqueen.position.x - tank.position.x, 2) + Math.pow(Graphics.mcqueen.position.z - tank.position.z, 2));
    if (dist < 5) {
        fuel = Math.min(100, fuel + 25);

        fuelpoints[index] += 1;
        if (fuelpoints[index] >= max_laps)
            Graphics.scene.remove(tank);
        else {
            let positioning = fuels_pos[index][fuelpoints[index]];
            tank.position.set(positioning.x, positioning.y, positioning.z);
        }

        lastfuel[index] = new Date();
        lastfuel[index].setSeconds(lastfuel[index].getSeconds() + 3);
    }

    return 0;
}

// Update fuel states
export function updateFuel() {
    checkCollectFuel(Graphics.tank1, 0);
    checkCollectFuel(Graphics.tank2, 1);
}

// Check collision between player car and CPU cars
export function checkCollision(car, index) {
    if (Date.now() < lasthit[index] || healthCars[index] < 10)
        return -1;
    
    let dist = Math.sqrt(Math.pow(Graphics.mcqueen.position.x - car.position.x, 2) + Math.pow(Graphics.mcqueen.position.z - car.position.z, 2));
    if (dist < 8) {
        healthCars[index] -= ((8 - dist) * 10 + 15);
        health -= ((8 - dist) * 10 + 10);

        score -= (100 - health);

        if (healthCars[index] < 10) {
            Graphics.scene.remove(car);
        }

        lasthit[index] = new Date();
        lasthit[index].setSeconds(lasthit[index].getSeconds() + 3);

        timeCars[index] += 3.5;
    }
    return 0;
}

// Handle CPU car movement
export function animateCars(car, index) {
    if (Date.now() < lasthit[index] || end || countdown != 0)
        return;

    currangle[index] += (index + 1) * Math.PI / 1260;

    car.position.x = radius[index] * Math.cos(currangle[index]);
    car.position.z = radius[index] * Math.sin(currangle[index]);
    car.rotateY(-((index + 1) * Math.PI / 1260));

    checkCollision(car, index);
}

// Check if game should end
function checkGameEnd(data) {
    if (data.end) return true; // Already flagged as ended
    
    // Check for out of fuel or health
    if (data.fuel <= 0 || data.health <= 0) {
        return true;
    }
    
    // Check if the player finished all laps
    if (data.checkpointsz[0] >= data.max_laps && 
        data.checkpointsz[1] >= data.max_laps && 
        data.checkpointsx[0] >= data.max_laps && 
        data.checkpointsx[1] >= data.max_laps) {
        return true;
    }
    
    // Check if time exceeded CPU car finish time (player came in last)
    if (data.getTime() > data.timeCars[0]) {
        return true;
    }
    
    return false;
}

// Main update function for game logic
export function update() {
    // Update countdown timer
    if (countdown > 0) {
        // Calculate remaining countdown time
        let newCountdown = Math.max(0, Math.ceil(3 - getTime()));
        
        // Only update UI if countdown value changed
        if (newCountdown !== countdown) {
            countdown = newCountdown;
            Graphics.showCountdown(countdown);
        }
        
        // Don't process game logic during countdown
        if (countdown > 0) {
            return;
        }
        
        // When countdown reaches 0, clear the countdown display once
        Graphics.showCountdown(0);
    }

    // Handle player input for acceleration and braking
    if (keys['w'] && keys['s']) {
        Speed = 0.01;
        carSpeed += 0.01;
        fuel -= 0.1;
    }
    else if (keys['w']) {
        Speed = 0.06;
        carSpeed += Speed;
        fuel -= 0.06;
    }
    else if (keys['s']) {
        Speed = -0.04;
        carSpeed += Speed;
        fuel -= 0.04;
    }
    if (!keys['w'] && !keys['s']) {
        if (carSpeed > 0.03)
            carSpeed -= 0.03;
        else if (carSpeed < -0.03)
            carSpeed += 0.03;
        else
            carSpeed = 0;
    }

    // Limit maximum speed
    if (carSpeed > maxSpeed) carSpeed = maxSpeed;
    if (-carSpeed > maxSpeed) carSpeed = -maxSpeed;

    // Handle player input for turning
    if (keys['a'])
        rotateSpeed = Math.PI / 225;
    if (keys['d'])
        rotateSpeed = -Math.PI / 225;
    if ((!keys['a'] && !keys['d']) || (keys['a'] && keys['d']))
        rotateSpeed = 0;

    // Update player car position and rotation
    let x = camera_position1.x;
    let y = camera_position1.y;
    let z = camera_position1.z;
    let rot = Graphics.camera.rotation.y;
    
    x += carSpeed * cameraDirection.x;
    y += carSpeed * cameraDirection.y;
    z += carSpeed * cameraDirection.z;
    
    if (carSpeed)
        rot += rotateSpeed;

    Graphics.mcqueen.getWorldDirection(mcqueenDirection);
    mcqueenDirection.multiplyScalar(20);
    mcqueenDirection.add(new THREE.Vector3(x, y, z));

    let dist = Math.sqrt(Math.pow(mcqueenDirection.x, 2) + Math.pow(mcqueenDirection.z, 2));

    // Update car and camera positions if within track boundaries and game is active
    if (dist < 295 && dist > 215 && (fuel > 0 && health > 0 && !end)) {
        Graphics.camera.position.x = keys['c'] ? x : mcqueenDirection.x;
        Graphics.camera.position.y = keys['c'] ? y : 7;
        Graphics.camera.position.z = keys['c'] ? z : mcqueenDirection.z;
        Graphics.camera.rotation.y = rot;

        camera_position1.x = x;
        camera_position1.y = y;
        camera_position1.z = z;

        Graphics.mcqueen.position.set(
            mcqueenDirection.x,
            0.1,
            mcqueenDirection.z
        );
        Graphics.mcqueen.rotation.y = rot + Math.PI;

        if (carSpeed > 0)
            score += carSpeed;

        distance_travelled += Math.abs(carSpeed);
    }

    // Update CPU car radius when they cross midpoint
    if (indexradiuschange2d * Graphics.car2.position.x < 0) {
        indexradiuschange2d = -indexradiuschange2d;
        let rand = Graphics.randomGenerator(0, 4);
        radius[0] = indexradiuschange1[rand][0];
        radius[1] = indexradiuschange1[rand][1];
        radius[2] = indexradiuschange2[rand][0];
        radius[3] = indexradiuschange2[rand][1];
    }

    // Track checkpoint crossing
    if (Graphics.mcqueen.position.z * checkpointz < 0) {
        checkpointz = -checkpointz;

        if (carSpeed > 0) {
            if (Graphics.mcqueen.position.z > 0)
                checkpointsz[0] += 1;
            else
                checkpointsz[1] += 1;
        }
    }
    else if (Graphics.mcqueen.position.x * checkpointx < 0) {
        checkpointx = -checkpointx;

        if (carSpeed > 0) {
            if (Graphics.mcqueen.position.x > 0)
                checkpointsx[0] += 1;
            else
                checkpointsx[1] += 1;
        }
    }

    // Update CPU cars - fixed to remove countdown check since we handle that above
    animateCars(Graphics.car1, 0);
    animateCars(Graphics.car2, 1);
    animateCars(Graphics.car3, 2);
    animateCars(Graphics.car4, 3);
    
    // Check for fuel collection
    updateFuel();

    // Create a game state object to pass to the UI update
    const gameState = {
        fuel,
        health,
        score,
        carSpeed,
        end,
        countdown,
        getTime,
        convert_min_sec,
        nextfuelcan,
        timeCars,
        max_laps,
        checkpointsz,
        checkpointsx,
        distance_travelled,
        time: getTime()
    };
    
    // Check if the game should end
    if (!end && countdown === 0 && checkGameEnd(gameState)) {
        end = true;
    }

    // Update UI with current game state
    Graphics.updateUI(gameState);
    
    // Update stats display
    Graphics.stats.update();
}

// Event handlers for keyboard input
function onDocumentKeyDown(event) {
    if (started) {
        Graphics.camera.getWorldDirection(cameraDirection);
        let keyCode = event.key;
        if (keyCode == 'w' || keyCode == 'W')
            keys['w'] = true;

        if (keyCode == 's' || keyCode == 'S')
            keys['s'] = true;


        if (keyCode == 'a' || keyCode == 'A')
            keys['a'] = true;
        if (keyCode == 'd' || keyCode == 'D')
            keys['d'] = true;

        if (keyCode == 'c' || keyCode == "C")
            keys['c'] = !keys['c'];
    }
}

function onDocumentKeyUp(event) {
    if (started) {
        let keyCode = event.key;
        if (keyCode == 'w' || keyCode == 'W') {
            Speed = 0;
            keys['w'] = false;
        }
        if (keyCode == 's' || keyCode == 'S') {
            Speed = 0;
            keys['s'] = false;
        }

        if (keyCode == 'a' || keyCode == 'A') {
            keys['a'] = false;
            rotateSpeed = 0;
        }
        if (keyCode == 'd' || keyCode == 'D') {
            keys['d'] = false;
            rotateSpeed = 0;
        }
    } else if (event.key == " " ||
        event.code == "Space" ||
        event.keyCode == 32
    )
        start_game();
}

// Start the game
export function start_game() {
    if (!started) {
        document.getElementById("start").style.display = "none";
        document.getElementById("game").style.display = "block";
        
        // Initialize the game
        initGame();

        started = true;
        end = false;
        start_time = new Date();
        
        // Start animation loop
        animate();
    }
}

// Main animation loop
function animate() {
    // Store the animation frame ID so we can cancel it on restart
    animationFrameId = requestAnimationFrame(animate);
    
    // Update game mechanics
    update();
    
    // Render the scene
    Graphics.renderScene();
}

// Initialize the game components
function initGame() {
    // Initialize graphics
    Graphics.initGraphics();
    
    // Initialize track
    Graphics.initTrack();
    
    // Initialize player car
    Graphics.initPlayerCar();
    
    // Initialize CPU cars
    Graphics.initCars(radius);
    
    // Initialize crowd models
    Graphics.initPeople();
    
    // Initialize environment
    Graphics.initEnvironment();
    
    // Initialize mechanics first to set up fuel positions
    initMechanics();
    
    // Initialize fuel cans after mechanics has set up the positions
    Graphics.initFuel(fuels_pos);
}