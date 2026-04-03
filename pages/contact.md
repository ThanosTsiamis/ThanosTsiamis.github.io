---
layout: default
title: Contact
permalink: /contact/
---

# Contact

<div class="panel">
  <p>Business proposition, academic question or just a hi?</p>
  <p><strong>Don't be afraid to drop me a line!</strong></p>
  <p>I will do my best to respond as soon as possible.</p>
</div>

<form class="panel retro-form" data-contact-form data-contact-email="{{ site.data.social.email }}">
  <div class="field">
    <label class="field-label" for="name">Your name:</label>
    <input id="name" name="name" type="text" required>
  </div>
  <div class="field">
    <label class="field-label" for="email">Your email:</label>
    <input id="email" name="email" type="email" required>
  </div>
  <div class="field">
    <label class="field-label" for="message">Your message:</label>
    <textarea id="message" name="message" rows="6" required></textarea>
  </div>
  <button type="submit" class="retro-btn">Send email</button>
</form>

<div class="panel">
  <div class="field"><span class="field-label">Email:</span> <a href="mailto:{{ site.data.social.email }}">{{ site.data.social.email }}</a></div>
  <div class="field"><span class="field-label">{{ site.data.social.github.label }}:</span> <a href="{{ site.data.social.github.url }}">{{ site.data.social.github.label }}</a></div>
  <div class="field"><span class="field-label">{{ site.data.social.linkedin.label }}:</span> <a href="{{ site.data.social.linkedin.url }}">{{ site.data.social.linkedin.label }}</a></div>
</div>
