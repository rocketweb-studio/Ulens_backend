export class BaseUserViewDto {
  //   @ApiProperty({ example: 'email' })
  email: string;
  //   @ApiProperty({ example: '1' })
  id: string;
  //   @ApiProperty({ example: 'login' })
  name: string;
  //   @ApiProperty({ example: new Date() })
  createdAt: Date;

  constructor(model: any) {
    this.id = model.id;
    this.name = model.name;
    this.email = model.email;
    this.createdAt = model.createdAt;
  }

  static mapToView(user: any): BaseUserViewDto {
    return new BaseUserViewDto(user);
  }

  static mapToViewList(users: any[]): BaseUserViewDto[] {
    return users.map(user => BaseUserViewDto.mapToView(user));
  }
}
