(function () {
    'use strict';

    var DEFAULT_NAME = 'мой друг';
    var TITLE_TEMPLATE = 'Привет, {name}! Добро пожаловать на сайт группы отелей Selly Hotels!';

    var promoTitle = document.getElementById('promoTitle');
    var modal = document.getElementById('welcomeModal');
    var form = document.getElementById('welcomeForm');
    var input = document.getElementById('guestName');
    var error = document.getElementById('guestNameError');
    var lastFocusedElement = null;

    function formatName(value) {
        var name = value.trim().replace(/\s+/g, ' ');

        if (!name) {
            return '';
        }

        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    function setGreeting(name) {
        promoTitle.textContent = TITLE_TEMPLATE.replace('{name}', function () {
            return name || DEFAULT_NAME;
        });
    }

    function showError(message) {
        error.textContent = message;
        error.hidden = false;
        input.classList.add('welcome-modal__input_invalid');
        input.setAttribute('aria-invalid', 'true');
    }

    function hideError() {
        error.hidden = true;
        input.classList.remove('welcome-modal__input_invalid');
        input.removeAttribute('aria-invalid');
    }

    function openModal() {
        lastFocusedElement = document.activeElement;
        modal.hidden = false;
        document.body.classList.add('modal-open');

        window.requestAnimationFrame(function () {
            input.focus();
        });
    }

    function closeModal() {
        modal.hidden = true;
        document.body.classList.remove('modal-open');
        hideError();

        if (lastFocusedElement && lastFocusedElement !== document.body) {
            lastFocusedElement.focus();
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        var name = formatName(input.value);

        if (!name) {
            showError('Пожалуйста, введите имя');
            input.focus();
            return;
        }

        setGreeting(name);
        closeModal();
    }

    modal.addEventListener('click', function (event) {
        if (event.target.hasAttribute('data-welcome-close')) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (modal.hidden) {
            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            closeModal();
            return;
        }

        if (event.key !== 'Tab') {
            return;
        }

        var focusable = modal.querySelectorAll('button, input, [href], select, textarea, [tabindex]:not([tabindex="-1"])');

        if (!focusable.length) {
            return;
        }

        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

    input.addEventListener('input', function () {
        if (!error.hidden) {
            hideError();
        }
    });

    form.addEventListener('submit', handleSubmit);

    setGreeting(DEFAULT_NAME);
    openModal();
})();
