function createImageElement(src){
  const img = new Image();
  img.src = src;
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  return img;
}

function playImageSequenceAnimation(){
  const animationContainer = document.getElementById('animation-container');
  const totalFrames = 300;
  const imgPrefix = "Final/Final.";
  const imgFormat = "png";

  const currentFrame = Math.min(Math.floor((window.scrollY / (document.body.offsetHeight - window.innerHeight)) * totalFrames), totalFrames - 1);
  console.log(currentFrame);

  const imgName = `${imgPrefix}${currentFrame + 1}.${imgFormat}`;

  const currentImgElement = animationContainer.querySelector("img");
  if(currentImgElement){
    currentImgElement.src = imgName;
  } else {
    const newImgElement = createImageElement(imgName);
    animationContainer.appendChild(newImgElement);
  }
}

window.addEventListener('scroll', playImageSequenceAnimation);
playImageSequenceAnimation();


var tl = gsap.timeline({scrollTrigger:{
  trigger: ".animation_conatiner",
  // markers: true,
  start: "0% 0%",
  end: "100% -200%",
  pin: true,
  // duration: 9,
  scrub: 1
}})
tl.to(".animation_conatiner h1", {
  y: "-100vh",
  duration: 4,
  scrub: 1
})