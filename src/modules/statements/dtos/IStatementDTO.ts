enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

export interface IStatementDTO{
  amount:number,
  description: string,
  sender_id?:string,
  user_id:string,
  type:OperationType,
}
