  function onGeosurfingLinkButtonClick() {
    const popup = document.getElementById('popup');
    if (popup) popup.style.display = 'none';

    // Tiny delay so the hide applies (useful if you add a fade-out)
    setTimeout(() => {
      window.location.href = 'https://geosurfing.net';
    });
  }

  document.getElementById('geosurfingLinkButton')
    ?.addEventListener('click', onGeosurfingLinkButtonClick);