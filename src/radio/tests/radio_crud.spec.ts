import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { Connection, connect, Mongoose, model } from "mongoose";
import { RedisMemoryServer } from "redis-memory-server";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongooseModule, getConnectionToken } from "@nestjs/mongoose";
import { RedisModule } from "@songkeys/nestjs-redis";
import { RadioModule } from "@/src/radio/radio.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as supertest from "supertest";
import { ValidationPipe } from "@nestjs/common";
import { AuthModule } from "@/src/auth/auth.module";
import { UserSchema } from "@/schemas/user.schema";
import { Role } from "@/enums/Role.enum";

describe("RadioController - radio_crud", () => {
  let redisd: RedisMemoryServer;
  let mongod: MongoMemoryServer;
  let module: TestingModule;
  let app: NestExpressApplication;
  let mongoConection: Mongoose;

  const apiClient = () => {
    return supertest(app.getHttpServer());
  };

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mogiuri = mongod.getUri();
    mongoConection = await connect(mogiuri);
    redisd = await RedisMemoryServer.create();
    const redisHost = await redisd.getHost();
    const redisPort = await redisd.getPort();
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mogiuri),
        RedisModule.forRoot({
          closeClient: true,
          config: {
            host: redisHost,
            port: redisPort,
          },
        }),
        AuthModule,
        RadioModule,
      ],
    }).compile();

    app = module.createNestApplication<NestExpressApplication>();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await (app.get(getConnectionToken()) as Connection).db.dropDatabase();
    await app.close();
    await mongoConection.disconnect();
    await mongod.stop();
    await redisd.stop();
  });

  afterEach(async () => {
    const collections = await (
      app.get(getConnectionToken()) as Connection
    ).db.collections();
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  const userModel = model("User", UserSchema);

  // Your Tests HERE

  it("should create a new radio", async () => {
    const user = {
      nickname: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      roles: [Role.Administrator],
    };

    await userModel.create({
      ...user,
    });

    const token = (
      await apiClient()
        .post("/auth/login")
        .send({
          nickname: user.nickname,
          password: user.password,
        })
        .expect(200)
    ).body.token;

    const response = await apiClient()
      .post("/radio")
      .send({
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3000",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    expect(response.body).toMatchObject({
      name: expect.any(String),
      id: expect.any(String),
    });
  });

  it("should create some radios and get all of them", async () => {
    const user = {
      nickname: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      roles: [Role.Administrator],
    };

    await userModel.create({
      ...user,
    });

    const token = (
      await apiClient()
        .post("/auth/login")
        .send({
          nickname: user.nickname,
          password: user.password,
        })
        .expect(200)
    ).body.token;

    const radios = [
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3000",
      },
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3001",
      },
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3002",
      },
    ];

    for (const radio of radios) {
      await apiClient()
        .post("/radio")
        .send(radio)
        .set("Authorization", `Bearer ${token}`)
        .expect(201);
    }

    const response = await apiClient().get("/radio").expect(200);

    expect(response.body).toHaveLength(3);
  });

  it("should create some radios and get one of them", async () => {
    const user = {
      nickname: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      roles: [Role.Administrator],
    };

    await userModel.create({
      ...user,
    });

    const token = (
      await apiClient()
        .post("/auth/login")
        .send({
          nickname: user.nickname,
          password: user.password,
        })
        .expect(200)
    ).body.token;

    const radios = [
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3000",
      },
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3001",
      },
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3002",
      },
    ];

    for (const radio of radios) {
      await apiClient()
        .post("/radio")
        .send(radio)
        .set("Authorization", `Bearer ${token}`)
        .expect(201);
    }

    const response = await apiClient().get("/radio").expect(200);

    await apiClient()
      .get("/radio")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const radio = response.body[0];

    const response2 = await apiClient().get(`/radio/${radio.id}`).expect(200);

    expect(response2.body).toMatchObject({
      name: expect.any(String),
      id: expect.any(String),
    });
  });

  it("should create some radios and update one of them", async () => {
    const user = {
      nickname: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      roles: [Role.Administrator],
    };

    await userModel.create({
      ...user,
    });

    const token = (
      await apiClient()
        .post("/auth/login")
        .send({
          nickname: user.nickname,
          password: user.password,
        })
        .expect(200)
    ).body.token;

    const radios = [
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3000",
      },
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3001",
      },
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3002",
      },
    ];

    for (const radio of radios) {
      await apiClient()
        .post("/radio")
        .send(radio)
        .set("Authorization", `Bearer ${token}`)
        .expect(201);
    }

    const response = await apiClient().get("/radio").expect(200);

    const radio = response.body[0];

    const newRadio = {
      name: faker.person.firstName(),
    };

    const response2 = await apiClient()
      .put(`/radio/${radio.id}`)
      .send(newRadio)
      .set("Authorization", `Bearer ${token}`)
      .expect(202);

    expect(response2.body).toMatchObject({
      name: newRadio.name,
      id: expect.any(String),
    });

    const response3 = await apiClient().get(`/radio/${radio.id}`).expect(200);

    expect(response3.body).toMatchObject({
      name: newRadio.name,
      id: expect.any(String),
    });
  });

  it("should create some radios and delete one of them", async () => {
    const user = {
      nickname: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      roles: [Role.Administrator],
    };

    await userModel.create({
      ...user,
    });

    const token = (
      await apiClient()
        .post("/auth/login")
        .send({
          nickname: user.nickname,
          password: user.password,
        })
        .expect(200)
    ).body.token;

    const radios = [
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3000",
      },
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3001",
      },
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3002",
      },
    ];

    for (const radio of radios) {
      await apiClient()
        .post("/radio")
        .send(radio)
        .set("Authorization", `Bearer ${token}`)
        .expect(201);
    }

    const response = await apiClient().get("/radio").expect(200);

    const radio = response.body[0];

    const response2 = await apiClient()
      .delete(`/radio/${radio.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(202);

    expect(response2.body).toMatchObject({
      name: radio.name,
      id: radio.id,
    });

    await apiClient().get(`/radio/${radio.id}`).expect(404);

    const response4 = await apiClient().get("/radio").expect(200);

    expect(response4.body).toHaveLength(2);
  });

  it("should create some radios and get one of them with a wrong id", async () => {
    const user = {
      nickname: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      roles: [Role.Administrator],
    };

    await userModel.create({
      ...user,
    });

    const token = (
      await apiClient()
        .post("/auth/login")
        .send({
          nickname: user.nickname,
          password: user.password,
        })
        .expect(200)
    ).body.token;

    const radios = [
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3000",
      },
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3001",
      },
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3002",
      },
    ];

    for (const radio of radios) {
      await apiClient()
        .post("/radio")
        .send(radio)
        .set("Authorization", `Bearer ${token}`)
        .expect(201);
    }

    const response = await apiClient().get("/radio").expect(200);

    const radio = response.body[0];

    await apiClient().get(`/radio/${radio.id}1`).expect(404);
  });

  it("should create some radios and update one of them with a wrong id", async () => {
    const user = {
      nickname: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      roles: [Role.Administrator],
    };

    await userModel.create({
      ...user,
    });

    const token = (
      await apiClient()
        .post("/auth/login")
        .send({
          nickname: user.nickname,
          password: user.password,
        })
        .expect(200)
    ).body.token;

    const radios = [
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3000",
      },
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3001",
      },
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3002",
      },
    ];

    for (const radio of radios) {
      await apiClient()
        .post("/radio")
        .send(radio)
        .set("Authorization", `Bearer ${token}`)
        .expect(201);
    }

    const response = await apiClient().get("/radio").expect(200);

    const radio = response.body[0];

    const newRadio = {
      name: faker.person.firstName(),
    };

    await apiClient()
      .put(`/radio/${radio.id}1`)
      .send(newRadio)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
  });

  it("should create some radios and delete one of them with a wrong id", async () => {
    const user = {
      nickname: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      roles: [Role.Administrator],
    };

    await userModel.create({
      ...user,
    });

    const token = (
      await apiClient()
        .post("/auth/login")
        .send({
          nickname: user.nickname,
          password: user.password,
        })
        .expect(200)
    ).body.token;

    const radios = [
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3000",
      },
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3001",
      },
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3002",
      },
    ];

    for (const radio of radios) {
      await apiClient()
        .post("/radio")
        .send(radio)
        .set("Authorization", `Bearer ${token}`)
        .expect(201);
    }

    const response = await apiClient().get("/radio").expect(200);

    const radio = response.body[0];

    await apiClient()
      .delete(`/radio/${radio.id}1`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
  });

  it("should not accept some operations without a token", async () => {
    const user = {
      nickname: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      roles: [Role.Administrator],
    };

    await userModel.create({
      ...user,
    });

    const token = (
      await apiClient()
        .post("/auth/login")
        .send({
          nickname: user.nickname,
          password: user.password,
        })
        .expect(200)
    ).body.token;

    const radios = [
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3000",
      },
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3001",
      },
      {
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3002",
      },
    ];

    for (const radio of radios) {
      await apiClient()
        .post("/radio")
        .send(radio)
        .set("Authorization", `Bearer ${token}`)
        .expect(201);
    }

    await apiClient()
      .post("/radio")
      .send({
        name: faker.person.firstName(),

        websiteUrl: "https://localhost:3000",
      })
      .expect(401);

    const response2 = await apiClient().get("/radio").expect(200);

    const radio1 = response2.body[0];

    await apiClient().get(`/radio/${radio1.id}`).expect(200);

    await apiClient()
      .put(`/radio/${radio1.id}`)
      .send({
        name: faker.person.firstName(),

        websiteUrl: "https://localhost:3000",
      })
      .expect(401);

    await apiClient()
      .delete(`/radio/${radio1.id}`)
      .expect(401);
  });

  it("should not accept some operations without Role.Administrator role", async () => {
    const user = {
      nickname: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      roles: [],
    };

    await userModel.create({
      ...user,
    });

    const token = (
      await apiClient()
        .post("/auth/login")
        .send({
          nickname: user.nickname,
          password: user.password,
        })
        .expect(200)
    ).body.token;

    await apiClient()
      .post("/radio")
      .send({
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3000",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(403);

    await apiClient().get("/radio").expect(200);

    await apiClient()
      .put(`/radio/null`)
      .send({
        name: faker.person.firstName(),
        websiteUrl: "https://localhost:3000",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(403);

    await apiClient()
      .delete(`/radio/null`)
      .set("Authorization", `Bearer ${token}`)
      .expect(403);
  });

  it("should not create radio with a name that already exists", async () => {
    const user = {
      nickname: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      roles: [Role.Administrator],
    };

    await userModel.create({
      ...user,
    });

    const token = (
      await apiClient()
        .post("/auth/login")
        .send({
          nickname: user.nickname,
          password: user.password,
        })
        .expect(200)
    ).body.token;

    const name = faker.person.firstName();

    await apiClient()
      .post("/radio")
      .send({
        name,
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(201);

    await apiClient()
      .post("/radio")
      .send({
        name,
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
  });
});
