import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementDTO } from "../../dtos/IStatementDTO";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferError";


@injectable()
export class CreateTransferUseCase {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject("StatementsRepository")
    private statementsRepository: IStatementsRepository
  ){}

  async execute({amount,description,sender_id,type,user_id}:IStatementDTO):Promise<Statement>{
    const userSender =  await this.usersRepository.findById(sender_id as string);
    if(!userSender){
      throw new CreateTransferError.UserNotFound();
    }
    const userReceiver =  await this.usersRepository.findById(user_id);
    if(!userReceiver){
      throw new CreateTransferError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id:userSender.id as string });

    if(balance<amount){
      console.log(balance);
      throw new CreateTransferError.InsufficientFunds()
    }
    await this.statementsRepository.create({
      amount,
      description,
      type,
      user_id: userReceiver.id as string,
      sender_id
    });

    const transferSender = await this.statementsRepository.create({
      amount,
      description,
      type,
      user_id: userSender.id as string,
    });
    return transferSender;

 }
}
