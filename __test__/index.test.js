const request = require("supertest")(url);
const chai = require("chai");
const expect = chai.expect;
const GRAPHQL_ROUTE = "/the-graph-ql"
const url = `http://127.0.0.1:8000/subgraphs/name/badgeth-dao`;


describe("GraphQL", () => {
  it("Returns expected badge definitions", (done) => {
    request
      .post(GRAPHQL_ROUTE)
      .send({ query: "{ badgeDefinitions(first: 3, orderBy: id) { id } }" })
      .expect(200)
      .end((err, res) => {
        // res will contain array with one user
        if (err) return done(err);
        const { data } = res.body;
        const { badgeDefinitions } = data;
        expect(badgeDefinitions[0].id).to.equal("28 Epochs Later");
        expect(badgeDefinitions[1].id).to.equal("Delegation Nation");
        expect(badgeDefinitions[2].id).to.equal("Delegation Streak");
        done();
      });
  });

  it.("Returns allocations with expected subgraphId", (done) => {
    request
      .post(GRAPHQL_ROUTE)
      .send({ query: "{ user { id name username email } }" })
      .expect(200)
      .end((err, res) => {
        // res will contain array of all users
        if (err) return done(err);
        // assume there are a 100 users in the database
        res.body.user.should.have.lengthOf(100);
      });
  });
});
