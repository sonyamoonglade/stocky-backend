import { UsersService } from "../users.service";
import { Test } from "@nestjs/testing";
import { UsersRepository } from "../users.repository";
import { DbModule } from "../../database/db.module";
import { QueryBuilderModule } from "../../xander_qb/qb.module";
import { AuthenticationModule } from "../../authentication/authentication.module";
import { User } from "../../entities/User";

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

  describe('userRepo', () => {


    it('getAll', async () => {

      jest.spyOn(usersRepository, 'getAll').mockImplementation(() => Promise.resolve(users))

      const actual = await usersRepository.getAll()

      expect(actual).toBe(users)

    })




  })

})