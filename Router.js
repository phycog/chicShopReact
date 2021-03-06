const bcrypt = require('bcrypt');

class Router {
    constructor(app,db){
        this.login(app,db);
        this.logout(app,db);
        this.isLoggedIn(app,db);
        this.checkRegister(app,db);
    }

    login(app,db){
        app.post('/loginU',(req,res) =>{
            let username = req.body.username;
            let password = req.body.password;

            username = username.toLowerCase();

            if (username.length > 12 || password.length > 12){
                res.json({
                    success : false,
                    msg : 'You Are Doing Something Wrong, Please Try Again..'
                })
                return;
            }

            let cols = [username];
            db.query('SELECT * FROM userdata WHERE username = ? LIMIT 1',cols,(err,data,fields) =>{
                if (err){
                    res.json({
                        success : false,
                        msg : 'You Are Doing Something Wrong, Please Try Again..'
                    })
                    return;
                }
                if(data && data.length ===1){
                    bcrypt.compare(password,data[0].password,(bcryptErr,verified) =>{
                        if (verified){
                            req.session.userID = data[0].id;

                            res.json({
                                success : true,
                                username : data[0].username
                            })
                            return;
                        }
                        else{
                            res.json({
                                success: false,
                                msg : 'Invalid password!'
                            })
                        }


                    });           
                }else{
                    res.json({
                        success : false,
                        msg : 'User Not Found! , Please Try Again..'
                    })
                }
            });

        });

    }

    logout(app,db){
        app.post('/logout',(req,res) =>{
            if (req.session.userID){
                req.session.destroy();
                res.json({
                    success : false
                })
                return true;
            }else{
                res.json({
                    success : false
                })
                return false;
            }
        });

    }

    isLoggedIn(app,db){
        app.post('/isLoggedIn',(req,res) => {

            if (req.session.userID){
                let cols = [req.session.userID];
                db.query('SELECT * FROM userdata WHERE id = ? LIMIT 1',cols,(err,data,fields) =>{
                    if (data && data.length ===1){
                        res.json({
                            success : true,
                            username : data[0].username
                        })
                        return true;
                    } else{
                        res.json({
                            success : false
                        })
                    }

                });
            } else{ res.json({
                success : false
            })

            }
        })

    }


    /////////////////   check same name
    checkRegister(app,db){
        app.post('/checkRegister',(req,res) =>{
            let username = req.body.username;
            let password = req.body.password;

            username = username.toLowerCase();

            if (username.length < 8 || password.length < 8){
                res.json({
                    checkNoSame : false,
                    msg : 'You Are Doing Something Wrong, Please Try Again..'
                })
                return;
            }

            let cols = [username];
            db.query('SELECT * FROM userdata WHERE username = ? LIMIT 1',cols,(err,data,fields) =>{
                if (err){
                    res.json({
                        checkNoSame : false,
                        msg : 'You Are Doing Something Wrong, Please Try Again..'
                    })
                    return;
                }
                if(data && data.length ===1){
                    bcrypt.compare(password,data[0].password,(bcryptErr,verified) =>{
                        if (verified){
                            

                            res.json({
                                checkNoSame : false,
                                msg : 'You Are Doing Something Wrong, Please Try Again..'
                            })
                            return;
                        }
                        else{
                            res.json({
                                checkNoSame: true,
                                msg : 'สมัครสำเร็จ..'
                            })
                        }


                    });           
                }else{
                    res.json({
                        checkNoSame : true,
                        msg : 'สมัครสำเร็จ..'
                    })
                }
            });

        });

    }


}

module.exports = Router;