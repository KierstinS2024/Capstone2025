// path: tests/api/auth/register.test.ts
import request from "supertest";
import mongoose from "mongoose";
import { createServer } from "http";
import handler from "@/app/api/auth/register/route"; // Your Next.js route

let server: any;

beforeAll(async () => {
  // Start Next.js route as an HTTP server for supertest
  server = createServer((req, res) => handler(req as any, res as any));
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

describe("POST /api/auth/register", () => {
  it("should register a new user", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ email: "test@example.com", password: "Password123!" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe("test@example.com");
  });

  it("should not allow duplicate emails", async () => {
    await request(server).post("/api/auth/register").send({
      email: "dupe@example.com",
      password: "Password123!",
    });

    const res = await request(server).post("/api/auth/register").send({
      email: "dupe@example.com",
      password: "Password123!",
    });

    expect(res.status).toBe(400);
  });
});
