---
layout: default
title: Projects
permalink: /projects/
---

# Projects I am interested in
{{ site.data.projects.page_subtitle }}

<div class="panel">
  <h2>{{ site.data.projects.magnus_opus.title }}</h2>
  <p>{{ site.data.projects.magnus_opus.description }}</p>
</div>

<div class="panel">
  <h2>Other work</h2>
  <ul>
    {% for item in site.data.projects.other_work %}
    <li>{{ item }}</li>
    {% endfor %}
  </ul>
</div>

<div class="panel">
  <h2>{{ site.data.projects.extras.title }}</h2>
  {% for paragraph in site.data.projects.extras.paragraphs %}
  <p>{{ paragraph }}</p>
  {% endfor %}
</div>
