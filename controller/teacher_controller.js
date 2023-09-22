const Teacher = require('../models/teacher');
const Quiz=require('../models/quiz');
const Question = require('../models/questions')

module.exports.createQuiz = (req, res) => {
    const find = async()=>{
        try{
            const user = await Quiz.findOne({owneremail : req.body.owneremail});

            if(!user){
                const data = new Quiz(req.body);
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
module.exports.nextpage=function(req,res){
    return res.render("teacherinterface");
}
module.exports.quizmaker=function(req,res){
    // console.log("kkk");
    return res.render("quizcreatepage");
}
module.exports.addQuestion = (req, res) => {

    Question.find({ quizid: req.body.quizid }, (err, q) => {
        if (err) {
            console.log(error);
            res.json({ msg: "some error!" });
        }
        else {
            var question = new Question({
                quizid: req.body.quizid,
                questionId: q.length + 1,
                questionText: req.body.questionText,
                // answer: req.body.answer,
                // options: req.body.options
            });
            question.save((error, qsn) => {
                if (error) {
                    console.log(error);
                    res.json({ msg: "some error!" });
                }
                else {
                    res.status(200).json({ message: "yes question added!!" })
                }
            })
        }
    })
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