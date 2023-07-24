const intro = document.querySelector('.intro');
const video = intro.querySelector('video');
const text = intro.querySelector('h1');

const section = document.querySelector('section');
const end = section.querySelector('h1');

const controller = new ScrollMagic.Controller();

const scene = new ScrollMagic.Scene({
    duration: 14000,
    triggerElement: intro,
    triggerHook: 0
}).setPin(intro).addTo(controller);

let accel = .2;
let scrollpos = 0;
let delay = 0;

scene.on('update', e => {
    scrollpos = e.scrollPos / 1000;
});

setInterval(()=>{
    delay += (scrollpos - delay) * accel;

    video.currentTime = scrollpos;
},33.33)