import React, { useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion';
import skyImage from "../assets/bubbles.png";
import axios from 'axios';
import { useUserContext } from '../context/userContext';

const BubblesGame = () => {
  const canvasRef = useRef(null);
  const scoreRef = useRef(null);
  const timerRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [preGameCountdown, setPreGameCountdown] = useState(3);
  const [tokensUpdated, setTokensUpdated] = useState(false);
  const { userData, setUserData } = useUserContext();

  const handleTokenUpdate = async (score) => {
    const tokenCount = Math.floor(score / 100);
    try {
      const response = await axios.post('http://localhost:3000/games/tokens', {
        userID: userData.userID,
        tokens: tokenCount
      });
      const newCount = userData.token + tokenCount;
      setUserData({ ...userData, token: newCount });
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  useEffect(() => {
    if (preGameCountdown > 0 && gameStarted) {
      const countdownTimer = setInterval(() => {
        setPreGameCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdownTimer);
    }
  }, [preGameCountdown, gameStarted]);

  const handleStartGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setPreGameCountdown(3);
    setTokensUpdated(false);
  };

  useEffect(() => {
    if (!gameStarted) return;
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    class Scene {
      constructor() {
        this.animation = undefined;
        this.canvas = undefined;
        this.height = 0;
        this.width = 0;
        this.context = undefined;
        this.paused = false;
      }

      setup(canvas, animation) {
        this.canvas = canvas;
        this.animation = animation;
        this.context = this.canvas.getContext("2d");
        resizeCanvas();
        this.width = this.canvas.width;
        this.height = this.canvas.height;
      }

      animate() {
        if (!this.paused) {
          requestAnimationFrame(this.animate.bind(this));
        }
        this.animation(this);
      }
    }

    class Particle {
      constructor() {
        this.x = 0;
        this.y = 0;
        this.size = 0;
        this.color = "#fff";
        this.vx = 0;
        this.vy = 0;
        this.destroy = false;
        this.gravity = 0;
        this.wind = 0;
        this.hp = 0;
        this.value = 0;
      }

      update() {
        this.vy += this.gravity;
        this.vx += this.wind;
        this.x += this.vx;
        this.y += this.vy;
        if (this.onafterupdate) this.onafterupdate.call(this);
      }

      draw(ctx) {
        // Draw the bubble
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2, false);
        ctx.fill();

        // Add shine effect
        const gradient = ctx.createRadialGradient(
          this.x - this.size / 4,
          this.y - this.size / 4,
          this.size / 20,
          this.x,
          this.y,
          this.size / 2
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2, false);
        ctx.fill();
      }

      checkCollisionWithBubble(bubble) {
        const dx = this.x - bubble.x;
        const dy = this.y - bubble.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.size / 2 + bubble.size / 2;
      }
    }


    class Emitter {
      constructor() {
        this.particles = [];
      }

      create(properties) {
        const particle = new Particle();
        Object.assign(particle, properties);
        this.particles.push(particle);
      }

      update(ctx, width, height) {
        this.particles = this.particles.filter((particle) => !particle.destroy);
        this.particles.forEach((particle) => {
          particle.draw(ctx);
          particle.update();

          if (!this.inView(particle, width, height)) {
            particle.onviewexit && particle.onviewexit.call(particle);
          }

          if (particle.type === "bullet") {
            this.particles.forEach((bubble) => {
              if (bubble.type === "bubble" && particle.checkCollisionWithBubble(bubble)) {
                bubble.oncollision && bubble.oncollision.call(bubble);
                particle.destroy = true;
              }
            });
          }
        });
      }

      inView(particle, width, height) {
        const hs = particle.size / 2;
        return (
          particle.x - hs < width &&
          particle.x + hs > 0 &&
          particle.y + hs > 0 &&
          particle.y - hs < height
        );
      }
    }

    const bubbleTypes = [
      {
        name: "Bubble",
        color: "#3d6aa3",
        minValue: 10,
        maxValue: 40,
        rarity: 1,
      },
      {
        name: "Power Bubble",
        color: "#3d68ff",
        minValue: 20,
        maxValue: 70,
        rarity: 0.35,
      },
      {
        name: "Bad Bubble",
        color: "#f00",
        minValue: -10,
        maxValue: -20,
        rarity: 0.2,
      },
      {
        name: "Golden Bubble",
        color: "rgb(255, 255, 0)",
        minValue: 50,
        maxValue: 200,
        rarity: 0.1,
      },
    ];

    const canvas = canvasRef.current;
    const scoreboard = scoreRef.current;
    const timer = timerRef.current;
    const scene = new Scene();
    const emitter = new Emitter();

    let gx = 30;
    let gy = canvas.height * 2.8;
    let score = 0;
    let time = 33;
    let angle = 0;
    let firespeed = 0;
    let maxspeed = 13;

    const initializeScene = () => {
      scene.setup(canvas, run);
      scene.animate();
    };

    const run = (scene) => {
      const ctx = scene.context;
      ctx.clearRect(0, 0, scene.width, scene.height);
      emitter.update(ctx, scene.width, scene.height);
      ctx.fillStyle = "#fff";
      ctx.fillRect(gx - 10, gy - 10, 20, 20);

      const endX = gx + firespeed * 5 * Math.cos((angle * Math.PI) / 180);
      const endY = gy + firespeed * 5 * Math.sin((angle * Math.PI) / 180);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      scoreboard.textContent = score;
    };

    const spawnBubbles = () => {
      setInterval(() => {
        const type = bubbleTypes[Math.floor(Math.random() * bubbleTypes.length)];
        emitter.create({
          x: Math.random() * canvas.width + 100,
          y: canvas.height,
          size: Math.random() * 10 + 40,
          vx: 0,
          vy: -0.5,
          hp: 100,
          value: Math.floor(Math.random() * (type.maxValue - type.minValue + 1)) + type.minValue,
          gravity: -0.001,
          wind: 0,
          color: type.color,
          type: "bubble",
          onviewexit: function () {
            this.destroy = true;
          },
          oncollision: function () {
            score += 10;
            setScore((prevScore) => prevScore + 10);
            this.destroy = true;
          },
        });
      }, 1000);
    };

    const level = () => {
      if (!scene.paused) {
        timer.textContent = time;
        time--;
        if (time < 0) {
          scene.paused = true;
          setGameOver(true);
          if(!tokensUpdated) {
            handleTokenUpdate(score);
            setTokensUpdated(true);
          }
        } else {
          setTimeout(level, 1000);
        }
      }
    };

    spawnBubbles();
    level();

    canvas.onmousemove = (event) => {
      const deltaY = event.clientY - gy;
      const deltaX = event.clientX - gx;
      angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI + 360;
      firespeed = Math.min(maxspeed, Math.sqrt(deltaX ** 2 + deltaY ** 2) / 10);
    };

    canvas.onclick = () => {
      emitter.create({
        x: gx,
        y: gy,
        vx: Math.cos((angle * Math.PI) / 180) * firespeed,
        vy: Math.sin((angle * Math.PI) / 180) * firespeed,
        color: "#fff",
        size: 10,
        gravity: 0.09,
        type: "bullet",
        onviewexit: function () {
          this.destroy = true;
        },
      });
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    initializeScene();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [gameStarted]);

  const handlePlayAgain = () => {
    setGameOver(false);
    setGameStarted(false);
  };

  return (
    <div className="w-full h-full relative">
      {!gameStarted ? (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div
            className="relative p-8 rounded-lg shadow-lg bg-gray-400"
            style={{
              width: '60%',
              height: '60%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <h2 className="font-DirtyHeadline mb-2" style={{ fontSize: '1.8em' }}>Bubble Boom</h2>
            <div
              className="relative"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div className="flex flex-row">
                <h2 className="font-PoppinsBold text-m mt-2 mb-2 mr-2">Get ready to test your aim! You have 30 seconds to pop as many bubbles as you can. Earn a token for every 100 points! Use your cursor to aim and shoot. Let's see how many bubbles you can blast!</h2>
              </div>

              <motion.button
                whileTap={{ scale: 0.85 }}
                className="w-3/4 p-2 mt-2 text-center rounded font-PoppinsBold cursor-pointer"
                style={{
                  backgroundImage: 'linear-gradient(to right, #1479ec, #1727bd)',
                  color: 'white',
                  textAlign: 'center',
                  fontSize: '1em',
                  transition: 'background-color 0.1s ease',
                  boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
                }}
                onClick={handleStartGame}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #075ab9, #0a1685)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #1479ec, #1727bd)')}
              >
                Start Game
              </motion.button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 cursor-crosshair"
            style={{
              backgroundImage: `url(${skyImage})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div ref={scoreRef} className="font-PoppinsBold absolute top-5 left-5 text-white text-xl z-50">
            0
          </div>
          <div ref={timerRef} className="font-PoppinsBold absolute top-5 right-5 text-white text-xl z-50">
            30
          </div>
          {preGameCountdown > 0 && gameStarted && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
              <h1
                className="text-white font-bold"
                style={{ fontSize: '2.5em', fontFamily: 'PoppinsBold' }}
              >
                Starting in {preGameCountdown}...
              </h1>
            </div>
          )}
          {gameOver && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
              <div
                className="relative p-6 rounded-lg shadow-lg bg-gray-400"
                style={{
                  width: '50%',
                  height: '50%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 1)",
                }}
              >
                <h2 className="font-DirtyHeadline mb-2" style={{ fontSize: '1.8em' }}>Time's Up!</h2>
                <div
                  className="relative"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <div className="flex flex-row">
                    <h2 className="font-PoppinsBold text-xl mb-2 mr-2">Your Score:</h2>
                    <h2 className="font-Poppins text-xl mb-2">{score}</h2>
                  </div>

                  <div className="flex flex-row">
                    <h2 className="font-PoppinsBold text-xl mb-2 mr-2">Tokens Earned:</h2>
                    <h2 className="font-Poppins text-xl mb-3">{Math.floor(score / 100)}</h2>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    className="w-full p-2 mt-2 text-center rounded font-PoppinsBold cursor-pointer"
                    style={{
                      backgroundImage: 'linear-gradient(to right, #1479ec, #1727bd)',
                      color: 'white',
                      textAlign: 'center',
                      fontSize: '1em',
                      transition: 'background-color 0.1s ease',
                      boxShadow: '4px 4px 8px rgba(0, 0, 0, 0.5)',
                    }}
                    type="submit"
                    onClick={handlePlayAgain}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #075ab9, #0a1685)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #1479ec, #1727bd)')}
                  >
                    Play Again
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BubblesGame;
