import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Minio from "minio";

@Injectable()
export class MinioService {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get("MINIO_ENDPOINT"),
      port: Number(this.configService.get("MINIO_PORT")),
      useSSL: this.configService.get("MINIO_USE_SSL") === "true",
      accessKey: this.configService.get("MINIO_ROOT_USER"),
      secretKey: this.configService.get("MINIO_ROOT_PASSWORD"),
    });
    this.bucketName = this.configService.get("MINIO_BUCKET_NAME");
  }

  async createBucketIfNotExists(bucketName?: string) {
    const bucketExists = await this.minioClient.bucketExists(
      bucketName ? bucketName : this.bucketName,
    );
    if (!bucketExists) {
      await this.minioClient.makeBucket(
        bucketName ? bucketName : this.bucketName,
        "eu-west-1",
      );
      const policy = {
        Version: "2012-10-17",
        Id: `policy-${bucketName ? bucketName : this.bucketName}`,
        Statement: [
          {
            Action: ["s3:GetObject"],
            Effect: "Allow",
            Principal: {
              AWS: ["*"],
            },
            Resource: [
              `arn:aws:s3:::${bucketName ? bucketName : this.bucketName}/*`,
            ],
          },
        ],
      };
      await this.minioClient.setBucketPolicy(
        bucketName ? bucketName : this.bucketName,
        JSON.stringify(policy),
      );
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    opts?: { filename?: string; bucketName?: string },
  ) {
    const fileName = opts.filename
      ? opts.filename
      : `${Date.now()}-${file.originalname}`;
    await this.minioClient.putObject(
      opts.bucketName ? opts.bucketName : this.bucketName,
      fileName,
      file.buffer,
      file.size,
      { "Content-Type": file.mimetype },
    );
    return fileName;
  }

  async getFileUrl(fileName: string, bucketName?: string) {
    return await this.minioClient.presignedUrl(
      "GET",
      bucketName ? bucketName : this.bucketName,
      fileName,
    );
  }

  async deleteFile(fileName: string, bucketName?: string) {
    await this.minioClient.removeObject(
      bucketName ? bucketName : this.bucketName,
      fileName,
    );
  }
}
