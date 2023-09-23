const Teacher = require('../models/teacher');
const Quiz=require('../models/quiz');
const Question = require('../models/questions')
const db = require('../config/mongoose');
module.exports.createQuiz = (req, res) => {
    const find = async()=>{
        try{
            const user = await Quiz.findOne({owneremail : req.body.owneremail});

            if(!user){
                const data = new Quiz(req.body);
                data.save();

                return res.render('Question'); 
            }
            else{
                return res.redirect('/teacher/signup');
            }
        }
        catch(err){
            console.log(err);
        }
    }
    find();
}
module.exports.home = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/teacher/teacherinrt');
    }

    return res.render("teacher-signup");
}

module.exports.signup = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/teacher/teacherinrt');
    }

    return res.render("teacher-signup");
}
module.exports.changepassword = function(req,res){
    if(!req.isAuthenticated()){
        return res.redirect('/teacher');
    }

    return res.render("changepass");
}

module.exports.changepass = async function(req,res){
    if((req.body.oldpass != req.user.password) || (req.body.newpass!=req.body.newpassc)){
        return res.redirect('/teacher');
    }
    await Teacher.updateOne(
        { email: req.user.email },
        {
          $set: { password: req.body.newpass},
        }
    );
    return res.redirect('/teacher/logout');
};



module.exports.logout = function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
}
module.exports.nextpage=function(req,res){
    return res.render("teacherinterface");
}
module.exports.quizmaker=function(req,res){``
    return res.render("quizcreatepage");
}
module.exports.addQuestion = (req, res) => {
    res.redirect('Question');
}
module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_pass){
        return res.redirect('back');
    }
    const find = async()=>{
        try{
            const user = await Teacher.findOne({email : req.body.email});

            if(!user){
                const data = new Teacher(req.body);
                data.save();

                return res.redirect('/teacher'); // change to signup page later
            }
            else{
                return res.redirect('/teacher/signup');
            }
        }
        catch(err){
            console.log(err);
        }
    }
    find();
};

module.exports.createSession = function(req,res){
    return res.redirect('/teacher/teacherinrt');
}