import gsap from 'https://cdn.skypack.dev/gsap@3.12.0'
import {ScrollTrigger} from 'https://cdn.skypack.dev/gsap@3.12.0/ScrollTrigger'
import {CSSRulePlugin} from 'https://cdn.skypack.dev/gsap@3.12.0/CSSRulePlugin'

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(CSSRulePlugin)

const basicScrollAnimation = (element, toggleActions = "play none none reverse", delay = 0, customY = null, markers = false) => {
  if (typeof element === "string") {
    element = document.querySelector(element)
  }

  const elementHeight = element.offsetHeight * 1.2
  let y = 120
  if (y < elementHeight) {
    y = elementHeight
  }

  if (customY) {
    y = customY
  }

  console.log(element.classList.value, " :", element.offsetHeight)
  return gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      toggleActions,
      markers
    },
    y: y,
    opacity: 0,
    duration: 0.6,
    delay,
    ease: "power1.out"
  })
}

const reversedScrollAnimation = (cls) => {
  return gsap.from(cls, {
    scrollTrigger: {
      trigger: cls,
      toggleActions: "play none none reverse"
    },
    y: -120,
    opacity: 0,
    duration: 0.6,
    ease: "power1.out"
  })
}

const designDisplayAnimation = () => {
  const mainCls = ".design-display"
  const textCls = ".design-display__copy-block .text-dark"
  const darkPictureCls = ".design-display__image-dark"
  const lightPictureCls = ".design-display__image-light"

  const toggleActions = "restart none none reverse"
  const duration = 0.6


  gsap.to(textCls, {
    scrollTrigger: {
      trigger: mainCls,
      start: "bottom bottom",
      toggleActions: toggleActions,
      ease: "sine.inOut"
    },
    color: "#ff0000",
    duration: duration
  })

  gsap.to(mainCls, {
    scrollTrigger: {
      trigger: mainCls,
      start: "bottom bottom",
      toggleActions: toggleActions,
      ease: "sine.inOut"
    },
    backgroundColor: "#000",
    duration: duration
  })

  gsap.to(lightPictureCls, {
    scrollTrigger: {
      trigger: mainCls,
      start: "bottom bottom",
      toggleActions: toggleActions,
      ease: "sine.inOut"
    },
    opacity: 0,
    duration: duration
  })
}

const pinAnimation = (cls, start, end, isTop = false) => {
  const stickyContainer = ".sticky-container"


  let rule = CSSRulePlugin.getRule(".pin-vertical-bottom:after");
  if (isTop) {
    rule = CSSRulePlugin.getRule(".pin-vertical-top:after");
  }

  // Order is important
  gsap.fromTo(rule,
      {"clip-path": isTop ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)"},
      {
        "clip-path": "inset(0% 0% 0% 0%)",
        scrollTrigger: {
          trigger: stickyContainer,
          start: `${start} top`,
          toggleActions: "play none none reverse",
          scrub: 1,
        },
        ease: "sine.inOut"
      })

  gsap.fromTo(cls,
      {
        opacity: 1,
      },
      {
        opacity: 0,
        ease: "sine.inOut",
        scrollTrigger: {
          trigger: stickyContainer,
          start: `${end} top`,
          toggleActions: "play none none reverse",
          scrub: 1
        },
      })

  gsap.fromTo(rule,
      {
        "clip-path": "inset(0% 0% 0% 0%)",
      },
      {
        "clip-path": isTop ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
        ease: "sine.inOut",
        scrollTrigger: {
          trigger: stickyContainer,
          start: `${end} top`,
          toggleActions: "play none none reverse",
          scrub: 1,
        },
      })

  gsap.fromTo(cls,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        ease: "sine.inOut",
        scrollTrigger: {
          trigger: stickyContainer,
          start: `${start} top`,
          toggleActions: "play none none reverse",
          scrub: 1,
        },
      }
  )
}

const videoAnimation = (start, end) => {
  const videoCls = ".schematic-video-container video"
  const video = document.querySelector(videoCls);
  const stickyContainer = ".sticky-container"

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: stickyContainer,
      start: `${start} top`,
      markers: true,
      end: `+=${end}`,
      ease: "none",
      scrub: true,
      toggleActions: "play none none reverse"
    }
  });

  tl.fromTo(
      video,
      {
        currentTime: 0
      },
      {
        currentTime: video.duration || 2
      }
  );
}

const pinsQueueAnimation = (tl, start, headerHeight) => {
  const container = document.querySelector(".sticky-container")
  const delay = headerHeight * 2
  const gps = ".pin-gps"
  const dualSpeakers = ".pin-dual-speakers"
  const actionButton = ".pin-action-button"
  const siren = ".pin-siren"

  start = start + delay
  pinAnimation(gps, start + delay, start + delay * 6)
  pinAnimation(dualSpeakers, start + delay * 2, start + delay * 6, true)

  start = start + delay * 6

  pinAnimation(actionButton, start + delay * 2, start + delay * 7)
  pinAnimation(siren, start + delay * 3, start + delay * 7, true)

  start = start + delay * 7


  console.log("container:", container)
  // const end = "240%"
  const end = window.innerHeight * 2
  videoAnimation(start + delay * 2, end)

  const sideButton = ".pin-side-button"
  const depthGauge = ".pin-depth-gauge"
  const microphone = ".pin-microphone"
  const digitalCrown = ".pin-digital-crown"

  start = start + end

  pinAnimation(sideButton, start, start + delay * 3)
  pinAnimation(microphone, start, start + delay * 3, true)

  start = start + delay * 3
  pinAnimation(depthGauge, start + delay * 3, start + delay * 8)
  pinAnimation(digitalCrown, start + delay * 3, start + delay * 8, true)
}

