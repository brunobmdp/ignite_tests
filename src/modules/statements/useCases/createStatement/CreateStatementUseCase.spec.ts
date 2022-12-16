import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;


describe("Create Statement test", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  })
  it("Should be able to create a new statement", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User test",
      email: "email@test.com",
      password: "1234",
    });

    const statement = await createStatementUseCase.execute({
      amount: 3000,
      description: "deposit test",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });
    expect(statement).toHaveProperty("id");
  });
  it("Should not be able to create a new statement for a non existent user", async () => {
    await expect(async () => {

      await createStatementUseCase.execute({
        amount: 3000,
        description: "deposit test",
        type: OperationType.DEPOSIT,
        user_id: "123456789 non existent id",

      });
    }).rejects.toBeInstanceOf(AppError);

  });
  it("Should not be able to create a new statement with negative balance", async () => {
    await expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "User test",
        email: "email@test.com",
        password: "1234",
      });

      await createStatementUseCase.execute({
        amount: 3000,
        description: "deposit test",
        type: OperationType.DEPOSIT,
        user_id: user.id as string,
      });
      await createStatementUseCase.execute({
        amount: 3001,
        description: "withdraw test",
        type: OperationType.WITHDRAW,
        user_id: user.id as string,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
