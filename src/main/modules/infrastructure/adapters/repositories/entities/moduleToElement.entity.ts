import { Column, Entity, ManyToOne, PrimaryColumn, Unique } from "typeorm";
import { ElementEntity } from "./element.entity";
import { ModuleEntity } from "./module.entity";

@Entity("module_elements_element")
@Unique(["moduleId", "order", "elementId"])
export class ModuleToElementEntity {
  @PrimaryColumn()
  moduleId: string;

  @PrimaryColumn()
  elementId: string;

  @Column()
  order: number;

  @ManyToOne(() => ModuleEntity, (module) => module.elements, {
    primary: true,
    persistence: false,
    onDelete: "CASCADE",
    orphanedRowAction: "delete"
  })
  module!: ModuleEntity;

  @ManyToOne(() => ElementEntity, (element) => element.modules, {
    primary: true,
    persistence: false,
    onDelete: "CASCADE",
    orphanedRowAction: "delete"
  })
  element!: ElementEntity;
}
