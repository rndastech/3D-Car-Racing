# 3D Racing Game

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![WebGL](https://img.shields.io/badge/WebGL-990000?style=for-the-badge&logo=webgl&logoColor=white)](https://www.khronos.org/webgl/)

![Game Preview](https://github.com/rndastech/3D-Car-Racing/blob/main/WhatsApp%20Image%202025-04-30%20at%204.54.45%20PM.jpeg?raw=true)

## 📖 Overview

3D Racing Game is an immersive 3D car racing game developed using JavaScript and Three.js as part of a Computer Graphics project. Race against CPU-controlled opponents, manage your fuel consumption, and aim for the best lap times while avoiding collisions.

## ✨ Features

- **3D Rendered Environment**: Beautifully designed race track with desert terrain, mountains, trees, and dynamic clouds
- **Realistic Car Physics**: Acceleration, deceleration, and turning mechanics with speed limitations
- **Multiple Camera Views**: First-person and third-person camera perspectives (toggle with 'C' key)
- **CPU Opponents**: Race against four AI-controlled cars with different speeds and paths
- **Fuel Management System**: Collect fuel cans around the track to maintain your vehicle's fuel level
- **Health System**: Avoid collisions to maintain your car's health
- **Dynamic Lighting**: Realistic lighting with shadows for immersive gameplay
- **Interactive UI**: Real-time speedometer, fuel gauge, health indicator, and race statistics
- **Minimap**: Top-down view for strategic racing
- **Crowd Animation**: Spectators around the track to enhance the racing atmosphere

## 🎮 Controls

- **W**: Accelerate
- **S**: Brake/Reverse
- **A**: Turn Left
- **D**: Turn Right
- **C**: Toggle Between First-Person and Third-Person Camera Views
- **Space**: Start Game (from start screen)

## 🚀 Getting Started

### Prerequisites

- Modern web browser with WebGL support
- Docker (optional, for containerized deployment)

### Installation

1. Clone this repository:
   ```
   git clone <repository-url>
   cd CGV_project-Car_racing_Game
   ```

2. Using Docker (recommended):
   ```
   cd Computer-Graphics/A2
   docker-compose up
   ```

3. Without Docker:
   - Navigate to the `Computer-Graphics/A2/game` directory
   - Install dependencies:
     ```
     npm install
     ```
   - Start a local server and open the game in your browser

## 🏁 Gameplay

1. **Start**: Press the start button or space bar to begin the race
2. **Countdown**: The race begins after a 6-second countdown
3. **Racing**: Navigate the track, collecting fuel cans and avoiding collisions with other cars
4. **Checkpoints**: Complete 3 laps by crossing all checkpoints to finish the race
5. **Game Over**: The game ends when you run out of fuel, your car is destroyed, or you complete the race

## 🛠️ Technical Architecture

The game is built with a modular architecture:

- **game.js**: Main entry point that initializes the game and handles user interactions
- **graphics.js**: Manages 3D rendering, scene setup, models, lighting, and camera views
- **mechanics.js**: Controls game physics, collision detection, car movement, and game state
- **ui.js**: Handles all user interface elements and game state visualization

## 🎨 Visual Effects

- Dynamic lighting with realistic shadows
- Reflective car materials
- Particle effects for collisions
- Environmental elements (clouds, trees, mountains)
- Skybox for realistic sky rendering
- Minimap for strategic navigation


## 📝 License

This project was developed for educational purposes. All 3D models used are credited to their respective creators.

## 🙏 Acknowledgements

- Three.js community for the powerful 3D rendering library
- Model creators for the 3D assets used in the game

---

*This game was developed as part of a Computer Graphics Visualization project.*
