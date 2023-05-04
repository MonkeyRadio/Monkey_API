import { app } from "../app.js";
import dotenv from "dotenv";

dotenv.config();

type fetR = {
    ret : any;
    code: number;
}

async function fet(input: RequestInfo | URL, init?: RequestInit | undefined): Promise<fetR> {
    let r: fetR = {
        ret: null,
        code: 0
    }
    let res = await fetch(input, init);
    r.ret = await res.json();
    r.code = res.status;
    return r;
}

describe("Get no radio", () => {
  it("No radio", async () => {
    const result = await fet(`http://localhost:${process.env.PORT}/radio`);
    expect(result.ret).toEqual({
      request: "radio.get",
      data: {
        radios: []
      },
      status: 200
  });
    expect(result.code).toEqual(200);
  });
});