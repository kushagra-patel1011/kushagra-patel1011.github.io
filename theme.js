// Loaded in <head> so the saved theme applies before the page paints.
// Kept as a real file (not inline) so the site works with a strict
// Content-Security-Policy that forbids inline scripts.
(function () {
  var root = document.documentElement;

  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  } catch (e) {}

  document.addEventListener('click', function (event) {
    var target = event.target instanceof Element ? event.target : null;
    if (!target) return;

    if (target.closest('[data-theme-toggle]')) {
      var next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch (e) {}
    }

    if (target.closest('[data-print]')) window.print();

    // Buttons with data-copy="text" copy that text and briefly say so.
    var copy = target.closest('[data-copy]');
    if (copy) {
      var text = copy.getAttribute('data-copy');
      var label = copy.getAttribute('data-label') || copy.textContent;
      copy.setAttribute('data-label', label);
      var say = function (message) {
        copy.textContent = message;
        setTimeout(function () {
          copy.textContent = label;
        }, 2200);
      };
      // If the browser refuses to copy, highlight the text so Ctrl+C works.
      var selectInstead = function () {
        var source = document.querySelector('[data-copy-source]');
        if (source) {
          var range = document.createRange();
          range.selectNodeContents(source);
          var selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
        }
        say('Selected, press Ctrl+C');
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          say('Copied');
        }, selectInstead);
      } else {
        selectInstead();
      }
    }
  });
})();
