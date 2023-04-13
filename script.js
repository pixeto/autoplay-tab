import gsap from "gsap";
import $ from "jquery";

window.addEventListener("DOMContentLoaded", (event) => {
    //set overridable defaults
    function val(defVal, inVal) {
      const defValType = typeof defVal,
        inValType = typeof inVal;
      return inValType !== "string"
        ? defVal
        : inVal.trim() === ""
        ? defVal
        : defValType === "boolean" && inVal === "true"
        ? true
        : defValType === "boolean" && inVal === "false"
        ? false
        : isNaN(inVal) && defValType === "string"
        ? inVal
        : !isNaN(inVal) && defValType === "number"
        ? +inVal
        : defVal;
    }
    //select elements for each component instance
    $("[px-tab-element='component']").each(function () {
      //[required elements]
      let componentEl = $(this),
        triggerEl = componentEl.find("[px-tab-element='trigger']"),
        targetEl = componentEl.find("[px-tab-element='target']"),
        //[optional elements]
        indexEl = componentEl.find("[px-tab-element='index']"),
        progressBarEL = componentEl.find("[px-tab-element='progress-bar']"),
        arrowEl = componentEl.find("[px-tab-arrow]");
  
      //gsap progress timeline and variables
      let progressTl,
        inView = true;
  
      //tab settings
      let activeClassVal = val("active", componentEl.attr("px-tab-activeclass")),
        activeLoadVal = val(0, componentEl.attr("px-tab-activeindex")),
        intervalDurationVal = val(3000, componentEl.attr("px-tab-duration")),
        gsapDuration = intervalDurationVal / 1000;
  
      //initialise tab autoplay function
      autoplayInit();
  
      //autoplayInit function
      function autoplayInit() {
        //call load function
        tabLoad();
        //auto play when component is in view
        ScrollTrigger.create({
          trigger: componentEl,
          start: "top bottom",
          onEnter: () => {
            if (inView) {
              //call auto play function
              autoplayTab();
              inView = false;
            }
          }
        });
      }
  
      //tab load function
      function tabLoad() {
        removeActive();
        tabItemCount();
        activeLoad();
      }
  
      //tab auto play function
      function autoplayTab() {
        loopReset();
        progress();
        addEventListener();
      }
  
      //tab reset function for click events
      function tabReset() {
        removeActive();
        clearInterval(loopInterval);
        loopReset();
        progressTl.restart();
      }
  
      //remove active function
      function removeActive() {
        triggerEl.removeClass(activeClassVal);
        targetEl.removeClass(activeClassVal);
      }
  
      //active element on load function
      function activeLoad() {
        addActive(triggerEl.eq(activeLoadVal));
        addActive(targetEl.eq(activeLoadVal));
      }
  
      //add active function
      function addActive(trigger) {
        trigger.addClass(activeClassVal);
        targetEl.eq(trigger.index()).addClass(activeClassVal);
        targetEl.css("pointer-events", "none");
        targetEl.eq(trigger.index()).css("pointer-events", "auto");
      }
  
      //tab item indexing function
      function tabItemCount() {
        indexEl.each(function (index) {
          let itemIndex = index + 1;
          if (itemIndex < 10) {
            $(this).text("0" + itemIndex);
          } else {
            $(this).text(itemIndex);
          }
        });
      }
  
      //tab loop interval
      let loopInterval;
      function loopReset() {
        loopInterval = setInterval(() => {
          tabLoop();
        }, intervalDurationVal);
      }
  
      //tab loop function
      function tabLoop() {
        let activeEl = triggerEl.filter(`.${activeClassVal}`).next();
        if (activeEl.length > 0) {
          removeActive();
          addActive(activeEl);
          progress();
        } else {
          removeActive();
          progressTl.restart();
          addActive(triggerEl.eq(0));
        }
      }
  
      //gsap progress function
      let activeEl = triggerEl.filter(`.${activeClassVal}`);
      function progress() {
        if (activeEl.next()) {
          progressTl = gsap.timeline({ paused: true });
          progressTl.fromTo(
            progressBarEL,
            { width: "0%", duration: gsapDuration, ease: "linear" },
            {
              width: "100%",
              duration: gsapDuration,
              ease: "linear"
            }
          );
          progressTl.restart();
        }
      }
  
      //events
      function addEventListener() {
        //trigger click event
        triggerEl.on("click", function () {
          let trigger = $(this);
          tabReset();
          addActive(trigger);
        });
        //arrow click event
        arrowEl.on("click", function () {
          let activeEl = triggerEl.filter(`.${activeClassVal}`);
          tabReset();
          if ($(this).attr("px-tab-arrow") === "left") {
            if (activeEl.prev().length > 0) {
              addActive(activeEl.prev());
            } else {
              addActive(triggerEl.eq(-1));
            }
          } else if ($(this).attr("px-tab-arrow") === "right") {
            if (activeEl.next().length > 0) {
              addActive(activeEl.next());
            } else {
              addActive(triggerEl.eq(0));
            }
          }
        });
      }
    });
  });
  