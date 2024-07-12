// Modificar esta url para que apunte a la carpeta server
const baseUrl = "http://localhost/php/server";

const swalWithCustomClass = Swal.mixin({
    customClass: {
        container: 'swal-dark-container',
        popup: 'swal-dark-popup',
        title: 'swal-dark-title',
        closeButton: 'swal-dark-close-button',
        icon: 'swal-dark-icon',
        image: 'swal-dark-image',
        content: 'swal-dark-content',
        input: 'swal-dark-input',
        actions: 'swal-dark-actions',
        confirmButton: 'swal-dark-confirm-button',
        cancelButton: 'swal-dark-cancel-button',
        footer: 'swal-dark-footer'
    },
    buttonsStyling: false
});

document.addEventListener("DOMContentLoaded", function () {
  cargarObras();

  function cargarObras() {
    fetch(baseUrl + "/api.php?action=getAvailablePlays")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const select = document.getElementById("selectObra");
        
        select.innerHTML = '<option value="">Seleccione una obra...</option>';
        data.forEach((obra) => {
          const option = document.createElement("option");
          option.value = obra.cod_obra;
          option.textContent = obra.nombre;
          option.dataset.fechaObra = obra.fecha_obra; 
          option.dataset.imagen = obra.imagen; 
          select.appendChild(option);
        });
        select.onchange = mostrarFechaHora; 
      })
      .catch((error) => {
        console.error("Error al cargar las obras:", error);
        swalWithCustomClass.fire("Error", "No se pudieron cargar las obras", "error");
      });
  }

  function mostrarFechaHora() {
    const select = document.getElementById("selectObra");
    const infoObra = document.getElementById("infoObra");
    const fechaObra = document.getElementById("fechaObra"); 
    const horaObra = document.getElementById("horaObra"); 
    const obraSeleccionada = select.options[select.selectedIndex];

    if (obraSeleccionada && obraSeleccionada.value) {
      const fechaHora = obraSeleccionada.dataset.fechaObra; 
      const partes = fechaHora.split(" "); 
      const fecha = partes[0].split("-").reverse().join("/"); 
      const hora = partes[1]; 

      fechaObra.textContent = `Fecha: ${fecha}`; 
      horaObra.textContent = `Hora: ${hora}`; 
      infoObra.style.display = "block";
    } else {
      infoObra.style.display = "none";
    }
  }

  document.getElementById("btnComprar").addEventListener("click", function () {
    const select = document.getElementById("selectObra");
    const obraSeleccionada = select.options[select.selectedIndex];
    const idObra = obraSeleccionada.value;
    const comprador = document.getElementById("inputComprador").value.trim();

    if (!idObra) {
      swalWithCustomClass.fire("Atención", "Por favor, seleccione una obra.", "warning");
      return;
    }
    if (!comprador) {
      swalWithCustomClass.fire(
        "Atención",
        "Por favor, ingrese el nombre del comprador.",
        "warning"
      );
      return;
    }

    const nombreObra = obraSeleccionada.textContent;
    const fechaHora = obraSeleccionada.dataset.fechaObra;
    const partesFechaHora = fechaHora.split(" ");
    const fecha = partesFechaHora[0].split("-").reverse().join("/");
    const hora = partesFechaHora[1];

    swalWithCustomClass.fire({
      title: "¿Está seguro?",
      html: `Está a punto de comprar entradas para <strong>${nombreObra}</strong> el <strong>${fecha}</strong> a las <strong>${hora}</strong>.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, comprar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        verificarDisponibilidad(idObra, comprador);
      }
    });
  });

  function verificarDisponibilidad(idObra, comprador) {
    let formData = new FormData();
    formData.append("id_obra", idObra);
    formData.append("comprador", comprador);

    fetch(baseUrl + "/api.php?action=checkAvailability", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isAvailable) {
          comprarEntradas(idObra, comprador);
        } else {
          swalWithCustomClass.fire(
            "Lo sentimos",
            "No hay suficientes entradas disponibles.",
            "error"
          );
        }
      })
      .catch((error) =>
        console.error("Error al verificar la disponibilidad:", error)
      );
  }

  function comprarEntradas(idObra, comprador) {
    let formData = new FormData();
    formData.append("id_obra", idObra);
    formData.append("comprador", comprador);

    fetch(baseUrl + "/api.php?action=buyTickets", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
            console.log(data)
          const obraSeleccionada =
            document.getElementById("selectObra").options[
              document.getElementById("selectObra").selectedIndex
            ];
          const fechaHora = obraSeleccionada.dataset.fechaObra;
          const partesFechaHora = fechaHora.split(" ");
          const fecha = partesFechaHora[0].split("-").reverse().join("/");
          const hora = partesFechaHora[1];
          const imagen = obraSeleccionada.dataset.imagen;
          const ticketHTML = `
                <div style="background-color: #333; padding: 20px; border-radius: 10px; color: #fff;">
                    <h2 style="text-align: center; color: #f0ad4e;">Entrada al Espectáculo</h2>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="flex: 1; padding-right: 20px; text-align: left;">
                            <p><strong>Obra:</strong> ${obraSeleccionada.textContent}</p>
                            <p><strong>Fecha:</strong> ${fecha}</p>
                            <p><strong>Hora:</strong> ${hora}</p>
                            <p><strong>Comprador:</strong> ${comprador}</p>
                            <p><strong>Número de Entrada:</strong> ${data.idVenta}</p>
                        </div>
                        <div style="flex: 1;">
                            <img src="./img/${imagen}" alt="Imagen de la obra" style="width: 100%; max-width: 200px; height: auto; border-radius: 5px;">
                        </div>
                    </div>
                </div>
            `;
          swalWithCustomClass.fire({
            title: "Compra realizada con éxito!",
            html: ticketHTML,
            icon: "success",
            confirmButtonText: "Ok",
          });
          document.getElementById("selectObra").selectedIndex = 0;
          cargarObras();
          document.getElementById("inputComprador").value = "";
          const infoObra = document.getElementById("infoObra");
          infoObra.style.display = "none";
        } else {
          swalWithCustomClass.fire("Error", "Error realizando la compra.", "error");
        }
      })
      .catch((error) => console.error("Error realizando la compra:", error));
  }
});
