const form = document.getElementById('daftarForm');
const nama = document.getElementById('nama');
const email = document.getElementById('email');
const kelas = document.getElementById('kelas');
const jurusan = document.getElementById('jurusan');
const kegiatan = document.getElementById('kegiatan');
const syarat = document.getElementById('syarat');
const tombol = document.getElementById('submitButton');
const hasil = document.getElementById('hasil');

const namaError = document.getElementById('namaError');
const emailError = document.getElementById('emailError');
const kelasError = document.getElementById('kelasError');
const jurusanError = document.getElementById('jurusanError');
const kegiatanError = document.getElementById('kegiatanError');
const syaratError = document.getElementById('syaratError');

function setError(input, errorText, pesan) {
  if (input) {
    input.classList.add('invalid');
  }
  if (errorText) {
    errorText.textContent = pesan;
  }
}

function clearError(input, errorText) {
  if (input) {
    input.classList.remove('invalid');
  }
  if (errorText) {
    errorText.textContent = '';
  }
}

function cekCheckbox() {
  if (!syarat.checked) {
    tombol.disabled = true;
    syaratError.textContent = 'Anda harus menyetujui syarat & ketentuan.';
    return false;
  } else {
    tombol.disabled = false;
    syaratError.textContent = '';
    return true;
  }
}

syarat.addEventListener('change', cekCheckbox);

form.addEventListener('submit', function (event) {
  event.preventDefault();

  let valid = true;

  if (nama.value.trim() === '') {
    setError(nama, namaError, 'Nama lengkap tidak boleh kosong.');
    valid = false;
  } else if (nama.value.trim().length < 3) {
    setError(nama, namaError, 'Nama minimal 3 karakter.');
    valid = false;
  } else {
    clearError(nama, namaError);
  }

  if (email.value.trim() === '') {
    setError(email, emailError, 'Email tidak boleh kosong.');
    valid = false;
  } else if (!email.value.includes('@')) {
    setError(email, emailError, 'Email harus mengandung @.');
    valid = false;
  } else {
    clearError(email, emailError);
  }

  if (kelas.value === '') {
    setError(kelas, kelasError, 'Kelas harus dipilih.');
    valid = false;
  } else {
    clearError(kelas, kelasError);
  }

  if (jurusan.value === '') {
    setError(jurusan, jurusanError, 'Jurusan harus dipilih.');
    valid = false;
  } else {
    clearError(jurusan, jurusanError);
  }

  if (kegiatan.value.trim() === '') {
    setError(kegiatan, kegiatanError, 'Kegiatan tidak boleh kosong.');
    valid = false;
  } else {
    clearError(kegiatan, kegiatanError);
  }

  if (!syarat.checked) {
    syaratError.textContent = 'Anda harus menyetujui syarat & ketentuan.';
    valid = false;
  } else {
    syaratError.textContent = '';
  }

  if (valid) {
    hasil.textContent = 'Data Anda telah kami terima. Tim panitia akan menginfokan anda.';
    hasil.classList.add('show');
    form.reset();
    tombol.disabled = true;
  }
});

cekCheckbox();
