AFRAME.registerComponent("global-animation-coordinator", {
  init: function () {
    const marker = this.el;
    let isPlaying = false;
    let allAssetsLoaded = false;
    let markerIsFound = false;

    const animatedElements = [];
    const loadPromises = [];

    marker.querySelectorAll("[animation__0]").forEach((el) => {
      const animations = [];
      let i = 0;
      while (true) {
        const anim = el.getAttribute(`animation__${i}`);
        if (!anim) break;
        animations.push({
          el: el,
          delay: 500,
          duration: anim.dur,
          attribute: anim.property,
          from: anim.from,
          to: anim.to,
        });
        i++;
      }

      const loadPromise = new Promise((resolve) => {
        if (el.hasLoaded) {
          resolve();
        } else {
          el.addEventListener("loaded", resolve, { once: true });
        }
      });
      loadPromises.push(loadPromise);

      if (animations.length > 0) {
        animatedElements.push({ el: el, animations });
      }
    });

    const allAnimations = animatedElements
      .flatMap((item) =>
        item.animations.map((anim) => ({ el: item.el, ...anim }))
      )
      .sort((a, b) => a.delay - b.delay);

    const resetAnimations = () => {
      allAnimations.forEach(({ el, from, attribute }) => {
        if (from && attribute) {
          el.setAttribute(attribute, from);
        }
      });
      isPlaying = false;
    };

    const startAnimations = () => {
      if (!isPlaying && allAssetsLoaded && markerIsFound) {
        isPlaying = true;
        const delayAfterReady = 2000;

        setTimeout(() => {
          allAnimations.forEach(({ el, delay }) => {
            setTimeout(() => {
              el.emit("startAllAnimations");
            }, delay);
          });
        }, delayAfterReady);
      }
    };


    marker.addEventListener("markerFound", () => {
      markerIsFound = true;
      startAnimations();
    });

    marker.addEventListener("markerLost", () => {
      markerIsFound = false;
      resetAnimations();
    });

    // Wait until all assets are loaded
    Promise.all(loadPromises).then(() => {
      allAssetsLoaded = true;
      startAnimations();
    });
  },
});
