const Teacher = require('../models/teacher');
const Quiz = require('../models/quiz');
const Question = require('../models/questions')
const db = require('../config/mongoose');
const bcrypt = require('bcryptjs');
const Configuration = require("openai");
const OpenAIApi = require("openai");
const OpenAI = require("openai");
const openaii = new OpenAI();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);




module.exports.createQuiz = (req, res) => {
    const find = async () => {
        try {
            const user = await Quiz.findOne({ quizname: req.body.quizname });

            if (!user) {
                req.body.owneremail = req.user.email;
                console.log(req.user.email);
                const data = new Quiz(req.body);
                data.save();
                const user2 = await Quiz.findOne({ quizname: req.body.quizname });
                console.log(user2);
                return res.redirect('/teacher/pastquiz');
            }
            else {
                return res.redirect('/teacher/');
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    find();
}
module.exports.pastquiz = function (req, res) {
    const getquiz = async () => {
        const ress = await Quiz.find({ end: 0 });
        //console.log(ress);
        return res.render('displaypastquiz', {
            title: "Available Quiz!",
            past_quiz: ress
        });
    }
    getquiz();
}

module.exports.completed = function (req, res) {
    const getquiz = async () => {
        const ress = await Quiz.find({ end: 1 });
        return res.render('displaycompleted', {
            title: "Completed Quiz!",
            past_quiz: ress
        });
    }
    getquiz();
}


module.exports.viewquiz = function (req, res) {
    let id = req.query.id;
    const getquiz = async () => {
        const ress = await Question.find({ quizid: id });
        //console.log(ress);
        return res.render('viewquiz', {
            title: "Quiz!",
            past_quiz: ress
        });
    }
    getquiz();
}


module.exports.viewstures = async function (req, res) {
    let id = req.query.id;
    let quizId = req.query.otherParam;
    try {
        const result = await Question.findOne(
            { quizid: quizId, 'response.stu_id': id },
            { questionText: 1, response: 1 }
        );
        console.log(result);

        if (result) {
            const { questionText, responses } = result;

            const studentResponse = responses.find((response) => response.stu_id === stuId);

            res.render('viewstures', {
                title: 'Question and Answer',
                questionText,
                studentResponse: studentResponse ? studentResponse.answer : 'Student did not answer'
            });
        }
    } catch (error) {
        console.error('Error fetching question and answer:', error);
    }
    return res.redirect('back');
}


module.exports.deletequiz = function (req, res) {
    let id = req.query.id;
    // let contind = contactList.findIndex(contact => contact.number==phone);
    // if(contind!=-1){
    //     contactList.splice(contind,1);
    // }
    const dele = async () => {
        try {
            const ress = await Quiz.deleteOne({ _id: id });
            return res.redirect('back');
        } catch (err) {
            console.log(err);
            return;
        }
    }
    dele();
};

module.exports.endquiz = async function (req, res) {
    let id = req.query.id;
    await Quiz.updateOne(
        { _id: id },
        {
            $set: {
                end: true,
                upload: 0
            }
        }
    );
    return res.redirect('back');
};



module.exports.deleteques = function (req, res) {
    let id = req.query.id;

    const dele = async () => {
        try {
            const ress = await Question.deleteOne({ _id: id });
            return res.redirect('back');
        } catch (err) {
            console.log(err);
            return;
        }
    }
    dele();
};

module.exports.home = function (req, res) {
    if (req.isAuthenticated() && req.user.role == 'student') {
        console.log('ok');
        return res.redirect('/teacher/logout');
    }
    if (req.isAuthenticated()) {
        return res.redirect('/teacher/teacherinrt');
    }
    else if (!req.isAuthenticated) {
        return res.render('Alert');
    }
    else
        return res.render("teacher-signup");
}

module.exports.signup = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/teacher/teacherinrt');
    }
    return res.render("Alert");
}
module.exports.changepassword = function (req, res) {
    if (!req.isAuthenticated()) {
        return res.redirect('Alert');
    }

    return res.render("changepass");
}

module.exports.changepass = async function (req, res) {
    console.log(req.user);
    if ((req.body.oldpass != req.user.password) || (req.body.newpass != req.body.newpassc)) {
        return res.render('Alert');
    }
    await Teacher.updateOne(
        { email: req.user.email },
        {
            $set: { password: req.body.newpass },
        }
    );
    return res.redirect('/teacher/logout');
};



module.exports.logout = function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}
module.exports.nextpage = function (req, res) {
    return res.render("teacherinterface");
}
module.exports.quizmaker = function (req, res) {
    // console.log(req.user);
    return res.render("quizcreatepage", {
        email: req.user.email
    });
}
module.exports.addQuestion = (req, res) => {
    let id = req.query.id;
    return res.render('Question', {
        idd: id
    });
}
module.exports.upload = (req, res) => {
    let id = req.query.id;
    const getquiz = async () => {
        try {
            const ress = await Quiz.findOne({ _id: id });
            var fla;
            if (ress.upload) {
                fla = false;
            }
            else {
                fla = true;
            }
            await Quiz.updateOne(
                { _id: id },
                {
                    $set: { upload: fla },
                }
            );
            return res.redirect('/teacher/pastquiz');
        } catch (err) {
            console.log(err);
            return;
        }
    }
    getquiz();

}
module.exports.addnewQuestion = (req, res) => {
    let id = req.query.id;
    const find = async () => {
        try {
            req.body.quizid = id;
            const data = new Question(req.body);
            data.save();

            return res.redirect('/teacher/pastquiz'); // change to signup page later
        }
        catch (err) {
            console.log(err);
        }
    }
    find();
}
module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_pass) {
        return res.render('Alert');
    }
    const find = async () => {
        try {
            const user = await Teacher.findOne({ email: req.body.email });
            console.log(user);
            if (!user || user.role != "teacher") {
                // req.body.role="teacher";
                // const data = new Teacher(req.body);
                // data.save();
                // console.log(data);
                const salt = await bcrypt.genSalt(10);
                // const salt="Azbe";
                // const pass=await bcrypt.hash(req.body.password,salt);
                let pass = await bcrypt.hash(req.body.password, salt);
                let rol = "teacher";
                Teacher.create({
                    email: req.body.email,
                    password: pass,
                    name: req.body.name,
                    role: rol
                })
                console.log("Areeee");
                return res.redirect('/teacher'); // change to signup page later
            }
            else {
                return res.redirect('Alert');
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    find();
};

module.exports.addbatch = async function (req, res) {
    let id = req.query.id;
    const arr = [];
    if (req.body.batch1 != undefined) {
        arr.push("F1");
    }
    if (req.body.batch2 != undefined) {
        arr.push("F2");
    }
    if (req.body.batch3 != undefined) {
        arr.push("F3");
    }
    console.log(arr);
    await Quiz.updateOne(
        { _id: id },
        {
            $set: { batches: arr }
        }
    );
    return res.redirect('back');
}

module.exports.createSession = function (req, res) {
    return res.redirect('/teacher/teacherinrt');
}

module.exports.viewres = function (req, res) {

    async function eval() {
        const completion = await openaii.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful assistant." }
                , { role: "assistant", content: "What can I do for you today?" },
            { role: "user", content: "compare two answers provide me a score on a value ranges from 0 to 10" },
            { role: "assistant", content: "Ok! give me Answer1 " },
            { role: "user", content: "Ram is a good boy" },
            { role: "assistant", content: " give me Answer2 " },
            { role: "user", content: "ram is fine boy" },
            { role: "user", content: "now compare and give me a only a number score" },
            ],
            model: "gpt-3.5-turbo",
        });

        console.log(completion.choices[0]);
    }











    let id = req.query.id; // quizid
    const getstu = async () => {
        const ress1 = await Teacher.find({ role: 'student', batch: 'F1' });
        const ress2 = await Teacher.find({ role: 'student', batch: 'F2' });
        const ress3 = await Teacher.find({ role: 'student', batch: 'F3' });
        console.log(ress1);
        const ques = await Question.find({ quizid: id });
        for (const que of ques) {
            console.log(que.questionText);
            async function eval() {
                let ans11 = "";
                var ans1 = "";
                const completion = await openaii.chat.completions.create({
                    messages: [{ role: "system", content: "You are a helpful assistant." }
                        , { role: "assistant", content: "What can I do for you today?" },
                    { role: "user", content: "Generate the answer for this question" },
                    { role: "assistant", content: "Ok! give me Question" },
                    { role: "user", content: que.questionText},
                    ],
                    model: "gpt-3.5-turbo",
                });
                //var result = JSON.parse(JSON.stringify(completion));
                ans1 = completion.choices[0];
                ans11 = (ans1.message.content);
                console.log(ans11);
                for (const re of que.response) {
                    async function evalans() {
                        const completion = await openaii.chat.completions.create({
                            messages: [{ role: "system", content: "You are a helpful assistant." }
                                , { role: "assistant", content: "What can I do for you today?" },
                            { role: "user", content: "compare two answers provide me a score on a value ranges from 0 to 10" },
                            { role: "assistant", content: "Ok! give me Answer1 " },
                            { role: "user", content: ans11 },
                            { role: "assistant", content: " give me Answer2 " },
                            { role: "user", content: re.answer},
                            { role: "user", content: "now compare and give me a only a number score" },
                            ],
                            model: "gpt-3.5-turbo",
                        });
                        console.log(completion.choices[0]);
                    }
                    evalans();
                }
            }
            eval();
        }
        for (const stu of ress1) {
            console.log(stu._id);
        }
        return res.render('viewresponse', {
            title: "Quiz!",
            student1: ress1,
            student2: ress2,
            student3: ress3,
            quizid: id
        });
    }
    getstu();
}

module.exports.evaluate = function (req, res) {
    async function eval() {
        const completion = await openaii.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful assistant." }
                , { role: "assistant", content: "What can I do for you today?" },
            { role: "user", content: "compare two answers provide me a score on a value ranges from 0 to 10" },
            { role: "assistant", content: "Ok! give me Answer1 " },
            { role: "user", content: "Ram is a good boy" },
            { role: "assistant", content: " give me Answer2 " },
            { role: "user", content: "ram is fine boy" },
            { role: "user", content: "now compare and give me a only a number score" },
            ],
            model: "gpt-3.5-turbo",
        });

        console.log(completion.choices[0]);
    }

    eval();
}
module.exports.alert = function (req, res) {
    return res.render('Alert');
}
module.exports.alert2 = function (req, res) {
    return res.redirect('back');
}