// UI Controller for Racing Pro 3D
export class UIController {
    constructor() {
        // Speedometer elements
        this.speedValue = document.getElementById('speed');
        this.speedGaugeFill = document.getElementById('speedo-gauge-fill');
        
        // Fuel elements
        this.fuelBar = document.getElementById('fuel-bar');
        this.fuelText = document.getElementById('fuel');
        
        // Score and health elements
        this.scoreValue = document.getElementById('score');
        this.healthValue = document.getElementById('health');
        
        // Info elements
        this.timeText = document.getElementById('time');
        this.mileageText = document.getElementById('mileage');
        this.nextText = document.getElementById('next');
    }
    
    // Update speedometer with current speed
    updateSpeed(speed) {
        const speedValue = Math.trunc(speed * 100);
        const maxSpeed = 300;
        const percentage = Math.min(Math.max(speedValue / maxSpeed, 0), 1);
        
        // Update gauge fill width based on speed percentage
        this.speedGaugeFill.style.width = `${percentage * 100}%`;
        
        // Update speed value text
        this.speedValue.textContent = speedValue.toString();
    }
    
    // Update fuel bar with current fuel percentage
    updateFuel(fuel) {
        const fuelPercentage = Math.ceil(Math.max(0, fuel));
        this.fuelBar.style.width = `${fuelPercentage}%`;
        this.fuelText.textContent = `${fuelPercentage}`;
        
        // Change color based on fuel level
        if (fuelPercentage < 20) {
            this.fuelBar.style.background = 'linear-gradient(90deg, #ff0000, #ff3300)';
        } else if (fuelPercentage < 50) {
            this.fuelBar.style.background = 'linear-gradient(90deg, #ff3300, #ff9900)';
        } else {
            this.fuelBar.style.background = 'linear-gradient(90deg, #ff3c00, #ffb700)';
        }
    }
    
    // Update score display
    updateScore(score) {
        this.scoreValue.textContent = Math.ceil(score).toString();
    }
    
    // Update health display
    updateHealth(health) {
        this.healthValue.textContent = Math.ceil(Math.max(0, health)).toString();
    }
    
    // Update time display
    updateTime(timeString) {
        this.timeText.textContent = timeString;
    }
    
    // Update mileage display
    updateMileage(mileage) {
        this.mileageText.textContent = `Mileage: ${(Math.round(mileage * 100) / 100).toString()}`;
    }
    
    // Update next checkpoint/fuel info
    updateNextCheckpoint(next) {
        if (next !== -1) {
            this.nextText.textContent = `Next Fuel Can: ${next}`;
        } else {
            this.nextText.textContent = `Next Fuel Can: XX`;
        }
    }
    
    // Update all UI elements with current game data
    updateUI(data) {
        if (data.fuel > 0 && data.health > 0 && !data.end && data.countdown === 0) {
            // Update all UI components
            this.updateSpeed(data.carSpeed);
            this.updateFuel(data.fuel);
            this.updateScore(data.score);
            this.updateHealth(data.health);
            this.updateTime(data.convert_min_sec());
            
            // Calculate mileage
            let mileage = 0;
            if (data.fuel < 100) {
                mileage = data.distance_travelled / (100 - data.fuel);
            }
            this.updateMileage(mileage);
            
            // Update fuel can distance
            this.updateNextCheckpoint(data.nextfuelcan());
        } else {
            // If game is over or not active, show zero speed
            this.updateSpeed(0);
        }
    }
    
    // Show countdown at start of race
    showCountdown(countdown) {
        const endElement = document.getElementById('end');
        
        if (countdown > 0) {
            endElement.innerHTML = `<h1>${countdown}</h1>`;
            endElement.style.display = "flex";
        } else {
            endElement.innerHTML = "";
            endElement.style.display = "none";
            
            // Clear any background styling
            endElement.style.background = "none";
            endElement.style.backdropFilter = "none";
        }
    }
    
