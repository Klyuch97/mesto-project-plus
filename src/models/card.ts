import mongoose from 'mongoose';
import reqExp from '../constants/constants';

interface ICard {
  name: string,
  link: string,
  owner: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[],
  createdAt: Date
}

const CardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v:string) => reqExp.test(v),

      message: 'Неправильный формат ссылки на карточку',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICard>('card', CardSchema);
