import mongoose from 'mongoose';

const studioSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Um estúdio deve possuir um nome'],
      unique: true,
      trim: true,
      maxlength: [20, 'O nome do estúdio deve conter até 20 caracteres'],
      minlength: [5, 'O nome do estúdio deve conter pelo menos 5 caracteres'],
      validate: {
        validator: function (value) {
          return /^[A-Za-zÀ-ÿ\s]+$/.test(value);
        },
        message: 'O nome do estúdio deve conter apenas letras',
      },
    },
    localizacao: {
      type: String,
      required: [true, 'Um estúdio deve possuir uma localização'],
      trim: true,
      maxlength: [50, 'A localização do estúdio deve conter até 50 caracteres'],
      minlength: [
        10,
        'A localização do estúdio deve conter pelo menos 10 caracteres',
      ],
    },
    capacidade: {
      type: Number,
      required: [true, 'Um estúdio deve ter uma capacidade máxima'],
      min: [5, 'Um estúdio deve suportar no mínimo 5 pessoas'],
      max: [20, 'Um estúdio deve suportar no máximo 20 pessoas'],
    },
  },
  { timestamps: true }
);

// Pré-processamento
studioSchema.pre('save', function (next) {
  this.nome = this.nome.trim().replace(/\s+/g, ' ');
  this.localizacao = this.localizacao.trim();
  next();
});

export default mongoose.model('Studio', studioSchema);
