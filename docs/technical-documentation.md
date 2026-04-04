# 🧠 Technical Documentation

## Overview

This project is a responsive portfolio website built using HTML, CSS, and JavaScript. It focuses on creating a clean UI, interactive components, and a user-friendly experience.

---

## System Architecture

The project follows a simple front-end structure:

- HTML → structure  
- CSS → styling and layout  
- JavaScript → interactivity  

---

## Key Components

### 1. Theme Toggle

- Implemented using `data-theme` on `<html>`  
- CSS variables control colors  
- User preference saved using LocalStorage  

---

### 2. Dynamic Greeting

- Based on current time using `Date().getHours()`  
- Displays different messages (Morning, Afternoon, Evening)  

---

### 3. Project Cards

- Implemented using CSS 3D transforms  
- Uses `perspective` and `rotateY`  
- Flip effect on hover  

---

### 4. Modal System

- Opens when clicking "View Details"  
- Content is dynamically updated using JavaScript  
- Improves user interaction without page reload  

---

### 5. Responsive Design

- Built using Flexbox and Media Queries  
- Supports mobile, tablet, and desktop screens  

---

## Data Handling

- LocalStorage is used to:
  - Save theme preference  
  - Maintain user settings  

---

## Design Decisions

- Used soft color palette for better visual comfort  
- Focused on minimal and clean layout  
- Prioritized usability and readability  

---

## Performance Considerations

- Optimized image usage  
- Lightweight JavaScript  
- No heavy external libraries  

---

## Limitations

- No backend integration  
- Contact form is not functional  
- Limited accessibility features  

---

## Future Enhancements

- Add backend functionality  
- Improve accessibility (ARIA, keyboard navigation)  
- Add more animations and transitions  
- Enhance performance optimization  

---

## Conclusion

This project demonstrates strong fundamentals in front-end development, combining structure, design, and interactivity into a cohesive portfolio website.