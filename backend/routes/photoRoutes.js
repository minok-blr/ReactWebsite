var express = require('express');
// Vključimo multer za file upload
var multer = require('multer');
var upload = multer({dest: 'public/images/'});

var router = express.Router();
var photoController = require('../controllers/photoController.js');

function requiresLogin(req, res, next){
    if(req.session && req.session.userId){
        return next();
    } else{
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

router.get('/', photoController.list);
//router.get('/publish', requiresLogin, photoController.publish);
router.get('/popular', photoController.popular);
router.get('/:id', photoController.show);
router.get('/tag/:name', photoController.list);

router.post('/', requiresLogin, upload.single('image'), photoController.create);

router.put('/:id', photoController.update);
router.put('/up/:id', photoController.update);
router.put('/down/:id', photoController.update);
router.put('/comment/:id', photoController.addComment);
router.put('/report/:id', photoController.report);

router.delete('/:id', photoController.remove);

module.exports = router;
