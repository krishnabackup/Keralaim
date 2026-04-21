import request from "supertest";
import app from "../../src/app";

describe("Complaint API", () => {
  let token: string;

  beforeAll(async () => {
    // login user
    const res = await request(app).post("/api/auth/login").send({
      email: "test@gmail.com",
      password: "123456",
    });

    token = res.body.data.token;
  });

  it("should create a complaint", async () => {
    const res = await request(app)
      .post("/api/complaints")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Road issue",
        description: "Bad road",
        location: "Kerala",
      });

    expect(res.statusCode).toBe(201);
  });

  it("should fetch complaints", async () => {
    const res = await request(app)
      .get("/api/complaints/user")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});