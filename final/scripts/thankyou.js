// thankyou.js — display form submission data from localStorage

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('submission-data');
  const detailsBox = document.getElementById('submission-details');

  try {
    const raw = localStorage.getItem('amondbeauty_submission');
    if (!raw) {
      if (detailsBox) detailsBox.style.display = 'none';
      return;
    }

    const data = JSON.parse(raw);
    const labels = {
      firstName:   'First name',
      lastName:    'Last name',
      email:       'Email',
      phone:       'Phone',
      inquiryType: 'Inquiry type',
      message:     'Message',
      newsletter:  'Newsletter',
      timestamp:   'Submitted',
    };

    const html = Object.entries(data)
      .filter(([, v]) => v)
      .map(([key, value]) => {
        const label = labels[key] || key;
        const val = key === 'message' && value.length > 80
          ? value.slice(0, 80) + '…'
          : value;
        return `<div class="ab-detail-item">
          <span class="key">${label}</span>
          <span class="val">${val}</span>
        </div>`;
      })
      .join('');

    container.innerHTML = html || '<p>No data found.</p>';

    // One-time display: clear after showing
    localStorage.removeItem('amondbeauty_submission');
  } catch (_) {
    if (detailsBox) detailsBox.style.display = 'none';
  }
});
