import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create user test", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });
  it("Should be able to create a new user", async () => {
    const user = {
      email: "email@test.com",
      name: " test",
      password: "1234",
    };
    const userCreated = await createUserUseCase.execute({
      email: user.email,
      name: user.name,
      password: user.password,
    });
    expect(userCreated).toHaveProperty("id");
  });

  it("Should not be able to create a new user with same email", async () => {
    await expect(async () => {
      const user = {
        email: "email@test.com",
        name: " test",
        password: "1234",
      };
      await createUserUseCase.execute({
        email: user.email,
        name: user.name,
        password: user.password,
      });
      await createUserUseCase.execute({
        email: user.email,
        name: user.name,
        password: user.password,
      });
    }).rejects.toBeInstanceOf(AppError);

  });
});
