const { response } = require("express");

const controller = {};

controller.list = (req, res) => {
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM customers', (err, customers) => {
            if(err){
                res.json(err);
            }
            res.render('customers', {
                data: customers
            });
        });
    });
};

controller.save = (req, res) => {
    const { body } = req;
    if(body.name == "" || body.address == ""){
        //res.send('<h2>Los campos nombre y dirección son obligatorios</h2><a href="/">Volver</a>');
    } else if (body["g-recaptcha-response"] == ""){
        //res.send('<h2>ReCaptcha no aceptado</h2><a href="/">Volver</a>');
    } else {
        req.getConnection((err, conn) => {
            delete body["g-recaptcha-response"];
            conn.query('INSERT INTO customers set ?', [ body ], (err, customer) => {
                if (err) throw err;
                res.redirect('/');
            });
        });
    }
};

controller.edit = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('SELECT * FROM customers WHERE id = ?', [ id ], (err, customer) => {
            if (err) throw err;
            res.render('customersEdit', {
                data: customer[0]
            })
        });
    });
};

controller.update = (req, res) => {
    const { id } = req.params;
    const { body } = req;
    req.getConnection((err, conn) => {
        conn.query('UPDATE customers set ? WHERE id = ?', [ body, id ], (req, customer) => {
            if (err) throw err;
            res.redirect('/');
        });
    });
};

controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, conn) => {
        conn.query('DELETE FROM customers WHERE id = ?', [ id ], (err, customer) => {
            if (err) throw err;
            res.redirect('/');
        });
    });
};

module.exports = controller;