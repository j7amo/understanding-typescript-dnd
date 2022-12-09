// here we use "class-validator" package which uses experimental TS feature - DECORATORS
import { IsNumber, IsNotEmpty, IsPositive } from "class-validator";

export class Product {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }

  getInformation() {
    return [this.title, `$${this.price}`];
  }
}
