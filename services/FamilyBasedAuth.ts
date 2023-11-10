import { UnauthorizedException } from "@nestjs/common";
import { Redis } from "ioredis";
import { SECONDS_IN_DAY, SECONDS_IN_MONTH } from "@/utils/timeConversion";

const nameGen = (userid: string) =>
  userid +
  "@" +
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

export const GenerateNewFamily = async (
  RedisClient: Redis,
  userid: string,
  expirationSeconds?: number,
): Promise<string> => {
  let family = nameGen(userid);

  while ((await RedisClient.get(family)) !== null) family = nameGen(userid);
  await RedisClient.set(
    family,
    0,
    "EX",
    expirationSeconds ||
      Number(process.env.JWT_REFRESHING_EXPIRATION_DAY) * SECONDS_IN_DAY ||
      SECONDS_IN_MONTH,
  );
  return family;
};

export const DestroyFamily = async (
  RedisClient: Redis,
  family: string,
): Promise<boolean> => {
  const oldChildId = await RedisClient.get(family);
  if (oldChildId === null) return false;
  await RedisClient.del(family);
  return true;
};

export const CheckAuthentication = async (
  RedisClient: Redis,
  family: string,
  childId: number,
): Promise<boolean> => {
  const oldChildId = await RedisClient.get(family);
  if (oldChildId === null) return false;
  if (parseInt(oldChildId) !== childId) {
    DestroyFamily(RedisClient, family);
    return false;
  }
  return true;
};

export const IncrementFamily = async (
  RedisClient: Redis,
  family: string,
  childId: number,
  expirationSeconds?: number,
): Promise<number> => {
  const oldChildId = await RedisClient.get(family);
  if (oldChildId === null) throw new UnauthorizedException("Invalid Token");
  if (parseInt(oldChildId) !== childId) {
    DestroyFamily(RedisClient, family);
    throw new UnauthorizedException("Invalid Token");
  }
  await RedisClient.set(
    family,
    childId + 1,
    "EX",
    expirationSeconds ||
      Number(process.env.JWT_REFRESHING_EXPIRATION_DAY) * SECONDS_IN_DAY ||
      SECONDS_IN_MONTH,
  );
  return childId + 1;
};
