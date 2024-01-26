const request = require("supertest"); // request is a function
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Genre.collection.deleteMany({});
    await server.close();
  });

  describe("GET/", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "action" },
        { name: "comedy" },
      ]);

      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe("GET /:id", () => {
    it("should return a genre if valid id is passed", async () => {
      // populate with a genre for testing
      const genre = new Genre({ name: "Drama" });
      await genre.save();
      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });
    it("should return 404 if genre id is invalid", async () => {
      const res = await request(server).get("/api/genres/1");
      expect(res.status).toBe(404);
    });
  });

  // User must be authorized inorder to POST
  describe("POST /", () => {
    let token;

    const generateRequest = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "ge" });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await request(server)
        .post("/api/genres")
        .send({ name: "Sci-fi" });

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      const res = await generateRequest();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      const name = new Array(52).join("s");

      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: name });

      expect(res.status).toBe(400);
    });

    it("It should save the genre if it is valid", async () => {

      await generateRequest();

      const genre = await Genre.find({ name: "genre" });
      expect(genre).not.toBeNull();
    });
  });
});
