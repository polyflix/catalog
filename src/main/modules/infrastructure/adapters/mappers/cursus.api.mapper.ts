import { Injectable } from "@nestjs/common";
import { AbstractMapper } from "../../../../core/helpers/abstract.mapper";
import {
  CreateCursusDto,
  CursusResponse
} from "../../../application/dto/cursus.dto";
import { Cursus, CursusProps } from "../../../domain/models/cursus.model";

@Injectable()
export class CursusApiMapper {
  apiToEntity(apiModel: CreateCursusDto): Cursus {
    return Cursus.create(Object.assign(new CursusProps(), apiModel));
  }

  entityToApi(entity: Cursus): CursusResponse {
    const cursus = new CursusResponse();
    Object.assign(cursus, entity);
    return cursus;
  }
}
