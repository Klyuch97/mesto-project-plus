import mongoose, { Document, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { StatusUnauthorized } from '../errors/customError';


interface IUser {
  name: string,
  about: string,
  avatar: string,
  email: string,
  password: string
}

interface UserModel extends Model<IUser> {
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

const UserSchema = new mongoose.Schema<IUser, UserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто'
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь'
  },
  avatar: {
    type: String,
    validate: {
      validator: (v:string)=>
         /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(v),

      message: 'Неправильный формат ссылки на аватар'
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неправильный формат почты'
    }
  },
  password: {
    type: String,
    required: true,
    select: false
  }
})

UserSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const authenticationError = new StatusUnauthorized('Неправильные почта или пароль');
        throw authenticationError;
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const authenticationError = new StatusUnauthorized('Неправильные почта или пароль');
            throw authenticationError;
          }

          return user;
        });
    });
});

export default mongoose.model<IUser, UserModel>('user', UserSchema)