const designSchematic = (onUpdate) => {
  const firstBlockCls = ".hardware-wrapper"
  const secondBlockCls = ".schematic-wrapper"
  const stickyContainer = ".sticky-container"

  const tl = gsap.timeline();

  const start = (document.querySelector(".hardware-wrapper").clientHeight / 2)
  const end = 1800
  const headerHeight = 52

  tl.to(firstBlockCls, {
    "clip-path": "inset(0% 0% 100% 0%)",
    ease: "none",
    scrollTrigger: {
      trigger: stickyContainer,
      start: `${start} top`,
      end: `+=${end}`,
      scrub: true,
      onUpdate: () => {
        const clipPath = document.querySelector(firstBlockCls).style.clipPath
        onUpdate(clipPath)
      }
    }
  });

  // 96, header height
  const startSecondBlock = start + end - headerHeight - 80

  tl.to(secondBlockCls, {
    "clip-path": "inset(0% 40px 40px)",
    scrollTrigger: {
      trigger: stickyContainer,
      start: `${startSecondBlock} top`,
      end: `+=${headerHeight * 3}`,
      scrub: true,
    }
  });

  pinsQueueAnimation(tl, startSecondBlock, headerHeight)
}

const imageAnimation = (cls, transformFrom, transformTo, trigger, start = "top top") => {
  gsap.fromTo(cls,
      {
        "transform": transformFrom,
      },
      {
        "transform": transformTo,
        ease: "none",
        scrollTrigger: {
          trigger,
          start: start,
          toggleActions: "play none none reverse",
          scrub: true,
          markers: true
        },
      }
  );
}

gsap.from(".hero__left", {x: -350, duration: 1.5, delay: .5, opacity: 0, ease: "power1.inOut"});
gsap.fromTo(".hero__center", {scale: 1.1}, {scale: 1, duration: 1.5, ease: "power1.inOut"});
gsap.from(".hero__right", {x: 350, duration: 1.5, delay: .5, opacity: 0, ease: "power1.inOut"});

basicScrollAnimation(".hero__logo")
basicScrollAnimation(".hero__headline")
basicScrollAnimation(".hero__intro")

basicScrollAnimation(".design-intro__headline")
basicScrollAnimation(".design-intro__eyebrow")

basicScrollAnimation(".design-tough__headline")
basicScrollAnimation(".design-tough__content")
basicScrollAnimation(".design-tough__item-1")
basicScrollAnimation(".design-tough__item-2")
basicScrollAnimation(".design-tough__item-3")
basicScrollAnimation(".design-tough__item-4")

const hardwareWrapperAnimation = reversedScrollAnimation(".hardware-wrapper__copy-block")
const designSchematicAnimation = basicScrollAnimation(".schematic__copy-block")

designDisplayAnimation()
designSchematic((clipPath) => {
  const splited = clipPath.split(" ")[2]
  if (splited) {
    const percent = splited.split(".")[0].replace("%", "").replace(")", "")
    // todo, fix animation
    if (+percent > 60) {
      hardwareWrapperAnimation.reverse()
    } else {
      hardwareWrapperAnimation.play()
    }
    if (+percent > 90) {
      designSchematicAnimation.play()
    } else {
      designSchematicAnimation.reverse()
    }
  }
})


basicScrollAnimation(".battery-life-intro")
const batteryStats = document.querySelectorAll(".stat.stat-super")
batteryStats.forEach((element, index) => {
  basicScrollAnimation(element, "play none none reverse", (index + 1) / 10, 180, true)
})


basicScrollAnimation(".design-icon-s9")
basicScrollAnimation(".chip-headline")
basicScrollAnimation(".chip-copy", "play none none reverse", 0, 200)


basicScrollAnimation(".copy-block-gestures")


basicScrollAnimation(".overview-design-logo-carbon-neutral")
basicScrollAnimation(".overview-design-design-carbon", "play none none reverse", 0, 120)


basicScrollAnimation(".design-carbon-neutral-text-1", "play none none reverse", 0, 136)
basicScrollAnimation(".design-carbon-neutral-text-2", "play none none reverse", 0, 150)


imageAnimation(
    ".overview-endurance-endurance-hero img",
    "matrix(1.3, 0, 0, 1.3, 0, 0)",
    "matrix(1.1, 0, 0, 1.1, 0, 0)",
    ".section-header-image"
)
imageAnimation(
    ".overview-endurance-endurance-hero-float img",
    "matrix(2.17846, 0, 0, 2.17846, 0, 0)",
    "matrix(1.67574, 0, 0, 1.67574, 0, -100)",
    ".hero-float-image",
    "top bottom"
)