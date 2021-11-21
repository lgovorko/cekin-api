import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString, IsOptional } from "class-validator";


export class FunFactUpdateDTO {
    @ApiProperty()
    @IsOptional()
    @IsString()
    text: string;
}