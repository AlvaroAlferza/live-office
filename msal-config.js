const msalConfig = {

    auth: {

        clientId:
            "5d98417c-74a7-4fab-8f2c-41ac127be696",

        authority:
            "https://login.microsoftonline.com/dbab984f-4bb1-4b60-9dff-da59f54acdf1",

        redirectUri:
            "http://localhost:5500"

    }

};

const loginRequest = {

    scopes: [
        "User.Read",
        "Presence.Read.All"
    ]

};