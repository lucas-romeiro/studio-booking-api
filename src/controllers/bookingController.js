import Booking from '../models/bookingModel.js';

const createBooking = async (req, res) => {
  try {
    const newBooking = await Booking.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        booking: newBooking,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Erro ao criar agendamento',
      error: err.message,
    });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('studio');

    res.status(200).json({
      status: 'success',
      data: {
        bookings,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'Erro ao buscar agendamentos',
      error: err.message,
    });
  }
};

const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('studio');

    if (!booking) {
      return res.status(404).json({
        status: 'fail',
        message: 'Agendamento não encontrado',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        booking,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Erro ao buscar agendamento',
      error: err.message,
    });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('studio');

    if (!booking) {
      return res.status(404).json({
        status: 'fail',
        message: 'Agendamento não encontrado',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        booking,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Erro ao atualizar agendamento',
      error: err.message,
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        status: 'fail',
        message: 'Agendamento não encontrado',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Agendamento deletado com sucesso',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Erro ao deletar agendamento',
      error: err.message,
    });
  }
};

export default {
  createBooking,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
};
