import { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

function App() {
  const containerRef = useRef<HTMLElement>(null);
  const [loadComplete, setLoadComplete] = useState(false);

  // --- PHASE 1: THE GOLDEN FILL LOADER (Time-based) ---
  useGSAP(() => {
    const tl = gsap.timeline();
    let progressProxy = { val: 0 };

    tl.to(progressProxy, {
      val: 100,
      duration: 3.5, 
      ease: "power2.inOut",
      onUpdate: () => {
        // Fills the text from left to right
        gsap.set(".text-fill", { 
          clipPath: `inset(0 ${100 - progressProxy.val}% 0 0)` 
        });
      },
      onComplete: () => {
        setLoadComplete(true); // Triggers Phase 2!
      }
    });
  }, { scope: containerRef });

  // --- PHASE 2: THE SCROLL ZOOM & POETRY REVEAL ---
  useGSAP(() => {
    if (!loadComplete) return;

    // We create a ScrollTrigger timeline attached to our massive 400vh track
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".scroll-track",
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // '1' adds a slight cinematic buttery delay to the scroll
      }
    });

    // 1. Zoom into the letter "l". 
    scrollTl.to(".typography-layers", {
      scale: 150, 
      transformOrigin: "47% 50%", 
      duration: 8, 
      ease: "power2.in"
    });

    // 2. The Seamless Swap! As the "l" covers the screen, we fade in a solid yellow background
    // to hide the pixelated text edges, making the screen a perfect canvas.
    scrollTl.to(".bg-swap-layer", {
      opacity: 1,
      duration: 0.1, // Happens almost instantly!
    }, "-=0.5");

    // 3. Reveal the Poetry from Top to Bottom
    // Notice the text colors here are dark (#07031A) since the screen is now yellow!
    scrollTl.to(".intro-section", { opacity: 1, duration: 0.5 }, "-=0.2");
    
    // Animate the sunflower spinning up
    scrollTl.from(".intro-sunflower", { 
      scale: 0, 
      rotation: 180, 
      duration: 5, 
      ease: "power3.out" 
    }, "-=0.5");

    // Float the text lines down one by one
    scrollTl.from(".intro-line", { 
      opacity: 0, 
      y: -20, // Starts higher and drops down
      stagger: 1, // Delays each line so they read top to bottom
      duration: 3, 
      ease: "power2.out" 
    }, "-=1.5");

    // 4. Fade OUT the Intro Section
    scrollTl.to(".intro-section", { 
      opacity: 0, 
      y: -50, 
      duration: 3 
    }, "+=2");

    // 5. Fade IN the Letter Wrapper
    scrollTl.to(".scrolling-wrapper", { opacity: 1, duration: 1 });

    // 6. The Clean Scroll (Moves the text block from bottom to top)
    scrollTl.to(".letter-content", { 
      y: "-160%", // Drags the text all the way up and off the screen
      duration: 40, 
      ease: "none" 
    }, "scrollUp");

    // 7. Crisp, Clean Fade-Ins (No Blur!)
    // As the text scrolls up, the paragraphs cleanly fade in one by one.
    scrollTl.fromTo(".letter-stanza", 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, stagger: 4.5, duration: 3, ease: "power2.out" }, 
      "scrollUp+=1" 
    );

    // 8. Fade OUT the Letter Wrapper so the screen is completely empty again
    scrollTl.to(".scrolling-wrapper", { opacity: 1, duration: 2 }, "+=2");

    // 9. THE GRAND FINALE: The Conclusion Scene
    // This ONLY starts after the letter is completely gone.
    scrollTl.to(".conclusion-section", { opacity: 1, duration: 2 }, "+=1"); // Added a pause before it appears
    
    scrollTl.from(".concl-line-1", { opacity: 0, y: 20, duration: 3, ease: "power2.out" });
    
    scrollTl.from(".concl-photo", { 
      scale: 0.5, 
      opacity: 0, 
      rotation: -10, 
      duration: 4, 
      ease: "elastic.out(1, 0.8)" 
    }, "-=1");
    
    scrollTl.from(".concl-line-2", { opacity: 0, y: -20, duration: 3, ease: "power2.out" }, "-=2");

  }, { scope: containerRef, dependencies: [loadComplete] });

  return (
    // We disable scroll (overflow-hidden) until loadComplete is true
    <main 
      ref={containerRef} 
      className={`w-full bg-[#07031A] text-[#F6F7D3] relative font-['Montserrat'] ${loadComplete ? 'overflow-auto' : 'overflow-hidden h-screen'}`}
    >
      
      {/* THE SCROLL TRACK: Provides physical room to scroll (only exists after loading) */}
      {loadComplete && <div className="scroll-track h-[1400vh] w-full"></div>}

      {/* THE FIXED CAMERA: Everything happens inside this viewport */}
      <div className="fixed inset-0 w-full h-screen flex items-center justify-center pointer-events-none">
        
        {/* --- THE TYPOGRAPHY ZOOM LAYER --- */}
        <div className="typography-layers relative flex items-center justify-center w-full z-10">
          {/* Outline Layer */}
          <h1 className="absolute font-extrabold text-[18vw] leading-none tracking-[-0.05em] pb-2 text-center w-full"
            style={{ color: "transparent", WebkitTextStroke: "2px #F6F7D3" }}>
            sunflower
          </h1>
          {/* Solid Fill Layer */}
          <h1 className="text-fill text-[#F6F7D3] font-extrabold text-[18vw] leading-none tracking-[-0.05em] pb-2 text-center w-full"
            style={{ clipPath: "inset(0 100% 0 0)" }}>
            sunflower
          </h1>
        </div>

        {/* --- THE SEAMLESS BACKGROUND SWAP --- */}
        {/* This fades in to make the whole screen perfectly yellow before the intro appears */}
        <div className="bg-swap-layer absolute inset-0 bg-[#F6F7D3] opacity-0 z-20"></div>

        {/* --- THE INTRO POETRY LAYER --- */}
        <div className="intro-section absolute inset-0 opacity-0 z-30 flex items-center justify-center text-[#07031A] w-full h-full">
          
          {/* THE 1920x1080 CANVAS WRAPPER */}
          {/* This locks the aspect ratio to 16:9, guaranteeing the layout never breaks */}
          <div className="relative w-full max-w-[1920px] aspect-[16/9] flex items-center justify-center">
            
            {/* The Main Sunflower (Centered) */}
            {/* Scales to take up about 40% of the canvas width, just like the photo */}
            <img 
              src="/sunflower-intro.png" 
              alt="Sunflower" 
              className="intro-sunflower absolute w-[100%] h-auto object-contain z-20" 
            />

            {/* --- RIGHT SIDE TEXT (Staggered top-right) --- */}
            <div className="absolute left-[48%] top-[15%] flex flex-col items-start z-10 text-[2.5vw]
             md:text-[2vw] lg:text-[1.8vw] xl:text-[28px] leading-[1.6] tracking-wide">
              <div className="intro-line">
                if a <span className="font-bold">sunflower</span>
              </div>
              <div className="intro-line ml-[3em]">
                can spend its
              </div>
              <div className="intro-line ml-[6em]">
                entire life gazing
              </div>
              <div className="intro-line ml-[7.5em]">
                at the <span className="underline decoration-[1.5px] underline-offset-4">sun</span>
              </div>
              <div className="intro-line ml-[9.5em]">
                that <span className="italic">never</span> once
              </div>
              <div className="intro-line ml-[11.5em]">
                looked down,
              </div>
            </div>

            {/* --- LEFT SIDE TEXT (Staggered bottom-left) --- */}
            {/* Using font sizes based on viewport width (vw) so it scales perfectly with the 16:9 box */}
            <div className="absolute left-[12%] bottom-[20%] flex flex-col items-start z-10 text-[2.5vw] md:text-[2vw]
             lg:text-[1.8vw] xl:text-[28px] leading-[1.6] tracking-wide">
              <div className="intro-line">
                what's <span className="underline decoration-[1.5px] underline-offset-4">wrong</span> with
              </div>
              <div className="intro-line ml-[2.5em]">
                <span className="font-bold">adoring</span> someone,
              </div>
              <div className="intro-line ml-[5em]">
                knowing they won't
              </div>
              <div className="intro-line ml-[8.5em] italic">
                love you back?
              </div>
            </div>

          </div>
        </div>

        {/* --- THE SCROLLING POETRY LAYER --- */}
        <div className="scrolling-wrapper absolute inset-0 z-30 opacity-0 flex justify-center overflow-hidden pointer-events-none">
          
          {/* THE COMPRESSED, JUSTIFIED LETTER */}
          {/* FIX 1: Changed gap-24 to gap-8 (brings paragraphs closer) */}
          {/* FIX 2: Changed leading-[2.2] to leading-[1.7] (brings lines of text closer) */}
          <div className="letter-content absolute top-[100%] w-full max-w-[650px] px-6 md:px-0 flex flex-col gap-6 md:gap-8 text-[4.5vw] 
          md:text-[3vw] lg:text-[2vw] xl:text-[24px] leading-[1.7] tracking-wide text-justify text-[#07031A] pb-[20vh]">
            
            <p className="letter-stanza">
              Similar to a <span className="font-bold">sunflower</span>—
              <span className="italic">I would consume my day pivoting toward the sun</span>
              , <span className="underline decoration-[1.5px] underline-offset-4">orienteering</span> my 
              very existence around the star I devote in.
            </p>
            
            <p className="letter-stanza">
              but it's a <span className="underline decoration-[1.5px] underline-offset-4">one-sided</span> relationship, 
              even if I constantly adore the sun. You would still be shining 
              <span className="font-bold"> indiscriminately</span>, unaware of any particular flower.
            </p>
            
            <p className="letter-stanza">
              and maybe that's <span className="underline decoration-[1.5px] underline-offset-4">palatable</span>. 
              Perhaps all I'd ever need in this life, is a source of <span className="italic">light</span> I 
              can <span className="font-bold">bloom</span> in.
            </p>
            
            <p className="letter-stanza">
              In the way <span className="font-bold">sunflowers</span> would turn back 
              to the east every night just to wait for down, I would constantly be going 
              back to the idea of us, waiting for a <span className="underline decoration-[1.5px] underline-offset-4">possibility</span> that 
              might ever happen, a dawn is not promised—<span className="italic">so is our fate</span>.
            </p>
            
            <p className="letter-stanza">
              Your light is beyond <span className="underline decoration-[1.5px] underline-offset-4">captivating</span>, 
              my soul stretches toward it—<span className="italic">like a <span className="font-bold">sunflower</span> that <span className="italic">grows for meters just to reach for sunlight.</span></span>
            </p>
            
            <p className="letter-stanza">
              I'm <span className="underline decoration-[1.5px] underline-offset-4">envious</span> of
              the boy who broke your heart not because he hurt you (<span className="italic">no never that</span>), 
              but rather because he got to experience your <span className="font-bold italic underline decoration-[1.5px] underline-offset-4">love</span>. and I'll <span className="underline 
              decoration-[1.5px] underline-offset-4">wait</span>—
              <span className="italic">the same manner how <span className="font-bold">sunflowers</span> wait for 
              dawn—until you're ready to bloom in someone else again.</span>
            </p>
            
            <p className="letter-stanza">
              You truly are <span className="font-bold">enchanting</span>, my dear <span className="underline decoration-[1.5px] 
              underline-offset-4">star</span>, <span className="italic">but—</span>
            </p>

          </div>
        </div>

        {/* --- THE CONCLUSION LAYER --- */}
        <div className="conclusion-section absolute inset-0 opacity-0 z-40 flex items-center justify-center text-[#07031A] pointer-events-none">
          
          {/* THE 1920x1080 CANVAS WRAPPER */}
          <div className="relative w-full max-w-[1920px] aspect-[16/9] flex items-center justify-center">
            
            {/* TOP TEXT: Adjust the top-[...] percentage to move it up or down! */}
            <div className="concl-line-1 absolute top-[18%] text-[4vw] md:text-[3vw] lg:text-[2vw] xl:text-[1.5vw] tracking-wide z-10">
              I am <span className="underline decoration-[1.5px] underline-offset-4">merely</span> a <span className="font-bold">sunflower</span>,
            </div>
            
            {/* THE EXACT 1920x1080 IMAGE */}
            <img 
              src="/sunflower-crumpled.png" 
              alt="Paper Sunflower" 
              className="concl-photo absolute inset-0 w-full h-full object-contain z-0" 
            />
            
            {/* BOTTOM TEXT: Adjust the bottom-[...] percentage to move it up or down! */}
            <div className="concl-line-2 absolute bottom-[18%] text-[4vw] md:text-[3vw] lg:text-[2vw] xl:text-[1.5vw] tracking-wide z-10">
              and you are the <span className="font-bold italic">sun</span> I center my <span className="italic">life</span> around.
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}

export default App;