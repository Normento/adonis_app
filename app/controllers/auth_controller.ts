
import User from "#models/user"
import { LoginValidator } from "#validators/login_validator"
import { registerValidator } from "#validators/register_validator"
import { HttpContext } from "@adonisjs/core/http"

export default class AuthController {

  public async register({ request, response}: HttpContext) {
    const payload = await request.validateUsing(registerValidator)
    const user = await User.create(payload)
    const message = 'User registered successfully'
    return response.status(201).json({ data: user, message : message })
  }


  //login method

  public async login({ request, response }: HttpContext) {
    const payload = await request.validateUsing(LoginValidator)

    const user = await User.verifyCredentials(payload.email, payload.password)

    if (!user) {
      return response.status(400).json({ message: 'Identifiants invalides' })
    }

    const token = await User.accessTokens.create(user,['*'],{ expiresIn: '1 days' })
    const tokenValue = token.value!.release()

    return response.status(200).json({
      message: 'Login successful',
      data: user,
      token: tokenValue,
    })
  }
}
