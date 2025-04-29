// Updated artist data with Daddy Yankee added at the beginning
const artistsData = [
  { id: 'artist0', name: 'Daddy Yankee', reportUrls: [ // Added Daddy Yankee
    'https://lookerstudio.google.com/embed/reporting/0114febd-b174-4d34-8e78-f6b10a94535f/page/p_2la4tiiyqd',
    'about:blank',
    'about:blank',
    'about:blank'
  ]},
  { id: 'artist1', name: 'BTS', reportUrls: [
    'https://lookerstudio.google.com/embed/reporting/0ec3d1cf-547b-4e66-8c81-77921c1cab64/page/gnpEF',
    'about:blank',
    'about:blank',
    'about:blank'
  ]},
  { id: 'artist2', name: 'Chicocurlyhead', reportUrls: [
    'https://lookerstudio.google.com/embed/reporting/2cdea0f6-6583-4f4d-8500-b0a58e677dc6/page/gnpEF',
    'about:blank',
    'about:blank',
    'about:blank'
  ]},
  { id: 'artist3', name: 'MAGNA', reportUrls: [
    'https://lookerstudio.google.com/embed/reporting/d53caf15-04e7-4737-b2ab-d9b47a9752e9/page/gnpEF',
    'about:blank',
    'about:blank',
    'about:blank'
  ]},
  { id: 'artist4', name: 'Adrian Cota', reportUrls: [
    'https://lookerstudio.google.com/embed/reporting/a1f0ea40-c3b2-4df5-979d-4ab132a2b7ec/page/gnpEF',
    'about:blank',
    'about:blank',
    'about:blank'
  ]},
  { id: 'artist5', name: 'Meme del Real', reportUrls: [
    'https://lookerstudio.google.com/embed/reporting/ce6d6f8f-4e3e-458f-ad76-7bd16651cd52/page/gnpEF',
    'about:blank',
    'about:blank',
    'about:blank'
  ]},
  { id: 'artist6', name: 'andrea ele', reportUrls: [
    'https://lookerstudio.google.com/embed/reporting/08ebac8f-33d1-48fe-94ad-98357027f20a/page/gnpEF',
    'about:blank',
    'about:blank',
    'about:blank'
  ]},
  { id: 'artist7', name: 'América Fernández', reportUrls: [
    'https://lookerstudio.google.com/embed/reporting/01360d8d-5515-477c-819d-11ecba384212/page/gnpEF',
    'about:blank',
    'about:blank',
    'about:blank'
  ]},
];

// Data for PALF and TRUVATOS sections (Social Media)
// Updated reportUrl for all items to the new Looker Studio link
const socialMediaData = [
  { id: 'fb', name: 'Facebook', reportUrl: 'https://lookerstudio.google.com/embed/reporting/b4a8cec2-b9a5-4db4-8370-c9594f08c39d/page/gnpEF' },
  { id: 'ig', name: 'Instagram', reportUrl: 'https://lookerstudio.google.com/embed/reporting/b4a8cec2-b9a5-4db4-8370-c9594f08c39d/page/gnpEF' },
  { id: 'x', name: 'X (Twitter)', reportUrl: 'https://lookerstudio.google.com/embed/reporting/b4a8cec2-b9a5-4db4-8370-c9594f08c39d/page/gnpEF' },
  { id: 'yt', name: 'YouTube', reportUrl: 'https://lookerstudio.google.com/embed/reporting/b4a8cec2-b9a5-4db4-8370-c9594f08c39d/page/gnpEF' },
  { id: 'tt', name: 'TikTok', reportUrl: 'https://lookerstudio.google.com/embed/reporting/b4a8cec2-b9a5-4db4-8370-c9594f08c39d/page/gnpEF' },
  { id: 'sc', name: 'Snapchat', reportUrl: 'https://lookerstudio.google.com/embed/reporting/b4a8cec2-b9a5-4db4-8370-c9594f08c39d/page/gnpEF' },
];


// Get elements
const hamburgerIcon = document.getElementById('hamburger-icon');
const navButtons = document.querySelectorAll('.nav-button');
const contentSections = document.querySelectorAll('.content-section');


// Generic function to render a list in a sidebar
function renderList(listElementId, data, clickHandler) {
  const listElement = document.getElementById(listElementId);
  if (listElement) {
    listElement.innerHTML = ''; // Clear existing list
    data.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.name;
      li.dataset.itemId = item.id; // Store item ID for reference
      // Pass the clickHandler function itself, not the result of calling it
      li.addEventListener('click', (event) => clickHandler(event, data)); // Pass data to handler
      listElement.appendChild(li);
    });
  }
}

