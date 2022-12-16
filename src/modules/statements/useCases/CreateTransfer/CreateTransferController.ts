import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";

enum OperationType {
  TRANSFER = 'transfer',
}

export class CreateTransferController {
  async execute(request:Request, response: Response): Promise<Response>{
    const { amount,description } = request.body;
    const { user_id } = request.params;
    const { id: sender_id } =  request.user
    const type = OperationType.TRANSFER;

    const createTransferUseCase = container.resolve(CreateTransferUseCase);
    const transfer = await createTransferUseCase.execute({
      amount,
      description,
      type,
      user_id,
      sender_id
    })
    return response.json(transfer);
  }
}
