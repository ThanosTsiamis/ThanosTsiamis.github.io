---
layout: default
title: Curriculum Vitae
permalink: /cv/
---

# Curriculum Vitae

<div class="panel">
  <h2>Education</h2>
  {% for item in site.data.cv.education %}
  <p><strong><a href="{{ item.url }}" target="_blank" rel="noopener noreferrer">{{ item.degree }}</a></strong></p>
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
  <h2>Awards and Publications</h2>
  {% for item in site.data.cv.awards %}
  <article>
    <h3>{{ item.year }} — {{ item.name }}</h3>
    <p><strong>{{ item.work }}</strong></p>
    <p>{{ item.authors }}</p>
    <p>In {{ item.venue }} (<strong>{{ item.name }}</strong>)</p>
    <p><a href="{{ item.url }}" target="_blank" rel="noopener noreferrer">Learn more about FIONA on IEEE Xplore</a></p>
  </article>
  {% endfor %}
</div>

<div class="panel">
  <h2>Security Research</h2>
  {% for item in site.data.security.disclosures %}
  <article class="security-disclosure">
    <div class="security-disclosure-heading">
      <h3>{{ item.year }} — <a href="{{ item.advisory_url }}" target="_blank" rel="noopener noreferrer">{{ item.cve }}</a></h3>
      <span class="severity-badge severity-{{ item.severity | downcase }}">{{ item.severity }} · {{ item.cvss }}</span>
    </div>
    <p><strong>{{ item.title }}</strong></p>
    <p>{{ item.summary }}</p>
    <dl class="security-facts">
      <div><dt>Credit</dt><dd>{{ item.credit }}</dd></div>
      <div><dt>Package</dt><dd><code>{{ item.package }}</code></dd></div>
      <div><dt>Affected</dt><dd>{{ item.affected }}</dd></div>
      <div><dt>Patched</dt><dd>{{ item.patched }}</dd></div>
    </dl>
    <p>
      <a href="{{ item.advisory_url }}" target="_blank" rel="noopener noreferrer">{{ item.ghsa }}</a>
      ·
      <a href="{{ item.nvd_url }}" target="_blank" rel="noopener noreferrer">NVD record</a>
    </p>
  </article>
  {% endfor %}
</div>

<div class="panel">
  <h2>Open-Source Contributions</h2>
  {% for item in site.data.contributions.open_source %}
  <article class="contribution-card">
    <div class="contribution-heading">
      <h3>{{ item.year }} — <a href="{{ item.pull_request_url }}" target="_blank" rel="noopener noreferrer">{{ item.project }}</a></h3>
      <span class="merged-badge">Merged</span>
    </div>
    <p><strong>{{ item.title }}</strong></p>
    <p>{{ item.summary }}</p>
    <p class="contribution-impact">{{ item.impact }}</p>
    <p>
      <a href="{{ item.pull_request_url }}" target="_blank" rel="noopener noreferrer">Pull request #{{ item.pull_request_number }}</a>
      ·
      <a href="{{ item.issue_url }}" target="_blank" rel="noopener noreferrer">Issue #{{ item.issue_number }}</a>
    </p>
  </article>
  {% endfor %}
</div>

<div class="panel">
  <h2>Stacks and Technologies</h2>
  {% for group in site.data.cv.stacks_groups %}
  <h3>{{ group.title }}</h3>
  <ul>
    {% for item in group.items %}
    <li>{{ item }}</li>
    {% endfor %}
  </ul>
  {% endfor %}
</div>

<div class="panel">
  <h2>Also..</h2>
  <p><strong>{{ site.data.cv.also }}</strong></p>
</div>
