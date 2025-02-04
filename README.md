# Visitor Management System

## Overview
This project is a **Visitor Management System** built using Node.js. It allows storing, retrieving, and managing visitor data using JSON files for persistent storage.

## Features
- Add new visitors with details including name, age, date, time, comments, and assistant.
- Store visitor data in JSON files within a `dataFolder`.
- Generate unique IDs for each visitor.
- Load and retrieve visitor data using their ID.
- Validate visitor input data before saving.

## Installation
1. Clone the repository:
   ```sh
   git clone [<repo-url>](https://github.com/KatekaniN/node-file-system.git)
   ```
2. Navigate to the project directory:
   ```sh
   cd node-file-system
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

## Usage
### Importing the Module
```js
const { Visitor, load, generateId } = require("./visitor.js");
```

### Adding a New Visitor
```js
const newVisitor = new Visitor(
  "John Doe",
  25,
  "2025-02-01",
  "14:30",
  "First-time visitor",
  "Jane Smith"
);
console.log(newVisitor.save());
```

### Retrieving a Visitor by ID
```js
try {
  const visitor = load(1);
  console.log(visitor);
} catch (error) {
  console.error(error.message);
}
```

## Error Handling
Error messages are predefined for input validation failures, such as:
- **Invalid Name:** Must be a string with both first and last name.
- **Invalid Age:** Must be a non-negative number.
- **Invalid Date:** Must follow `YYYY-MM-DD` format.
- **Invalid Time:** Must follow `HH:MM` format.
- **Invalid Assistant:** Must be a valid full name.
- **Invalid ID:** Must be a number.

## Testing

Run tests using:

```
npm run test
```

## Resources
[Project Brief](http://syllabus.africacode.net/projects/nodejs/file-io/)