// Generic function to render panels in a grid container
function renderPanels(gridContainerId, data) {
  const gridContainerElement = document.getElementById(gridContainerId);
  if (gridContainerElement) {
    gridContainerElement.innerHTML = ''; // Clear existing panels from the grid container
    data.forEach(item => {
      // Create panel container (card)
      const panelDiv = document.createElement('div');
      panelDiv.classList.add('panel'); // Use 'panel' class for card styling
      panelDiv.dataset.itemId = item.id; // Link panel to item

      // Create h2 title
      const titleElement = document.createElement('h2');
      titleElement.textContent = item.name; // Set title text

      // Create iframe for content
      const iframe = document.createElement('iframe');
      iframe.title = `${item.name} Panel`; // Accessible title
      iframe.src = 'about:blank'; // Start empty
      iframe.frameborder = "0";
      iframe.style.border = "0";
      iframe.allowfullscreen = true;
      // Standard sandbox attributes
      iframe.sandbox = "allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox";

      // Append title and iframe to panel, and panel to the grid container
      panelDiv.appendChild(titleElement); // Add title first
      panelDiv.appendChild(iframe);
      gridContainerElement.appendChild(panelDiv); // Append to grid container
    });
  }
}

// Generic function to handle item selection in a sidebar
// Added optional activeSectionElement parameter
function handleSelection(event, data, activeSectionElement = null) {
  const selectedLi = event.target;
  const itemId = selectedLi.dataset.itemId;
  const selectedItem = data.find(item => item.id === itemId);

  if (!selectedItem) return;

  // Find the active section - use passed element if available, otherwise query the DOM
  const activeSection = activeSectionElement || document.querySelector('.content-section.active');

  if (!activeSection) {
      console.error('handleSelection: activeSection is null!');
      return; // Exit if activeSection is null
  }

  // Find the grid container within the active section
  const currentGridContainer = activeSection.querySelector('.grid-container');
  if (!currentGridContainer) {
      console.error('handleSelection: currentGridContainer is null!');
      return; // Exit if currentGridContainer is null
  }

  // Update panel iframes: Load content into the selected item's panel, clear others
  const allPanels = currentGridContainer.querySelectorAll('.panel');
  allPanels.forEach(panel => {
    const iframe = panel.querySelector('iframe');
    if (iframe) {
      if (panel.dataset.itemId === itemId) {
        // Use the first URL from the array for artists, or the single URL for social media
        const targetUrl = selectedItem.reportUrls ? selectedItem.reportUrls[0] || 'about:blank' : selectedItem.reportUrl || 'about:blank';
        if (iframe.src !== targetUrl) {
          iframe.src = targetUrl;
        }
      } else {
        // Clear iframe if it's not the selected item's panel
        if (iframe.src !== 'about:blank') {
           iframe.src = 'about:blank';
        }
      }
    }
  });


  // Update active class styling on the list within the active section
  const currentList = activeSection.querySelector('ul'); // Find the list within the active section
  if (currentList) {
      currentList.querySelectorAll('li').forEach(li => {
        li.classList.remove('active');
      });
      selectedLi.classList.add('active');
  }


  // Scroll the selected panel into view smoothly
  const currentPanelsSection = activeSection.querySelector('.panels-section'); // Find panels section in active section
  const targetPanel = currentGridContainer.querySelector(`.panel[data-item-id="${itemId}"]`); // Find panel in current grid container
  if (currentPanelsSection && targetPanel) {
    currentPanelsSection.scrollTo({
        top: targetPanel.offsetTop,
        behavior: 'smooth'
    });
  }


  // On mobile, hide the sidebar after selection (optional, but common UX)
  if (window.innerWidth <= 900) {
      const currentSidebar = activeSection.querySelector('.artist-list-section'); // Find sidebar in active section
      if (currentSidebar) {
          currentSidebar.classList.remove('active');
      }
  }
}

// Function to toggle sidebar visibility on mobile (now needs to target the active sidebar)
function toggleSidebar() {
    const currentSidebar = document.querySelector('.content-section.active .artist-list-section');
    if (currentSidebar) {
        currentSidebar.classList.toggle('active');
    }
}

// Add event listener to hamburger icon
if (hamburgerIcon) {
    hamburgerIcon.addEventListener('click', toggleSidebar);
}

/**
 * Renders a circular gauge within the given element.
 * @param {HTMLElement} el - The container element for the gauge.
 * @param {number} percent - The percentage value (0-100) for the gauge progress.
 * @param {string} label - The label text to display below the number.
 */
