import { ApiProperty } from "@nestjs/swagger";

export class BaseUserView {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'user.email@gmail.com' })
  email: string;
  @ApiProperty({ example: 'John Doe' })
  userName: string;
  @ApiProperty({ example: '2025-08-10T00:00:00.000Z' })
  createdAt: Date;

  constructor(model: any) {
    this.userName = model.userName;
    this.email = model.email;
    this.createdAt = model.createdAt;
  }

  static mapToView(user: any): BaseUserView {
    return new BaseUserView(user);
  }

  static mapToViewList(users: any[]): BaseUserView[] {
    return users.map((user) => BaseUserView.mapToView(user));
  }
}