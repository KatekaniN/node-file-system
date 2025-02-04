const fs = require("fs");
const path = require("path");
const {
  Visitor,
  load,
  generateId,
  errorMessages,
} = require("../src/visitor.js");
const dataFolder = "./dataFolder";

describe("Visitor", () => {
  let visitorInstance;

  beforeEach(() => {
    visitorInstance = new Visitor(
      "Jane Doe",
      25,
      "2023-10-27",
      "11:00",
      "Comment",
      "Bob Smith"
    );
    if (!fs.existsSync(dataFolder)) {
      fs.mkdirSync(dataFolder);
    }
  });

  afterEach(() => {
    const files = fs.readdirSync(dataFolder);
    files
      .filter((file) => file.startsWith("visitor_") && file.endsWith(".json"))
      .forEach((file) => {
        if (fs.existsSync(path.join(dataFolder, file))) {
          fs.unlinkSync(path.join(dataFolder, file));
        }
      });
  });

  describe("constructor", () => {
    it("should throw an error if name is invalid", () => {
      expect(
        () =>
          new Visitor("John", 25, "2023-10-27", "11:00", "Comment", "Bob Smith")
      ).toThrow(new Error(errorMessages.invalidName));
    });

    it("should throw an error if age is invalid", () => {
      expect(
        () =>
          new Visitor(
            "John Doe",
            -5,
            "2023-10-27",
            "11:00",
            "Comment",
            "Bob Smith"
          )
      ).toThrow(new Error(errorMessages.invalidAge));
    });

    it("should throw an error if date is invalid", () => {
      expect(
        () =>
          new Visitor(
            "John Doe",
            25,
            "202-13-27",
            "11:00",
            "Comment",
            "Bob Smith"
          )
      ).toThrow(new Error(errorMessages.invalidDate));
    });

    it("should throw an error if time is invalid", () => {
      expect(
        () =>
          new Visitor(
            "John Doe",
            25,
            "2023-10-27",
            "2:00",
            "Comment",
            "Bob Smith"
          )
      ).toThrow(new Error(errorMessages.invalidTime));
    });

    it("should throw an error if comments are invalid", () => {
      expect(
        () =>
          new Visitor("John Doe", 25, "2023-10-27", "11:00", 123, "Bob Smith")
      ).toThrow(new Error(errorMessages.invalidComments));
    });

    it("should throw an error if assistant is invalid", () => {
      expect(
        () =>
          new Visitor("John Doe", 25, "2023-10-27", "11:00", "Comment", "Bob")
      ).toThrow(new Error(errorMessages.invalidAssistant));
    });
  });

  describe("save", () => {
    it("should save visitor data to a JSON file using fs.writeFileSync()", () => {
      spyOn(fs, "writeFileSync");
      visitorInstance.save();
      const expectedFileName = Visitor.generateFileName(visitorInstance.id);
      const expectedData = JSON.stringify(
        {
          fullName: visitorInstance.name,
          age: visitorInstance.age,
          date: visitorInstance.date,
          time: visitorInstance.time,
          comments: visitorInstance.comments,
          assistant: visitorInstance.assistant,
          id: visitorInstance.id,
        },
        null,
        2
      );
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        path.join(dataFolder, expectedFileName),
        expectedData
      );
    });

    it("should create dataFolder if it does not exist", () => {
      spyOn(fs, "existsSync").and.returnValue(false);
      spyOn(fs, "mkdirSync");
      visitorInstance.save();
      expect(fs.mkdirSync).toHaveBeenCalledWith(dataFolder);
    });

    it("should throw an error if trying to update a non-existent visitor", () => {
      visitorInstance.id = 999;
      expect(() => visitorInstance.save()).toThrow(
        new Error(
          `No visitor found with ID ${visitorInstance.id}. Cannot update.`
        )
      );
    });

    it("should return a correct message when saving a new visitor", () => {
      const result = visitorInstance.save();
      expect(result).toEqual(
        `Visitor data saved to visitor_${visitorInstance.id}.json.`
      );
    });

    it("should return a correct message when updating an existing visitor", () => {
      visitorInstance.save();
      const result = visitorInstance.save();
      expect(result).toEqual(
        `Visitor data for visitor_${visitorInstance.id}.json has been updated.`
      );
    });
  });
  describe("load", () => {
    it("should load visitor data from a JSON file using fs.readFileSync()", () => {
      spyOn(fs, "existsSync").and.returnValue(true);
      spyOn(fs, "readFileSync").and.returnValue(
        JSON.stringify({
          fullName: "Jane Smith",
          age: 25,
          date: "2023-10-27",
          time: "11:00",
          comments: "Follow up",
          assistant: "Bob Smith",
          id: 1,
        })
      );

      const loadedVisitor = load(1);
      expect(loadedVisitor.name).toEqual("Jane Smith");
      expect(loadedVisitor.age).toEqual(25);
      expect(loadedVisitor.date).toEqual("2023-10-27");
      expect(loadedVisitor.time).toEqual("11:00");
      expect(loadedVisitor.comments).toEqual("Follow up");
      expect(loadedVisitor.assistant).toEqual("Bob Smith");
      expect(loadedVisitor.id).toEqual(1);
    });

    it("should throw an error if no data found for the given ID", () => {
      spyOn(fs, "existsSync").and.returnValue(false);
      expect(() => load(999)).toThrow(
        new Error(`No visitor found with ID 999. Cannot update.`)
      );
    });

    it("should throw an error if id is not a number", () => {
      expect(() => load("abc")).toThrow(new Error(errorMessages.invalidId));
    });
  });

  describe("generateId", () => {
    it("should generate a unique ID for a new visitor", () => {
      visitorInstance.save();

      const visitor2 = new Visitor(
        "John Doe",
        30,
        "2023-10-28",
        "12:00",
        "New product launch",
        "Alice Smith"
      );
      visitor2.save();
      expect(visitorInstance.id).not.toEqual(visitor2.id);
    });

    it("should generate a unique ID based on existing files", () => {
      spyOn(fs, "readdirSync").and.returnValue([
        "visitor_1.json",
        "visitor_2.json",
        "visitor_3.json",
      ]);
      const newVisitorId = generateId();
      expect(newVisitorId).toEqual(4);
    });
  });
});
