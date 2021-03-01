/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
*/

/**
 * Define Global Variables
*/
const elementsList = document.querySelectorAll('[data-nav]');
const navbarList = document.querySelector('#navbar-list');
let activeSection = '';

/**
 * End Global Variables
 * Start Helper Functions
*/

// Set scroll-to behaviour for page element
function scrollToPageElement(pageElement) {
    pageElement.scrollIntoView({
        behavior: 'smooth'
    });
}

/**
 * End Helper Functions
 * Begin Main Functions
 *
*/

// Build the navigation:
// Iterate through list of elements (sections) with the "data-nav" attribute
// Extract text and attribute values for building the navigation
// Create menu items as list items in an unordered list
// For efficiency, use fragments for appending menu items to UL node in the HTML
function buildNav() {
    if (elementsList) {
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < elementsList.length; i++) {
            const menuItem = document.createElement('li');
            const menuLink = document.createElement('a');
            menuLink.setAttribute('class', 'menu-link section' + (i + 1));
            menuLink.setAttribute('href', '#' + elementsList[i].id);
            menuLink.innerText = elementsList[i].dataset.nav;
            fragment.appendChild(menuItem).appendChild(menuLink);
        }
        if (navbarList) {
            navbarList.appendChild(fragment);
        }
    }
}

// Show section as active when near top of viewport:
// Add scroll event listener to window to apply "active" class to each section when in viewport
// Remove "active" class from section when section is no longer in viewport
// Add or remove "active" class from menu items (navigation) depending on which section is in viewport
function addActiveStateOnScroll() {
    if (elementsList) {
        for (let i = 0; i < elementsList.length; i++) {
            window.addEventListener('scroll', function () {
                const elementPosition = elementsList[i].getBoundingClientRect();
                const linkElement = document.querySelector('.menu-link.section' + (i + 1))
                if (elementPosition.top > -elementPosition.height / 3 && elementPosition.top < window.innerHeight / 3) {
                    linkElement.classList.add('active');
                    elementsList[i].classList.add('active');
                } else {
                    linkElement.classList.remove('active');
                    elementsList[i].classList.remove('active');
                }
            })
        }
    }
}

// Scroll to appropriate section when menu link is clicked:
// For efficiency, add event listener to UL element and use event delegation to detect clicks on menu items
// Disable default HTML link behaviour and replace with custom JS link behaviour
function scrollToSection() {
    if (navbarList) {
        navbarList.addEventListener('click', function (theEvent) {
            theEvent.preventDefault();
            if (theEvent.target.nodeName === 'A') {
                const clickedMenuLink = theEvent.target;
                activeSection = document.querySelector(clickedMenuLink.getAttribute('href'));
                scrollToPageElement(activeSection);
            }
        })
    }
}

// Hide navigation while not scrolling:
// Add event listener to window to run delayed (timeout) function to hide navigation when scrolling
// Clear timeout during scrolling
// Hide navigation by setting opacity to 0 to allow css hover interactions with hidden navigation
function showNavOnScroll() {
    const pageHeader = document.querySelector('.page-header');
    if (pageHeader) {
        let isScrolling = '';
        window.addEventListener('scroll', function () {
            pageHeader.style.opacity = 1;

            // Clear timeout while scrolling
            window.clearTimeout(isScrolling);

            // Set timeout to run 2000ms after scrolling stops
            // Prevent timeout from running when scrolling stops a short distance from the top of the document
            if (window.pageYOffset > (3 * pageHeader.offsetHeight)) {
                isScrolling = setTimeout(function () {
                    pageHeader.style.opacity = 0;
                }, 2000);
            }
        }, false);
    }
}

// Hide or show section content when toggle button is clicked
function toggleCollapse() {
    if (elementsList) {
        for (let i = 0; i < elementsList.length; i++) {
            elementsList[i].addEventListener('click', function (theEvent) {
                if (theEvent.target.nodeName === 'BUTTON') {
                    const toggleButton = theEvent.target;
                    if (toggleButton.classList.contains('toggle-button')) {
                        const sectionHeader = toggleButton.parentElement;
                        const sectionContent = sectionHeader.nextElementSibling;
                        if (toggleButton.getAttribute('aria-expanded') === 'true') {
                            toggleButton.setAttribute('aria-expanded', false);
                            toggleButton.textContent = '+';
                        }
                        else {
                            toggleButton.setAttribute('aria-expanded', true);
                            toggleButton.textContent = '-';
                        }
                        sectionContent.classList.toggle('collapse');
                    }
                }
            })
        }
    }
}

// Scroll to the top of viewport when floating "Top" button is clicked:
// Add event listener to window to display or hide "Top" button depending on height scrolled
// Add event listener to "Top" to scroll window to the top when clicked
function scrollToTopOnClick() {
    const scrollButton = document.querySelector('#scroll-to-top');
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > window.innerHeight / 2) {
            scrollButton.style.display = 'block';
        }
        else {
            scrollButton.style.display = 'none'
        }
    })
    scrollButton.addEventListener('click', function () {
        document.documentElement.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    })
}

// Build hamburger navigation for viewports with width less than 768px:
// Replace default "navbar-menu" class with "navbar-menu-mobile" class on the nav element
function buildMobileNav() {
    if (navbarList && window.innerWidth < 768) {
        const navbar = document.querySelector('nav');
        const navbarToogle = document.querySelector('.navbar-toggle');
        navbar.classList.remove('navbar-menu');
        navbar.classList.add('navbar-menu-mobile');
        navbar.addEventListener('click', function () {
            if (navbarToogle.getAttribute('aria-expanded') === 'true') {
                navbarToogle.setAttribute('aria-expanded', false);
                navbarList.style.display = 'none';
            }
            else {
                navbarToogle.setAttribute('aria-expanded', true);
                navbarList.style.display = 'block';
            }
        })
    }
}

/**
 * End Main Functions
 * Begin Events
 *
*/

// Build navigation
buildNav();
buildMobileNav();


// Scroll to appropriate section when menu is clicked
scrollToSection();

// Show section as active when near top of viewport
addActiveStateOnScroll();

// Hide navigation bar while not scrolling
showNavOnScroll();

// Hide or show section content when section heading is clicked
toggleCollapse();

// Scroll to the top of viewport when floating "Top" button is clicked
scrollToTopOnClick();