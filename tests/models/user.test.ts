// path: tests/models/user.test.ts
import mongoose from "mongoose";
import User from "@/models/User";

describe("User Model", () => {
  it("should hash password before save", async () => {
    const user = new User({ email: "hash@example.com", password: "PlainPass123!" });
    await user.save();

    expect(user.password).not.toBe("PlainPass123!");
    expect(user.password).toMatch(/^\$2[aby]\$.{56}$/); // bcrypt hash pattern
  });

  it("should enforce unique email", async () => {
    const user1 = new User({ email: "unique@example.com", password: "TestPass123!" });
    await user1.save();

    const user2 = new User({ email: "unique@example.com", password: "TestPass123!" });

    await expect(user2.save()).rejects.toThrow();
  });
});
