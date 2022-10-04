import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { CreateCarUseCase } from "./createCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create car", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });
  it("should be able to create a new car", async () => {
    await createCarUseCase.execute({
      name: "Cincueccento",
      description: "2 Portas",
      daily_rate: 100,
      license_plate: "ABC-1212",
      fine_amount: 60,
      brand: "Fiat",
      category_id: "category",
    });
  });
});
