// ========================================
// TIMELINE COMPONENT
// Data-driven timeline following React-like patterns
// ========================================

const TimelineData = [
  {
    id: 'inditex',
    date: 'Feb 2023 - Present',
    datetime: '2023-02',
    title: 'Senior Frontend Developer',
    company: 'Inditex',
    description: 'Promoted to Team Lead (July 2025) to oversee development of critical loyalty and back-office systems managing global online stores. Bridge the gap between product design and technical implementation, ensuring high-fidelity UI/UX at multinational scale.',
    skills: ['React', 'TypeScript', 'Team Leadership', 'Figma']
  },
  {
    id: 'dolphinze',
    date: 'Sep 2023 - Sep 2025',
    datetime: '2023-09',
    title: 'Senior Frontend Lead',
    company: 'Dolphinze',
    description: 'Led the frontend team for a global payroll platform allowing remote contractors to receive payments in multiple currencies, including crypto. Implemented high-performance UIs using MUI and Tailwind CSS for complex administrative dashboards.',
    skills: ['React', 'Vite', 'MUI', 'Tailwind CSS']
  },
  {
    id: 'zircontech',
    date: 'Mar 2022 - Feb 2023',
    datetime: '2022-03',
    title: 'Frontend Developer',
    company: 'ZirconTech',
    description: 'Led customization of a white-label crypto exchange (HoverTrusts), managing legacy system integrations and security best practices. Collaborated on Ola.gg CMS for NFT scholarships and developed blockchain-based document notarization application.',
    skills: ['React', 'Crypto/Web3', 'Blockchain', 'CMS']
  },
  {
    id: 'sombradoble',
    date: 'Jan 2020 - Mar 2022',
    datetime: '2020-01',
    title: 'Frontend Developer',
    company: 'Sombradoble',
    description: 'Key player in a small distributed team, managing full lifecycle from architecture to deployment. Developed complex back-office systems for multinational logistics (Agribioterra) and scheduling applications (iLoft Malaga).',
    skills: ['React', 'Angular', 'Ionic', 'JavaScript']
  }
];

// Timeline Item Component
function TimelineItem({ id, date, datetime, title, company, description, skills }) {
  return `
    <article class="timeline-item anim-stagger-item" role="listitem" data-id="${id}">
      <div class="timeline-marker">
        <span class="timeline-bullet" aria-hidden="true"></span>
      </div>
      <div class="timeline-content">
        <div class="timeline-header">
          <time class="timeline-date" datetime="${datetime}">${date}</time>
          <button class="timeline-toggle" aria-expanded="false" aria-label="Toggle details for ${company}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </div>
        <h3 class="timeline-title">${title}</h3>
        <p class="timeline-company">${company}</p>
        <div class="timeline-details" aria-hidden="true">
          <p>${description}</p>
          <div class="timeline-skills">
            ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
          </div>
        </div>
      </div>
    </article>
  `;
}

// Timeline Container Component
function Timeline({ data, containerId = 'timeline-container' }) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Timeline: Container #${containerId} not found`);
    return;
  }

  const html = `
    <div class="timeline anim-stagger-children" role="list">
      ${data.map(item => TimelineItem(item)).join('')}
    </div>
  `;

  container.innerHTML = html;

  // Initialize toggle functionality after render
  initTimelineToggles();
}

// Toggle functionality
function initTimelineToggles() {
  const toggleButtons = document.querySelectorAll('.timeline-toggle');

  toggleButtons.forEach(button => {
    // Remove existing listeners to prevent duplicates
    button.replaceWith(button.cloneNode(true));
  });

  // Re-select after clone
  document.querySelectorAll('.timeline-toggle').forEach(button => {
    button.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      const content = this.closest('.timeline-content');
      const details = content.querySelector('.timeline-details');

      if (isExpanded) {
        this.setAttribute('aria-expanded', 'false');
        details.classList.remove('is-expanded');
        details.setAttribute('aria-hidden', 'true');
      } else {
        this.setAttribute('aria-expanded', 'true');
        details.classList.add('is-expanded');
        details.setAttribute('aria-hidden', 'false');
      }
    });
  });
}

// Auto-initialize when DOM is ready
function initTimeline() {
  const container = document.getElementById('timeline-container');
  if (container) {
    Timeline({ data: TimelineData, containerId: 'timeline-container' });
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTimeline);
} else {
  initTimeline();
}

// Export for external use (if needed)
window.Timeline = Timeline;
window.TimelineData = TimelineData;
