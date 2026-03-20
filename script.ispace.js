// --- 1. DATA (Persis sama dengan React) ---
const moods = [
    { emoji: "😡", label: "Marah", text: "Keluarkan amarahmu di sini. Kami mendengarkan." },
    { emoji: "☹️", label: "Sedih", text: "Tidak apa-apa untuk bersedih. Luapkan saja semuanya." },
    { emoji: "😞", label: "Kecewa", text: "Mari kita urai rasa kecewa ini perlahan." },
    { emoji: "😰", label: "Cemas", text: "Tarik napas... mari buat pikiranmu lebih tenang." },
    { emoji: "😵‍💫", label: "Bingung", text: "Mari kita susun potongan pikiranmu satu per satu." },
    { emoji: "😫", label: "Lelah", text: "Rehatkan sejenak lelahmu di ruang aman ini." },
];
  
const steps = [
    { id: 1, title: "Emotional Disclosure", question: "Apa yang membuat kamu merasa seperti ini?", placeholder: "Tuliskan apa yang sedang menyesakkan dadamu...", feedback: "Mengutarakan perasaan secara jujur adalah langkah awal pemulihan yang luar biasa." },
    { id: 2, title: "Narrative Formation", question: "Apa yang sebenarnya terjadi dalam situasi ini?", placeholder: "Tuliskan kronologi kejadian secara objektif...", feedback: "Melihat fakta membantu kita memisahkan emosi dari kejadian yang sebenarnya terjadi." },
    { id: 3, title: "Perspective Shift", question: "Menurutmu, kenapa hal ini bisa terjadi?", placeholder: "Coba lihat dari sudut pandang yang berbeda...", feedback: "Memahami alasan di balik sebuah peristiwa seringkali membuka pintu kedamaian." },
    { id: 4, title: "Cognitive Appraisal", question: "Apa yang bisa kamu kontrol? Apa yang tidak?", placeholder: "Fokuslah pada hal-hal yang ada dalam kendalimu...", feedback: "Menyadari batas kendali kita adalah kunci utama untuk melepas kecemasan." },
    { id: 5, title: "Problem Focused Thinking", question: "Apa tindakan yang masih bisa kamu lakukan sekarang?", placeholder: "Tuliskan langkah kecil yang ingin kamu ambil...", feedback: "Tindakan nyata, sekecil apa pun, akan memberikanmu rasa berdaya kembali." },
    { id: 6, title: "Reflection Insight", question: "Apa yang kamu pelajari dari perasaan ini?", placeholder: "Tuliskan pesan atau pelajaran untuk dirimu...", feedback: "Terima kasih sudah berproses. Setiap rasa adalah guru yang mendewasakan." }
];

// --- 2. STATE (Pengganti useState di React) ---
let currentStep = 0;
let selectedMood = null;
let answers = {};
let showFeedback = false;

// --- 3. INITIALIZE PADA SAAT HALAMAN DIBUKA ---
document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons(); // Memanggil icon Lucide
    renderMoods(); // Menampilkan grid emoji
    
    // Set tanggal hari ini
    const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('current-date').innerText = new Date().toLocaleDateString('id-ID', dateOptions);

    // Membaca ketikan user di textarea
    const textarea = document.getElementById('journal-input');
    textarea.addEventListener('input', (e) => {
        answers[currentStep] = e.target.value;
        validateInput(); // Cek jika tombol sudah boleh di-klik
    });
});

// --- 4. LOGIKA PERPINDAHAN VIEW ---
function switchView(viewId) {
    // Sembunyikan semua halaman
    document.querySelectorAll('.view-section').forEach(el => {
        el.classList.remove('active');
        el.classList.add('hidden');
    });
    // Tampilkan yang dituju saja
    const target = document.getElementById(viewId);
    target.classList.remove('hidden');
    target.classList.add('active');
}

