
import User from "#models/user"
import { registerValidator } from "#validators/register_validator"
import { HttpContext } from "@adonisjs/core/http"

export default class AuthController {

  public async register({ request, response}: HttpContext) {
    const payload = await request.validateUsing(registerValidator)
    const user = await User.create(payload)
    const message = 'User registered successfully'
    return response.status(201).json({ data: user, message : message })
  }
}
