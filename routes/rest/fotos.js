const express = require('express');
const router = express.Router();
module.exports = router;
const { Sequelize, Op } = require('sequelize');
const foto = require('../../models').foto;
const etiqueta = require('../../models').etiqueta;


router.get('/findAll/json', async (req, res) => {
    try {
        const fotos = await foto.findAll({
            attributes: { exclude: ["updatedAt", "createdAt"] },
            include: [{
                model: etiqueta,
                attributes: ['texto'],
                through: { attributes: [] }
            }]
        });
        res.json(fotos);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/findById/:id/json', function (req, res,
    next) {
    let id = parseInt(req.params.id);
    foto.findAll({
        attributes: {
            exclude: ["updatedAt",
                "createdAt"]
        },
        include: [{
            model: etiqueta,
            attributes: ['texto'],
            through: { attributes: [] }
        }],
        where: {
            [Op.and]: [
                { id: id }
            ]
        }
    })
        .then(fotos => {
            res.json(fotos);
        })
        .catch(error => res.status(400).send(error))
});

// Corrige la inconsistencia en el nombre del modelo
router.post('/save', function (req, res, next) {
    let { titulo, descripcion, calificacion, ruta } = req.body;
    foto.create({
        titulo: titulo,
        descripcion: descripcion,
        calificacion: parseFloat(calificacion),
        ruta: ruta,
        createdAt: new Date(),
        updatedAt: new Date()
    })
        .then(foto => {
            res.json(foto);
        })
        .catch(error => res.status(400).send(error))
});

router.put('/update', function (req, res, next) {
    let { id, titulo, descripcion, calificacion, ruta } =
        req.body;
    foto.update({
        titulo: titulo,
        descripcion: descripcion,
        calificacion: parseFloat(calificacion),
        ruta: ruta,
        createdAt: new Date(),
        updatedAt: new Date()
    },
        {
            where: {
                id: parseInt(id)
            }
        })
        .then(respuesta => {
            res.json(respuesta);
        })
        .catch(error => res.status(400).send(error))
});

router.delete('/delete/:id', function (req, res,
    next) {
    let id = parseInt(req.params.id);
    foto.destroy({
        where: {
            id: id
        }
    })
        .then(respuesta => {
            res.json(respuesta);
        })
        .catch(error =>
            res.status(400).send(error))
});



module.exports = router;