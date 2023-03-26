import { IsBoolean, IsDefined } from "class-validator";

export class SetTaskDoneDto {
  @IsDefined()
  @IsBoolean()
  done: boolean;

  constructor({ done = false }: Partial<SetTaskDoneDto>) {
    this.done = done;
  }
}
