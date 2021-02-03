let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");

//Assertion Style
chai.should();
var expect = chai.expect;
var assert = require("assert");

chai.use(chaiHttp);



describe('Tasks API', () => {

    /**
     * Test the GET route
     */
    describe("GET /fault", () => {
        it("It should have 404 status code.This endpoint does not exist", (done) => {
            chai.request(server)
                .get("/fault")
                .end((err, response) => {
                    response.should.have.status(404);
                   
                done();
                });
        });
    });


    describe("GET /login", () => {
        it("It should have 200 status code.", (done) => {
            chai.request(server)
                .get("/login")
                .end((err, response) => {
                    response.should.have.status(200);
                   
                done();
                });
        });
    });

    describe("GET /adminSignup", () => {
        it("It should be redirected. Must be a super admin to have access.", (done) => {
            chai.request(server)
                .get("/adminSignup")
                .end((err, response) => {
                	expect(response).to.redirect;                 
                done();
                });
        });
    });


     describe("GET /userReg", () => {
        it("It should be redirected. Must be authenticated user to have access.", (done) => {
            chai.request(server)
                .get("/userReg")
                .end((err, response) => {
                	expect(response).to.redirect;                 
                done();
                });
        });
    });


     describe("GET /tanks", () => {
        it("It should be redirected. Must login to have access to details.", (done) => {
            chai.request(server)
                .get("/tanks")
                .end((err, response) => {
                	expect(response).to.redirect;                 
                done();
                });
        });
    });



     /**
     * Test the POST route
     */
    
    describe('/signup user', () => {
        it('it should POST the same user credentials to signup. Signup should fail. Expect 400 status', (done) => {
            

            let customer = {
                email: "thusharaweerasundara@gmail.com",
                password: "test12345",
               	role : "user"
            };

          chai.request(server)
              .post('/signup')
              .send(customer)
              .end((err, res) => {
                    res.should.have.status(400); 
                    res.body.should.be.a('object');                  
                    res.body.should.have.property('errors');                   
                done();
              }).timeout(0);
        


        }).timeout(0);
  
    });

describe('/login user', () => {
        it('it should POST user credentials to login. Expect 200 status with a user object. After login get user device details', (done) => {
            

            let customer = {
                email: "thusharaweerasundara@gmail.com",
                password: "test12"
               
            };

          chai.request(server)
              .post('/login')
              .send(customer)
              .end((err, res) => {
                    res.should.have.status(200); 
                    res.body.should.have.property('user');  

                    expect(res).to.have.cookie('jwt');

                    chai.request(server)
	                .get("/tanks")
	                .end((err, response) => {
	                	response.should.have.status(200);                     
                    	response.should.be.a('object');               	           
	                });


                done();
              }).timeout(0);
        


        }).timeout(0);
  
    });

    



});

