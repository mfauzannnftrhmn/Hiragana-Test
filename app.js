/**
 * Aplikasi Belajar Kosakata Hiragana & Kuis Interaktif
 * Berdasarkan Lembar Ajar Pertemuan 1-2
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==================== STATE MANAGEMENT ====================
  const state = {
    activeTab: 'tab-vocab',
    searchQuery: '',
    selectedCategory: 'all',
    showRomaji: true,

    // Flashcard State
    flashcardList: [...VOCAB_LIST],
    flashcardIndex: 0,
    isCardFlipped: false,

    // Quiz State
    quizMode: 'hiraganaToArti', // 'hiraganaToArti', 'artiToHiragana', 'romajiToHiragana'
    quizCategory: 'all',
    quizQuestionCount: 10,
    quizQuestions: [],
    quizCurrentIndex: 0,
    quizScore: 0,
    quizWrongAnswers: [],
    quizAnswerLocked: false
  };

  // ==================== AUDIO SYNTHESIZER (WEB AUDIO API & SPEECH) ====================
  const audioCtx = (window.AudioContext || window.webkitAudioContext) ? new (window.AudioContext || window.webkitAudioContext)() : null;

  function resumeAudioContext() {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Synthesizer Sound Effects
  function playSuccessSfx() {
    if (!audioCtx) return;
    resumeAudioContext();
    const now = audioCtx.currentTime;

    // Pleasant major two-note chime
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.setValueAtTime(880, now + 0.1); // A5
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);
  }

  function playErrorSfx() {
    if (!audioCtx) return;
    resumeAudioContext();
    const now = audioCtx.currentTime;

    // Soft low buzz/thud
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(120, now + 0.25);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  function playFlipSfx() {
    if (!audioCtx) return;
    resumeAudioContext();
    const now = audioCtx.currentTime;

    // Quick soft paper flip click
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  function playCelebrationSfx() {
    if (!audioCtx) return;
    resumeAudioContext();
    const now = audioCtx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0.12, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.3);
    });
  }

  // Japanese Pronunciation via Web Speech API
  function speakJapanese(text) {
    if (!('speechSynthesis' in window)) {
      alert('Browser Anda tidak mendukung fitur Web Speech API.');
      return;
    }
    window.speechSynthesis.cancel(); // Stop current speech
    const cleanText = text.replace(/～|~/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.85; // Slightly slower for better learning clarity

    // Try to find a native Japanese voice if available
    const voices = window.speechSynthesis.getVoices();
    const jaVoice = voices.find(v => v.lang.includes('ja') || v.lang.includes('JP'));
    if (jaVoice) {
      utterance.voice = jaVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  // Pre-load voices
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }

  // ==================== TAB SWITCHING ====================
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  function switchTab(tabId) {
    state.activeTab = tabId;
    navButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    tabPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === tabId);
    });

    if (tabId === 'tab-flashcard') {
      updateFlashcardView();
    }
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // ==================== INITIALIZE COUNTERS & RULES ====================
  function initCounters() {
    const totalCount = VOCAB_LIST.length;
    document.getElementById('totalVocabCount').textContent = totalCount;
    document.getElementById('countAll').textContent = totalCount;

    const salamCount = VOCAB_LIST.filter(v => v.kategori === 'salam').length;
    const orangCount = VOCAB_LIST.filter(v => v.kategori === 'orang').length;
    const keluargaCount = VOCAB_LIST.filter(v => v.kategori === 'keluarga').length;
    const gelarCount = VOCAB_LIST.filter(v => v.kategori === 'gelar').length;

    document.getElementById('countSalam').textContent = salamCount;
    document.getElementById('countOrang').textContent = orangCount;
    document.getElementById('countKeluarga').textContent = keluargaCount;
    document.getElementById('countGelar').textContent = gelarCount;
  }

  function renderRulesSection() {
    const container = document.getElementById('rulesGrid');
    if (!container) return;

    container.innerHTML = HIRAGANA_RULES.map(rule => `
      <div class="rule-box">
        <h4>${rule.title}</h4>
        <p>${rule.desc}</p>
        <div class="rule-examples">
          <strong>Contoh:</strong>
          <ul>
            ${rule.examples.map(ex => `<li>${ex}</li>`).join('')}
          </ul>
        </div>
      </div>
    `).join('');
  }

  // ==================== TAB 1: DAFTAR KOSAKATA ====================
  const vocabGrid = document.getElementById('vocabGrid');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const filterResultText = document.getElementById('filterResultText');
  const toggleRomaji = document.getElementById('toggleRomaji');
  const catPills = document.querySelectorAll('.cat-pill');

  function renderVocabList() {
    const query = state.searchQuery.toLowerCase().trim();
    const category = state.selectedCategory;

    const filtered = VOCAB_LIST.filter(item => {
      const matchCat = category === 'all' || item.kategori === category;
      const matchQuery = !query ||
        item.hiragana.toLowerCase().includes(query) ||
        item.romaji.toLowerCase().includes(query) ||
        item.arti.toLowerCase().includes(query) ||
        (item.catatan && item.catatan.toLowerCase().includes(query));
      return matchCat && matchQuery;
    });

    filterResultText.textContent = `Menampilkan ${filtered.length} kosakata`;

    if (filtered.length === 0) {
      vocabGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h3>Kosakata tidak ditemukan</h3>
          <p>Coba gunakan kata kunci pencarian yang lain atau pilih kategori "Semua".</p>
        </div>
      `;
      return;
    }

    vocabGrid.innerHTML = filtered.map(item => `
      <div class="vocab-card" data-id="${item.id}">
        <div class="card-top">
          <span class="card-cat-badge">${item.kategoriLabel}</span>
          <button class="card-audio-btn" data-speak="${item.hiragana}" title="Dengarkan pengucapan ${item.romaji}">
            🔊
          </button>
        </div>
        <div class="card-hiragana">${item.hiragana}</div>
        <div class="card-romaji ${state.showRomaji ? '' : 'hidden-romaji'}">${item.romaji}</div>
        <div class="card-meaning">${item.arti}</div>
        ${item.catatan ? `<div class="card-note">💡 ${item.catatan}</div>` : ''}
      </div>
    `).join('');

    // Attach speak button event listeners
    vocabGrid.querySelectorAll('.card-audio-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        speakJapanese(btn.dataset.speak);
      });
    });
  }

  // Search input handler
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
    renderVocabList();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    state.searchQuery = '';
    clearSearchBtn.style.display = 'none';
    renderVocabList();
    searchInput.focus();
  });

  // Category pills handler
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.selectedCategory = pill.dataset.cat;
      renderVocabList();
    });
  });

  // Toggle Romaji handler
  toggleRomaji.addEventListener('change', (e) => {
    state.showRomaji = e.target.checked;
    renderVocabList();
  });

  document.getElementById('btnPlayAllHelp').addEventListener('click', () => {
    alert("Tips Audio:\n• Fitur audio menggunakan Web Speech API pengucapan bahasa Jepang (ja-JP).\n• Di smartphone atau PC, pastikan volume suara aktif.\n• Anda dapat mengklik tombol 🔊 pada setiap kartu untuk mendengar pelafalan asli.");
  });

  // ==================== TAB 2: FLASHCARD ====================
  const flashcardCategorySelect = document.getElementById('flashcardCategory');
  const mainFlashcard = document.getElementById('mainFlashcard');
  const fcCurrentIndex = document.getElementById('fcCurrentIndex');
  const fcTotalCards = document.getElementById('fcTotalCards');
  const fcProgressBar = document.getElementById('fcProgressBar');
  const fcFrontHiragana = document.getElementById('fcFrontHiragana');
  const fcBackRomaji = document.getElementById('fcBackRomaji');
  const fcBackArti = document.getElementById('fcBackArti');
  const fcBackNote = document.getElementById('fcBackNote');
  const btnPrevCard = document.getElementById('btnPrevCard');
  const btnFlipCard = document.getElementById('btnFlipCard');
  const btnNextCard = document.getElementById('btnNextCard');
  const btnShuffleFlashcards = document.getElementById('btnShuffleFlashcards');
  const btnResetFlashcards = document.getElementById('btnResetFlashcards');
  const fcFrontAudioBtn = document.getElementById('fcFrontAudioBtn');
  const fcBackAudioBtn = document.getElementById('fcBackAudioBtn');

  function updateFlashcardList() {
    const cat = flashcardCategorySelect.value;
    if (cat === 'all') {
      state.flashcardList = [...VOCAB_LIST];
    } else {
      state.flashcardList = VOCAB_LIST.filter(v => v.kategori === cat);
    }
    state.flashcardIndex = 0;
    state.isCardFlipped = false;
    mainFlashcard.classList.remove('flipped');
    updateFlashcardView();
  }

  function updateFlashcardView() {
    if (state.flashcardList.length === 0) return;

    const item = state.flashcardList[state.flashcardIndex];
    fcCurrentIndex.textContent = state.flashcardIndex + 1;
    fcTotalCards.textContent = state.flashcardList.length;

    const percent = ((state.flashcardIndex + 1) / state.flashcardList.length) * 100;
    fcProgressBar.style.width = `${percent}%`;

    fcFrontHiragana.textContent = item.hiragana;
    fcBackRomaji.textContent = item.romaji;
    fcBackArti.textContent = item.arti;
    fcBackNote.textContent = item.catatan ? `💡 ${item.catatan}` : `${item.kategoriLabel}`;

    // Update audio buttons
    fcFrontAudioBtn.dataset.speak = item.hiragana;
    fcBackAudioBtn.dataset.speak = item.hiragana;
  }

  function toggleFlip() {
    state.isCardFlipped = !state.isCardFlipped;
    mainFlashcard.classList.toggle('flipped', state.isCardFlipped);
    playFlipSfx();
  }

  function nextFlashcard() {
    if (state.flashcardIndex < state.flashcardList.length - 1) {
      state.flashcardIndex++;
    } else {
      state.flashcardIndex = 0; // Loop back
    }
    state.isCardFlipped = false;
    mainFlashcard.classList.remove('flipped');
    updateFlashcardView();
  }

  function prevFlashcard() {
    if (state.flashcardIndex > 0) {
      state.flashcardIndex--;
    } else {
      state.flashcardIndex = state.flashcardList.length - 1; // Loop to end
    }
    state.isCardFlipped = false;
    mainFlashcard.classList.remove('flipped');
    updateFlashcardView();
  }

  function shuffleFlashcards() {
    // Fisher-Yates shuffle
    for (let i = state.flashcardList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [state.flashcardList[i], state.flashcardList[j]] = [state.flashcardList[j], state.flashcardList[i]];
    }
    state.flashcardIndex = 0;
    state.isCardFlipped = false;
    mainFlashcard.classList.remove('flipped');
    updateFlashcardView();
    playSuccessSfx();
  }

  flashcardCategorySelect.addEventListener('change', updateFlashcardList);
  mainFlashcard.addEventListener('click', toggleFlip);
  btnFlipCard.addEventListener('click', toggleFlip);
  btnNextCard.addEventListener('click', nextFlashcard);
  btnPrevCard.addEventListener('click', prevFlashcard);
  btnShuffleFlashcards.addEventListener('click', shuffleFlashcards);
  btnResetFlashcards.addEventListener('click', () => {
    state.flashcardIndex = 0;
    state.isCardFlipped = false;
    mainFlashcard.classList.remove('flipped');
    updateFlashcardView();
  });

  fcFrontAudioBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    speakJapanese(fcFrontAudioBtn.dataset.speak);
  });

  fcBackAudioBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    speakJapanese(fcBackAudioBtn.dataset.speak);
  });

  // Keyboard navigation for Flashcards
  window.addEventListener('keydown', (e) => {
    if (state.activeTab !== 'tab-flashcard') return;
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') return;

    if (e.code === 'Space') {
      e.preventDefault();
      toggleFlip();
    } else if (e.code === 'ArrowRight') {
      e.preventDefault();
      nextFlashcard();
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      prevFlashcard();
    }
  });

  // ==================== TAB 3: KUIS INTERAKTIF ====================
  const quizSetupScreen = document.getElementById('quizSetupScreen');
  const quizPlayScreen = document.getElementById('quizPlayScreen');
  const quizResultScreen = document.getElementById('quizResultScreen');

  const quizCategorySelect = document.getElementById('quizCategorySelect');
  const numPills = document.querySelectorAll('.num-pill');
  const btnStartQuiz = document.getElementById('btnStartQuiz');
  const btnQuitQuiz = document.getElementById('btnQuitQuiz');

  const qCurrentNum = document.getElementById('qCurrentNum');
  const qTotalNum = document.getElementById('qTotalNum');
  const qLiveScore = document.getElementById('qLiveScore');
  const quizProgressBar = document.getElementById('quizProgressBar');
  const questionTypeTag = document.getElementById('questionTypeTag');
  const questionPrompt = document.getElementById('questionPrompt');
  const questionSubtext = document.getElementById('questionSubtext');
  const questionAudioBtn = document.getElementById('questionAudioBtn');
  const optionsContainer = document.getElementById('optionsContainer');

  const answerFeedbackBox = document.getElementById('answerFeedbackBox');
  const feedbackIcon = document.getElementById('feedbackIcon');
  const feedbackTitle = document.getElementById('feedbackTitle');
  const feedbackDetail = document.getElementById('feedbackDetail');
  const btnNextQuestion = document.getElementById('btnNextQuestion');

  // Result Screen Elements
  const resultFinalScore = document.getElementById('resultFinalScore');
  const resultCorrectCount = document.getElementById('resultCorrectCount');
  const resultWrongCount = document.getElementById('resultWrongCount');
  const resultAccuracy = document.getElementById('resultAccuracy');
  const resultEmoji = document.getElementById('resultEmoji');
  const resultTitle = document.getElementById('resultTitle');
  const resultSubtitle = document.getElementById('resultSubtitle');
  const wrongQuestionsReview = document.getElementById('wrongQuestionsReview');
  const wrongReviewList = document.getElementById('wrongReviewList');
  const btnRetryQuiz = document.getElementById('btnRetryQuiz');
  const btnRetryWrongOnly = document.getElementById('btnRetryWrongOnly');
  const btnBackToVocab = document.getElementById('btnBackToVocab');

  // Amount selection
  numPills.forEach(pill => {
    pill.addEventListener('click', () => {
      numPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      state.quizQuestionCount = pill.dataset.amount === 'all' ? 'all' : parseInt(pill.dataset.amount, 10);
    });
  });

  function startQuiz(customQuestions = null) {
    const selectedRadio = document.querySelector('input[name="quizType"]:checked');
    state.quizMode = selectedRadio ? selectedRadio.value : 'hiraganaToArti';
    state.quizCategory = quizCategorySelect.value;
    state.quizCurrentIndex = 0;
    state.quizScore = 0;
    state.quizWrongAnswers = [];
    state.quizAnswerLocked = false;

    if (customQuestions) {
      state.quizQuestions = customQuestions;
    } else {
      // Filter by category
      let pool = VOCAB_LIST;
      if (state.quizCategory !== 'all') {
        pool = VOCAB_LIST.filter(v => v.kategori === state.quizCategory);
      }

      // Shuffle pool
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      const count = state.quizQuestionCount === 'all' ? shuffled.length : Math.min(state.quizQuestionCount, shuffled.length);
      state.quizQuestions = shuffled.slice(0, count);
    }

    if (state.quizQuestions.length === 0) {
      alert('Tidak ada kosakata dalam kategori yang dipilih.');
      return;
    }

    // Switch screens
    quizSetupScreen.classList.add('hidden');
    quizResultScreen.classList.add('hidden');
    quizPlayScreen.classList.remove('hidden');

    displayQuestion();
  }

  function displayQuestion() {
    state.quizAnswerLocked = false;
    answerFeedbackBox.classList.add('hidden');

    const total = state.quizQuestions.length;
    const currentIdx = state.quizCurrentIndex;
    const item = state.quizQuestions[currentIdx];

    qCurrentNum.textContent = currentIdx + 1;
    qTotalNum.textContent = total;
    qLiveScore.textContent = state.quizScore;

    const progress = ((currentIdx + 1) / total) * 100;
    quizProgressBar.style.width = `${progress}%`;

    // Configure question display based on mode
    if (state.quizMode === 'hiraganaToArti') {
      questionTypeTag.textContent = 'Tebak Arti Bahasa Indonesia';
      questionPrompt.textContent = item.hiragana;
      questionSubtext.textContent = `Ejaan Romaji: ${item.romaji}`;
      questionAudioBtn.style.display = 'inline-block';
      questionAudioBtn.dataset.speak = item.hiragana;
    } else if (state.quizMode === 'artiToHiragana') {
      questionTypeTag.textContent = 'Tebak Tulisan Hiragana';
      questionPrompt.textContent = item.arti;
      questionSubtext.textContent = `Kategori: ${item.kategoriLabel}`;
      questionAudioBtn.style.display = 'none';
    } else { // romajiToHiragana
      questionTypeTag.textContent = 'Cocokkan Ejaan Romaji ke Hiragana';
      questionPrompt.textContent = item.romaji;
      questionSubtext.textContent = `Arti: ${item.arti}`;
      questionAudioBtn.style.display = 'none';
    }

    // Generate 4 Options (1 correct + 3 distinct distractors)
    const options = generateOptions(item, state.quizMode);
    optionsContainer.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `
        <span class="option-letter">${letters[idx]}</span>
        <span class="option-label">${opt.label}</span>
      `;
      btn.addEventListener('click', () => handleOptionSelect(opt, btn, item));
      optionsContainer.appendChild(btn);
    });
  }

  function generateOptions(correctItem, mode) {
    const isTargetArti = mode === 'hiraganaToArti';
    const correctLabel = isTargetArti ? correctItem.arti : correctItem.hiragana;

    // Distractor pool
    const distractors = VOCAB_LIST.filter(v => v.id !== correctItem.id);
    const shuffledDistractors = [...distractors].sort(() => 0.5 - Math.random());

    const chosenDistractors = [];
    const usedLabels = new Set([correctLabel]);

    for (let d of shuffledDistractors) {
      const label = isTargetArti ? d.arti : d.hiragana;
      if (!usedLabels.has(label)) {
        usedLabels.add(label);
        chosenDistractors.push({ label, isCorrect: false });
      }
      if (chosenDistractors.length === 3) break;
    }

    const allOptions = [
      { label: correctLabel, isCorrect: true },
      ...chosenDistractors
    ];

    // Shuffle options order
    return allOptions.sort(() => 0.5 - Math.random());
  }

  function handleOptionSelect(selectedOpt, btnElement, currentItem) {
    if (state.quizAnswerLocked) return;
    state.quizAnswerLocked = true;

    const allOptionBtns = optionsContainer.querySelectorAll('.option-btn');
    allOptionBtns.forEach(b => b.disabled = true);

    const isCorrect = selectedOpt.isCorrect;

    if (isCorrect) {
      btnElement.classList.add('selected-correct');
      state.quizScore += 10;
      qLiveScore.textContent = state.quizScore;
      playSuccessSfx();

      feedbackIcon.textContent = '🎉';
      feedbackTitle.textContent = 'Benar Sekali!';
      feedbackTitle.style.color = 'var(--success)';
      feedbackDetail.innerHTML = `<strong>${currentItem.hiragana}</strong> (${currentItem.romaji}) = <em>${currentItem.arti}</em>`;
      answerFeedbackBox.className = 'feedback-box correct';
    } else {
      btnElement.classList.add('selected-wrong');
      playErrorSfx();

      // Highlight the correct one
      allOptionBtns.forEach(b => {
        const text = b.querySelector('.option-label').textContent;
        const correctText = state.quizMode === 'hiraganaToArti' ? currentItem.arti : currentItem.hiragana;
        if (text === correctText) {
          b.classList.add('reveal-correct');
        }
      });

      // Record wrong answer
      state.quizWrongAnswers.push({
        item: currentItem,
        userAnswer: selectedOpt.label
      });

      feedbackIcon.textContent = '❌';
      feedbackTitle.textContent = 'Kurang Tepat!';
      feedbackTitle.style.color = 'var(--danger)';
      feedbackDetail.innerHTML = `Jawaban yang benar untuk <strong>${currentItem.hiragana}</strong> (${currentItem.romaji}) adalah <strong>${currentItem.arti}</strong>`;
      answerFeedbackBox.className = 'feedback-box wrong';
    }

    answerFeedbackBox.classList.remove('hidden');
  }

  btnNextQuestion.addEventListener('click', () => {
    state.quizCurrentIndex++;
    if (state.quizCurrentIndex < state.quizQuestions.length) {
      displayQuestion();
    } else {
      finishQuiz();
    }
  });

  function finishQuiz() {
    quizPlayScreen.classList.add('hidden');
    quizResultScreen.classList.remove('hidden');

    const total = state.quizQuestions.length;
    const correctCount = total - state.quizWrongAnswers.length;
    const accuracy = Math.round((correctCount / total) * 100);
    const finalScore = accuracy;

    resultFinalScore.textContent = finalScore;
    resultCorrectCount.textContent = correctCount;
    resultWrongCount.textContent = state.quizWrongAnswers.length;
    resultAccuracy.textContent = `${accuracy}%`;

    // Dynamic celebration / motivation message
    if (accuracy === 100) {
      resultEmoji.textContent = '🏆';
      resultTitle.textContent = 'Sugoi! Sempurna!';
      resultSubtitle.textContent = 'Hebat sekali! Kamu menjawab semua pertanyaan dengan benar tanpa cela.';
      playCelebrationSfx();
    } else if (accuracy >= 80) {
      resultEmoji.textContent = '🌟';
      resultTitle.textContent = 'Sangat Bagus!';
      resultSubtitle.textContent = 'Pemahaman kosakata Hiragana kamu sudah sangat baik. Pertahankan!';
      playSuccessSfx();
    } else if (accuracy >= 60) {
      resultEmoji.textContent = '👍';
      resultTitle.textContent = 'Cukup Bagus!';
      resultSubtitle.textContent = 'Teruslah berlatih flashcard untuk memperkuat ingatan kosakata yang salah.';
    } else {
      resultEmoji.textContent = '💪';
      resultTitle.textContent = 'Tetap Semangat!';
      resultSubtitle.textContent = 'Jangan menyerah! Buka kembali daftar kosakata dan pelajari lagi ya.';
    }

    // Wrong questions list review
    if (state.quizWrongAnswers.length > 0) {
      wrongQuestionsReview.classList.remove('hidden');
      btnRetryWrongOnly.classList.remove('hidden');
      wrongReviewList.innerHTML = state.quizWrongAnswers.map(({ item, userAnswer }) => `
        <div class="wrong-item">
          <div>
            <div class="wrong-item-jp">${item.hiragana} (${item.romaji})</div>
            <div class="wrong-item-ans">Jawabanmu: <del>${userAnswer}</del> ➔ Jawaban Benar: <strong>${item.arti}</strong></div>
          </div>
          <button class="card-audio-btn" data-speak="${item.hiragana}" title="Dengarkan pelafalan">🔊</button>
        </div>
      `).join('');

      wrongReviewList.querySelectorAll('.card-audio-btn').forEach(b => {
        b.addEventListener('click', () => speakJapanese(b.dataset.speak));
      });
    } else {
      wrongQuestionsReview.classList.add('hidden');
      btnRetryWrongOnly.classList.add('hidden');
    }
  }

  // Quiz Control Listeners
  btnStartQuiz.addEventListener('click', () => startQuiz());
  btnQuitQuiz.addEventListener('click', () => {
    if (confirm('Apakah kamu yakin ingin mengakhiri kuis yang sedang berlangsung?')) {
      quizPlayScreen.classList.add('hidden');
      quizSetupScreen.classList.remove('hidden');
    }
  });

  questionAudioBtn.addEventListener('click', () => {
    speakJapanese(questionAudioBtn.dataset.speak);
  });

  btnRetryQuiz.addEventListener('click', () => {
    quizResultScreen.classList.add('hidden');
    quizSetupScreen.classList.remove('hidden');
  });

  btnRetryWrongOnly.addEventListener('click', () => {
    const wrongList = state.quizWrongAnswers.map(w => w.item);
    startQuiz(wrongList);
  });

  btnBackToVocab.addEventListener('click', () => {
    switchTab('tab-vocab');
  });

  // ==================== TAB 5: KUIS HURUF PER KARAKTER ====================
  const charQuizState = {
    mode: 'hiraganaToRomaji', // or 'romajiToHiragana'
    group: 'all',
    questionCount: 10,
    questions: [],
    currentIndex: 0,
    score: 0,
    wrongAnswers: [],
    answerLocked: false
  };

  // DOM Elements - Char Quiz
  const charQuizSetupScreen = document.getElementById('charQuizSetupScreen');
  const charQuizPlayScreen = document.getElementById('charQuizPlayScreen');
  const charQuizResultScreen = document.getElementById('charQuizResultScreen');
  const charQuizGroupSelect = document.getElementById('charQuizGroupSelect');
  const charQuizNumPillsContainer = document.getElementById('charQuizNumPills');
  const charQuizNumPills = charQuizNumPillsContainer.querySelectorAll('.num-pill');

  const cqCurrentNum = document.getElementById('cqCurrentNum');
  const cqTotalNum = document.getElementById('cqTotalNum');
  const cqLiveScore = document.getElementById('cqLiveScore');
  const charQuizProgressBar = document.getElementById('charQuizProgressBar');
  const cqQuestionTypeTag = document.getElementById('cqQuestionTypeTag');
  const cqQuestionPrompt = document.getElementById('cqQuestionPrompt');
  const cqQuestionSubtext = document.getElementById('cqQuestionSubtext');
  const cqQuestionAudioBtn = document.getElementById('cqQuestionAudioBtn');
  const cqOptionsContainer = document.getElementById('cqOptionsContainer');

  const cqAnswerFeedbackBox = document.getElementById('cqAnswerFeedbackBox');
  const cqFeedbackIcon = document.getElementById('cqFeedbackIcon');
  const cqFeedbackTitle = document.getElementById('cqFeedbackTitle');
  const cqFeedbackDetail = document.getElementById('cqFeedbackDetail');
  const btnNextCharQuestion = document.getElementById('btnNextCharQuestion');

  const cqResultEmoji = document.getElementById('cqResultEmoji');
  const cqResultTitle = document.getElementById('cqResultTitle');
  const cqResultSubtitle = document.getElementById('cqResultSubtitle');
  const cqResultFinalScore = document.getElementById('cqResultFinalScore');
  const cqResultCorrectCount = document.getElementById('cqResultCorrectCount');
  const cqResultWrongCount = document.getElementById('cqResultWrongCount');
  const cqResultAccuracy = document.getElementById('cqResultAccuracy');
  const cqWrongReviewContainer = document.getElementById('cqWrongReviewContainer');
  const cqWrongReviewList = document.getElementById('cqWrongReviewList');
  const btnRetryCharQuiz = document.getElementById('btnRetryCharQuiz');
  const btnRetryCharWrongOnly = document.getElementById('btnRetryCharWrongOnly');
  const btnCharQuizToVocab = document.getElementById('btnCharQuizToVocab');
  const btnStartCharQuiz = document.getElementById('btnStartCharQuiz');
  const btnQuitCharQuiz = document.getElementById('btnQuitCharQuiz');

  // Number pills for char quiz
  charQuizNumPills.forEach(pill => {
    pill.addEventListener('click', () => {
      charQuizNumPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      charQuizState.questionCount = pill.dataset.amount === 'all' ? 'all' : parseInt(pill.dataset.amount, 10);
    });
  });

  function startCharQuiz(customChars = null) {
    const selectedRadio = document.querySelector('input[name="charQuizType"]:checked');
    charQuizState.mode = selectedRadio ? selectedRadio.value : 'hiraganaToRomaji';
    charQuizState.group = charQuizGroupSelect.value;
    charQuizState.currentIndex = 0;
    charQuizState.score = 0;
    charQuizState.wrongAnswers = [];
    charQuizState.answerLocked = false;

    if (customChars) {
      charQuizState.questions = customChars;
    } else {
      // Filter by group
      let pool = HIRAGANA_CHARS;
      if (charQuizState.group !== 'all') {
        pool = HIRAGANA_CHARS.filter(c => c.group === charQuizState.group);
      }

      // Shuffle
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      const count = charQuizState.questionCount === 'all' ? shuffled.length : Math.min(charQuizState.questionCount, shuffled.length);
      charQuizState.questions = shuffled.slice(0, count);
    }

    if (charQuizState.questions.length === 0) {
      alert('Tidak ada huruf dalam grup yang dipilih.');
      return;
    }

    // Switch screens
    charQuizSetupScreen.classList.add('hidden');
    charQuizResultScreen.classList.add('hidden');
    charQuizPlayScreen.classList.remove('hidden');

    displayCharQuestion();
  }

  function displayCharQuestion() {
    charQuizState.answerLocked = false;
    cqAnswerFeedbackBox.classList.add('hidden');

    const total = charQuizState.questions.length;
    const idx = charQuizState.currentIndex;
    const item = charQuizState.questions[idx];

    cqCurrentNum.textContent = idx + 1;
    cqTotalNum.textContent = total;
    cqLiveScore.textContent = charQuizState.score;

    const progress = ((idx + 1) / total) * 100;
    charQuizProgressBar.style.width = `${progress}%`;

    if (charQuizState.mode === 'hiraganaToRomaji') {
      cqQuestionTypeTag.textContent = 'Tebak Bacaan Romaji';
      cqQuestionPrompt.textContent = item.char;
      cqQuestionPrompt.classList.remove('romaji-mode');
      cqQuestionSubtext.textContent = `Grup: ${item.groupLabel} • Deret: ${item.row}`;
      cqQuestionAudioBtn.style.display = 'inline-block';
      cqQuestionAudioBtn.dataset.speak = item.char;
    } else {
      cqQuestionTypeTag.textContent = 'Tebak Huruf Hiragana';
      cqQuestionPrompt.textContent = item.romaji;
      cqQuestionPrompt.classList.add('romaji-mode');
      cqQuestionSubtext.textContent = `Grup: ${item.groupLabel} • Deret: ${item.row}`;
      cqQuestionAudioBtn.style.display = 'none';
    }

    // Generate 4 options
    const options = generateCharOptions(item, charQuizState.mode);
    cqOptionsContainer.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';

      if (charQuizState.mode === 'hiraganaToRomaji') {
        // Show romaji as answers
        btn.innerHTML = `
          <span class="option-letter">${letters[i]}</span>
          <span class="option-label">${opt.label}</span>
        `;
      } else {
        // Show hiragana as answers
        btn.innerHTML = `
          <span class="option-letter">${letters[i]}</span>
          <span class="option-label option-hiragana">${opt.label}</span>
        `;
      }

      btn.addEventListener('click', () => handleCharOptionSelect(opt, btn, item));
      cqOptionsContainer.appendChild(btn);
    });
  }

  function generateCharOptions(correctItem, mode) {
    const isTargetRomaji = mode === 'hiraganaToRomaji';
    const correctLabel = isTargetRomaji ? correctItem.romaji : correctItem.char;

    // Build distractor pool from all characters
    const distractors = HIRAGANA_CHARS.filter(c => c.char !== correctItem.char);
    const shuffledDistractors = [...distractors].sort(() => 0.5 - Math.random());

    const chosen = [];
    const usedLabels = new Set([correctLabel]);

    for (const d of shuffledDistractors) {
      const label = isTargetRomaji ? d.romaji : d.char;
      if (!usedLabels.has(label)) {
        usedLabels.add(label);
        chosen.push({ label, isCorrect: false });
      }
      if (chosen.length === 3) break;
    }

    const allOptions = [
      { label: correctLabel, isCorrect: true },
      ...chosen
    ];

    return allOptions.sort(() => 0.5 - Math.random());
  }

  function handleCharOptionSelect(selectedOpt, btnElement, currentItem) {
    if (charQuizState.answerLocked) return;
    charQuizState.answerLocked = true;

    const allBtns = cqOptionsContainer.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.disabled = true);

    const isCorrect = selectedOpt.isCorrect;
    const correctLabel = charQuizState.mode === 'hiraganaToRomaji'
      ? currentItem.romaji
      : currentItem.char;

    if (isCorrect) {
      btnElement.classList.add('selected-correct');
      charQuizState.score += 10;
      cqLiveScore.textContent = charQuizState.score;
      playSuccessSfx();

      cqFeedbackIcon.textContent = '🎉';
      cqFeedbackTitle.textContent = 'Benar Sekali!';
      cqFeedbackTitle.style.color = 'var(--success)';
      cqFeedbackDetail.innerHTML = `<strong style="font-family: 'Noto Sans JP', sans-serif; font-size: 1.3rem;">${currentItem.char}</strong> dibaca <strong>"${currentItem.romaji}"</strong> (${currentItem.groupLabel})`;
      cqAnswerFeedbackBox.className = 'feedback-box correct';
    } else {
      btnElement.classList.add('selected-wrong');
      playErrorSfx();

      // Highlight correct
      allBtns.forEach(b => {
        const labelText = b.querySelector('.option-label').textContent;
        if (labelText === correctLabel) {
          b.classList.add('reveal-correct');
        }
      });

      charQuizState.wrongAnswers.push({
        item: currentItem,
        userAnswer: selectedOpt.label
      });

      cqFeedbackIcon.textContent = '❌';
      cqFeedbackTitle.textContent = 'Kurang Tepat!';
      cqFeedbackTitle.style.color = 'var(--danger)';
      cqFeedbackDetail.innerHTML = `Jawaban yang benar: <strong style="font-family: 'Noto Sans JP', sans-serif; font-size: 1.3rem;">${currentItem.char}</strong> = <strong>"${currentItem.romaji}"</strong>`;
      cqAnswerFeedbackBox.className = 'feedback-box wrong';
    }

    cqAnswerFeedbackBox.classList.remove('hidden');
  }

  btnNextCharQuestion.addEventListener('click', () => {
    charQuizState.currentIndex++;
    if (charQuizState.currentIndex < charQuizState.questions.length) {
      displayCharQuestion();
    } else {
      finishCharQuiz();
    }
  });

  function finishCharQuiz() {
    charQuizPlayScreen.classList.add('hidden');
    charQuizResultScreen.classList.remove('hidden');

    const total = charQuizState.questions.length;
    const correctCount = total - charQuizState.wrongAnswers.length;
    const accuracy = Math.round((correctCount / total) * 100);

    cqResultFinalScore.textContent = accuracy;
    cqResultCorrectCount.textContent = correctCount;
    cqResultWrongCount.textContent = charQuizState.wrongAnswers.length;
    cqResultAccuracy.textContent = `${accuracy}%`;

    if (accuracy === 100) {
      cqResultEmoji.textContent = '🏆';
      cqResultTitle.textContent = 'Sugoi! Sempurna!';
      cqResultSubtitle.textContent = 'Kamu menguasai semua huruf dengan sempurna! すごい！';
      playCelebrationSfx();
    } else if (accuracy >= 80) {
      cqResultEmoji.textContent = '🌟';
      cqResultTitle.textContent = 'Sangat Bagus!';
      cqResultSubtitle.textContent = 'Pengenalan huruf Hiragana kamu sudah kuat! Terus berlatih!';
      playSuccessSfx();
    } else if (accuracy >= 60) {
      cqResultEmoji.textContent = '👍';
      cqResultTitle.textContent = 'Cukup Bagus!';
      cqResultSubtitle.textContent = 'Masih ada beberapa huruf yang perlu diperkuat. Ayo coba lagi!';
    } else {
      cqResultEmoji.textContent = '💪';
      cqResultTitle.textContent = 'Tetap Semangat!';
      cqResultSubtitle.textContent = 'Buka tabel Gojuon di tab Aturan Huruf dan hafalkan perlahan ya!';
    }

    // Wrong answers list
    if (charQuizState.wrongAnswers.length > 0) {
      cqWrongReviewContainer.classList.remove('hidden');
      btnRetryCharWrongOnly.classList.remove('hidden');
      cqWrongReviewList.innerHTML = charQuizState.wrongAnswers.map(({ item, userAnswer }) => `
        <div class="wrong-item">
          <div>
            <div class="wrong-item-char">
              ${item.char}
              <span class="char-arrow">➔</span>
              <span class="char-romaji">${item.romaji}</span>
            </div>
            <div class="wrong-item-ans">Jawabanmu: <del>${userAnswer}</del></div>
          </div>
          <button class="card-audio-btn" data-speak="${item.char}" title="Dengarkan pelafalan">🔊</button>
        </div>
      `).join('');

      cqWrongReviewList.querySelectorAll('.card-audio-btn').forEach(b => {
        b.addEventListener('click', () => speakJapanese(b.dataset.speak));
      });
    } else {
      cqWrongReviewContainer.classList.add('hidden');
      btnRetryCharWrongOnly.classList.add('hidden');
    }
  }

  // Char Quiz Control Listeners
  btnStartCharQuiz.addEventListener('click', () => startCharQuiz());

  btnQuitCharQuiz.addEventListener('click', () => {
    if (confirm('Apakah kamu yakin ingin mengakhiri kuis huruf yang sedang berlangsung?')) {
      charQuizPlayScreen.classList.add('hidden');
      charQuizSetupScreen.classList.remove('hidden');
    }
  });

  cqQuestionAudioBtn.addEventListener('click', () => {
    speakJapanese(cqQuestionAudioBtn.dataset.speak);
  });

  btnRetryCharQuiz.addEventListener('click', () => {
    charQuizResultScreen.classList.add('hidden');
    charQuizSetupScreen.classList.remove('hidden');
  });

  btnRetryCharWrongOnly.addEventListener('click', () => {
    const wrongChars = charQuizState.wrongAnswers.map(w => w.item);
    startCharQuiz(wrongChars);
  });

  btnCharQuizToVocab.addEventListener('click', () => {
    switchTab('tab-vocab');
  });

  // ==================== INITIALIZATION ====================
  initCounters();
  renderVocabList();
  renderRulesSection();
  updateFlashcardList();
});

