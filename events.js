AFRAME.registerComponent('rotate-on-tap', {
    init: function () {
      var el = this.el;
      el.addEventListener('tap', function () {
        var rotation = el.getAttribute('rotation');
        rotation.y += 45; // Adjust the rotation increment as needed
        el.setAttribute('rotation', rotation);
      });
    }
  });