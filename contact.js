const EMAIL = "georgia.m.vrana@gmail.com";

export function contactPayload(formData) {
  return {
    name: String(formData.get("name") || "").trim().slice(0, 100),
    email: String(formData.get("email") || "").trim().slice(0, 254),
    message: String(formData.get("message") || "").trim().slice(0, 5000),
    _subject: "Portfolio enquiry for Georgia Vrana",
    _honey: String(formData.get("_honey") || ""),
    _template: "table",
  };
}

export function initContactDialog() {
  const dialog = document.querySelector("#contact-dialog");
  if (!dialog?.showModal) return;
  let trigger;
  for (const link of document.querySelectorAll("[data-contact]")) {
    link.addEventListener("click", event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = link;
      dialog.showModal();
      dialog.querySelector('[name="name"]').focus();
    });
  }
  dialog.querySelector("[data-close-contact]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => trigger?.focus());
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  const form = dialog.querySelector("form");
  const status = dialog.querySelector('[role="status"]');
  const submit = form.querySelector('[type="submit"]');
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!form.reportValidity() || submit.disabled) return;
    const payload = contactPayload(new FormData(form));
    if (payload._honey) return;
    if (!payload.name || !payload.message) {
      status.textContent = "Please include your name and a message.";
      return;
    }
    submit.disabled = true;
    submit.textContent = "Sending…";
    status.textContent = "Sending your message securely…";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || ![true, "true"].includes(result.success)) {
        if (/activat|confirm/i.test(result.message || "")) {
          status.textContent = "This form is awaiting email confirmation. Please use the direct email link below for now. Your message is still here.";
          return;
        }
        throw new Error("Message not accepted");
      }
      status.textContent = "Your message was submitted. Thank you for getting in touch!";
      form.reset();
    } catch {
      status.textContent = "I couldn’t confirm delivery. Your message is still here—please try again or use the email link below.";
    } finally {
      clearTimeout(timeout);
      submit.disabled = false;
      submit.textContent = "Send message";
    }
  });
}
