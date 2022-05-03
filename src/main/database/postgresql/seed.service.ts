import { Injectable, Logger } from "@nestjs/common";
import * as fs from "fs";
import { join } from "path";
import { EnvironmentsEnum } from "../../constants/environments-enum";
import { getRepository } from "typeorm";

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  async seed(): Promise<void> {
    await this.wipe();
    this.logger.log("Start seeding");
    const fileNames = this.getFileNames();

    for (const fileName of fileNames) {
      const data = JSON.parse(
        fs.readFileSync(`${this.getSeedPath()}/${fileName}`, "utf8")
      );
      const entityTableName = this.getEntity(fileName);
      const repository = getRepository(entityTableName);
      this.logger.log(`Seed ${entityTableName} table...`);
      try {
        await repository.save(data);
      } catch (error) {
        this.logger.error(
          `Failed to insert data into ${entityTableName}`,
          error
        );
      }
    }
    this.logger.log("Seed applied successfully");
  }

  async wipe(): Promise<void> {
    this.logger.log("Wiping database");
    const fileNames = this.getFileNames().reverse();
    for (const fileName of fileNames) {
      const entityTableName = this.getEntity(fileName);
      const repository = getRepository(entityTableName);
      this.logger.log(`Wipe ${entityTableName} table...`);
      try {
        const data = await repository.find();
        if (data.length) {
          for (const item of data) {
            await repository.remove(item);
          }
        }
      } catch (error) {
        this.logger.error(
          `Failed to remove data from ${entityTableName}`,
          error
        );
      }
    }
    this.logger.log("Database successfully wipe");
  }

  private getFileNames() {
    return fs
      .readdirSync(this.getSeedPath())
      .sort((a, b) => +a.split("-")[0] - +b.split("-")[0])
      .filter((fileName) => fileName.endsWith(".json"));
  }

  private getEntity(fileName) {
    return fileName.split(".")[0].split("-").pop();
  }

  private getSeedPath(): string {
    if (process.env.NODE_ENV === EnvironmentsEnum.PROD) {
      return join(process.cwd(), "dist/database/postgresql/seeds");
    } else {
      return join(process.cwd(), "src/database/postgresql/seeds");
    }
  }
}