    // Show game over screen
    showGameOver(data) {
        const endElement = document.getElementById('end');
        const gameElement = document.getElementById('game');
        let message = "";
        
        // Style end screen
        endElement.style.background = "rgba(0, 0, 0, 0.85)";
        endElement.style.backdropFilter = "blur(5px)";
        endElement.style.color = "white";
        endElement.style.display = "flex";
        endElement.style.flexDirection = "column";
        endElement.style.justifyContent = "center";
        endElement.style.alignItems = "center";
        endElement.style.position = "fixed";
        endElement.style.top = "0";
        endElement.style.left = "0";
        endElement.style.width = "100%";
        endElement.style.height = "100%";
        endElement.style.zIndex = "1000";
        
        // Determine rank and reason for game over
        if (data.fuel <= 0) {
            message = "<h1 style='color: #ff3300; font-size: 3rem; margin-bottom: 10px;'>GAME OVER!</h1>";
            message += "<h2 style='color: #ff9900; font-size: 2rem; margin-bottom: 20px;'>OUT OF FUEL</h2>";
            message += "<h3 style='color: #ffb700; font-size: 1.5rem; margin-bottom: 10px;'>RANK: LAST</h3>";
        } else if (data.health <= 0) {
            message = "<h1 style='color: #ff3300; font-size: 3rem; margin-bottom: 10px;'>GAME OVER!</h1>";
            message += "<h2 style='color: #ff9900; font-size: 2rem; margin-bottom: 20px;'>CAR DESTROYED</h2>";
            message += "<h3 style='color: #ffb700; font-size: 1.5rem; margin-bottom: 10px;'>RANK: LAST</h3>";
        } else {
            let rank = 4;
            if (data.time < data.timeCars[3]) rank = 1;
            else if (data.time < data.timeCars[2]) rank = 2;
            else if (data.time < data.timeCars[1]) rank = 3;
            
            const rankColors = ['#ffcc00', '#cccccc', '#cd7f32', '#ffffff'];
            const rankColor = rankColors[Math.min(rank - 1, 3)];
            
            message = `<h1 style='color: #00cc00; font-size: 3.5rem; margin-bottom: 15px; text-shadow: 0 0 10px rgba(0,255,0,0.7); font-family: "Orbitron", sans-serif; letter-spacing: 2px; text-transform: uppercase; animation: pulse 1.5s infinite alternate;'>RACE COMPLETE!</h1>
            <style>
                @keyframes pulse {
                    from { transform: scale(1); text-shadow: 0 0 10px rgba(0,255,0,0.7); }
                    to { transform: scale(1.05); text-shadow: 0 0 20px rgba(0,255,0,0.9), 0 0 30px rgba(0,255,0,0.5); }
                }
            </style>`;
            message += `<h2 style='color: ${rankColor}; font-size: 2rem; margin-bottom: 20px;'>RANK: ${rank}</h2>`;
            message += `<div style='background: rgba(0,0,0,0.5); padding: 20px; border-radius: 10px; margin-bottom: 20px;'>`;
            message += `<h3 style='color: white; margin-bottom: 10px;'>TIME: ${data.convert_min_sec()}</h3>`;
            message += `<h3 style='color: white; margin-bottom: 10px;'>SCORE: ${Math.ceil(data.score)}</h3>`;
            message += `<h3 style='color: white; margin-bottom: 0;'>HEALTH: ${Math.ceil(Math.max(0, data.health))}</h3>`;
            message += `</div>`;
        }
        
        // Add restart button to message with better styling
        message += `<button id="restart-button" style="
            background: linear-gradient(to bottom, #ff6600, #ff3300);
            color: white;
            font-size: 1.5rem;
            padding: 15px 40px;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            margin-top: 20px;
        ">RESTART RACE</button>`;
        
        // Hide game UI
        gameElement.style.display = "none";
        
        // Display end screen with message
        endElement.innerHTML = message;
        
        // Add event listener to restart button with hover effect
        setTimeout(() => {
            const restartButton = document.getElementById('restart-button');
            if (restartButton) {
                restartButton.addEventListener('mouseover', function() {
                    this.style.transform = 'scale(1.05)';
                    this.style.background = 'linear-gradient(to bottom, #ff7700, #ff4400)';
                });
                
                restartButton.addEventListener('mouseout', function() {
                    this.style.transform = 'scale(1)';
                    this.style.background = 'linear-gradient(to bottom, #ff6600, #ff3300)';
                });
                
                restartButton.addEventListener('click', () => {
                    // Use custom restart function instead of page reload
                    this.restartGame();
                });
            }
        }, 100);
    }
    
    // Restart the game without reloading the page
    restartGame() {
        // Get references to the necessary elements
        const startElement = document.getElementById('start');
        const gameElement = document.getElementById('game');
        const endElement = document.getElementById('end');
        
        // Hide end screen and game UI, show start screen
        endElement.style.display = "none";
        gameElement.style.display = "none";
        startElement.style.display = "flex";
        
        // Clear any existing event listeners on start button by cloning and replacing
        const startButton = document.getElementById('start_button');
        const newStartButton = startButton.cloneNode(true);
        startButton.parentNode.replaceChild(newStartButton, startButton);
        
        // Re-initialize the game by adding the event listener back
        // The actual reset of game state will happen in the start_game function
        const event = new CustomEvent('game:restart');
        document.dispatchEvent(event);
    }
}