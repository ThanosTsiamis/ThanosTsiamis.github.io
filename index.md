---
layout: default
title: Home
---

# Welcome
to my personal website

## Curious by nature
## Happy by choice!

<div class="panel">
  <div class="hero-profile">
    <img src="{{ '/assets/profile.jpg' | relative_url }}" alt="Portrait of Thanos Tsiamis" class="profile-photo">
    <div>
      <p>
        My name is Thanos, a postgraduate computer science student currently on a
        Bit of a Detour..., with a strong interest in computer stuff of all kinds!
      </p>
      <p>
        <a href="{{ '/about/' | relative_url }}">More About Me</a>
      </p>
    </div>
  </div>
</div>

<div class="panel">
  <h2>Quick Links</h2>
  <ul>
    {% for item in site.data.navigation %}
    {% unless item.label == "Home" %}
    <li><a href="{{ item.url | relative_url }}">{{ item.label }}</a></li>
    {% endunless %}
    {% endfor %}
  </ul>
</div>
