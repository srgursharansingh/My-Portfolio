import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './style.scss';

gsap.registerPlugin(ScrollTrigger);

const lines = [
  { text: 'DESIGN', white: true },
  { text: 'IS NOT JUST', white: false },
  { text: 'DECORATION, BUT', white: false },
  { text: 'A TOOL FOR INFLUENCE', white: true },
  { text: 'AND GROWTH.', white: true },
];

const PhysicsText = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const runnerRef = useRef(null);
  const canvasRef = useRef(null);

  const allBodiesRef = useRef([]);
  const initialPositionsRef = useRef([]);
  const animTargetsRef = useRef([]);
  const isAnimatingRef = useRef(false);
  const rafIdRef = useRef(null);

  async function waitForStableLayout() {
    if (document.readyState !== 'complete') {
      await new Promise((r) =>
        window.addEventListener('load', r, { once: true })
      );
    }
    if (document.fonts?.ready) {
      await document.fonts.ready;
    } else if (document.fonts?.load) {
      try {
        await document.fonts.load('900 100px "Sofia Sans Condensed"');
      } catch {}
    }
    await new Promise((r) => requestAnimationFrame(() => r()));
  }

  useEffect(() => {
    let cleanupFn = null;
    let destroyed = false;

    const init = async () => {
      await waitForStableLayout();
      if (destroyed) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const BASE_WIDTH = 1920;
      const scale = width / BASE_WIDTH;

      const BASE_FONT_SIZE = width > 1100 ? 170 : 230;
      const BASE_CHAR_HEIGHT = width > 1100 ? 150 : 250;
      const BASE_LINE_SPACING = width > 1100 ? 140 : 200;
      const BASE_X_OFFSET = width > 1100 ? 580 : 60;
      const BASE_CHAR_SPACING = -80;

      const FONT_SIZE = BASE_FONT_SIZE * scale;
      const CHAR_HEIGHT = BASE_CHAR_HEIGHT * scale;
      const LINE_SPACING = BASE_LINE_SPACING * scale;
      const CHAR_SPACING = BASE_CHAR_SPACING * scale;

      let totalTextHeight = LINE_SPACING * lines.length;
      let verticalScale =
        totalTextHeight > height ? height / totalTextHeight : 1;

      const adjustedFontSize = FONT_SIZE * verticalScale;
      const adjustedCharHeight = CHAR_HEIGHT * verticalScale;
      const adjustedLineSpacing = LINE_SPACING * verticalScale;
      const adjustedCharSpacing = CHAR_SPACING * verticalScale;
      const X_OFFSET_START = BASE_X_OFFSET * scale;

      let TOP_PADDING = 150;
      if (width > 1300) TOP_PADDING = 250;
      else if (width > 1100) TOP_PADDING = 150;
      else if (width > 768) TOP_PADDING = 100;
      const offsetY = TOP_PADDING * verticalScale;

      const STRENGTH_POWER = width > 768 ? 0.4 : 0.05;

      try {
        if (document.fonts?.load) {
          await document.fonts.load(
            `900 ${Math.max(60, adjustedFontSize)}px "Sofia Sans Condensed"`
          );
        }
      } catch {}

      if (!canvasRef.current)
        canvasRef.current = document.createElement('canvas');
      const measureCtx = canvasRef.current.getContext('2d');
      measureCtx.font = `900 ${adjustedFontSize}px "Sofia Sans Condensed", sans-serif`;
      measureCtx.textAlign = 'left';
      measureCtx.textBaseline = 'alphabetic';

      const { Engine, Render, World, Bodies, Events, Runner, Body } = Matter;

      const engine = Engine.create({
        positionIterations: 8,
        velocityIterations: 6,
      });
      engineRef.current = engine;

      const render = Render.create({
        element: sceneRef.current,
        engine,
        options: {
          width,
          height,
          pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
          wireframes: false,
          background: '#101010',
        },
      });
      renderRef.current = render;

      engine.gravity.y = 3;

      // Ğ³Ñ€Ğ°Ğ½Ğ¸Ñ†Ñ‹
      const FLOOR_H = Math.max(16, 0.12 * adjustedCharHeight);
      const floorY = height + FLOOR_H / 2;
      const floor = Bodies.rectangle(width / 2, floorY, width * 2, FLOOR_H, {
        isStatic: true,
        restitution: 0,
        friction: 1,
        frictionStatic: 1,
        render: { visible: false },
      });

      const wallW = 40;
      const leftWall = Bodies.rectangle(
        -wallW / 2,
        height / 2,
        wallW,
        height * 2,
        {
          isStatic: true,
          render: { visible: false },
        }
      );
      const rightWall = Bodies.rectangle(
        width + wallW / 2,
        height / 2,
        wallW,
        height * 2,
        {
          isStatic: true,
          render: { visible: false },
        }
      );

      World.add(engine.world, [floor, leftWall, rightWall]);

      let yOffset = offsetY;
      const allBodies = [];
      const initialPositions = [];
      const animTargets = [];

      const advance = (text, i) =>
        measureCtx.measureText(text.slice(0, i)).width;
      const tracking = adjustedCharSpacing * 0.1;

      lines.forEach((line) => {
        const text = line.text;
        const chars = [...text];
        const lineStartX = X_OFFSET_START;

        chars.forEach((char, i) => {
          const wPrev = advance(text, i);
          const wNext = advance(text, i + 1);
          const charWidth = Math.max(1, wNext - wPrev + tracking);

          const cx = lineStartX + wPrev + tracking * i + charWidth / 2;

          const body = Bodies.rectangle(
            cx,
            yOffset,
            charWidth,
            adjustedCharHeight,
            {
              restitution: 0.1,
              friction: 0.01,
              frictionAir: 0.01,
              density: 0.0005,
              render: { fillStyle: 'transparent', strokeStyle: 'transparent' },
            }
          );

          body.customChar = char;
          body.customColor = line.white ? '#ffffff' : '#a9a9a9';
          Body.setStatic(body, true);

          World.add(engine.world, body);
          allBodies.push(body);
          const initPos = { x: body.position.x, y: body.position.y };
          initialPositions.push(initPos);
          animTargets.push({ ...initPos });
        });

        yOffset += adjustedLineSpacing;
      });

      allBodiesRef.current = allBodies;
      initialPositionsRef.current = initialPositions;
      animTargetsRef.current = animTargets;

      const afterRender = () => {
        const ctx = render.context;
        allBodiesRef.current.forEach((body) => {
          const { position, angle, customChar, customColor } = body;
          ctx.save();
          ctx.translate(position.x, position.y);
          ctx.rotate(angle);
          ctx.fillStyle = customColor;
          ctx.font = `900 ${adjustedFontSize}px "Sofia Sans Condensed", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(customChar, 0, 0);
          ctx.restore();
        });
      };
      Events.on(render, 'afterRender', afterRender);

      const cancelRaf = () => {
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      };
      const lerp = (a, b, t) => a + (b - a) * t;

      const reassembleToTargets = () => {
        cancelRaf();
        isAnimatingRef.current = true;

        allBodiesRef.current.forEach((b) => {
          Matter.Body.setStatic(b, true);
          Matter.Body.setVelocity(b, { x: 0, y: 0 });
          Matter.Body.setAngularVelocity(b, 0);
        });

        const step = () => {
          let allClose = true;

          allBodiesRef.current.forEach((body, i) => {
            const target = animTargetsRef.current[i];
            const nx = lerp(body.position.x, target.x, 0.18);
            const ny = lerp(body.position.y, target.y, 0.18);
            const na = lerp(body.angle, 0, 0.18);

            Matter.Body.setPosition(body, { x: nx, y: ny });
            Matter.Body.setAngle(body, na);
            Matter.Body.setVelocity(body, { x: 0, y: 0 });
            Matter.Body.setAngularVelocity(body, 0);

            if (
              Math.abs(nx - target.x) > 0.3 ||
              Math.abs(ny - target.y) > 0.3 ||
              Math.abs(na) > 0.005
            ) {
              allClose = false;
            }
          });

          if (!allClose) {
            rafIdRef.current = requestAnimationFrame(step);
          } else {
            allBodiesRef.current.forEach((b, i) => {
              Matter.Body.setPosition(b, initialPositionsRef.current[i]);
              Matter.Body.setAngle(b, 0);
              Matter.Body.setVelocity(b, { x: 0, y: 0 });
              Matter.Body.setAngularVelocity(b, 0);
            });
            isAnimatingRef.current = false;
            rafIdRef.current = null;
          }
        };

        step();
      };

      const handleMouseMove = (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        allBodiesRef.current.forEach((body) => {
          if (body.isStatic) return;
          const dx = body.position.x - mouseX;
          const dy = body.position.y - mouseY;
          const d2 = dx * dx + dy * dy;
          if (d2 < 120 * 120) {
            const d = Math.sqrt(d2) || 1;
            const strength = STRENGTH_POWER * (1 - d / 400);
            Matter.Body.applyForce(body, body.position, {
              x: (dx / d) * strength,
              y: (dy / d) * strength,
            });
          }
        });
      };

      const runner = Runner.create();
      runnerRef.current = runner;
      Runner.run(runner, engine);
      Render.run(render);

      const stBreak = ScrollTrigger.create({
        trigger: '.about-first__wrapper',
        start: 'top -50%',
        end: 'top -200%',
        toggleActions: 'play reverse play reverse',
        scroller: window.innerWidth < 1100 ? '.scroll-container' : null,
        onEnter: () => {
          cancelRaf();
          isAnimatingRef.current = false;

          allBodiesRef.current.forEach((body, i) => {
            Matter.Body.setStatic(body, true);
            Matter.Body.setPosition(body, initialPositionsRef.current[i]);
            Matter.Body.setAngle(body, 0);
            Matter.Body.setVelocity(body, { x: 0, y: 0 });
            Matter.Body.setAngularVelocity(body, 0);
          });

          setTimeout(() => {
            allBodiesRef.current.forEach((body) => {
              Matter.Body.setStatic(body, false);
              const fx = (Math.random() - 0.5) * 0.02;
              const fy = Math.random() * 0.003;
              Matter.Body.applyForce(body, body.position, { x: fx, y: fy });
            });
          }, 40);

          window.addEventListener('mousemove', handleMouseMove);
        },
        onLeaveBack: () => {
          animTargetsRef.current = initialPositionsRef.current.map((p) => ({
            ...p,
          }));
          reassembleToTargets();
          window.removeEventListener('mousemove', handleMouseMove);
        },
      });

      const bgTween = gsap.to('.canvas-text__bg', {
        y: 0,
        scrollTrigger: {
          trigger: '.about-first__wrapper',
          start: 'top -150%',
          end: 'top -250%',
          scrub: true,
          scroller: window.innerWidth < 1100 ? '.scroll-container' : null,
        },
      });

      ScrollTrigger.refresh(true);

      const cleanup = () => {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        try {
          Events.off(render, 'afterRender', afterRender);
        } catch {}
        try {
          Render.stop(render);
        } catch {}
        if (render?.canvas && render.canvas.parentNode) {
          render.canvas.parentNode.removeChild(render.canvas);
        }
        try {
          World.clear(engine.world, false);
        } catch {}
        try {
          Matter.Engine.clear(engine);
        } catch {}
        if (runnerRef.current) {
          try {
            Runner.stop(runnerRef.current);
          } catch {}
          runnerRef.current = null;
        }
        try {
          stBreak.kill();
        } catch {}
        try {
          bgTween.kill();
        } catch {}
        window.removeEventListener('mousemove', handleMouseMove);
      };

      cleanupFn = cleanup;
    };

    init();

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (cleanupFn) cleanupFn();
        init();
      }, 120);
    };
    window.addEventListener('resize', onResize);

    const lateRefresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', lateRefresh, { once: true });

    return () => {
      destroyed = true;
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', lateRefresh);
      if (cleanupFn) cleanupFn();
    };
  }, []);

  return (
    <div
      className='canvas-text'
      ref={sceneRef}
      style={{ opacity: 1 }}>
      <div className='canvas-text__bg' />
    </div>
  );
};

export default PhysicsText;
