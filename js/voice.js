/**
 * KRISHI-NIRNAY AI
 * Voice Assistant & Speech Synthesis Engine
 * Web Speech API with Canvas Audio Visualizer and Fallback Simulator
 */

class VoiceEngine {
  constructor(coordinator) {
    this.coordinator = coordinator;
    this.isListening = false;
    this.isSpeaking = false;
    this.recognition = null;
    this.synth = window.speechSynthesis || null;
    this.visualizerCanvas = null;
    this.visualizerCtx = null;
    this.animId = null;
    this.currentVoiceLang = "en-IN";

    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = this.getBCP47(I18N.currentLang);

      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateUIState("listening");
        this.startWaveformAnimation();
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.handleUserVoiceInput(transcript);
      };

      this.recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        this.stopListening();
        this.showFeedback("Could not hear clearly. Try again or select a sample question.");
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (!this.isSpeaking) {
          this.stopWaveformAnimation();
          this.updateUIState("idle");
        }
      };
    }
  }

  getBCP47(langCode) {
    const map = {
      en: "en-IN",
      hi: "hi-IN",
      kn: "kn-IN",
      ta: "ta-IN",
      te: "te-IN",
      mr: "mr-IN",
      bn: "bn-IN",
      gu: "gu-IN",
      ml: "ml-IN",
      or: "or-IN"
    };
    return map[langCode] || "en-IN";
  }

  startListening() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }

    if (this.recognition) {
      try {
        this.recognition.lang = this.getBCP47(I18N.currentLang);
        this.recognition.start();
        return;
      } catch (err) {
        console.warn("Recognition start failed, falling back to simulated input:", err);
      }
    }

    // Fallback if browser blocks microphone or unsupported
    this.simulateListening();
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch(e){}
    }
    this.isListening = false;
    this.stopWaveformAnimation();
    this.updateUIState("idle");
  }

  simulateListening() {
    this.isListening = true;
    this.updateUIState("listening");
    this.startWaveformAnimation();

    const sampleQueries = {
      en: "Should I store my tomatoes for 3 days or sell today?",
      hi: "क्या मुझे 3 दिन टमाटर रोकना चाहिए या आज ही बेचें?",
      kn: "ನನ್ನ ಟೊಮೆಟೊಗಳನ್ನು 3 ದಿನ ಶೇಖರಿಸಬೇಕೆ ಅಥವಾ ಇಂದೇ ಮಾರಾಟ ಮಾಡಬೇಕೆ?"
    };

    setTimeout(() => {
      if (this.isListening) {
        const sample = sampleQueries[I18N.currentLang] || sampleQueries.en;
        this.handleUserVoiceInput(sample);
      }
    }, 2800);
  }

  async handleUserVoiceInput(transcript) {
    this.stopListening();
    this.updateTranscriptUI(transcript);
    this.updateUIState("thinking");

    // Call FarmerAssistantAgent with Actual AI / Gemini / Embedded Neural reasoning
    try {
      const response = await this.coordinator.assistantAgent.respondToQueryAsync(transcript, I18N.currentLang);
      
      let responseText = response.replyEn;
      if (I18N.currentLang === "hi" && response.replyHi) responseText = response.replyHi;
      else if (I18N.currentLang === "kn" && response.replyKn) responseText = response.replyKn;

      this.updateResponseUI(responseText, response.actionCard, response.source);
      this.speak(responseText);
    } catch (e) {
      console.error("AI reasoning error:", e);
      const fallback = this.coordinator.assistantAgent.respondToQuery(transcript, I18N.currentLang);
      this.updateResponseUI(fallback.replyEn, fallback.actionCard);
      this.speak(fallback.replyEn);
    }
  }

  speak(text) {
    if (!this.synth) return;
    this.synth.cancel();

    this.isSpeaking = true;
    this.updateUIState("speaking");
    this.startWaveformAnimation();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.getBCP47(I18N.currentLang);
    utterance.rate = 0.95; // Slightly slower for rural clarity

    // Choose Indian voice if available
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith(utterance.lang) || v.name.includes("India"));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      this.isSpeaking = false;
      this.stopWaveformAnimation();
      this.updateUIState("idle");
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.stopWaveformAnimation();
      this.updateUIState("idle");
    };

    this.synth.speak(utterance);
  }

  // Visualizer Animation
  attachCanvas(canvas) {
    this.visualizerCanvas = canvas;
    if (canvas) {
      this.visualizerCtx = canvas.getContext("2d");
      this.drawIdleWaveform();
    }
  }

  startWaveformAnimation() {
    if (this.animId) cancelAnimationFrame(this.animId);
    let step = 0;

    const render = () => {
      if (!this.visualizerCanvas || !this.visualizerCtx) return;
      const ctx = this.visualizerCtx;
      const width = this.visualizerCanvas.width;
      const height = this.visualizerCanvas.height;

      ctx.clearRect(0, 0, width, height);

      const bars = 32;
      const barWidth = width / bars;
      step += 0.15;

      for (let i = 0; i < bars; i++) {
        const amplitude = this.isListening ? Math.sin(step + i * 0.4) * 25 + 30 : Math.sin(step * 0.8 + i * 0.3) * 18 + 22;
        const barHeight = Math.max(6, Math.min(height * 0.85, amplitude));
        const x = i * barWidth + barWidth * 0.15;
        const y = (height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (this.isListening) {
          gradient.addColorStop(0, "#22c55e");
          gradient.addColorStop(1, "#15803d");
        } else {
          gradient.addColorStop(0, "#38bdf8");
          gradient.addColorStop(1, "#0284c7");
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth * 0.7, barHeight, 4);
        ctx.fill();
      }

      this.animId = requestAnimationFrame(render);
    };

    this.animId = requestAnimationFrame(render);
  }

  stopWaveformAnimation() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    this.drawIdleWaveform();
  }

  drawIdleWaveform() {
    if (!this.visualizerCanvas || !this.visualizerCtx) return;
    const ctx = this.visualizerCtx;
    const width = this.visualizerCanvas.width;
    const height = this.visualizerCanvas.height;

    ctx.clearRect(0, 0, width, height);
    const bars = 32;
    const barWidth = width / bars;

    for (let i = 0; i < bars; i++) {
      const barHeight = 6 + Math.sin(i * 0.3) * 4;
      const x = i * barWidth + barWidth * 0.15;
      const y = (height - barHeight) / 2;

      ctx.fillStyle = "#cbd5e1";
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth * 0.7, barHeight, 3);
      ctx.fill();
    }
  }

  updateUIState(state) {
    const statusText = document.getElementById("voice-modal-status");
    const micBtn = document.getElementById("voice-modal-mic-btn");
    if (!statusText || !micBtn) return;

    if (state === "listening") {
      statusText.innerHTML = `<span class="pulse-dot active"></span> ${I18N.t("listening")}`;
      micBtn.classList.add("listening-pulse");
      micBtn.innerHTML = `<span>🛑</span>`;
    } else if (state === "thinking") {
      statusText.innerHTML = `<span class="pulse-dot active"></span> 🤖 Analyzing with Gemini AI & Agmarknet...`;
      micBtn.classList.remove("listening-pulse");
      micBtn.innerHTML = `<span>⏳</span>`;
    } else if (state === "speaking") {
      statusText.innerHTML = `<span class="pulse-dot speaker"></span> Speaking response...`;
      micBtn.classList.remove("listening-pulse");
      micBtn.innerHTML = `<span>🔊</span>`;
    } else {
      statusText.innerHTML = I18N.t("speakNow");
      micBtn.classList.remove("listening-pulse");
      micBtn.innerHTML = `<span>🎙️</span>`;
    }
  }

  updateTranscriptUI(text) {
    const transBox = document.getElementById("voice-modal-transcript");
    if (transBox) {
      transBox.innerHTML = `<strong>You said:</strong> "${text}"`;
      transBox.classList.remove("hidden");
    }
  }

  updateResponseUI(text, actionCard, source) {
    const respBox = document.getElementById("voice-modal-response");
    if (respBox) {
      let html = `<div style="font-size:11px; color:#a7f3d0; margin-bottom:6px; font-weight:700;">📡 Source: ${source || 'KRISHI-NIRNAY AI'}</div>`;
      html += `<p class="voice-ai-bubble" style="white-space: pre-line;">${text}</p>`;
      if (actionCard) {
        html += `
          <div class="voice-action-card">
            <div class="voice-card-header">
              <span class="badge badge-success">${actionCard.title}</span>
              <span class="badge badge-outline">${actionCard.gainPercent}</span>
            </div>
            <h4>${actionCard.mandi}</h4>
            <div class="voice-net-profit">${actionCard.netProfit}</div>
          </div>
        `;
      }
      respBox.innerHTML = html;
      respBox.classList.remove("hidden");
    }
  }

  showFeedback(msg) {
    const statusText = document.getElementById("voice-modal-status");
    if (statusText) statusText.innerText = msg;
  }
}

window.VoiceEngine = VoiceEngine;
