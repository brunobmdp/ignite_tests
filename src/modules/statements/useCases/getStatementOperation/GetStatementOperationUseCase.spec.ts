import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get statement Operation test", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to show the statement operation by id", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "test",
      email: "test@email.com",
      password: "1234",
    });

    const operation = await inMemoryStatementsRepository.create({
      amount: 3000,
      description: "deposit test",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    const statement = await getStatementOperationUseCase.execute({
      statement_id: operation.id as string,
      user_id: user.id as string,
    });

    expect(statement).toBe(operation);
  });

  it("Should not be able to show an non existent statement", async () => {
    await expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "test",
        email: "test@email.com",
        password: "1234",
      });

      await inMemoryStatementsRepository.create({
        amount: 3000,
        description: "deposit test",
        type: OperationType.DEPOSIT,
        user_id: user.id as string,
      });

      await getStatementOperationUseCase.execute({
        statement_id: "wrong id",
        user_id: user.id as string,
      });

    }).rejects.toBeInstanceOf(AppError);
  });
  it("Should not be able to show a statement of an non existent user", async () => {
    await expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "test",
        email: "test@email.com",
        password: "1234",
      });

      const operation = await inMemoryStatementsRepository.create({
        amount: 3000,
        description: "deposit test",
        type: OperationType.DEPOSIT,
        user_id: user.id as string,
      });

      const statement = await getStatementOperationUseCase.execute({
        statement_id: operation.id as string,
        user_id: "wrong id",
      });
      console.log(statement);

    }).rejects.toBeInstanceOf(AppError);
  });

});
