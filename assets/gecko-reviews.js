(function () {
  'use strict';

  function initPagination(root) {
    var list = root.querySelector('[data-gecko-reviews-list]');
    var pagination = root.querySelector('[data-gecko-reviews-pagination]');
    if (!list || !pagination) return;

    var perPage = parseInt(list.getAttribute('data-per-page') || '3', 10);
    var items = list.querySelectorAll('[data-review-item]');
    var pages = pagination.querySelectorAll('[data-page]');
    var current = 1;

    function showPage(page) {
      current = page;
      var start = (page - 1) * perPage;
      var end = start + perPage;
      items.forEach(function (item, i) {
        item.classList.toggle('is-hidden', i < start || i >= end);
      });
      pages.forEach(function (btn) {
        var p = btn.getAttribute('data-page');
        btn.classList.toggle('is-active', p === String(page));
      });
    }

    pages.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var p = btn.getAttribute('data-page');
        if (p === 'next') {
          var max = Math.ceil(items.length / perPage);
          showPage(Math.min(current + 1, max));
        } else {
          showPage(parseInt(p, 10));
        }
      });
    });

    showPage(1);
  }

  function initWriteForm(root) {
    var toggle = root.querySelector('[data-gecko-write-toggle]');
    if (!toggle) return;

    var targetId = toggle.getAttribute('aria-controls');
    var panel = targetId ? document.getElementById(targetId) : root.querySelector('.gecko-reviews__write-form');
    if (!panel) return;

    toggle.addEventListener('click', function () {
      var isOpen = !panel.hidden;
      panel.hidden = isOpen;
      toggle.setAttribute('aria-expanded', String(!isOpen));
      if (!isOpen) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  function initPicturesFirst(root) {
    var filterBtn = root.querySelector('.gecko-reviews__filter-btn');
    var list = root.querySelector('[data-gecko-reviews-list]');
    if (!filterBtn || !list) return;

    var items = Array.prototype.slice.call(list.querySelectorAll('[data-review-item]'));
    var photosFirst = false;

    filterBtn.addEventListener('click', function () {
      photosFirst = !photosFirst;
      filterBtn.setAttribute('aria-expanded', String(photosFirst));

      items.sort(function (a, b) {
        var aPhotos = a.querySelector('.gecko-reviews__photos') ? 1 : 0;
        var bPhotos = b.querySelector('.gecko-reviews__photos') ? 1 : 0;
        if (photosFirst) return bPhotos - aPhotos;
        return 0;
      });

      items.forEach(function (item) {
        list.appendChild(item);
      });

      initPagination(root);
    });
  }

  function init(root) {
    initPagination(root);
    initWriteForm(root);
    initPicturesFirst(root);
  }

  document.querySelectorAll('.gecko-reviews').forEach(init);
})();
