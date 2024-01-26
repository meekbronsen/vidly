const { default: mongoose } = require("mongoose");
const { Rental } = require("../../models/rental");
const request = require("supertest");
const { User } = require("../../models/user");
const { Movie } = require("../../models/movie");

describe("/api/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;

  // Happy Path
  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../index");

    customerId = new mongoose.Types.ObjectId();
    movieId = new mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "meek",
        phone: "0746613409",
      },
      movie: {
        _id: movieId,
        title: "Spiderman",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });

  afterEach(async () => {
    await Rental.deleteMany({});
    server.close();
  });

  it("should populate rental and clean up", async () => {
    const result = await Rental.findById(rental._id);
    expect(result).toHaveProperty("_id");
    expect(result).toHaveProperty("customer");
    expect(result).toHaveProperty("movie");
  });
  it("should return 401 if client is not logged in", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });
  it("should return 400 if customerId is not provided", async () => {
    customerId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });
  it("should return 400 if movieId is not provided", async () => {
    movieId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });
  it("should return 404 if no rental with combinations customer/movie is found.", async () => {
    await Rental.deleteMany({});
    const res = await exec();
    expect(res.status).toBe(404);
  });
  it("should return 400 if rental is already processed", async() => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();
    expect(res.status).toBe(400);
  });
  it ("should return 200 if request is successful", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
  it ("should set the return date", async () => {
    await exec();

    const rentalFromDB = await Rental.findById(rental._id)
    const diff = new Date() - rentalFromDB.dateReturned;
    expect(diff).toBeLessThan(10 * 1000);
  })
  it ("should set the rental fee if input is valid", async () => {
    const res = await exec();
    const rentalFromDB = await Rental.findById(rental._id);
    const borrowedTime = rentalFromDB.dateOut.getTime();
    const returnTime = rentalFromDB.dateReturned.getTime();
    const days = Math.round((returnTime - borrowedTime) / (24*60*60*1000));
    const movie = await Movie.findById(movieId);
    const rentalFee = days * movie.dailyRentalRate;
    expect(res).toHaveProperty(rentalFee);
  })  
  
});
