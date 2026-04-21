import request from "supertest";
import app from "../../src/app";

describe("Auth API", () => {
  it("should register user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: "test@gmail.com",
        district: "Kochi",
        password: "123456",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("data.token");
  });

  it("should login user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@gmail.com",
        password: "123456",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("data.token");
  });
});