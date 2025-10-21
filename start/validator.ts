
import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.messagesProvider = new SimpleMessagesProvider({
  'required': 'Le champ {{ field }} est requis.',
  'string': 'Le champ {{ field }} doit être une chaîne de caractères.',
  'email': 'La valeur de {{ field }} doit être une adresse email valide.',
  'username.required': 'Le nom d’utilisateur est obligatoire.',
  'username.unique': 'Ce nom d’utilisateur est déjà pris.',
  'email.unique': 'Cette adresse email est déjà utilisée.',
  'password.minLength': 'Le mot de passe doit contenir au moins {{ min }} caractères.',
})
