import DataLoader from "dataloader";
import { Container } from "../../generated/graphql";
import { mapFromArray } from "../../utils/mapFromArray";
import { ContainerService } from "./containers.service";

export function createContainersLoader(containerService: ContainerService) {
  return new DataLoader<string, Container>(async (ids) => {
    const containers = await containerService.findByItemsIds(ids);
    const containersMap = mapFromArray(containers, (container) => container.id);
    return ids.map((id) => containersMap[id]);
  });
}
