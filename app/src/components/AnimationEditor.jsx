import React, { useState, useRef, useEffect } from 'react';
import anime from 'animejs/lib/anime.es.js';
import { useShapes } from './ShapeContext';

const AnimationEditor = () => {
  const [animationProps, setAnimationProps] = useState({
    property: 'position',
    from: { x: -1, y: 0.5, z: -3 },
    to: { x: 1, y: 1, z: 0 },
    dur: 2000,
    loop: false
  });

  const [animationTimeline, setAnimationTimeline] = useState([]);
  const { selectedObject, setSelectedObject } = useShapes();
  const timelineRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'to' || name === 'from') {
      try {
        setAnimationProps((prevProps) => ({
          ...prevProps,
          [name]: JSON.parse(value)
        }));
      } catch (error) {
        console.error(`Error parsing JSON for ${name}:`, error);
      }
    } else {
      setAnimationProps((prevProps) => ({
        ...prevProps,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const addAnimationToTimeline = () => {
    setAnimationTimeline((prevTimeline) => [
      ...prevTimeline,
      { ...animationProps, id: prevTimeline.length }
    ]);
    console.log('Animation added to timeline:', animationProps);
  };

  const setupTimeline = () => {
    if (animationTimeline.length === 0 || !selectedObject) return;
    console.log('Setting up animation timeline:', animationTimeline);

    const mesh = selectedObject;

    const animations = animationTimeline.map(({ from, to, dur }) => ({
      targets: mesh.position,
      x: [from.x, to.x],
      y: [from.y, to.y],
      z: [from.z, to.z],
      duration: dur,
      easing: 'linear'
    }));

    timelineRef.current = anime.timeline({
      loop: animationProps.loop,
      autoplay: false,
      complete: () => {
        if (animationProps.loop) {
          const { from } = animationTimeline[0];
          mesh.position.set(from.x, from.y, from.z);
        }
      }
    });

    animations.forEach(anim => timelineRef.current.add(anim));
  };

  const playAnimationTimeline = () => {
    setupTimeline();
    if (timelineRef.current) {
      timelineRef.current.play();
    }
  };

  const handlePlay = () => {
    if (timelineRef.current) {
      timelineRef.current.restart();
    }
  };

  const handlePause = () => {
    if (timelineRef.current) {
      timelineRef.current.pause();
    }
  };

  const handleRestart = () => {
    if (timelineRef.current) {
      timelineRef.current.restart();
    }
  };

  useEffect(() => {
    if (selectedObject) {
      setupTimeline();
    }
  }, [selectedObject, animationTimeline]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: '100%', padding: '20px', borderRight: '1px solid #ccc' }}>
        <h3>Animation Properties</h3>
        <label>
          Property:
          <input type="text" name="property" value={animationProps.property} onChange={handleChange} />
        </label>
        <br />
        <label>
          From (JSON format):
          <input type="text" name="from" value={JSON.stringify(animationProps.from)} onChange={handleChange} />
        </label>
        <br />
        <label>
          To (JSON format):
          <input type="text" name="to" value={JSON.stringify(animationProps.to)} onChange={handleChange} />
        </label>
        <br />
        <label>
          Duration:
          <input type="number" name="dur" value={animationProps.dur} onChange={handleChange} />
        </label>
        <br />
        <label>
          Loop:
          <input type="checkbox" name="loop" checked={animationProps.loop} onChange={handleChange} />
        </label>
        <br />
        <button onClick={addAnimationToTimeline}>Add Animation to Timeline</button>
        <br />
        <button onClick={playAnimationTimeline}>Play Animation Timeline</button>
        <h3>Animation Timeline</h3>
        <ul>
          {animationTimeline.map((animation, index) => (
            <li key={index}>
              {`From: ${JSON.stringify(animation.from)} To: ${JSON.stringify(animation.to)} Duration: ${animation.dur}`}
            </li>
          ))}
        </ul>
        <div>
          <button onClick={handlePlay}>Play</button>
          <button onClick={handlePause}>Pause</button>
          <button onClick={handleRestart}>Restart</button>
        </div>
      </div>
    </div>
  );
};

export default AnimationEditor;
