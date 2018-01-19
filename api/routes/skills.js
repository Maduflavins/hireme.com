const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Skill = require('../model/skills');
const Authorize = require("../middleware/authorize");
const SkillController = require('../controllers/skills');
const multer    = require('multer');
const storage = multer.diskStorage({
    destination: function(req, res, cb){
        cb(null, './skillsUploads');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, res, cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

const upload = multer({storage: storage, limits:
    {
        fileSize: 1024 * 1024 * 5
    }, fileFilter: fileFilter
});


router.get('/', SkillController.getSkills);

router.post('/', upload.single('skillImage'), SkillController.createSkills);

router.get('/:skillId', SkillController.getSpecificSkill);

router.patch('/:skillId', Authorize.checkSkillOwnership, SkillController.updateSkill);

router.delete('/:skillId', SkillController.deleteSkills);

module.exports = router;