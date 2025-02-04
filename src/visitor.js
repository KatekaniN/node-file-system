const fs = require("fs");
const path = require("path");
const dataFolder = "./dataFolder";

class Visitor {
  constructor(name, age, date, time, comments, assistant, id = null) {
    validateInputs({ name, age, date, time, comments, assistant });
    this.name = name;
    this.age = age;
    this.date = date;
    this.time = time;
    this.comments = comments;
    this.assistant = assistant;
    this.id = id;
  }

  static generateFileName(id) { // generates a file name for a visitor using the visitor's ID
    return `visitor_${id}.json`;
  }

  save() { // saves visitor data to a JSON file using fs.writeFileSync()
    let isNewVisitor = false;
    if (this.id === null) {
      this.id = generateId();
      isNewVisitor = true;
    }

    const fileName = Visitor.generateFileName(this.id);
    const filePath = path.join(dataFolder, fileName);

    if (!fs.existsSync(dataFolder)) {
      fs.mkdirSync(dataFolder);
    }

    const jsonData = JSON.stringify(this, null, 2);
    fs.writeFileSync(filePath, jsonData);

    return isNewVisitor
      ? `Visitor data saved to ${fileName}.`
      : `Visitor data for ${fileName} has been updated.`;
  }
}

function load(id) { // loads visitor data from a JSON file using fs.readFileSync()
  if (typeof id !== "number") {
    throw new Error(errorMessages.invalidId);
  }
  const fileName = Visitor.generateFileName(id);
  const filePath = path.join(dataFolder, fileName);

  if (fs.existsSync(filePath)) { // reads the file and parses the data to create a new Visitor object
    const data = fs.readFileSync(filePath, "utf8");
    const visitorData = JSON.parse(data);
    return new Visitor(
      visitorData.fullName,
      visitorData.age,
      visitorData.date,
      visitorData.time,
      visitorData.comments,
      visitorData.assistant,
      visitorData.id
    );
  } else {
    throw new Error(`No visitor found with ID ${id}. Cannot update.`);
  }
}

function generateId() { //  generates a unique ID for a visitor
  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder);
  }
  const files = fs.readdirSync(dataFolder);
  const visitorFiles = files.filter(
    (file) => file.startsWith("visitor_") && file.endsWith(".json")
  );
  const ids = visitorFiles.map((file) =>
    parseInt(file.split("_")[1].split(".")[0], 10)
  );
  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  return maxId + 1;
}

function validateInputs(inputs) { // validates the input data for a visitor
  const isValidFullName = (value) =>
    typeof value === "string" && value.split(" ").length === 2;

  const validators = { //  validation functions for each input field
    name: isValidFullName,
    age: (value) => typeof value === "number" && value >= 0,
    date: (value) =>
      typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value),
    time: (value) => typeof value === "string" && /^\d{2}:\d{2}$/.test(value),
    comments: (value) => typeof value === "string",
    assistant: isValidFullName,
  };

  for (const key in validators) { // validates each input field using the corresponding validation function
    if (!validators[key](inputs[key])) {
      throw new Error(errorMessages[`invalid${capitalizeFirstLetter(key)}`]);
    }
  }
}

function capitalizeFirstLetter(key) { //  capitalizes the first letter of a string
  return key[0].toUpperCase() + key.slice(1);
}

const errorMessages = { // contains error messages for invalid input data
  invalidName: "Name should be a string with both a first and last name.",
  invalidAge: "Age should be a non-negative number.",
  invalidDate: "Date should be a string in the format YYYY-MM-DD.",
  invalidTime: "Time should be a string in the format HH:MM.",
  invalidComments: "Comments should be a string.",
  invalidAssistant:
    "Assistant should be a string with both a first and last name.",
  invalidId: "ID should be a number.",
};

module.exports = { Visitor, load, generateId, errorMessages };