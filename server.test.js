const expect = require('expect');
const request = require('supertest');
const {ObjectID} =require('mongodb');

const{router} = require('../api/model/users');


describe('POST/signup', ()=>{
    it('should create a user', (done)=>{
        var email = user.email;
        var password = user.password;

        request(router)
            .post('/signup')
            .send({email, password})
            .expect(200)
            .expect((res)=>{
                expect(res.header['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email)
            })
            .end((err)=>{
                if(err){
                    return done(err)
                }
                User.findOne({email}).then((user)=>{
                    expect(user).toExist();
                    expect(user.password).toNotBe(password)
                    done()
                }).catch((e)=>(e));
            })
    })

    });
    it('should return validation errors if reuest invalid', (done)=>{
        request(router)
            .post('/signup')
            .send({
                email: user.email,
                password: user.password
            })
            .expect(400)
            .end(done);

    });
    it('should not create user if email in use', (doen)=>{
        request(router)
            .post('/signup')
            .send({
                email: user.email,
                password: user.password
            })
            .expect(400)
            .end(done);        
})

describe('POST/login', ()=>{
    it('should login user and return auth token', (done)=>{
        request(router)
            .post('/login')
            .send({
                email: user.email,
                password: user.password
            })
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res)=>{
                if(err){
                    return done(err);
                }
                User.findById(user._id).then((user)=>{
                    expect(user.tokens[0]).toinclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e)=>(e));
            })
    })
    it('it should reject invalid login', (done)=>{
        request(router)
        .post('/login')
        .send({
            email: user.email,
            password: user.password
        })
        .expect(400)
        .expect((res)=>{
            expect(res.headers['x-auth']).toNotExist();
        })
        .end((err, res)=>{
            if(err){
                return done(err);
            }
            User.findById(user._id).then((user)=>{
                expect(user.tokens.length).toBe(0)
                done();
            }).catch((e)=>(e));
        })

    })
})






