import { Injectable } from "@nestjs/common";
import { MinioService } from "../shared/minio/minio.service";

@Injectable()
export class CoverService {
  public constructor(private readonly minioService: MinioService) {}

  public async uploadCover(
    radioId: string,
    id: string,
    file: Express.Multer.File,
  ) {
    const bucketName = `radio-${radioId}`;
    await this.minioService.createBucketIfNotExists(bucketName);
    const fileName = await this.minioService.uploadFile(file, {
      bucketName,
      filename: id,
    });
    return { fileName };
  }

  public async getCoverUrl(radioId: string, fileName: string) {
    const bucketName = `radio-${radioId}`;
    return await this.minioService.getFileUrl(fileName, bucketName);
  }
}
