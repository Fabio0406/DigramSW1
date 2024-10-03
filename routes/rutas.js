const expres = require("express");
const crypto = require('crypto'); // Importamos el módulo 'crypto'

const router = expres.Router();

//  Invocamos a la conexion de la DB
const connection = require('../database/db');
/* importamos el Model */
const MProyecto = require('../model/MProyecto');
const mProyecto = new MProyecto();
//	Invocamos a bcrypt
const bcrypt = require('bcryptjs');

const ProyectoDTO = require('../interface/system');


/**   RUTAS  **/

router.get('/login', (req, res) => {
	res.render('../views/login.ejs');
})


router.get('/createproyecto',(req, res)=>{
		res.render('create',{
			login:true,
			name: req.session.name,
			user_id: req.session.user_id,
		});
})

//10 - Método para REGISTRARSE
router.post('/register', async (req, res)=>{
	const user = req.body.user;
	const name = req.body.name;
	const rol = "admin";    
	const pass = req.body.pass;
	let passwordHash = await bcrypt.hash(pass, 8);
    connection.query('INSERT INTO users SET ?',{user:user, name:name, rol:rol, pass:passwordHash}, async (error, results)=>{
        if(error){
            console.log(error);
        }else{            
			res.render('register', {
				alert: true,
				alertTitle: "Regitro",
				alertMessage: "Te registraste correctamente!",
				alertIcon:'success',
				showConfirmButton: false,
				timer: 1500,
				ruta: 'login'
			});
        }
	});
})

function generadordecodigo() {
    return crypto.randomBytes(8).toString('hex'); // Generamos 8 bytes aleatorios y los convertimos a una cadena hexadecimal
}
//10 - Método para la REGISTRACIÓN
router.post('/store', async (req, res) => {
    const name = req.body.name;
	const user_id =  req.session.user_id;
	const link = generadordecodigo();
    const nuevoProyectoDTO = new ProyectoDTO(name,link,user_id);
    mProyecto.crearProyecto(nuevoProyectoDTO)
        .then((insertId) => {
            
            res.render('create', {
                alert: true,
                name: name,
                alertTitle: "Registro Correcto",
                alertMessage: "¡Registro exitoso!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            });
        })
        .catch((error) => {
            console.error(error);
        });
});

router.post('/validar-codigo', async (req, res) => {
    const codigoReunion = req.body.codigo; // Obtener el código desde el body de la solicitud

    try {
        // Consulta a la base de datos para encontrar el código de reunión
        connection.query('SELECT * FROM proyecto WHERE link = ?', [codigoReunion], (error, results) => {
            if (error) {
                return res.status(500).json({ success: false, message: 'Error en la consulta a la base de datos' });
            }

            if (results.length > 0) {
                // Si el código de reunión existe, devolver el ID del proyecto
                const projectId = results[0].id;
                res.json({ success: true, projectId: projectId });
            } else {
                // Si no se encuentra el código, devolver error
                res.json({ success: false, message: 'Código de reunión no válido' });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Error al procesar la solicitud' });
    }
});

router.post('/update', async (req, res) => {
	try {
	  const { id, newData } = req.body;
	  
	  mProyecto.update(id,newData);
	  res.status(200).json({ message: 'Datos actualizados con éxito' });
	} catch (error) {
	  res.status(500).json({ error: 'Error al actualizar datos' });
	}
  });




module.exports = router;