import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
describe("Show user profile test", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })
  it("Should be able to show a user profile by id", async () => {

    const user = await inMemoryUsersRepository.create({
      name: "Test name",
      email: "email@test.com",
      password: "1234",
    });

    const userSearchResult = await showUserProfileUseCase.execute(user.id as string)
    expect(userSearchResult).toEqual(user);

  });
  it("Should not be able to show a user with incorrect id", async () => {
    await expect(async () => {
      await inMemoryUsersRepository.create({
        name: "Test name",
        email: "email@test.com",
        password: "1234",
      });
      await showUserProfileUseCase.execute("incorrect id 1234567890");
    }).rejects.toBeInstanceOf(AppError);
  });
});
