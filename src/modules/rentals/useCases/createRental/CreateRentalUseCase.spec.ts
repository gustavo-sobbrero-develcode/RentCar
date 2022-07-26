import dayjs from "dayjs";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { CreateRentalUseCase } from "./CreateRentalUseCase";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();
  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory
    );
  });

  it("should be able to create a new rental", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Test",
      description: "test",
      daily_rate: 100,
      license_plate: "ab-112",
      fine_amount: 40,
      category_id: "12",
      brand: "volkswagen",
    });
    const rental = await createRentalUseCase.execute({
      user_id: "123123",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental if there is another open to the same user", async () => {
    await rentalsRepositoryInMemory.create({
      car_id: "121221",
      expected_return_date: dayAdd24Hours,
      user_id: "123123",
    });

    await expect(
      createRentalUseCase.execute({
        user_id: "123123",
        car_id: "12122321",
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(
      new AppError("There is a rental in progress for that user!")
    );
  });

  it("should not be able to create a new rental if there is another open to the same car", async () => {
    await rentalsRepositoryInMemory.create({
      car_id: "1212",
      expected_return_date: dayAdd24Hours,
      user_id: "123123",
    });

    await expect(
      createRentalUseCase.execute({
        user_id: "321",
        car_id: "1212",
        expected_return_date: new Date(),
      })
    ).rejects.toEqual(new AppError("Car is unavailable!"));
  });

  it("should not be able to create a new rental in less than 24 hours ", async () => {
    await expect(
      createRentalUseCase.execute({
        user_id: "123",
        car_id: "12",
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toEqual(new AppError("Invalid return time!"));
  });
});
