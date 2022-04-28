import { UsersService } from "../users.service";
import { Test } from "@nestjs/testing";
import { UsersRepository } from "../users.repository";
import { DbModule } from "../../database/db.module";
import { QueryBuilderModule } from "../../xander_qb/qb.module";
import { AuthenticationModule } from "../../authentication/authentication.module";
import { User } from "../../entities/User";
import { UserDoesNotExistException } from "../../exceptions/user.exceptions";
import exp from "constants";

describe('users module', () => {

  let usersService: UsersService
  let usersRepository: UsersRepository
  let users: User[]
  let user: User
  let updateUser: User

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersService,UsersRepository],
      imports: [DbModule, QueryBuilderModule, AuthenticationModule]
    }).compile();
    usersRepository = moduleRef.get(UsersRepository)
    usersService = moduleRef.get(UsersService)

  })

  beforeAll(() => {
    users = [
      new User("Artem","Timofeev","12345","18.01.2005","",1),
      new User("Vlad","Timofeev","12345","18.01.2005","",2),
      new User("Artem","Timofeev","12345","18.01.2005","",3)
    ]

    user = new User(
      "Artem",
      "Timofeev",
      "12345",
      "18.01.2005",
      "",
      1
    )

    updateUser = new User(
      "Vlad",
      "Timofeev",
      "12345",
      "18.01.2005",
      "",
      2
    )

  })


  describe('helper methods of usersService', () => {

    it('should return user because it exists', async () => {

      jest.spyOn(usersRepository,'getById').mockImplementation(async () => user)

      const actual = await usersService.doesUserEvenExist(1)

      expect(actual).toBe(user)

    })
    it('should throw exception userDoesNotExist', async () => {
      jest.spyOn(usersRepository,'getById').mockImplementation(async() => undefined)

      try {
        await usersService.doesUserEvenExist(1)
      }catch (exception) {
        expect(exception).toBeInstanceOf(UserDoesNotExistException)
      }
    })

    it('should return false because email has not been taken ', async () => {

      const notTakenEmail = 'testableblablarandomemail@mail.com'

      jest.spyOn(usersRepository,'get').mockImplementation(async() => [])

      const actual = await usersService.hasEmailBeenAlreadyTaken(notTakenEmail)

      expect(actual).toBeFalsy()

    })
    it('should return true because email has been taken', async () => {

      const takenEmail = 'takenemail@mail.com'

      jest.spyOn(usersRepository,'get').mockImplementation(async() => users)

      const actual = await usersService.hasEmailBeenAlreadyTaken(takenEmail)

      expect(actual).toBeTruthy()


    })

  })


})