window.addEventListener('load', () => {
  let deferredPrompt;
  const installButton = document.getElementById('installButton');
  const installBanner = document.getElementById('installBanner');

  if (!installButton || !installBanner) {
    return;
  }

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone ||
    localStorage.getItem('pwaInstalled');

  if (isStandalone) {
    return;
  }

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    installBanner.style.display = 'flex';

    installButton.addEventListener('click', async () => {
      installBanner.style.display = 'none';
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        localStorage.setItem('pwaInstalled', 'true');
      }
      deferredPrompt = null;
    });
  });

  window.addEventListener('appinstalled', () => {
    installBanner.style.display = 'none';
    localStorage.setItem('pwaInstalled', 'true');
  });
});
