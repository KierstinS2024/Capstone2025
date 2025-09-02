// path: tests/api/auth/login.test.ts
import request from "supertest";
import mongoose from "mongoose";
import { createServer } from "http";
import handler from "@/app/api/auth/login/route";

let server: any;

beforeAll(async () => {
  server = createServer((req, res) => handler(req as any, res as any));
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

describe("POST /api/auth/login", () => {
  it("should log in with valid credentials", async () => {
    // First register
    await request(server).post("/api/auth/register").send({
      email: "login@example.com",
      password: "Password123!",
    });

    // Then login
    const res = await request(server).post("/api/auth/login").send({
      email: "login@example.com",
      password: "Password123!",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should reject invalid credentials", async () => {
    const res = await request(server).post("/api/auth/login").send({
      email: "fake@example.com",
      password: "wrong",
    });

    expect(res.status).toBe(401);
  });
});
