(function(){
  var currentScript = document.currentScript;
  if (!currentScript) return;
  var origin = (function(){
    var src = currentScript.getAttribute('src') || '';
    try { var u = new URL(src, window.location.href); return u.origin; } catch { return window.location.origin; }
  })();

  var siteName = currentScript.getAttribute('data-site-name') || 'Support';
  var brandColor = currentScript.getAttribute('data-brand-color') || '#2563eb';
  var faqUrl = currentScript.getAttribute('data-faq-url') || '';
  var logoUrl = currentScript.getAttribute('data-logo-url') || '';

  var container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.bottom = '16px';
  container.style.right = '16px';
  container.style.zIndex = '2147483647';
  document.body.appendChild(container);

  var button = document.createElement('button');
  button.textContent = 'Chat';
  button.style.background = brandColor;
  button.style.color = '#fff';
  button.style.border = 'none';
  button.style.borderRadius = '9999px';
  button.style.padding = '12px 16px';
  button.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';

  var iframe = document.createElement('iframe');
  var src = origin + '/widget?siteName=' + encodeURIComponent(siteName) + '&brandColor=' + encodeURIComponent(brandColor);
  if (faqUrl) src += '&faqUrl=' + encodeURIComponent(faqUrl);
  if (logoUrl) src += '&logoUrl=' + encodeURIComponent(logoUrl);
  iframe.src = src;
  iframe.style.width = '360px';
  iframe.style.height = '520px';
  iframe.style.border = '1px solid #e5e7eb';
  iframe.style.borderRadius = '12px';
  iframe.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
  iframe.style.display = 'none';

  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', 'gpt-support-iframe');
  iframe.id = 'gpt-support-iframe';

  button.addEventListener('click', function(){
    iframe.style.display = (iframe.style.display === 'none') ? 'block' : 'none';
    var expanded = iframe.style.display === 'block';
    button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    button.textContent = expanded ? 'Close' : 'Chat';
  });

  container.appendChild(iframe);
  container.appendChild(button);
})();


