AFRAME.registerComponent("global-animation-coordinator", {
  init: function () {
    const marker = this.el;
    let allReady = false;
    let markerFound = false;
    let hasPlayed = false;

    const animatedElements = [];
    const loadPromises = [];

    // 1. Wait for the entire <a-scene> and <a-camera>
    const scene = document.querySelector("a-scene");
    const camera = scene.querySelector("[camera]");

    if (scene && !scene.hasLoaded) {
      loadPromises.push(
        new Promise((resolve) =>
          scene.addEventListener("loaded", resolve, { once: true })
        )
      );
    }

    if (camera && !camera.hasLoaded) {
      loadPromises.push(
        new Promise((resolve) =>
          camera.addEventListener("loaded", resolve, { once: true })
        )
      );
    }

    // 2. Gather and wait for all animated elements
    marker.querySelectorAll("[animation__0]").forEach((el) => {
      const animations = [];
      let i = 0;
      while (true) {
        const anim = el.getAttribute(`animation__${i}`);
        if (!anim) break;
        animations.push({
          el,
          delay: 500,
          duration: anim.dur,
          attribute: anim.property,
          from: anim.from,
          to: anim.to,
          startEvents: "startAllAnimations"
        });
        i++;
      }

      if (animations.length > 0) {
        animatedElements.push({ el, animations });
      }

      if (!el.hasLoaded) {
        loadPromises.push(
          new Promise((resolve) =>
            el.addEventListener("loaded", resolve, { once: true })
          )
        );
      }
    });

    const allAnimations = animatedElements
      .flatMap((item) =>
        item.animations.map((anim) => ({ el: item.el, ...anim }))
      )
      .sort((a, b) => a.delay - b.delay);

    const resetAnimations = () => {
      allAnimations.forEach(({ el, from, attribute }) => {
        if (from && attribute) el.setAttribute(attribute, from);
      });
      hasPlayed = false;
    };

    const tryStart = () => {
      if (!scene.hasLoaded || !allAssetsLoaded || !markerFound || hasPlayed) return;

      hasPlayed = true;

      const delayAfterReady = 4000; // Clear delay before animations start

      setTimeout(() => {
        animatedElements.forEach(({ el }) => {
          el.emit("startAllAnimations", null, false);
        });
      }, delayAfterReady);
    };


    marker.addEventListener("markerFound", () => {
      markerFound = true;
      tryStart();
    });

    marker.addEventListener("markerLost", () => {
      markerFound = false;
      resetAnimations();
    });

    Promise.all(loadPromises).then(() => {
      allReady = true;
      tryStart();
    });
  },
});
