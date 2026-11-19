/* One small form, no cookies, tracking, email storage in the browser, or mail sending. */
(() => {
  for (const form of document.querySelectorAll('[data-newsletter]')) {
    const email = form.querySelector('[name="email"]');
    const trap = form.querySelector('[name="website"]');
    const button = form.querySelector('button');
    const status = form.querySelector('[role="status"]');
    let busy = false;
    button.disabled = !form.dataset.endpoint;
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (busy || !form.dataset.endpoint || !form.reportValidity()) return;
      busy = true;
      button.disabled = true;
      button.textContent = 'Signing up…';
      status.textContent = '';
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      try {
        const response = await fetch(form.dataset.endpoint, {
          method: 'POST', mode: 'cors', credentials: 'omit', redirect: 'error', referrerPolicy: 'no-referrer',
          headers: {'Content-Type': 'application/json'}, signal: controller.signal,
          body: JSON.stringify({email: email.value.trim(), list_id: form.dataset.list,
            consent_version: 'new-content-weekly-v1', website: trap.value})
        });
        const data = await response.json();
        if (!response.ok || data.status !== 'subscribed') {
          status.textContent = response.status === 400 ? 'Please check your email address.'
            : response.status === 429 ? 'Please wait a little before trying again.'
            : 'We couldn’t save your signup. Please try again.';
          return;
        }
        email.value = '';
        status.textContent = 'You’re on the list. Thank you!';
      } catch (_) {
        status.textContent = 'We couldn’t confirm your signup. Please try again.';
      } finally {
        clearTimeout(timeout);
        button.textContent = 'Sign up';
        button.disabled = false;
        busy = false;
      }
    });
  }
})();
