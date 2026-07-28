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
  {% assign award = site.data.projects.magnus_opus.award %}
  <div class="project-award">
    <p class="project-award-label">🏆 {{ award.year }} {{ award.name }}</p>
    <p><strong>{{ award.publication }}</strong></p>
    <p>{{ award.authors }}</p>
    <p>In {{ award.venue }} (<strong>{{ award.name }}</strong>)</p>
    <p><a href="{{ award.url }}" target="_blank" rel="noopener noreferrer">Learn more about FIONA on IEEE Xplore</a></p>
  </div>
</div>

<div class="panel">
  <h2>Security Research</h2>
  {% for item in site.data.security.disclosures %}
  <div class="security-disclosure">
    <div class="security-disclosure-heading">
      <h3><a href="{{ item.advisory_url }}" target="_blank" rel="noopener noreferrer">{{ item.cve }}</a></h3>
      <span class="severity-badge severity-{{ item.severity | downcase }}">{{ item.severity }} · {{ item.cvss }}</span>
    </div>
    <p><strong>{{ item.title }}</strong></p>
    <p>{{ item.credit }} for <a href="{{ item.advisory_url }}" target="_blank" rel="noopener noreferrer">{{ item.ghsa }}</a>.</p>
    <p>{{ item.summary }}</p>
    <p>{{ item.remediation }} <a href="{{ item.nvd_url }}" target="_blank" rel="noopener noreferrer">View the NVD record.</a></p>
  </div>
  {% endfor %}
</div>

<div class="panel">
  <h2>Open-Source Contributions</h2>
  {% for item in site.data.contributions.open_source %}
  <article class="contribution-card">
    <div class="contribution-heading">
      <h3><a href="{{ item.pull_request_url }}" target="_blank" rel="noopener noreferrer">{{ item.project }} — {{ item.title }}</a></h3>
      <span class="merged-badge">Merged</span>
    </div>
    <p>{{ item.summary }}</p>
    <p class="contribution-impact"><strong>Impact:</strong> {{ item.impact }}</p>
    <ul>
      {% for technique in item.techniques %}
      <li>{{ technique }}</li>
      {% endfor %}
    </ul>
    <p>
      <a href="{{ item.pull_request_url }}" target="_blank" rel="noopener noreferrer">View pull request #{{ item.pull_request_number }}</a>
      ·
      <a href="{{ item.issue_url }}" target="_blank" rel="noopener noreferrer">View issue #{{ item.issue_number }}</a>
    </p>
  </article>
  {% endfor %}
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
