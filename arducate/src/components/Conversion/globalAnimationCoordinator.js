AFRAME.registerComponent("global-animation-coordinator", {
  init: function () {
    const marker = this.el;
    let allAssetsLoaded = false;
    let markerFound = false;
    let hasPlayed = false;

    const animatedElements = [];
    const loadPromises = [];

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
        });
        i++;
      }

      if (animations.length > 0) {
        animatedElements.push({ el, animations });
      }

      loadPromises.push(
        new Promise((resolve) => {
          el.hasLoaded
            ? resolve()
            : el.addEventListener("loaded", resolve, { once: true });
        })
      );
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
      if (allAssetsLoaded && markerFound && !hasPlayed) {
        hasPlayed = true;
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
      markerFound = true;
      tryStart();
    });

    marker.addEventListener("markerLost", () => {
      markerFound = false;
      resetAnimations();
    });

    Promise.all(loadPromises).then(() => {
      allAssetsLoaded = true;
      tryStart();
    });
  },
});
