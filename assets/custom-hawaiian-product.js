(function () {
  'use strict';

  var ROOT_SELECTOR = '.custom-hawaiian-product-page';
  var PAYMENT_IMG =
    'https://cdn.shopify.com/s/files/1/0703/7363/8402/files/gempages_491320059759690869-06c6bd7f-3ea0-465e-acbb-729b767ad902_2.webp?v=1782123204';
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

  function updatePreviewVisibility(mediaWrapper, host) {
    if (!mediaWrapper || !host) return;

    var hasPreview = !!host.querySelector(
      'canvas, img[src]:not([src=""]), .sl-canvas-container canvas, #customily-preview canvas, .customily-preview canvas'
    );

    if (hasPreview) {
      mediaWrapper.classList.add('hawaiian-preview-active');
    } else {
      mediaWrapper.classList.remove('hawaiian-preview-active');
    }
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
      });
    });

    infoColumn.querySelectorAll('.shopify-app-block').forEach(function (block) {
      if (block.querySelector('#customily-options, #cl_optionsapp')) return;
      var hasPreview = block.querySelector(PREVIEW_SELECTORS);
      if (hasPreview && !host.contains(block)) {
        block.classList.add('hawaiian-preview-moved');
        host.appendChild(block);
      }
    });

    updatePreviewVisibility(mediaWrapper, host);
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

  function setStickyTopOffset() {
    var header = document.querySelector('sticky-header header, .section-header sticky-header, header.header');
    var top = 20;
    if (header) {
      top = Math.ceil(header.getBoundingClientRect().height) + 12;
    }
    document.documentElement.style.setProperty('--hawaiian-sticky-top', top + 'px');
  }

  function bootstrapGeckoShell() {
    if (!document.body.classList.contains('gecko-product-active')) return null;

    var pageWidth = document.querySelector('product-info .page-width, .section-main-product .page-width');
    if (!pageWidth) return null;

    if (!pageWidth.classList.contains('custom-hawaiian-product-page')) {
      pageWidth.classList.add('custom-hawaiian-product-page');
    }

    var product = pageWidth.querySelector('.product');
    if (product) {
      product.classList.add('product--hawaiian-layout');
    }

    var mediaWrapper = pageWidth.querySelector('.product__media-wrapper');
    if (mediaWrapper) {
      mediaWrapper.classList.add('product__media-wrapper--hawaiian');
      if (!mediaWrapper.querySelector('.hawaiian-media-sticky')) {
        var sticky = document.createElement('div');
        sticky.className = 'hawaiian-media-sticky';
        if (!sticky.querySelector('.hawaiian-live-preview-host')) {
          var host = document.createElement('div');
          host.className = 'hawaiian-live-preview-host';
          host.setAttribute('aria-label', 'Product live preview');
          sticky.appendChild(host);
        }
        while (mediaWrapper.firstChild) {
          sticky.appendChild(mediaWrapper.firstChild);
        }
        mediaWrapper.appendChild(sticky);
      }
    }

    pageWidth.querySelectorAll('.product-form__submit').forEach(function (btn) {
      btn.classList.add('gecko-atc-btn');
      var span = btn.querySelector('span');
      if (span) {
        var label = (span.textContent || '').trim();
        if (!label || /add to cart/i.test(label)) {
          span.textContent = 'ADD TO CART';
        }
      }
    });

    return pageWidth;
  }

  function injectPostAtcFallback(root) {
    if (!root || root.querySelector('.gecko-post-atc')) return;

    var anchor = root.querySelector('.product-form');
    if (!anchor) return;

    var wrap = document.createElement('div');
    wrap.className = 'gecko-post-atc';
    wrap.innerHTML =
      '<div class="gecko-payment-trust">' +
      '<p class="gecko-payment-trust__checkout">' +
      '<span class="gecko-payment-trust__shield gecko-payment-trust__shield--blue" aria-hidden="true">✓</span>' +
      'Guaranteed safe &amp; secure checkout via:' +
      '</p>' +
      '<div class="gecko-payment-trust__icons">' +
      '<img src="' +
      PAYMENT_IMG +
      '" alt="Payment methods" class="gecko-payment-trust__icons-img" loading="lazy" width="900">' +
      '</div>' +
      '<p class="gecko-payment-trust__secure">' +
      '<span class="gecko-payment-trust__shield gecko-payment-trust__shield--green" aria-hidden="true">✓</span>' +
      'Secure transaction' +
      '</p>' +
      '</div>';

    var source = document.getElementById('gecko-shipping-timeline-source');
    if (source && source.content) {
      wrap.appendChild(source.content.cloneNode(true));
    }

    anchor.insertAdjacentElement('afterend', wrap);
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
    var root = document.querySelector(ROOT_SELECTOR) || bootstrapGeckoShell();
    if (!root) return;

    setStickyTopOffset();
    window.addEventListener('resize', setStickyTopOffset);

    injectPostAtcFallback(root);
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
