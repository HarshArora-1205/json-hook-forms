# JSON Hook Forms - Dynamic Form Generator

**Live Demo**: [https://json-hook-forms.vercel.app/](https://json-hook-forms.vercel.app/)  

## Overview  
JSON Hook Forms is a responsive, real-time, dynamic form generator. It allows users to input JSON schemas into a live editor, instantly previewing the form generated from the schema on the same interface. The application is built with React, TypeScript, and Tailwind CSS, integrating dark mode, JSON validation, real-time form generation, and more.  

If you like it, give it a star 😄.

---

## Features

### Core Features  
- **JSON Schema Editor**:
  - Real-time syntax highlighting and validation.
  - Displays error messages for invalid JSON schemas.
  - Dual code tabs (schema editor and JSON preview).
  - Smooth and responsive experience with **Shadcn UI** components.

- **Dynamic Form Preview**:
  - Forms are updated in real-time as the JSON schema changes.
  - Fully responsive layout, optimized for all screen sizes.
  - Mobile-friendly: editor and form preview stack vertically.

- **Form Functionalities**:
  - Supports multiple field types: text, email, select, radio, and textarea.
  - Includes validation messages and placeholders.
  - Submits form data to `console.log()` and displays a success toast notification.
  - Provides proper loading states and error handling.

- **Additional Features**:
  - **Slick UI**:
    - Styled with **Tailwind CSS** and Shadcn components.
    - Consistent design across the app.
  - **Dark Mode**:
    - Toggle between light and dark themes seamlessly.
  - **Proper Alerts & Notifications**:
    - Validation errors and form submission success alerts.
  - **Copy Button**:
    - Quickly copy the form JSON schema with one click.
  - **Proper Documentation**:
    - Well-structured README and example schemas.
  - **Error Handling**:
    - Graceful handling of invalid JSON or submission errors.

---

## Technical Stack
- **Frontend**: React 18+, Next 14, Tailwind CSS, React Hook Form, Zod, Shadcn UI
- **Languages**: TypeScript for type safety.
- **Testing**: 
  - **Playwright** for end-to-end (E2E) tests.
  - **Jest** for unit testing.

---

## Project Structure

```plaintext
root
├── __e2e__            # End-to-end tests using Playwright
├── __tests__          # Unit tests using Jest
├── src
│   ├── app
│   │   ├── fonts      # Custom fonts
│   │   ├── page.tsx   # Entry point for the app
│   ├── components
│   │   ├── ui         # UI-specific components shadcn
│   ├── hooks          # Custom React hooks
│   ├── lib            # Shared libraries and helpers
│   ├── utils          # Utility functions (e.g., JSON validation)
│   ├── types          # Schema types
```

## Setup Instructions

### Requirements

- Node.js (v16 or higher)
- Yarn or npm package manager

## Steps to Clone and Run the Project Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/json-hook-forms.git
   cd json-hook-forms
   ```

2. **Install Dependencies**  
   Use either `npm` or `yarn` to install required dependencies:
   ```bash
   npm install
   # OR
   yarn install
   ```

3. **Start the Development Server**  
   Start the application locally:
   ```bash
   npm run dev
   # OR
   yarn dev
   ```

4. **Access the Application**  
   Open your browser and navigate to:  
   [http://localhost:3000](http://localhost:3000)

---

## Optional: Running Tests Locally

- **Unit Tests** (Jest):
  ```bash
  npm run test
  # OR
  npm run test:ci
  ```

- **End-to-End Tests** (Playwright):
  ```bash
  npm run test:e2e
  # OR
  npm run test:e2e:ui
  # OR
  npm run test:e2e:report
  ```
## Example JSON Schema

You can use the following example schema to generate dynamic forms:

```json
{
  "formTitle": "Project Requirements Survey",
  "formDescription": "Please fill out this survey about your project needs",
  "fields": [
    {
      "id": "name",
      "type": "text",
      "label": "Full Name",
      "required": true,
      "placeholder": "Enter your full name"
    },
    {
      "id": "email",
      "type": "email",
      "label": "Email Address",
      "required": true,
      "placeholder": "you@example.com",
      "validation": {
        "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
        "message": "Please enter a valid email address"
      }
    },
    {
      "id": "comments",
      "type": "textarea",
      "label": "Additional Comments",
      "required": false,
      "placeholder": "Any other details you'd like to share..."
    }
  ]
}
```

Copy and paste this schema into the JSON editor in the application to preview the form in real-time.

---

## Contribution Guidelines

We welcome contributions to enhance the project! Please follow these steps:

1. **Fork the Repository**  
   Click the "Fork" button in the top-right corner of this repository to create your own copy.

2. **Clone the Forked Repository**  
   ```bash
   git clone https://github.com/your-username/json-hook-forms.git
   cd json-hook-forms
   ```

3. **Create a New Branch**  
   Use a descriptive branch name:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes**  
   - Update the code.
   - Write tests for new functionality.
   - Ensure all tests pass.

5. **Run Tests Locally**  
   - Unit Tests (Jest):
     ```bash
     npm run test
     ```
   - End-to-End Tests (Playwright):
     ```bash
     npm run test:e2e
     ```

6. **Commit and Push Your Changes**  
   ```bash
   git add .
   git commit -m "Add: Description of your changes"
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request**  
   Go to the original repository and click on "New Pull Request." Provide a clear description of the changes made.

### Contribution Rules

- Ensure your code follows the existing style guidelines.
- Add proper comments and documentation where necessary.
- For UI changes, test the responsiveness and dark mode compatibility.
- All new features must include corresponding tests.

Thank you for your contribution!
