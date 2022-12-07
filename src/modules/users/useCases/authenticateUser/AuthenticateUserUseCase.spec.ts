import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
describe("Authenticate user test", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });
  it("should be able to authenticate a new session", async () => {

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

    const authenticatedUser = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });
    expect(authenticatedUser).toHaveProperty("token");
  });
  it("Should not be able to authenticate an non existent user", async () => {
    await expect(async () => {
      const user = {
        email: "email@test.com",
        name: " test",
        password: "1234",
      };
      await authenticateUserUseCase.execute({
        email: user.email,
        password: user.password,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
  it("Should not be able to authenticate an user with incorrect password", async () => {
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

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrectPassword",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
