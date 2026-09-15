document.addEventListener('DOMContentLoaded', () => {
  const formPendaftaran = document.getElementById('formPendaftaran'); // Sesuaikan ID form kamu
  const tabelBody = document.getElementById('tabelPesertaBody') || 
                    document.getElementById('tabelPeserta') || 
                    document.querySelector('tbody');

  let daftarPendaftar = JSON.parse(localStorage.getItem('daftarPendaftar')) || [];

  const escapeHTML = (str = '') => String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );

  const renderTabel = () => {
    if (!tabelBody) return;

    if (daftarPendaftar.length === 0) {
      tabelBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 20px;">Belum ada data peserta yang terdaftar.</td>
        </tr>
      `;
      return;
    }

    tabelBody.innerHTML = daftarPendaftar.map(p => `
      <tr>
        <td>${escapeHTML(p.nama)}</td>
        <td>${escapeHTML(p.email)}</td>
        <td>${escapeHTML(p.kelas)}</td>
        <td>${escapeHTML(p.jurusan)}</td>
        <td>${escapeHTML(p.kegiatan || '-')}</td>
        <td><span class="status-badge ${(p.status || 'Pending').toLowerCase()}">${escapeHTML(p.status || 'Pending')}</span></td>
        <td style="padding: 10px;">
          <button type="button" class="btn-delete btn-hapus" data-id="${p.id}">Hapus</button>
        </td>
      </tr>
    `).join('');
  };

  formPendaftaran?.addEventListener('submit', (e) => {
    e.preventDefault();

    const dataBaru = {
      id: Date.now(), 
      nama: document.getElementById('nama')?.value,
      email: document.getElementById('email')?.value,
      kelas: document.getElementById('kelas')?.value,
      jurusan: document.getElementById('jurusan')?.value,
      kegiatan: document.getElementById('kegiatan')?.value,
      status: document.getElementById('status')?.value || 'Pending'
    };

    daftarPendaftar.push(dataBaru);
    localStorage.setItem('daftarPendaftar', JSON.stringify(daftarPendaftar));
    
    renderTabel();
    formPendaftaran.reset();
  });

  tabelBody?.addEventListener('click', (e) => {
    const target = e.target;
    const id = target.dataset.id;
    if (!id) return;

    if ((target.classList.contains('btn-delete') || target.classList.contains('btn-hapus')) && confirm('Apakah Anda yakin ingin menghapus data peserta ini?')) {
      daftarPendaftar = daftarPendaftar.filter(p => String(p.id) !== String(id));
      localStorage.setItem('daftarPendaftar', JSON.stringify(daftarPendaftar));
      renderTabel();
    }
  });

  renderTabel();
});