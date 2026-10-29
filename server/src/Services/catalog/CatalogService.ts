import { CatalogRepository } from "../../Database/repositories/catalog/CatalogRepository";
export class CatalogService {
  private catalogRepository = new CatalogRepository();

  getHiveTypes() {
    return this.catalogRepository.getHiveTypes();
  }

  getQueenBreeds() {
    return this.catalogRepository.getQueenBreeds();
  }
}