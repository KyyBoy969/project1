document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    form: document.getElementById('daftarForm') || document.getElementById('formPendaftaran'),
    nama: document.getElementById('nama'),
    email: document.getElementById('email'),
    kelas: document.getElementById('kelas'),
    jurusan: document.getElementById('jurusan'),
    kegiatan: document.getElementById('kegiatan'),
    syarat: document.getElementById('syarat'),
    tombol: document.getElementById('submitButton'),
    hasil: document.getElementById('hasil'),
    editId: document.getElementById('editId'),
    status: document.getElementById('status'),
    tabelBody: document.getElementById('tabelPesertaBody') || 
               document.getElementById('tabelPeserta') || 
               document.querySelector('tbody'),
    errors: {
      nama: document.getElementById('namaError'),
      email: document.getElementById('emailError'),
      kelas: document.getElementById('kelasError'),
      jurusan: document.getElementById('jurusanError'),
      kegiatan: document.getElementById('kegiatanError'),
      syarat: document.getElementById('syaratError')
    }
  };

  let daftarPendaftar = JSON.parse(localStorage.getItem('daftarPendaftar')) || [];
  let editId = null;

  const escapeHTML = (str = '') => String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );

  const toggleError = (input, targetError, pesan = '') => {
    if (input) input.classList.toggle('invalid', !!pesan);
    if (targetError) targetError.textContent = pesan;
  };

  const cekCheckbox = () => {
    if (!elements.syarat) return true;
    const valid = elements.syarat.checked;
    if (elements.tombol) elements.tombol.disabled = !valid;
    if (elements.errors.syarat) {
      elements.errors.syarat.textContent = valid ? '' : 'Anda harus menyetujui syarat & ketentuan.';
    }
    return valid;
  };

  const simpanData = () => {
    localStorage.setItem('daftarPendaftar', JSON.stringify(daftarPendaftar));
    renderTabel();
  };

  // Render Data ke Tabel
  const renderTabel = () => {
    if (!elements.tabelBody) return;

    if (daftarPendaftar.length === 0) {
      elements.tabelBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 20px;">Belum ada data peserta yang terdaftar.</td>
        </tr>
      `;
      return;
    }

    elements.tabelBody.innerHTML = daftarPendaftar.map(p => `
      <tr>
        <td>${escapeHTML(p.nama)}</td>
        <td>${escapeHTML(p.email)}</td>
        <td>${escapeHTML(p.kelas)}</td>
        <td>${escapeHTML(p.jurusan)}</td>
        <td>${escapeHTML(p.kegiatan || '-')}</td>
        <td><span class="status-badge ${(p.status || 'Pending').toLowerCase()}">${escapeHTML(p.status || 'Pending')}</span></td>
        <td style="padding: 10px;">
          <button type="button" class="btn-edit" data-id="${p.id}">Edit</button>
          <button type="button" class="btn-delete btn-hapus" data-id="${p.id}">Hapus</button>
        </td>
      </tr>
    `).join('');
  };

  const resetFormMode = () => {
    if (elements.form) elements.form.reset();
    editId = null;
    if (elements.editId) elements.editId.value = '';
    if (elements.tombol) elements.tombol.textContent = 'Daftar Sekarang';
    cekCheckbox();
  };

  const validasi = () => {
    let valid = true;

    const rules = [
      { input: elements.nama, err: elements.errors.nama, fn: v => !v ? 'Nama lengkap tidak boleh kosong.' : (v.length < 3 ? 'Nama minimal 3 karakter.' : '') },
      { input: elements.email, err: elements.errors.email, fn: v => !v ? 'Email tidak boleh kosong.' : (!v.includes('@') ? 'Email harus mengandung @.' : '') },
      { input: elements.kelas, err: elements.errors.kelas, fn: v => !v ? 'Kelas harus dipilih.' : '' },
      { input: elements.jurusan, err: elements.errors.jurusan, fn: v => !v ? 'Jurusan harus dipilih.' : '' },
      { input: elements.kegiatan, err: elements.errors.kegiatan, fn: v => !v ? 'Kegiatan tidak boleh kosong.' : '' }
    ];

    rules.forEach(({ input, err, fn }) => {
      if (!input) return;
      const msg = fn(input.value.trim());
      toggleError(input, err, msg);
      if (msg) valid = false;
    });

    if (!cekCheckbox()) valid = false;
    return valid;
  };

  elements.syarat?.addEventListener('change', cekCheckbox);

  elements.tabelBody?.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    if ((e.target.classList.contains('btn-delete') || e.target.classList.contains('btn-hapus')) && confirm('Apakah Anda yakin ingin menghapus data peserta ini?')) {
      daftarPendaftar = daftarPendaftar.filter(p => String(p.id) !== String(id));
      simpanData();
    } 
    else if (e.target.classList.contains('btn-edit')) {
      const p = daftarPendaftar.find(item => String(item.id) === String(id));
      if (!p) return;

      if (elements.nama) elements.nama.value = p.nama;
      if (elements.email) elements.email.value = p.email;
      if (elements.kelas) elements.kelas.value = p.kelas;
      if (elements.jurusan) elements.jurusan.value = p.jurusan;
      if (elements.kegiatan) elements.kegiatan.value = p.kegiatan;
      if (elements.status) elements.status.value = p.status || 'Pending';

      editId = id;
      if (elements.editId) elements.editId.value = id;
      if (elements.syarat) elements.syarat.checked = true;
      cekCheckbox();
      if (elements.tombol) elements.tombol.textContent = 'Perbarui Data';

      if (elements.hasil) elements.hasil.classList.remove('show');
    }
  });

  elements.form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validasi()) return;

    const statusVal = elements.status ? elements.status.value : 'Pending';
    const payload = {
      nama: elements.nama?.value.trim() || '',
      email: elements.email?.value.trim() || '',
      kelas: elements.kelas?.value || '',
      jurusan: elements.jurusan?.value || '',
      kegiatan: elements.kegiatan?.value.trim() || '',
      status: statusVal
    };

    if (editId) {
      daftarPendaftar = daftarPendaftar.map(p => String(p.id) === String(editId) ? { ...p, ...payload } : p);
      if (elements.hasil) elements.hasil.textContent = 'Data peserta berhasil diperbarui.';
    } else {
      daftarPendaftar.push({ id: `Id_daftar_${Date.now()}`, ...payload });
      if (elements.hasil) elements.hasil.textContent = 'Data Anda telah kami terima. Tim panitia akan menginfokan anda.';
    }

    simpanData();
    if (elements.hasil) elements.hasil.classList.add('show');
    resetFormMode();
  });

  cekCheckbox();
  renderTabel();
});