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

  document.querySelectorAll('.gecko-reviews').forEach(initPagination);
})();
