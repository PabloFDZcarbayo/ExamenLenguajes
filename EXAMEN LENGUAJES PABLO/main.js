
//Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBIBdX7vHuetCd-Qxgzx8STJwpFhtcg_XY",
    authDomain: "examen-d4902.firebaseapp.com",
    projectId: "examen-d4902",
    storageBucket: "examen-d4902.appspot.com",
    messagingSenderId: "548273397043",
    appId: "1:548273397043:web:ed6a903631cb3978d2b246"
  };

// Iniciar Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = firebase.firestore();



//He creado un evento que se realiza cuando el documento HTML ha sido completamente cargadonavegador. 
//La parte de "DOMContentLoaded"se refiere exactamente a eso
document.addEventListener("DOMContentLoaded", function() {
    const formulario = document.getElementById("formulario");
    //He creado otro evento para cuando enviamos el formulario
    formulario.addEventListener("submit", function(event) {
        event.preventDefault(); // Evitar el envío del formulario por defecto, ya que sin esto se me duplicaban las entradas en la lista

        //Llama al metodo Agregar ALUMNO
        AgregarAlumno();
    });
});

//Este es el metodo principal de la página

function AgregarAlumno() {
    
    //Obtenos los 4 valores de nuestros ids
    const nombre= document.getElementById("Nombre").value;
    const apellidos = document.getElementById("apellidos").value;
    const dni = document.getElementById("dni").value;
    const telefono = document.getElementById("telefono").value;


    // Comprobamos si alguno de los campos está vacío
    if (!nombre || !apellidos || !dni || !telefono) {
        alert("Por favor, completa todos los campos antes de añadir un alumno.");
        return; 
    }

    // Verificamos si la ciudad ya existe en la colección
    db.collection("Alumnos")
        .where("DNI", "==", dni)
        .get()
        //Si ya existe en nuestra base de datos mandaremos un mensaje de alerta y resetearemos el formulario
        .then((querySnapshot) => {
            if (!querySnapshot.empty) {
                alert("El alumno ya existe en la lista.");
              
                document.getElementById("Nombre").value = "";
                document.getElementById("apellidos").value = "";
                document.getElementById("dni").value = "";
                document.getElementById("telefono").value = "";
                return;


         // En caso de que no exista, la añadriremos a nuestra base de datos
            } else {
               
                db.collection("Alumnos").add({
                    Nombre: nombre,
                    Apellidos: apellidos,
                    DNI: dni,
                    Telefono: telefono,
                })
                .then((docRef) => {
                    console.log("Document written with ID: ", docRef.id);
                    // Mostrar un mensaje de éxito
                    alert("Alumno agregada correctamente.");


                    // En esta parte creamos el html para que se muestre en nuestra lista, le indicamos que nuevoAlumno sera un elemento "li"
                    const nuevoAlumno = document.createElement("li");
// Establish the style with Tailwind
nuevoAlumno.className = "grid grid-cols-6 mb-2 bg-white bg-opacity-30 rounded border border-black";
// Create the HTML
nuevoAlumno.innerHTML = `
 <span class="col-span-1 px-6 py-3 flex justify-center items-center">
    <img src="https://api.multiavatar.com/${nombre}.png" alt="Avatar style="width: 20px; height: 20px">
</span>
  <span class="col-span-1 px-6 py-3 flex justify-center items-center">${nombre}</span>
  <span class="col-span-1 px-6 py-3 flex justify-center items-center">${apellidos}</span>
  <span class="col-span-1 px-6 py-3 flex justify-center items-center">${dni}</span>
  <span class="col-span-1 px-6 py-3 flex justify-center items-center">${telefono}</span>
  <span class="col-span-1 px-6 py-3 flex justify-center items-center">
    <button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 data-dni="${dni}" onclick="eliminarAlumno(this)">Eliminar</button>
    <button class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 data-dni="${dni}" onclick="marcarDesmarcarPresente(this)">Presente</button>
                    
  </span>
`;

                    // Obtenemos el código de nuestra lista y le agregamos el alumno
                    const listaAlumnos = document.getElementById("Lista-Alumnos");
                    listaAlumnos.appendChild(nuevoAlumno);

                    // Reseteamos los valores una vez agregado
                    document.getElementById("Nombre").value = "";
                    document.getElementById("apellidos").value = "";
                    document.getElementById("dni").value = "";
                    document.getElementById("telefono").value = "";
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                });

                // Mostrarmos la lista de ALUMNOS
                const contenedorAlumnos = document.getElementById("Lista-Alumnos");
                contenedorAlumnos.style.display = "block";
            }
        })
        .catch((error) => {
            console.error("Error getting documents: ", error);
        });
}

//  Esta funcion sirve para eliminar una ciudad de la base de datos
function eliminarAlumno(botonEliminar) {
    
    const dni = botonEliminar.getAttribute('data-dni'); // Obtener el dni del atributo data-dni
    const AlumnoEliminar = botonEliminar.closest('li');

   
    // Aqui eliminamos el alumno, 
    db.collection("Alumnos")
        .where("DNI", "==", dni)
        .get()
        //Si la encuentra ejecuta la sentencia
        .then((querySnapshot) => {
            //Recorre nuestra base de datos con un forEach
            querySnapshot.forEach((doc) => {
                //Borrara ese documento
                doc.ref.delete();
                console.log("Alumno eliminado de la base de datos:", nombre);
            });
        })
        .catch((error) => {
            console.error("Error eliminando ciudad de la base de datos: ", error);
        });

    // Eliminar EL ALUMNO de la lista html
    AlumnoEliminar.remove();
}

// Función para agregar y desagregar a la lista visitadas
function marcarDesmarcarPresente(botonPresente) {
    const alumno = botonPresente.closest('li'); // Obtener el <li> padre del botón presente
    const dni = botonPresente.getAttribute('data-dni'); // Obtener el dni del atributo data-dni

    if (!botonPresente.classList.contains('bg-green-500')) {
        // Marcar como presente
        db.collection("Presentes").add({
            DNI: dni
        })
        .then((docRef) => {
            console.log("Alumno marcado como presente:", dni);
            botonPresente.classList.remove('bg-blue-500');
            botonPresente.classList.add('bg-green-500');
            botonPresente.setAttribute('data-doc-id', docRef.id);
        })
        .catch((error) => {
            console.error("Error agregando alumno a la lista de presentes: ", error);
        });
    } else {
        // Desmarcar como presente
        const docId = botonPresente.getAttribute('data-doc-id');
        if (docId) {
            db.collection("Presentes").doc(docId).delete()
            .then(() => {
                console.log("Alumno desmarcado como presente:", dni);
                botonPresente.classList.remove('bg-green-500');
                botonPresente.classList.add('bg-blue-500');
                botonPresente.removeAttribute('data-doc-id');
            })
            .catch((error) => {
                console.error("Error eliminando alumno de la lista de presentes: ", error);
            });
        }
    }
}