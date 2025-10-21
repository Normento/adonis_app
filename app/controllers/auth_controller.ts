
import User from "#models/user"
import { LoginValidator } from "#validators/login_validator"
import { registerValidator } from "#validators/register_validator"
import { cuid } from "@adonisjs/core/helpers"
import { HttpContext } from "@adonisjs/core/http"

export default class AuthController {

  public async register({ request, response}: HttpContext) {
    const payload = await request.validateUsing(registerValidator)
    const avatarFile = request.file('avatar')
    let key: string | null = null
    if (avatarFile) {
      key = `avatars/${cuid()}.${avatarFile.extname}`
      await avatarFile.moveToDisk(key,'fs', { overwrite: true })
    }
    const user = await User.create({...payload, avatar : key})
    const message = 'User registered successfully'

    return response.status(201).json({
      data: { ...user.toJSON() },
      message: message,
    })
  }


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


  public async logout({ auth, response }: HttpContext) {
    await auth.use('api').invalidateToken()
    return response.status(200).json({ message: 'Logout successful' })
  }
}
