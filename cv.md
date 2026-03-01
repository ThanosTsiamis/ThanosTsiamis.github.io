---
layout: default
title: Curriculum Vitae
permalink: /cv/
---

# Curriculum Vitae

<div class="panel">
  <h2>Education</h2>
  {% for item in site.data.cv.education %}
  <p><strong>{{ item.degree }}</strong></p>
  {% if item.details %}
  <p>{{ item.details }}</p>
  {% endif %}
  {% endfor %}
</div>

<div class="panel">
  <h2>Work Experience</h2>
  <ul>
    {% for item in site.data.cv.work_experience %}
    <li>{{ item }}</li>
    {% endfor %}
  </ul>
</div>

<div class="panel">
  <h2>Stacks and Technologies</h2>
  <ul>
    {% for item in site.data.cv.stacks %}
    <li>{{ item }}</li>
    {% endfor %}
  </ul>
</div>

<div class="panel">
  <h2>Also..</h2>
  <p><strong>{{ site.data.cv.also }}</strong></p>
</div>
