import Studio from '../models/studioModel.js';

const createStudio = async (req, res) => {
  try {
    const newStudio = await Studio.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        studio: newStudio,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Erro ao criar estúdio',
      error: err.message,
    });
  }
};

const getAllStudios = async (req, res) => {
  try {
    const studios = await Studio.find();

    res.status(200).json({
      status: 'success',
      data: {
        studios,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'Erro ao buscar estúdios',
      error: err.message,
    });
  }
};

const getStudio = async (req, res) => {
  try {
    const studio = await Studio.findById(req.params.id);

    if (!studio) {
      return res.status(404).json({
        status: 'fail',
        message: 'Estúdio não encontrado',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        studio,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Erro ao buscar estúdio',
      error: err.message,
    });
  }
};

const updateStudio = async (req, res) => {
  try {
    const studio = await Studio.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!studio) {
      return res.status(404).json({
        status: 'fail',
        message: 'Estúdio não encontrado',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        studio,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Erro ao atualizar estúdio',
      error: err.message,
    });
  }
};

const deleteStudio = async (req, res) => {
  try {
    const studio = await Studio.findByIdAndDelete(req.params.id);

    if (!studio) {
      return res.status(404).json({
        status: 'fail',
        message: 'Estúdio não encontrado',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Estúdio deletado com sucesso',
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Erro ao deletar estúdio',
      error: err.message,
    });
  }
};

export default {
  createStudio,
  getAllStudios,
  getStudio,
  updateStudio,
  deleteStudio,
};
