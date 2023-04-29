import { ISourceOptions } from "tsparticles-engine";

export const particlesOptions: ISourceOptions = {
  "background": {
    "color": {
      "value": ""
    },
    "image": "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('./assets/background-access.png')",
    "position": "center",
    "repeat": "no-repeat",
    "size": "cover",
    "opacity": 0.3
  },
  "particles": {
    "number": {
      "value": 100,
      "density": {
        "enable": true,
        "value_area": 3000
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle",
    },
    "opacity": {
      "value": 0.5,
      "random": false,
    },
    "size": {
      "value": 3,
      "random": true,
    },
    "line_linked": {
      "enable": false,
    },
    "move": {
      "enable": true,
      "speed": 6,
      "direction": "none",
      "random": true,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
    }
  },
  "interactivity": {
    "detect_on": "window",
    "events": {
      "onhover": {
        "enable": false,
      },
      "onclick": {
        "enable": false,
      },
      "resize": false
    },
  },
  "fps_limit": 60,
}
