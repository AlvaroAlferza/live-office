//const TOKEN = "";
async function cargarUsuarios() {

    const contenedor = document.getElementById("officeGrid");
    contenedor.innerHTML = "";

    const respuesta = await fetch(
        "https://graph.microsoft.com/v1.0/users?$top=999",
        {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        }
    );

    const data = await respuesta.json();

    const usuarios = data.value.filter(
        u =>
            u.mail &&
            u.mail.toLowerCase().endsWith("@alferza.pe")
    );

    let disponibles = 0;
    let ocupados = 0;
    let ausentes = 0;
    let offline = 0;

    const usuariosConPresencia = await Promise.all(

        usuarios.map(async usuario => {

            try {

                const presenciaResponse = await fetch(
                    `https://graph.microsoft.com/v1.0/users/${usuario.id}/presence`,
                    {
                        headers: {
                            Authorization: `Bearer ${TOKEN}`
                        }
                    }
                );

                const presencia = await presenciaResponse.json();

                return {
                    usuario,
                    presencia
                };

            } catch {

                return {
                    usuario,
                    presencia: {
                        availability: "Offline"
                    }
                };

            }

        })

    );

    let html = "";

    usuariosConPresencia.forEach(item => {

        const usuario = item.usuario;
        const presencia = item.presencia;

        let estado = presencia.availability || "Offline";

        let clase = "offline";

        switch (estado) {

            case "Available":
                clase = "disponible";
                disponibles++;
                break;

            case "Busy":
            case "InAMeeting":
            case "OnACall":
                clase = "ocupado";
                ocupados++;
                break;

            case "Away":
            case "BeRightBack":
                clase = "ausente";
                ausentes++;
                break;

            default:
                clase = "offline";
                offline++;
                break;
        }

        html += `
            <div class="card" data-estado="${estado}">
                <h3>${usuario.displayName}</h3>
                <p>${usuario.mail}</p>
                <div class="status ${clase}">
                    ${estado}
                </div>
            </div>
        `;

    });

    contenedor.innerHTML = html;

    document.getElementById("disp").innerText = disponibles;
    document.getElementById("busy").innerText = ocupados;
    document.getElementById("away").innerText = ausentes;
    document.getElementById("offline").innerText = offline;
}

cargarUsuarios();

/* Actualizar cada 5 minutos */

setInterval(() => {
    cargarUsuarios();
}, 300000);

/* BUSCADOR */

document
    .getElementById("buscador")
    .addEventListener("keyup", function () {

        const texto = this.value.toLowerCase();

        document
            .querySelectorAll(".card")
            .forEach(card => {

                const contenido =
                    card.innerText.toLowerCase();

                card.style.display =
                    contenido.includes(texto)
                        ? ""
                        : "none";

            });

    });

/* FILTROS */

function filtrarEstado(tipo) {

    document
        .querySelectorAll(".card")
        .forEach(card => {

            const estado =
                card.dataset.estado;

            let mostrar = false;

            switch (tipo) {

                case "Available":
                    mostrar =
                        estado === "Available";
                    break;

                case "Busy":
                    mostrar =
                        estado === "Busy" ||
                        estado === "InAMeeting" ||
                        estado === "OnACall";
                    break;

                case "Away":
                    mostrar =
                        estado === "Away" ||
                        estado === "BeRightBack";
                    break;

                case "Offline":
                    mostrar =
                        estado === "Offline";
                    break;

                default:
                    mostrar = true;
            }

            card.style.display =
                mostrar ? "" : "none";

        });

}

function mostrarTodos() {

    document
        .querySelectorAll(".card")
        .forEach(card => {

            card.style.display = "";

        });

}