import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase"

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let getBalanceUseCase: GetBalanceUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("Get balance test", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("Should be able to show the balance of an user by id", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "test",
      email: "email@test.com",
      password: "1234",
    });



    const statement1 = await inMemoryStatementsRepository.create({
      amount: 3000,
      description: "deposit test",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    const statement2 = await inMemoryStatementsRepository.create({
      amount: 2500,
      description: "withdraw test",
      type: OperationType.WITHDRAW,
      user_id: user.id as string,
    });

    const balance = statement1.amount - statement2.amount;

    const balanceResult = await getBalanceUseCase.execute({ user_id: user.id as string });

    expect(balanceResult.statement.length).toEqual(2);
    expect(balanceResult.balance).toEqual(balance);
  });
  it("Should not be able to show the balance of an  non existent user", async () => {

    await expect(async () => {
      await getBalanceUseCase.execute({ user_id: "1234567890 wrong id" });
    }).rejects.toBeInstanceOf(AppError);

  });

});
