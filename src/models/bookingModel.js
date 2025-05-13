import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    studio: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Studio',
      required: [true, 'Um agendamento deve conter um studio'],
    },
    usuario: {
      type: String,
      required: [true, 'Um agendamento deve conter um usuário'],
      trim: true,
    },
    dataInicio: {
      type: Date,
      required: [true, 'Um agendamento deve conter uma data de início'],
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: 'A data de início deve ser maior que o horário atual',
      },
    },
    dataFim: {
      type: Date,
      required: [true, 'Um agendamento deve conter uma data de fim'],
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: 'A data de fim deve ser maior que o horário atual',
      },
    },
    observacoes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// 1) Valida conflito de horários
bookingSchema.pre('save', async function (next) {
  const conflicting = await mongoose.model('Booking').findOne({
    studio: this.studio,
    _id: { $ne: this._id },
    dataInicio: { $lt: this.dataFim },
    dataFim: { $gt: this.dataInicio },
  });

  if (conflicting) {
    return next(new Error('Já existe um agendamento nesse horário.'));
  }

  next();
});

// 2) Validação
bookingSchema.pre('validate', function (next) {
  // 1. Data fim > data início
  if (this.dataFim <= this.dataInicio) {
    this.invalidate(
      'dataFim',
      'A data de fim deve ser posterior à data de início'
    );
  }

  // 2. Faixa de horário permitida
  const horaValida = (data) => {
    const hora = data.getHours();
    return hora >= 8 && hora < 22;
  };

  if (!horaValida(this.dataInicio) || !horaValida(this.dataFim)) {
    return next(
      new Error('Os agendamentos devem ocorrer entre 08:00 e 22:00.')
    );
  }

  // 3. Duração entre 1h e 4h
  const duracao = this.dataFim - this.dataInicio;
  const duracaoMin = 60 * 60 * 1000;
  const duracaoMax = 4 * 60 * 60 * 1000;

  if (duracao < duracaoMin) {
    return next(new Error('A duração mínima do agendamento é de 1 hora.'));
  }

  if (duracao > duracaoMax) {
    return next(new Error('A duração máxima do agendamento é de 4 horas.'));
  }

  next();
});

export default mongoose.model('Booking', bookingSchema);
