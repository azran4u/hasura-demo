import { Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { DalService } from "../../dal/dal.service";
import {
  OfficeEquipmentItemDto,
  OfficeFornitureItemDto,
  SoftwareItemDto,
} from "../../dal/dal.types";
import { Item } from "../../generated/graphql";
import { officeEquipmentItemDtoToOfficeEquipmentItemConverter } from "./office.equipment.item.dto.converter";
import { officeFornitureItemDtoToOfficeFornitureConverter } from "./office.forniture.item.dto.converter";
import { softwareItemDtoToSoftwareItemConverter } from "./software.item.dto.converter";

@Injectable()
export class ItemsService {
  private knex: Knex;
  constructor(private dalService: DalService) {
    this.knex = this.dalService.knex;
  }

  async findAll(): Promise<Item[]> {
    const res: Item[] = [];

    const softwareItemsDtos: SoftwareItemDto[] = await this.knex
      .from("software")
      .innerJoin("items", "software.item_id", "items.id");

    const officeFornitureItemDtos: OfficeFornitureItemDto[] = await this.knex
      .from("office_forniture")
      .innerJoin("items", "office_forniture.item_id", "items.id");

    const officeEquipmentItemDtos: OfficeEquipmentItemDto[] = await this.knex
      .from("office_equipment")
      .innerJoin("items", "office_equipment.item_id", "items.id");

    const softwareItems = softwareItemsDtos.map((dto) =>
      softwareItemDtoToSoftwareItemConverter(dto)
    );

    const officeFornitureItems = officeFornitureItemDtos.map((dto) =>
      officeFornitureItemDtoToOfficeFornitureConverter(dto)
    );
    const officeEquipmentItems = officeEquipmentItemDtos.map((dto) =>
      officeEquipmentItemDtoToOfficeEquipmentItemConverter(dto)
    );

    if (softwareItems.length > 0) res.push(...softwareItems);
    if (officeFornitureItems.length > 0) res.push(...officeFornitureItems);
    if (officeEquipmentItems.length > 0) res.push(...officeEquipmentItems);

    return res;
  }
}
