import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-tsparticles';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';

const app = new Clarifai.App({
  apiKey: "1c65d7739f7b42518d8864fc944e8a8b",
 });

const particleOptions = {
  "fpsLimit": 60,
  "particles": {
    "number": {
      "value": 400,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ffffff",
      "animation": {
        "enable": true,
        "speed": 10,
        "sync": true
      }
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0
      },
      "polygon": {
        "nb_sides": 5
      },
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 3,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 20,
        "size_min": 0.1,
        "sync": false
      }
    },
    "links": {
      "enable": true,
      "distance": 100,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 4,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "window",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 0.8
      },
      "repulse": {
        "distance": 200
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true,
};




class App extends Component  {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      issignedIn: false
    }
  }

calculateFaceLocation = (data) => {
  const clarifaiFace =   data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputimage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }
}

displayFaceBox = (box) => {
  this.setState({box: box});
}

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});

      app.models
     .predict(
      Clarifai.FACE_DETECT_MODEL,
       this.state.input)
     .then(response => this.displayFaceBox( this.calculateFaceLocation(response)))
     .catch(err => console.log(err));
     }  
     
     onRouteChange = (route) => {
       if (route === 'signout') {
         this.setState({issignedIn: false})
       } else if (route === 'home') {
         this.setState({issignedIn: true})
     }
       this.setState({route: route});
     }
  

  render() {
    const { issignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
        params={particleOptions}
        />
        <Navigation issignedIn={issignedIn} onRoutechange={this.onRouteChange} />
        { route === 'home'
        ? <div>
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
        : (
        route === 'signin'
         ? <Signin onRouteChange={this.onRouteChange} />
         : <Register onRouteChange={this.onRoutechange}/>
      ) 
  }
  </div>
  );
}
}

export default App;
