import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { Request, Response } from "express";
import { User } from "../entities/User";
import { LoginUserDto } from "./dto/login-user.dto";

@Controller('/api/v1/users')
export class UsersController {


  constructor(private userService: UsersService) {
  }

  @Post('/createUser')
  createUser(@Body() user:CreateUserDto, @Res() res:Response){
    return this.userService.createUser(user,res);
  }



  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto, @Res() res: Response){
    return this.userService.login(res,loginUserDto)
  }

  @Get('/logout')
  logout(@Req() req: any, @Res() res:Response){
    return this.userService.logout(req,res)
  }

  @Get('/auth/me')
  authMe(@Req() req: any, @Res() res:Response){
    return this.userService.authMe(req,res)
  }


  @Get('/getUserById/:id')
  getUserById(@Param('id') id:number, @Res() res:Response){
    return this.userService.getUserById(id,res);
  }

  @Delete('/deleteUserById/:id')
  deleteUserById(@Param('id') id:number, @Res() res:Response){

    return this.userService.deleteUserById(id,res);
  }

  @Put('/updateUser/:id')
  updateUser(@Param('id') id:number, @Res() res:Response, @Body() newUser: Partial<User>){
    return this.userService.updateUser(id,res,newUser)
  }

  @Get('/getAllUsers')
  getAllUsers(@Res() res: Response, @Req() req:Request){
    return this.userService.getAllUsers(res,req)
  }

}
