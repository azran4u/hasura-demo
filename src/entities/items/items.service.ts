import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Knex } from "knex";
import { DalService } from "../../dal/dal.service";
import {
  OfficeEquipmentItemDto,
  OfficeFornitureItemDto,
  SoftwareItemDto,
} from "../../dal/dal.types";
import { Item, ItemTypes } from "../../generated/graphql";
import {
  softwareItemDtoToSoftwareItemConverter,
  officeFornitureItemDtoToOfficeFornitureConverter,
  officeEquipmentItemDtoToOfficeEquipmentItemConverter,
} from "./items.dto.converter";

@Injectable()
export class ItemsService {
  private knex: Knex;
  constructor(private dalService: DalService) {
    this.knex = this.dalService.knex;
  }

  async findAll(filterByEntityType?: ItemTypes[]): Promise<Item[]> {
    const queries: Promise<Item[]>[] = [];

    if (
      !filterByEntityType ||
      filterByEntityType?.includes(ItemTypes.Software)
    ) {
      queries.push(this.getAllSoftware());
    }

    if (
      !filterByEntityType ||
      filterByEntityType?.includes(ItemTypes.OfficeFurniture)
    ) {
      queries.push(this.getAllOfficeForniture());
    }

    if (
      !filterByEntityType ||
      filterByEntityType?.includes(ItemTypes.OfficeEquipment)
    ) {
      queries.push(this.getAllOfficeEquipment());
    }

    try {
      const res = await Promise.all(queries);
      return res.reduce((acc, curr) => {
        acc.push(...curr);
        return acc;
      }, []);
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        `error in ItemsService -> findAll ${error?.message}`
      );
    }
  }

  private async getAllSoftware() {
    const softwareItemsDtos: SoftwareItemDto[] = await this.knex
      .from("software")
      .innerJoin("items", "software.item_id", "items.id");

    const softwareItems = softwareItemsDtos.map((dto) =>
      softwareItemDtoToSoftwareItemConverter(dto)
    );
    return softwareItems?.length > 0 ? softwareItems : [];
  }

  private async getAllOfficeForniture() {
    const officeFornitureItemDtos: OfficeFornitureItemDto[] = await this.knex
      .from("office_forniture")
      .innerJoin("items", "office_forniture.item_id", "items.id");

    const officeFornitureItems = officeFornitureItemDtos.map((dto) =>
      officeFornitureItemDtoToOfficeFornitureConverter(dto)
    );
    return officeFornitureItems?.length > 0 ? officeFornitureItems : [];
  }

  private async getAllOfficeEquipment() {
    const officeEquipmentItemDtos: OfficeEquipmentItemDto[] = await this.knex
      .from("office_equipment")
      .innerJoin("items", "office_equipment.item_id", "items.id");

    const officeEquipmentItems = officeEquipmentItemDtos.map((dto) =>
      officeEquipmentItemDtoToOfficeEquipmentItemConverter(dto)
    );

    return officeEquipmentItems?.length > 0 ? officeEquipmentItems : [];
  }
}