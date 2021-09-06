/// <reference types="Cypress" />

describe("Signup", () => {

    let randomString = Math.random().toString(36).substring(2);

    let username = "user-" + randomString;
    let email = randomString + "@gmail.com";
    let Password = "Password1";

    it("Test valid sign up", () => {
        cy.intercept({
            method: 'POST',
            url: '**/users',
        }).as('newUser');
        cy.visit("http://localhost:4200/");
        cy.get(".nav").contains("Sign up").click();
        cy.get("[placeholder='Username']").type(username);
        cy.get("[placeholder='Email']").type(email);
        cy.get("[placeholder='Password']").type(Password);
        cy.get("button").contains("Sign up").click();

        cy.wait("@newUser").should((xhr) => {
            console.log(xhr);
            expect(xhr.response.statusCode).to.eq(200);
            expect(xhr.request.body.user.username).to.eq(username);
            expect(xhr.request.body.user.email).to.eq(email);

        })

    });

    it("Test valid login", () => {
        cy.intercept({
            method: 'GET',
            url: '**/tags',
        },
            {
                fixture: "popularTags.json"
            }).as('tags');
        cy.visit("http://localhost:4200/");
        cy.get(".nav").contains("Sign in").click();
        cy.get("[placeholder='Email']").type(email);
        cy.get("[placeholder='Password']").type(Password);
        cy.get("button").contains("Sign in").click();
        cy.get("a[href^='/profile/']").should("have.text", " " + username + " ");
        cy.wait("@tags");
        cy.get("div.tag-list").should("have.text", " Nadeera  cypress  appliTools  nodejs  Testng ");
    });

    it("Mock global feed data", () => {
        cy.intercept({
            method: 'GET',
            url: '**/tags',
        },
            {
                fixture: "popularTags.json"
            }).as('tags');
        cy.intercept({
            method: 'GET',
            url: '**/articles/*',
        },
            {
                fixture: "articles.json"
            }).as('articles');
        cy.visit("http://localhost:4200/");
        cy.get(".nav").contains("Sign in").click();
        cy.get("[placeholder='Email']").type(email);
        cy.get("[placeholder='Password']").type(Password);
        cy.get("button").contains("Sign in").click();
    })

})