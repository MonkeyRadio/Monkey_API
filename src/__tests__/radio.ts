import { app, start } from "../app.js";
import supertest from "supertest";

describe("GET / - a simple api endpoint", () => {
  it("Hello API Request", async () => {
    await start();
    const result = await supertest(app).get("/");
    expect(result.text).toEqual(JSON.stringify({
      request: "Unknown",
      errors: [
          "Route not found, please visit /docs for more information"
      ],
      status: 404
  }));
    expect(result.statusCode).toEqual(404);
  });
});