function renderGauge(el, percent, label = '') {
    const radius = 60; // Radius of the circle
    const circumference = 2 * Math.PI * radius;
    const strokeWidth = 10; // Must match CSS .gauge-circle stroke-width

    // Clear existing content
    el.innerHTML = '';
    el.classList.add('gauge'); // Ensure the container has the gauge class

    // Create SVG element
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add('gauge-svg');
    svg.setAttribute('viewBox', '0 0 120 120'); // Adjust viewBox based on radius and stroke
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    // Create track circle
    const trackCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    trackCircle.classList.add('gauge-circle', 'gauge-track');
    trackCircle.setAttribute('cx', '60'); // Center X
    trackCircle.setAttribute('cy', '60'); // Center Y
    trackCircle.setAttribute('r', radius);

    // Create progress circle
    const progressCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    progressCircle.classList.add('gauge-circle', 'gauge-progress');
    progressCircle.setAttribute('cx', '60'); // Center X
    progressCircle.setAttribute('cy', '60'); // Center Y
    progressCircle.setAttribute('r', radius);
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference; // Start hidden

    // Append circles to SVG
    svg.appendChild(trackCircle);
    svg.appendChild(progressCircle);

    // Create text container
    const textDiv = document.createElement('div');
    textDiv.classList.add('gauge-text');

    // Create number element
    const numberSpan = document.createElement('span');
    numberSpan.classList.add('gauge-number');
    numberSpan.textContent = '0%'; // Start at 0 for animation

    // Create label element
    const labelSpan = document.createElement('span');
    labelSpan.classList.classList.add('gauge-label');
    labelSpan.textContent = label;

    // Append number and label to text container
    textDiv.appendChild(numberSpan);
    textDiv.appendChild(labelSpan);


    // Append SVG and text to the container element
    el.appendChild(svg);
    el.appendChild(textDiv);

    // Animate the progress and number
    requestAnimationFrame(() => {
        const offset = circumference - (percent / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;

        // Animate the number
        let currentPercent = 0;
        const animationDuration = 1000; // 1 second
        const startTime = performance.now();

        function animateNumber(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / animationDuration, 1);
            currentPercent = Math.floor(progress * percent);
            numberSpan.textContent = `${currentPercent}%`;

            if (progress < 1) {
                requestAnimationFrame(animateNumber);
            }
        }

        requestAnimationFrame(animateNumber);
    });
}

// Function to switch between tabs/sections
function switchTab(tabId) {
    // Hide all sections
    contentSections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });

    // Show the selected section
    const targetSection = document.getElementById(tabId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block';

        // Determine which data and elements to use based on the tab
        let dataToRender = [];
        let listElementId = '';
        let gridContainerId = '';
        let sidebarTitle = '';

        if (tabId === 'artists') {
            dataToRender = artistsData;
            listElementId = 'artists-list';
            gridContainerId = 'artists-grid-container';
            sidebarTitle = 'Artists';
        } else if (tabId === 'palf') {
            dataToRender = socialMediaData; // Use social media data for PALF
            listElementId = 'palf-list';
            gridContainerId = 'palf-grid-container';
            sidebarTitle = 'PALF'; // Changed from 'PALF Artists'
        } else if (tabId === 'truvatos') {
            dataToRender = socialMediaData; // Use social media data for TRUVATOS
            listElementId = 'truvatos-list';
            gridContainerId = 'truvatos-grid-container';
            sidebarTitle = 'TRUVATOS'; // Changed from 'TRUVATOS Artists'
        }

        // Update sidebar title
        const sidebarTitleElement = targetSection.querySelector('.sidebar-title h2');
        if (sidebarTitleElement) {
            sidebarTitleElement.textContent = sidebarTitle;
        }


        // Render list and panels for the active section
        renderList(listElementId, dataToRender, handleSelection);
        renderPanels(gridContainerId, dataToRender);

        // Optionally, select the first item by default when switching tabs
        const firstItemLi = document.getElementById(listElementId)?.querySelector('li');
        if (firstItemLi) {
          // Pass the targetSection element when triggering the click programmatically
          handleSelection({ target: firstItemLi }, dataToRender, targetSection);
        }
    }

    // Update active class on navigation buttons
    navButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.tab === tabId) {
            button.classList.add('active');
        }
    });
}


// Initial setup
function init() {
  // Add event listeners to navigation buttons
  navButtons.forEach(button => {
      button.addEventListener('click', () => {
          switchTab(button.dataset.tab);
      });
  });

  // Set the default active tab (e.g., 'artists')
  switchTab('artists');

  // Add event listener to hamburger icon (already done, but ensure it targets active sidebar)
  // The toggleSidebar function is updated to target the active sidebar.
}

// Run initialization when the DOM is ready
document.addEventListener('DOMContentLoaded', init);

// --- Placeholder for future CRUD operations ---
// function addItem(dataArray, item) { ... renderList(); renderPanels(); ... }
// function editItem(dataArray, id, newItem) { ... renderList(); ... } // Panel content might need update too
// function deleteItem(dataArray, id) { ... renderList(); renderPanels(); ... }
// Remember to re-render lists/panels after any CRUD operation.
