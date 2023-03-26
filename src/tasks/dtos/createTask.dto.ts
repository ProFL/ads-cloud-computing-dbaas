import { IsDefined, IsString, MinLength } from "class-validator";

export class CreateTaskDto {
  @IsDefined()
  @IsString()
  @MinLength(3)
  title: string;

  constructor({ title = "" }: Partial<CreateTaskDto>) {
    this.title = title;
  }
}
