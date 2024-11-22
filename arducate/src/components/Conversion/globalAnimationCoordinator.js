AFRAME.registerComponent("global-animation-coordinator", {
  init: function () {
    const marker = this.el;
    let isPlaying = false;

    const animatedElements = [];
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
      if (!isPlaying) {
        isPlaying = true;

        allAnimations.forEach(({ el, delay }) => {
          setTimeout(() => {
            el.emit("startAllAnimations");
          }, delay);
        });
      }
    };

    marker.addEventListener("markerFound", () => {
      startAnimations();
    });

    marker.addEventListener("markerLost", () => {
      resetAnimations();
    });
  },
});
