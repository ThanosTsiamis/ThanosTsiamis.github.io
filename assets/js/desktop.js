    (function () {
      var windowEl = document.getElementById("main-window");
      var minBtn = document.getElementById("win-min");
      var maxBtn = document.getElementById("win-max");
      var closeBtn = document.getElementById("win-close");
      var taskBtn = document.getElementById("task-window");
      var startBtn = document.getElementById("start-btn");
      var startMenu = document.getElementById("start-menu");
      var shutdownBtn = document.getElementById("shutdown-btn");
      var trayVolume = document.getElementById("tray-volume");
      var trayNetwork = document.getElementById("tray-network");
      var trayHardware = document.getElementById("tray-hardware");
      var clock = document.getElementById("clock");
      var statusTime = document.getElementById("status-time");
      var cookieBanner = document.getElementById("cookie-banner");
      var cookieAccept = document.getElementById("cookie-accept");
      var gaMeasurementId = (document.documentElement.getAttribute("data-ga-measurement-id") || "").trim();
      var analyticsInitialized = false;
      var secretToast = document.getElementById("secret-toast");
      var desktopIcons = Array.prototype.slice.call(document.querySelectorAll(".desktop-icon"));
      var myComputerIcon = document.getElementById("icon-my-computer");
      var recycleBinIcon = document.getElementById("icon-recycle-bin");
      var myComputerDialog = document.getElementById("my-computer-dialog");
      var myComputerClose = document.getElementById("my-computer-close");
      var recycleDialog = document.getElementById("recycle-dialog");
      var recycleStatus = document.getElementById("recycle-status");
      var recycleEmpty = document.getElementById("recycle-empty");
      var recycleClose = document.getElementById("recycle-close");
      var desktopMenu = document.getElementById("desktop-menu");
      var bootScreen = document.getElementById("boot-screen");
      var bootProgress = document.getElementById("boot-progress");
      var bsod = document.getElementById("bsod");
      var virusLayer = document.getElementById("virus-layer");
      var titlebar = windowEl.querySelector(".titlebar");
      var audioContext = null;
      var lastClickAt = 0;
      var lastKeySoundAt = 0;
      var keyNoiseBuffer = null;
      var konami = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
      var konamiProgress = 0;
      var typedBuffer = "";
      var startClicks = [];
      var systemMuted = false;
      var networkConnected = true;
      var virusState = { active: false, spawnTimer: null, stopTimer: null, popups: 0 };
      var recycleCount = 3;

      function showSecret(message) {
        secretToast.textContent = message;
        secretToast.classList.remove("show");
        window.requestAnimationFrame(function () {
          secretToast.classList.add("show");
        });
        window.setTimeout(function () {
          secretToast.classList.remove("show");
        }, 2400);
      }

      function openBsod() {
        bsod.classList.add("show");
        bsod.setAttribute("aria-hidden", "false");
        playErrorSound();
        showSecret("Easter egg unlocked: Blue Screen");
      }

      function closeBsod() {
        bsod.classList.remove("show");
        bsod.setAttribute("aria-hidden", "true");
      }

      function closeDesktopMenu() {
        desktopMenu.classList.remove("open");
        desktopMenu.setAttribute("aria-hidden", "true");
      }

      function closeSystemDialogs() {
        myComputerDialog.classList.remove("show");
        recycleDialog.classList.remove("show");
        myComputerDialog.setAttribute("aria-hidden", "true");
        recycleDialog.setAttribute("aria-hidden", "true");
      }

      function openMyComputerDialog() {
        closeSystemDialogs();
        myComputerDialog.classList.add("show");
        myComputerDialog.setAttribute("aria-hidden", "false");
      }

      function updateRecycleStatus() {
        recycleStatus.textContent = "Items waiting: " + recycleCount;
      }

      function openRecycleDialog() {
        closeSystemDialogs();
        updateRecycleStatus();
        recycleDialog.classList.add("show");
        recycleDialog.setAttribute("aria-hidden", "false");
      }

      function openDesktopMenu(x, y) {
        desktopMenu.style.left = x + "px";
        desktopMenu.style.top = y + "px";
        desktopMenu.classList.add("open");
        desktopMenu.setAttribute("aria-hidden", "false");
      }

      function spawnVirusPopup() {
        var popup = document.createElement("div");
        popup.className = "virus-popup";
        popup.innerHTML =
          "<div class='virus-popup-title'>System Alert</div>" +
          "<div class='virus-popup-body'>Visual prank active.<br>Nothing is actually damaged.</div>" +
          "<button type='button' class='virus-popup-btn'>Ignore</button>";

        var maxX = Math.max(40, window.innerWidth - 280);
        var maxY = Math.max(40, window.innerHeight - 180);
        popup.style.left = Math.floor(Math.random() * maxX) + "px";
        popup.style.top = Math.floor(Math.random() * maxY) + "px";
        virusLayer.appendChild(popup);
        virusState.popups += 1;

        popup.querySelector(".virus-popup-btn").addEventListener("click", function () {
          popup.remove();
        });
      }

      function stopVirusPrank() {
        if (!virusState.active) return;
        virusState.active = false;
        if (virusState.spawnTimer) window.clearInterval(virusState.spawnTimer);
        if (virusState.stopTimer) window.clearTimeout(virusState.stopTimer);
        virusState.spawnTimer = null;
        virusState.stopTimer = null;
        virusState.popups = 0;
        document.body.classList.remove("virus-mode");
        virusLayer.innerHTML = "";
        virusLayer.classList.remove("show");
        virusLayer.setAttribute("aria-hidden", "true");
        showSecret("Virus eradicated.");
      }

      function placeDesktopIconsAtDefault() {
        desktopIcons.forEach(function (icon) {
          var x = parseInt(icon.getAttribute("data-default-x"), 10);
          var y = parseInt(icon.getAttribute("data-default-y"), 10);
          icon.style.left = x + "px";
          icon.style.top = y + "px";
        });
      }
      recycleBinIcon.addEventListener("click", function (event) {
        event.preventDefault();
        openRecycleDialog();
      });

      myComputerIcon.addEventListener("click", function (event) {
        event.preventDefault();
        openMyComputerDialog();
      });

      function startVirusPrank() {
        if (virusState.active) return;
        virusState.active = true;
        virusLayer.classList.add("show");
        virusLayer.setAttribute("aria-hidden", "false");
        document.body.classList.add("virus-mode");
        showSecret("totally-not-virus.exe launched");
        playErrorSound();
        spawnVirusPopup();
        virusState.spawnTimer = window.setInterval(function () {
          if (!virusState.active) return;
          if (virusState.popups >= 14) return;
          spawnVirusPopup();
          if (Math.random() > 0.7) playErrorSound();
        }, 650);
        virusState.stopTimer = window.setTimeout(function () {
          stopVirusPrank();
        }, 14000);
      }

      function hideCookieBanner(saveChoice) {
        cookieBanner.classList.add("hidden");
        if (saveChoice) {
          try {
            window.localStorage.setItem("cookie-banner-dismissed", "1");
          } catch (e) {}
        }
      }

      function initAnalytics() {
        if (analyticsInitialized || !gaMeasurementId) return;
        analyticsInitialized = true;

        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () {
          window.dataLayer.push(arguments);
        };

        var script = document.createElement("script");
        script.async = true;
        script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(gaMeasurementId);
        document.head.appendChild(script);

        window.gtag("js", new Date());
        window.gtag("config", gaMeasurementId, { anonymize_ip: true });
      }

      try {
        if (window.localStorage.getItem("cookie-banner-dismissed") === "1") {
          hideCookieBanner(false);
          initAnalytics();
        }
      } catch (e) {}

      cookieAccept.addEventListener("click", function () {
        hideCookieBanner(true);
        initAnalytics();
      });

      function playRetroClick() {
        var nowMs = Date.now();
        if (nowMs - lastClickAt < 30) return;
        lastClickAt = nowMs;

        if (!audioContext) {
          var AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return;
          audioContext = new AudioCtx();
        }

        if (audioContext.state === "suspended") {
          audioContext.resume();
        }

        var now = audioContext.currentTime;

        // Low "thunk" body.
        var thumpGain = audioContext.createGain();
        thumpGain.gain.setValueAtTime(0.0001, now);
        thumpGain.gain.exponentialRampToValueAtTime(0.26, now + 0.003);
        thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);
        thumpGain.connect(audioContext.destination);

        var thumpOsc = audioContext.createOscillator();
        thumpOsc.type = "triangle";
        thumpOsc.frequency.setValueAtTime(220, now);
        thumpOsc.frequency.exponentialRampToValueAtTime(95, now + 0.06);
        thumpOsc.connect(thumpGain);
        thumpOsc.start(now);
        thumpOsc.stop(now + 0.08);

        // Short high transient for the button switch snap.
        var clickGain = audioContext.createGain();
        clickGain.gain.setValueAtTime(0.0001, now);
        clickGain.gain.exponentialRampToValueAtTime(0.08, now + 0.001);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.012);
        clickGain.connect(audioContext.destination);

        var clickOsc = audioContext.createOscillator();
        clickOsc.type = "square";
        clickOsc.frequency.setValueAtTime(1800, now);
        clickOsc.frequency.exponentialRampToValueAtTime(700, now + 0.01);
        clickOsc.connect(clickGain);
        clickOsc.start(now);
        clickOsc.stop(now + 0.015);
      }

      function playKeyboardKey() {
        var nowMs = Date.now();
        if (nowMs - lastKeySoundAt < 14) return;
        lastKeySoundAt = nowMs;
        if (!ensureAudioContext()) return;

        var now = audioContext.currentTime;
        var velocity = 0.92 + Math.random() * 0.18;

        // Short bright switch click using filtered noise.
        if (!keyNoiseBuffer) {
          var len = Math.floor(audioContext.sampleRate * 0.04);
          keyNoiseBuffer = audioContext.createBuffer(1, len, audioContext.sampleRate);
          var data = keyNoiseBuffer.getChannelData(0);
          for (var i = 0; i < len; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / len);
          }
        }
        var noiseSource = audioContext.createBufferSource();
        noiseSource.buffer = keyNoiseBuffer;
        var noiseFilter = audioContext.createBiquadFilter();
        noiseFilter.type = "highpass";
        noiseFilter.frequency.value = 2300 + Math.random() * 400;
        noiseFilter.Q.value = 0.7;
        var noiseGain = audioContext.createGain();
        noiseGain.gain.setValueAtTime(0.0001, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.06 * velocity, now + 0.0015);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);
        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(audioContext.destination);
        noiseSource.start(now);
        noiseSource.stop(now + 0.03);

        // Main keycap thock.
        var thockGain = audioContext.createGain();
        thockGain.gain.setValueAtTime(0.0001, now + 0.002);
        thockGain.gain.exponentialRampToValueAtTime(0.12 * velocity, now + 0.006);
        thockGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
        thockGain.connect(audioContext.destination);

        var thockOsc = audioContext.createOscillator();
        thockOsc.type = "triangle";
        thockOsc.frequency.setValueAtTime(220 + Math.random() * 35, now + 0.002);
        thockOsc.frequency.exponentialRampToValueAtTime(145 + Math.random() * 25, now + 0.05);
        thockOsc.connect(thockGain);
        thockOsc.start(now + 0.002);
        thockOsc.stop(now + 0.058);

        // Tiny metallic spring tail.
        var springGain = audioContext.createGain();
        springGain.gain.setValueAtTime(0.0001, now + 0.01);
        springGain.gain.exponentialRampToValueAtTime(0.028 * velocity, now + 0.013);
        springGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);
        springGain.connect(audioContext.destination);

        var springOsc = audioContext.createOscillator();
        springOsc.type = "square";
        springOsc.frequency.setValueAtTime(1700 + Math.random() * 180, now + 0.01);
        springOsc.frequency.exponentialRampToValueAtTime(900 + Math.random() * 120, now + 0.07);
        springOsc.connect(springGain);
        springOsc.start(now + 0.01);
        springOsc.stop(now + 0.078);
      }

      function ensureAudioContext() {
        if (systemMuted) return false;
        if (!audioContext) {
          var AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (!AudioCtx) return false;
          audioContext = new AudioCtx();
        }
        if (audioContext.state === "suspended") {
          audioContext.resume();
        }
        return true;
      }

      function playStartupSound() {
        if (!ensureAudioContext()) return;
        var now = audioContext.currentTime;
        var master = audioContext.createGain();
        master.gain.setValueAtTime(0.0001, now);
        master.gain.exponentialRampToValueAtTime(0.085, now + 0.08);
        master.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
        master.connect(audioContext.destination);

        var low = audioContext.createOscillator();
        low.type = "triangle";
        low.frequency.setValueAtTime(246.94, now);
        low.frequency.exponentialRampToValueAtTime(329.63, now + 0.55);
        low.connect(master);
        low.start(now);
        low.stop(now + 1.45);

        var high = audioContext.createOscillator();
        high.type = "sine";
        high.frequency.setValueAtTime(493.88, now + 0.08);
        high.frequency.exponentialRampToValueAtTime(659.25, now + 0.72);
        high.connect(master);
        high.start(now + 0.08);
        high.stop(now + 1.35);
      }

      function playErrorSound() {
        if (!ensureAudioContext()) return;
        var now = audioContext.currentTime;
        var gain = audioContext.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.095, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
        gain.connect(audioContext.destination);

        var osc = audioContext.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(392.0, now + 0.16);
        osc.frequency.setValueAtTime(329.63, now + 0.29);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 0.43);
      }

      function playShutdownSound() {
        if (!ensureAudioContext()) return;
        var now = audioContext.currentTime;
        var gain = audioContext.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.10, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.05);
        gain.connect(audioContext.destination);

        var osc = audioContext.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(392, now);
        osc.frequency.exponentialRampToValueAtTime(146.83, now + 1.0);
        osc.connect(gain);
        osc.start(now);
        osc.stop(now + 1.06);
      }

      function closeStartMenu() {
        startMenu.classList.remove("open");
        startBtn.classList.remove("pressed");
        startMenu.setAttribute("aria-hidden", "true");
      }

      function toggleStartMenu() {
        var willOpen = !startMenu.classList.contains("open");
        if (!willOpen) {
          closeStartMenu();
          return;
        }
        startMenu.classList.add("open");
        startBtn.classList.add("pressed");
        startMenu.setAttribute("aria-hidden", "false");
      }

      function restoreWindow() {
        windowEl.classList.remove("closed");
        windowEl.classList.remove("minimized");
        taskBtn.classList.remove("taskbar-title-inactive");
      }

      // Basic draggable window behavior for non-maximized state.
      var dragState = { active: false, offsetX: 0, offsetY: 0 };
      titlebar.addEventListener("pointerdown", function (event) {
        if (event.target.closest(".window-buttons")) return;
        if (windowEl.classList.contains("maximized")) return;
        var rect = windowEl.getBoundingClientRect();
        windowEl.classList.add("floating");
        windowEl.style.left = rect.left + "px";
        windowEl.style.top = rect.top + "px";
        dragState.active = true;
        dragState.offsetX = event.clientX - rect.left;
        dragState.offsetY = event.clientY - rect.top;
        titlebar.setPointerCapture(event.pointerId);
      });

      titlebar.addEventListener("pointermove", function (event) {
        if (!dragState.active) return;
        windowEl.style.left = Math.max(0, event.clientX - dragState.offsetX) + "px";
        windowEl.style.top = Math.max(0, event.clientY - dragState.offsetY) + "px";
      });

      titlebar.addEventListener("pointerup", function () {
        dragState.active = false;
      });

      minBtn.addEventListener("click", function () {
        windowEl.classList.toggle("minimized");
        windowEl.classList.remove("closed");
        taskBtn.classList.toggle("taskbar-title-inactive", windowEl.classList.contains("minimized"));
      });

      maxBtn.addEventListener("click", function () {
        restoreWindow();
        windowEl.classList.toggle("maximized");
        if (windowEl.classList.contains("maximized")) {
          windowEl.classList.remove("floating");
          windowEl.style.left = "";
          windowEl.style.top = "";
        }
      });

      closeBtn.addEventListener("click", function () {
        windowEl.classList.add("closed");
        taskBtn.classList.add("taskbar-title-inactive");
      });

      taskBtn.addEventListener("click", function () {
        if (windowEl.classList.contains("closed") || windowEl.classList.contains("minimized")) {
          restoreWindow();
          return;
        }
        windowEl.classList.add("minimized");
        taskBtn.classList.add("taskbar-title-inactive");
      });

      startBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        toggleStartMenu();
        var now = Date.now();
        startClicks.push(now);
        while (startClicks.length && now - startClicks[0] > 1600) {
          startClicks.shift();
        }
        if (startClicks.length >= 7) {
          startClicks = [];
          openBsod();
        }
      });

      document.addEventListener("click", function (event) {
        if (!startMenu.contains(event.target) && event.target !== startBtn) {
          closeStartMenu();
        }
        if (!desktopMenu.contains(event.target)) {
          closeDesktopMenu();
        }
        if (!myComputerDialog.contains(event.target) && event.target !== myComputerIcon) {
          myComputerDialog.classList.remove("show");
          myComputerDialog.setAttribute("aria-hidden", "true");
        }
        if (!recycleDialog.contains(event.target) && event.target !== recycleBinIcon) {
          recycleDialog.classList.remove("show");
          recycleDialog.setAttribute("aria-hidden", "true");
        }
      });

      document.querySelector(".desktop").addEventListener("contextmenu", function (event) {
        if (event.target.closest(".window")) return;
        event.preventDefault();
        openDesktopMenu(event.clientX, event.clientY);
      });

      desktopMenu.addEventListener("click", function (event) {
        var btn = event.target.closest("button[data-action]");
        if (!btn) return;
        var action = btn.getAttribute("data-action");
        if (action === "refresh") {
          showSecret("Desktop refreshed.");
        } else if (action === "scanlines") {
          document.body.classList.toggle("scanlines");
          showSecret("Scanlines toggled.");
        } else if (action === "party") {
          document.body.classList.toggle("party-mode");
          showSecret("Party mode toggled.");
        } else if (action === "virus") {
          startVirusPrank();
        } else if (action === "about") {
          showSecret("Thanos Tsiamis - Windows 98 edition.");
        }
        closeDesktopMenu();
      });

      myComputerClose.addEventListener("click", function () {
        myComputerDialog.classList.remove("show");
        myComputerDialog.setAttribute("aria-hidden", "true");
      });

      recycleClose.addEventListener("click", function () {
        recycleDialog.classList.remove("show");
        recycleDialog.setAttribute("aria-hidden", "true");
      });

      recycleEmpty.addEventListener("click", function () {
        recycleCount = 0;
        stopVirusPrank();
        updateRecycleStatus();
        showSecret("Recycle Bin emptied.");
      });

      document.addEventListener("keydown", function (event) {
        var key = (event.key || "").toLowerCase();

        if (key === konami[konamiProgress]) {
          konamiProgress += 1;
          if (konamiProgress === konami.length) {
            konamiProgress = 0;
            document.body.classList.toggle("party-mode");
            showSecret("Easter egg unlocked: Party Mode");
          }
        } else if (key === konami[0]) {
          konamiProgress = 1;
        } else {
          konamiProgress = 0;
        }

        if (key.length === 1 && /[a-z0-9]/.test(key)) {
          typedBuffer = (typedBuffer + key).slice(-10);
          if (typedBuffer.indexOf("win98") !== -1) {
            typedBuffer = "";
            showSecret("Easter egg unlocked: Welcome back to 1998");
          }
        }

        if (event.key === "Escape") {
          closeStartMenu();
          closeBsod();
          stopVirusPrank();
          closeSystemDialogs();
        }
      });

      startMenu.addEventListener("click", function () {
        closeStartMenu();
      });

      shutdownBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        closeStartMenu();
        playShutdownSound();
        showSecret("It is now safe to turn off your computer.");
        windowEl.classList.add("closed");
        taskBtn.classList.add("taskbar-title-inactive");
      });

      trayVolume.addEventListener("click", function (event) {
        event.stopPropagation();
        systemMuted = !systemMuted;
        trayVolume.classList.toggle("is-muted", systemMuted);
        trayVolume.setAttribute("title", systemMuted ? "Volume: muted" : "Volume: on");
        showSecret(systemMuted ? "Volume muted." : "Volume enabled.");
      });

      trayNetwork.addEventListener("click", function (event) {
        event.stopPropagation();
        networkConnected = !networkConnected;
        trayNetwork.classList.toggle("is-offline", !networkConnected);
        trayNetwork.setAttribute("title", networkConnected ? "Network: connected" : "Network: disconnected");
        showSecret(networkConnected ? "Network connected." : "Network disconnected.");
      });

      trayHardware.addEventListener("click", function (event) {
        event.stopPropagation();
        var checks = [
          "No conflicts detected.",
          "USB Mass Storage Device is working properly.",
          "Safe to remove hardware."
        ];
        var message = checks[Math.floor(Math.random() * checks.length)];
        showSecret("Hardware: " + message);
      });

      document.addEventListener("pointerdown", function (event) {
        if (event.button !== 0) return;
        playRetroClick();
      });

      bsod.addEventListener("click", function () {
        closeBsod();
      });

      Array.prototype.slice.call(document.querySelectorAll(".retro-form input[type='text'], .retro-form input[type='email'], .retro-form textarea")).forEach(function (el) {
        el.addEventListener("keydown", function (event) {
          var k = event.key;
          if (k === "Shift" || k === "Alt" || k === "Control" || k === "Meta" || k === "CapsLock" || k === "Tab") {
            return;
          }
          playKeyboardKey();
        });
        el.addEventListener("input", function () {
          playKeyboardKey();
        });
      });

      function updateClock() {
        var now = new Date();
        var h = now.getHours();
        var m = now.getMinutes();
        if (m < 10) m = "0" + m;
        clock.textContent = h + ":" + m;
        statusTime.textContent = h + ":" + m;
      }

      function runBootScreen() {
        try {
          if (window.sessionStorage.getItem("boot-seen") === "1") return;
          window.sessionStorage.setItem("boot-seen", "1");
        } catch (e) {}
        bootScreen.classList.add("show");
        bootScreen.setAttribute("aria-hidden", "false");
        var progress = 0;
        var timer = window.setInterval(function () {
          progress += 7;
          bootProgress.style.width = Math.min(progress, 100) + "%";
          if (progress >= 100) {
            window.clearInterval(timer);
            window.setTimeout(function () {
              bootScreen.classList.remove("show");
              bootScreen.setAttribute("aria-hidden", "true");
              playStartupSound();
            }, 180);
          }
        }, 42);
      }

      runBootScreen();
      placeDesktopIconsAtDefault();
      updateClock();
      setInterval(updateClock, 60000);
    })();
