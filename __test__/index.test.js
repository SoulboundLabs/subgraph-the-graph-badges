const chai = require("chai");
const expect = chai.expect;
const GRAPHQL_ROUTE = "/the-graph-badges";
const url = `http://127.0.0.1:8000/subgraphs/name/badgeth-dao`;
const request = require("supertest")(url);

describe("GraphQL", () => {
  it("Returns expected badge definitions", (done) => {
    request
      .post(GRAPHQL_ROUTE)
      .send({ query: "{ badgeDefinitions(first: 3, orderBy: id) { id } }" })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const { data } = res.body;
        const { badgeDefinitions } = data;

        expect(badgeDefinitions[0].id).to.equal("28 Epochs Later");
        expect(badgeDefinitions[1].id).to.equal("Delegation Nation");
        expect(badgeDefinitions[2].id).to.equal("Delegation Streak");
        done();
      });
  });

  it("Returns allocations with expected subgraphId", (done) => {
    request
      .post(GRAPHQL_ROUTE)
      .send({ query: "{ allocations { id subgraphId } }" })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        const { data } = res.body;
        const { allocations } = data;

        expect(allocations[0].id).to.be.a("string");
        expect(allocations[0].subgraphId).to.be.a(
          "string",
          "returns subgraphId on the allocationsModel"
        );
        done();
      });
  });
});