function selectMood(index) {
    selectedMood = moods[index];
    currentStep = 0;
    answers = {};
    showFeedback = false;
    
    // Update bagian kanan (visual info)
    document.getElementById('visual-emoji').innerText = selectedMood.emoji;
    document.getElementById('visual-label').innerText = `Mood Saat Ini: ${selectedMood.label}`;
    document.getElementById('visual-text').innerText = `"${selectedMood.text}"`;
    
    updateJournalUI();
    switchView('view-journal');
}

// --- 5. RENDER UI TERUS MENERUS ---
function renderMoods() {
    const container = document.getElementById('mood-grid');
    container.innerHTML = moods.map((m, i) => `
        <button onclick="selectMood(${i})" class="bg-white p-10 rounded-3xl border-2 border-transparent hover:border-[#1a2b6d] shadow-sm hover:shadow-md transition-all duration-300 group text-center flex flex-col items-center justify-center">
            <div class="text-6xl mb-4 group-hover:scale-110 transition-transform">${m.emoji}</div>
            <div class="font-bold text-[#1a2b6d] uppercase tracking-wide">${m.label}</div>
        </button>
    `).join('');
}

function updateJournalUI() {
    const step = steps[currentStep];
    showFeedback = false;
    
    // Update Teks Pertanyaan
    document.getElementById('step-number').innerText = step.id;
    document.getElementById('step-title').innerText = step.title;
    document.getElementById('step-question').innerText = step.question;
    document.getElementById('step-feedback').innerText = `"${step.feedback}"`;
    
    // Update Textarea
    const textarea = document.getElementById('journal-input');
    textarea.placeholder = step.placeholder;
    textarea.value = answers[currentStep] || '';
    
    // Update Titik-titik Progres di kanan
    document.getElementById('progress-dots').innerHTML = steps.map((_, i) => `
        <div class="h-2 rounded-full transition-all duration-500 ${currentStep === i ? 'w-10 bg-white' : 'w-2 bg-white/20'}"></div>
    `).join('');

    toggleFeedbackView();
    validateInput();
    textarea.focus();
}

// Cek apakah textarea sudah terisi (Minimal 5 karakter seperti React-nya)
function validateInput() {
    const btn = document.getElementById('btn-process');
    const text = answers[currentStep] || '';
    
    if (text.trim().length >= 5) {
        btn.disabled = false;
        btn.className = "w-full py-6 rounded-3xl font-bold text-xl transition-all shadow-lg bg-[#1a2b6d] hover:bg-[#2a3b7d] text-white transform hover:-translate-y-1";
    } else {
        btn.disabled = true;
        btn.className = "w-full py-6 rounded-3xl font-bold text-xl transition-all shadow-lg bg-gray-100 text-gray-300 cursor-not-allowed";
    }
}

// --- 6. LOGIKA TOMBOL LANJUT ---
function processNext() {
    showFeedback = true;
    toggleFeedbackView();
}

function continueToNext() {
    if (currentStep < steps.length - 1) {
        currentStep++;
        updateJournalUI();
    } else {
        switchView('view-complete'); // Selesai
    }
}

function toggleFeedbackView() {
    const inputArea = document.getElementById('input-area');
    const feedbackArea = document.getElementById('feedback-area');
    const btnProcess = document.getElementById('btn-process');
    const btnContinue = document.getElementById('btn-continue');
    const btnContinueText = document.getElementById('btn-continue-text');

    if (showFeedback) {
        // Tampilkan feedback, sembunyikan textarea
        inputArea.classList.add('hidden');
        feedbackArea.classList.remove('hidden');
        btnProcess.classList.add('hidden');
        
        btnContinue.classList.remove('hidden');
        btnContinue.style.display = 'flex'; 
        btnContinueText.innerText = currentStep === steps.length - 1 ? 'SELESAI' : 'TAHAP BERIKUTNYA';
    } else {
        // Tampilkan textarea, sembunyikan feedback
        inputArea.classList.remove('hidden');
        feedbackArea.classList.add('hidden');
        btnProcess.classList.remove('hidden');
        
        btnContinue.classList.add('hidden');
        btnContinue.style.display = ''; 
    }
}