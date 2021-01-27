let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");

//Assertion Style
chai.should();

chai.use(chaiHttp);

describe('Tasks API', () => {

    /**
     * Test the GET route
     */
    describe("GET /fault", () => {
        it("It should have 404 status code", (done) => {
            chai.request(server)
                .get("/fault")
                .end((err, response) => {
                    response.should.have.status(404);
                   
                done();
                });
        });
    });


    describe("GET /login", () => {
        it("It should have 200 status code", (done) => {
            chai.request(server)
                .get("/login")
                .end((err, response) => {
                    response.should.have.status(200);
                   console.log(response.status);
                done();
                });
        });
    });

    describe("GET /userReg", () => {
        it("It should have 200 status code", (done) => {
            chai.request(server)
                .get("/userReg")
                .end((err, response) => {
                    response.should.have.status(200);
                   console.log(response.status);
                done();
                });
        });
    });

    



});


