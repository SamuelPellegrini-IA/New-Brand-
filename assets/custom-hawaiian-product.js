(function () {
  'use strict';

  var ROOT_SELECTOR = '.custom-hawaiian-product-page';
  var LABEL_FIXES = [
    ["Choose Leaves's Color #1", 'Choose Leaves Color #1'],
    ["Choose Leaves's Color #2", 'Choose Leaves Color #2'],
    ["Choose Flower's Color #1", 'Choose Flower Color #1'],
    ["Choose Flower's Color #2", 'Choose Flower Color #2'],
    ["Choose Flower's Color #3", 'Choose Flower Color #3'],
    ["Choose Flower's Color #4", 'Choose Flower Color #4']
  ];

  var PREVIEW_SELECTORS = [
    '.canvas-wrapper',
    '.sl-canvas-container',
    '.cl-preview-wrapper',
    '#customily-preview',
    '.customily-preview',
    '[data-customily-preview]',
    '.shopify-app-block [class*="preview"]'
  ].join(',');

  function fixLabelGrammar(root) {
    LABEL_FIXES.forEach(function (pair) {
      var from = pair[0];
      var to = pair[1];
      root.querySelectorAll('.sl-option-set-item_label, .option_name, .option_title').forEach(function (el) {
        if (el.textContent.indexOf(from) !== -1) {
          el.textContent = el.textContent.replace(from, to);
        }
      });
    });
  }

  function tagNumberOfPhotosOption(root) {
    root.querySelectorAll('#customily-options .sl-option-set-item, #cl_optionsapp .customily_option').forEach(function (group) {
      var label = group.querySelector('.sl-option-set-item_label, .option_name, .option_title');
      if (label && /number of photos/i.test(label.textContent)) {
        group.classList.add('hawaiian-number-photos');
        var parent = group.closest('.sl-option-set') || group;
        parent.classList.add('hawaiian-number-photos');
      }
    });
  }

  function wrapCustomilyOptions(root) {
    var options = root.querySelector('#customily-options');
    var legacy = root.querySelector('#cl_optionsapp');

    [options, legacy].forEach(function (el) {
      if (!el || el.closest('.hawaiian-options-card')) return;
      var card = document.createElement('div');
      card.className = 'hawaiian-options-card';
      el.parentNode.insertBefore(card, el);
      card.appendChild(el);
    });
  }

  function moveLivePreviewToMedia(root) {
    var mediaWrapper = root.querySelector('.product__media-wrapper');
    if (!mediaWrapper) return;

    var host = mediaWrapper.querySelector('.hawaiian-live-preview-host');
    if (!host) {
      host = document.createElement('div');
      host.className = 'hawaiian-live-preview-host';
      mediaWrapper.insertBefore(host, mediaWrapper.firstChild);
    }

    var infoColumn = root.querySelector('.product__info-wrapper');
    if (!infoColumn) return;

    PREVIEW_SELECTORS.split(',').forEach(function (selector) {
      selector = selector.trim();
      infoColumn.querySelectorAll(selector).forEach(function (node) {
        if (node.closest('.hawaiian-options-card')) return;
        if (host.contains(node)) return;
        node.classList.add('hawaiian-preview-moved');
        host.appendChild(node);
        mediaWrapper.classList.add('hawaiian-preview-active');
      });
    });

    infoColumn.querySelectorAll('.shopify-app-block').forEach(function (block) {
      if (block.querySelector('#customily-options, #cl_optionsapp')) return;
      var hasPreview = block.querySelector(PREVIEW_SELECTORS);
      if (hasPreview && !host.contains(block)) {
        block.classList.add('hawaiian-preview-moved');
        host.appendChild(block);
        mediaWrapper.classList.add('hawaiian-preview-active');
      }
    });
  }

  function normalizeUploadButtonText(root) {
    root.querySelectorAll(
      '#customily-options .sl-image-placeholder > label > span, .customily-file-input label, .customily-download-button'
    ).forEach(function (el) {
      var text = (el.textContent || '').trim().toLowerCase();
      if (text && (text.indexOf('upload') !== -1 || text.indexOf('select') !== -1 || text.indexOf('choose') !== -1 || text.indexOf('image') !== -1)) {
        if (text.indexOf('select image') === -1 && text.indexOf('upload photo') === -1) {
          el.textContent = 'Select Image';
        }
      }
    });
  }

  function initPreviewButton(root) {
    root.querySelectorAll('[data-gecko-preview-trigger]').forEach(function (btn) {
      if (btn.dataset.bound === 'true') return;
      btn.dataset.bound = 'true';
      btn.addEventListener('click', function () {
        var selectors = [
          '.customily-preview-button',
          '.gecko-preview-btn',
          '[data-customily-preview]',
          '#customily-options .sl-preview-btn',
          'button[class*="preview"]'
        ];
        var clicked = false;
        selectors.forEach(function (sel) {
          if (clicked) return;
          var target = document.querySelector(sel);
          if (target && !root.contains(target)) {
            target.click();
            clicked = true;
          }
        });
        if (!clicked) {
          var inPage = root.querySelector('.customily-preview-button, [class*="preview"]');
          if (inPage) inPage.click();
        }
      });
    });
  }

  function enhance(root) {
    if (!root) return;

    if (root.dataset.hawaiianBodyClass !== 'true') {
      root.dataset.hawaiianBodyClass = 'true';
      document.body.classList.add('product-custom-photo-tropical-cat-hawaiian-shirt');
    }

    moveLivePreviewToMedia(root);
    wrapCustomilyOptions(root);
    fixLabelGrammar(root);
    tagNumberOfPhotosOption(root);
    normalizeUploadButtonText(root);
    initPreviewButton(root);
  }

  function init() {
    var root = document.querySelector(ROOT_SELECTOR);
    if (!root) return;

    enhance(root);

    var observer = new MutationObserver(function () {
      enhance(root);
      fixLabelGrammar(root);
      tagNumberOfPhotosOption(root);
      normalizeUploadButtonText(root);
    });

    observer.observe(root, { childList: true, subtree: true });

    window.setTimeout(function () {
      enhance(root);
    }, 800);
    window.setTimeout(function () {
      enhance(root);
    }, 2500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
