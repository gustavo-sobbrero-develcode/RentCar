import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create car", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });
  it("should be able to create a new car", async () => {
    const car = await createCarUseCase.execute({
      name: "Cincueccento",
      description: "2 Portas",
      daily_rate: 100,
      license_plate: "ABC-1212",
      fine_amount: 60,
      brand: "Fiat",
      category_id: "category",
    });
    expect(car).toHaveProperty("id");
  });

  it("should not be able to create a car with an existing license plate", async () => {
    await createCarUseCase.execute({
      name: "Uno",
      description: "4 Portas",
      daily_rate: 120,
      license_plate: "CABJ-1212",
      fine_amount: 90,
      brand: "Fiat",
      category_id: "category",
    });

    await expect(
      createCarUseCase.execute({
        name: "Palio",
        description: "2 Portas",
        daily_rate: 100,
        license_plate: "CABJ-1212",
        fine_amount: 60,
        brand: "Fiat",
        category_id: "category",
      })
    ).rejects.toEqual(new AppError("Car already exists!"));
  });

  it("should be able to create a car with available true by default", async () => {
    const car = await createCarUseCase.execute({
      name: "Car available",
      description: "2 Portas",
      daily_rate: 100,
      license_plate: "DBAD-1212",
      fine_amount: 60,
      brand: "Fiat",
      category_id: "category",
    });
    expect(car.available).toBe(true);
  });
});
