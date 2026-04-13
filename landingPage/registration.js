// ── Supabase config ──
const SUPABASE_URL = 'https://wgbguuefyfjqbtbjfrcc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnYmd1dWVmeWZqcWJ0YmpmcmNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NDcwOTQsImV4cCI6MjA5MTMyMzA5NH0.FYGpQ1i4ctHsFFr8-9OBiRO0mFsEnElIxHiDLKPdwes';

let sb = null;
try {
  sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (e) {
  console.warn('Supabase not configured — data won\'t be saved.');
}

// ── DOM refs ──
const modal = document.getElementById('regModal');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const dots = document.querySelectorAll('.modal-progress .dot');
const steps = document.querySelectorAll('.form-step');

let currentStep = 1;

// Accumulate all form data here so every upsert sends the full picture
let formData = {};

// ── Save helper: upserts full formData every time ──
async function saveToSupabase() {
  if (!sb || !formData.email) return;
  const { error } = await sb
    .from('registrations')
    .upsert({ ...formData, updated_at: new Date().toISOString() }, { onConflict: 'email' });
  if (error) {
    console.error('Supabase save error:', error);
    throw error;
  }
}

// ── Open modal ──
function openModal(prefillEmail) {
  currentStep = 1;
  formData = {};
  document.getElementById('regEmail').value = prefillEmail || '';
  document.getElementById('regFirst').value = '';
  document.getElementById('regLast').value = '';
  document.getElementById('regAge').value = '';
  document.getElementById('regRent').value = '';
  document.getElementById('regYears').value = '';
  document.getElementById('regAddress').value = '';
  document.getElementById('regAptAddress').value = '';
  clearErrors();
  showStep(1);
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Step navigation ──
function showStep(step) {
  currentStep = step;
  steps.forEach(s => s.classList.remove('active'));
  const stepKey = step === 4 ? 'success' : String(step);
  document.querySelector(`.form-step[data-step="${stepKey}"]`).classList.add('active');

  dots.forEach(d => {
    const dStep = parseInt(d.dataset.step);
    d.classList.remove('active', 'done');
    if (dStep < step) d.classList.add('done');
    else if (dStep === step) d.classList.add('active');
  });

  const titles = {
    1: ['Get Early Access', 'Step 1 of 3 — Your email'],
    2: ['Tell us about yourself', 'Step 2 of 3 — Personal details'],
    3: ['Property information', 'Step 3 of 3 — Your rental'],
    4: ['Registration Complete', '']
  };
  const [title, subtitle] = titles[step] || titles[4];
  modalTitle.textContent = title;
  modalSubtitle.textContent = subtitle;
}

// ── Validation helpers ──
function clearErrors() {
  document.querySelectorAll('.form-error').forEach(e => e.style.display = 'none');
  document.querySelectorAll('.input-error').forEach(e => e.classList.remove('input-error'));
}

function showError(inputId, errorId) {
  document.getElementById(inputId).classList.add('input-error');
  document.getElementById(errorId).style.display = 'block';
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Step 1: Email ──
document.getElementById('step1Next').addEventListener('click', async () => {
  clearErrors();
  const email = document.getElementById('regEmail').value.trim();
  if (!validateEmail(email)) { showError('regEmail', 'emailError'); return; }

  const btn = document.getElementById('step1Next');
  btn.disabled = true;
  btn.textContent = 'Saving...';

  formData.email = email;
  formData.step_completed = 1;

  try {
    await saveToSupabase();
  } catch (err) {
    console.error('Step 1 save failed:', err);
  }
  btn.disabled = false;
  btn.textContent = 'Continue';
  showStep(2);
});

// ── Step 2: Personal details ──
document.getElementById('step2Next').addEventListener('click', async () => {
  clearErrors();
  const first = document.getElementById('regFirst').value.trim();
  const last = document.getElementById('regLast').value.trim();
  const ageVal = document.getElementById('regAge').value;
  const age = ageVal ? parseInt(ageVal) : null;

  const btn = document.getElementById('step2Next');
  btn.disabled = true;
  btn.textContent = 'Saving...';

  if (first) formData.first_name = first;
  if (last) formData.last_name = last;
  if (age) formData.age = age;
  formData.step_completed = 2;

  try {
    await saveToSupabase();
  } catch (err) {
    console.error('Step 2 save failed:', err);
  }
  btn.disabled = false;
  btn.textContent = 'Continue';
  showStep(3);
});

// ── Step 3: Property details ──
document.getElementById('step3Submit').addEventListener('click', async () => {
  clearErrors();
  const rentVal = document.getElementById('regRent').value;
  const yearsVal = document.getElementById('regYears').value;
  const address = document.getElementById('regAddress').value.trim();
  const aptAddress = document.getElementById('regAptAddress').value.trim();

  const btn = document.getElementById('step3Submit');
  btn.disabled = true;
  btn.textContent = 'Submitting...';

  if (rentVal) formData.monthly_rent = parseFloat(rentVal);
  if (yearsVal) formData.years_owned = parseInt(yearsVal);
  if (address) formData.address = address;
  if (aptAddress) formData.apartment_address = aptAddress;
  formData.step_completed = 3;

  try {
    await saveToSupabase();
  } catch (err) {
    console.error('Step 3 save failed:', err);
  }
  btn.disabled = false;
  btn.textContent = 'Submit Registration';
  showStep(4);
});

// ── Back buttons ──
document.querySelectorAll('.btn-back').forEach(btn => {
  btn.addEventListener('click', () => showStep(parseInt(btn.dataset.back)));
});

// ── Close modal ──
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('successClose').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

// ── Wire up all "Register Now" / "Sign Up" buttons ──
document.querySelectorAll('a.nav-cta, a.btn-blue').forEach(a => {
  if (a.getAttribute('href') === '#waitlist') {
    a.removeAttribute('href');
    a.style.cursor = 'pointer';
    a.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  }
});

document.getElementById('wlSignupBtn').addEventListener('click', () => {
  openModal(document.getElementById('emailIn').value.trim());
});

document.getElementById('emailIn').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') openModal(document.getElementById('emailIn').value.trim());
});
