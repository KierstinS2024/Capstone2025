// path: tests/api/auth/me.test.ts
import request from "supertest";
import mongoose from "mongoose";
import { createServer } from "http";
import loginHandler from "@/app/api/auth/login/route";
import meHandler from "@/app/api/auth/me/route";
import registerHandler from "@/app/api/auth/register/route";

let registerServer: any;
let loginServer: any;
let meServer: any;
let token: string;

beforeAll(async () => {
  registerServer = createServer((req, res) => registerHandler(req as any, res as any));
  loginServer = createServer((req, res) => loginHandler(req as any, res as any));
  meServer = createServer((req, res) => meHandler(req as any, res as any));

  // Register + login to get token
  await request(registerServer).post("/api/auth/register").send({
    email: "me@example.com",
    password: "Password123!",
  });

  const loginRes = await request(loginServer).post("/api/auth/login").send({
    email: "me@example.com",
    password: "Password123!",
  });

  token = loginRes.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
  registerServer.close();
  loginServer.close();
  meServer.close();
});

describe("GET /api/auth/me", () => {
  it("should return the current user if authenticated", async () => {
    const res = await request(meServer)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("email", "me@example.com");
  });

  it("should return 401 if not authenticated", async () => {
    const res = await request(meServer).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});
