import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { Response } from "express";

@Controller('/api/users')
export class UsersController {


  constructor(private userService: UsersService) {
  }

  @Post('/createUser')
  createUser(@Body() user:CreateUserDto){
    return this.userService.createUser(user);
  }


}
