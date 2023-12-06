const express = require("express");
const mysql = require("mysql2");
const app = express();
const methodOverride = require("method-override");
const path = require("path");
const { error } = require("console");



app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname,"./public/css")));
app.use(express.static(path.join(__dirname,"./public/js")));



const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'hospital_managment_system',
    password:"rahim.22101364"
  });
let port =8080;

app.listen(port,()=>{
    console.log(`App is listing at port: ${port}`);
});

//for admin login
app.get("/login",(req,res) =>{
    res.render("login_page.ejs");
});
app.post("/admin_login",(req,res) =>{
    let {username:entered_username,password:entered_password} = req.body;
    q = "SELECT * FROM admin";

    try{
        connection.query(q,(err,result) =>{
            if(err) throw err;
            let user = result[0];
            let password = user.password;
            let username = user.username;
            if(password==entered_password && username == entered_username){
                res.render("home.ejs");

            }
            else{
                res.send("Wrong Password");
            }
        });

    }catch(err){

        res.status(500).send("Error deleting doctor");
    }

});

// all doctor list

app.get("/all_doctor_list",(req,res) =>{
    q="SELECT * FROM doctors";
    try{
        connection.query(q,(err,doctors) =>{
            if(err) throw err;
            res.render("doctor_list.ejs",{doctors});
        });


    }catch(err){
        res.status(500).send("Error deleting doctor");
    }

});

// Edit Information of doctor
app.get("/doctor/:id/edit",(req,res) =>{
    let {id} = req.params;
    let q = `SELECT * FROM doctors WHERE doctor_id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("doctor_info_edit.ejs", { user });
    });
  } catch (err) {
    res.status(500).send("Error deleting doctor");
  }
});

app.patch("/doctor/:id/edit", (req, res) => {
    let { id } = req.params;
    console.log(id);
    let { phone_num:n_phone_num, email:n_email ,charge: n_charge } = req.body;  //n=new

    let q1 = `UPDATE doctors  SET phone_num='${n_phone_num}', email='${n_email}', 
    charge= ${n_charge} WHERE doctor_id='${id}'`;
  
    try {
      connection.query(q1, (err, result) => {
        if (err) throw err;
        res.redirect("/all_doctor_list");
      });


    }catch(err){
        res.status(500).send("Error deleting doctor");
    }

});

//Delete
app.delete("/doctor/:id/", (req, res) => {
    let { id } = req.params;
  
    let q1 = `DELETE FROM doctors WHERE doctor_id='${id}'`;
  
    try {
      connection.query(q1, (err, result) => {
        if (err) throw err;
        res.redirect("/all_doctor_list");
      });
    } catch (err) {
      res.send("Error found");
    }
  });
  

// Add new doctor
app.get("/doctor/add_new_doctor",(req,res) =>{
    res.render("add_new_doctor.ejs");

})

app.post("/doctor/add_new_doctor", (req, res) => {
    let { doctor_id:doctor_id, name:name, gender:gender, phone_num:phone_num, email:email, 
        specialization: specialization, qualification:qualification,charge: charge } = req.body;
  
    let q = `INSERT INTO doctors (doctor_id, name, gender, phone_num, email, specialization, qualification, charge) 
             VALUES ('${doctor_id}', '${name}', '${gender}', '${phone_num}', '${email}', '${specialization}', '${qualification}', ${charge})`;
  
    try {
      connection.query(q, (err, result) => {
        if (err) throw err;
        res.redirect("/all_doctor_list"); 
      });
    } catch (err) {
        res.send("error found");
    }
});

//PATIENT  START

// ALL PATIENT LIST
app.get("/all_patient_list", (req, res) => {
  q = "SELECT * FROM patients";
  try {
      connection.query(q, (err, patients) => {
          if (err) throw err;
          res.render("patient_list.ejs", { patients });
      });
  } catch (err) {
      res.status(500).send("Error fetching patients list");
  }
});

//ADD NEW PATIENT

app.get("/patient/add_new_patient", (req, res) => {
  res.render("add_new_patient.ejs");
});

app.post("/patient/add_new_patient", (req, res) => {
  let { patient_id, name, date_of_birth, gender, phone_num, email, address, history } = req.body;

  let q = `INSERT INTO patients (patient_id, name, date_of_birth, gender, phone_num, email, address, history) 
           VALUES ('${patient_id}', '${name}', '${date_of_birth}' ,'${gender}', '${phone_num}', '${email}', '${address}', '${history}')`;

  try {
      connection.query(q, (err, result) => {
          if (err) throw err;
          res.redirect("/all_patient_list"); 
      });
  } catch (err) {
      res.send("Error occurred while adding a new patient");
  }
});

// EDIT INFORMATION

app.get("/patient/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM patients WHERE patient_id='${id}'`;

  try {
      connection.query(q, (err, result) => {
          if (err) throw err;
          let patient = result[0];
          res.render("patient_info_edit.ejs", { patient });
      });
  } catch (err) {
      res.status(500).send("Error fetching patient data");
  }
});

app.patch("/patient/:id/edit", (req, res) => {
  let { id } = req.params;
  let { phone_num: n_phone_num, email: n_email, date_of_birth:n_date_of_birth, address: n_address, history: n_history } = req.body;

  let q = `UPDATE patients SET phone_num='${n_phone_num}', email='${n_email}', date_of_birth ='${n_date_of_birth}',
           address='${n_address}', history='${n_history}' WHERE patient_id='${id}'`;

  try {
      connection.query(q, (err, result) => {
          if (err) throw err;
          res.redirect("/all_patient_list");
      });
  } catch (err) {
      res.status(500).send("Error updating patient information");
  }
});

//DELETE
app.delete("/patient/:id", (req, res) => {
  let { id } = req.params;
  let q = `DELETE FROM patients WHERE patient_id='${id}'`;

  try {
      connection.query(q, (err, result) => {
          if (err) throw err;
          res.redirect("/all_patient_list");
      });
  } catch (err) {
      res.status(500).send("Error deleting patient");
  }
});

//NURSE-------------------------------------------
// Retrieve all nurses
app.get("/all_nurse_list",(req,res) =>{
  let q = "SELECT * FROM nurses";
  try{
      connection.query(q, (err, nurses) =>{
          if(err) throw err;
          res.render("nurse_list.ejs", { nurses });
      });
  } catch(err){
      res.status(500).send("Error retrieving nurses");
  }
});

// Edit nurse information
app.get("/nurse/:id/edit",(req,res) =>{
  let { id } = req.params;
  let q = `SELECT * FROM nurses WHERE nurse_id='${id}'`;

  try {
      connection.query(q, (err, result) => {
          if (err) throw err;
          let nurse = result[0];
          res.render("nurse_info_edit.ejs", { nurse });
      });
  } catch (err) {
      res.status(500).send("Error editing nurse");
  }
});

app.patch("/nurse/:id/edit", (req, res) => {
  let { id } = req.params;
  let { duty_floor: n_duty_floor, duty_day: n_duty_day, duty_time: n_duty_time,phone_num:n_phone_num,
        address:n_address } = req.body; //n=new

  let q1 = `UPDATE nurses SET duty_floor='${n_duty_floor}', duty_day='${n_duty_day}', duty_time='${n_duty_time}',
            phone_num='${n_phone_num}',address='${n_address}' WHERE nurse_id='${id}'`;

  try {
      connection.query(q1, (err, result) => {
          if (err) throw err;
          res.redirect("/all_nurse_list");
      });
  } catch(err){
      res.status(500).send("Error updating nurse");
  }
});

// Delete nurse
app.delete("/nurse/:id/", (req, res) => {
  let { id } = req.params;
  let q1 = `DELETE FROM nurses WHERE nurse_id='${id}'`;

  try {
      connection.query(q1, (err, result) => {
          if (err) throw err;
          res.redirect("/all_nurse_list");
      });
  } catch (err) {
      res.send("Error deleting nurse");
  }
});

// Add new nurse
app.get("/nurse/add_new_nurse", (req, res) => {
    res.render("add_new_nurse.ejs"); // 
  });
  
app.post("/nurse/add_new_nurse", (req, res) => {
    let { nurse_id, name, duty_floor, duty_day, duty_time, phone_num, address } = req.body;
  
    let q = `INSERT INTO nurses (nurse_id, name, duty_floor, duty_day, duty_time, phone_num, address) 
             VALUES ('${nurse_id}', '${name}', '${duty_floor}', '${duty_day}', '${duty_time}', '${phone_num}', '${address}')`;
  
    try {
      connection.query(q, (err, result) => {
        if (err) throw err;
        res.redirect("/all_nurse_list");
      });
    } catch (err) {
      res.send("Error occurred while adding a new nurse");
    }
  });

  //-------Appointment---------------------------//
// List all appointments
app.get("/all_appointments", (req, res) => {
    const q = "SELECT * FROM appointment";
    try {
      connection.query(q, (err, appointments) => {
        if (err) throw err;
        res.render("appointment_list.ejs", { appointments });
      });
    } catch (err) {
      res.status(500).send("Error fetching appointments");
    }
  });

// Add new appointment--------------------
app.get("/appointment/add_new_appointment", (req, res) => {
    const patientsQuery = "SELECT * FROM patients";
    const doctorsQuery = "SELECT * FROM doctors";
  
    try {
      connection.query(patientsQuery, (err, patients) => {
        if (err) throw err;
  
        connection.query(doctorsQuery, (err, doctors) => {
          if (err) throw err;
  
          res.render("add_new_appointment.ejs", { patients, doctors });
        });
      });
    } catch (err) {
      res.status(500).send("Error fetching patients and doctors");
    }
  });
  
  app.post("/appointment/add_new_appointment", (req, res) => {
    const { patient_id, doctor_id, date,time, visiting_fee } = req.body;
  
    const q = `INSERT INTO appointment (patient_id, doctor_id, date, time,visiting_fee)
               VALUES ('${patient_id}', '${doctor_id}', '${date}','${time}', ${visiting_fee})`;
  
    try {
      connection.query(q, (err, result) => {
        if (err) throw err;
        res.redirect("/all_appointments");
      });
    } catch (err) {
      res.status(500).send("Error occurred while adding a new appointment");
    }
  });

  //-----------EMPLOYEE----------//

app.get("/employees",(req,res) =>{
  let q = "SELECT * FROM employees";
  try{
      connection.query(q, (err, employees) =>{
          if(err) throw err;
          res.render("employees.ejs", { employees });
      });
  } catch(err){
      res.status(500).send("Error retrieving nurses");
  }
});


//--------ROOM---------//
app.get('/room_information', (req, res) => {
  res.render('room.ejs');
});
//----admit patient in room----///

app.get('/admit_into_room', (req, res) => {
  res.render('admit_into_room.ejs');
});

app.post('/admit_into_room', (req, res) => {
  const { room_no, patient_id, doctor_id, floor_no, building_no, room_type } = req.body;

  let q;
  if (room_type === 'room') {
    q = 'INSERT INTO room (room_no, patient_id, doctor_id, floor_no, building_no) VALUES (?, ?, ?, ?, ?)';
  } else if (room_type === 'cabin') {
    q = 'INSERT INTO cabin (cabin_no, patient_id, doctor_id, floor_no, building_no) VALUES (?, ?, ?, ?, ?)';
  } else if (room_type === 'operation_theatre') {
    q = 'INSERT INTO operation_theatre (operation_theatre_no, patient_id, doctor_id, floor_no, building_no) VALUES (?, ?, ?, ?, ?)';
  } else {
    res.status(400).send('Invalid location type');
    return;
  }

  const values = [room_no, patient_id, doctor_id, floor_no, building_no];

  connection.query(sql, values, (err, result) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log('Patient added to room');
    res.redirect('/room_information');
  });
});


//----sHOW ALL ROOMS---//
app.get('/all_rooms', (req, res) => {
  const q = 'SELECT * FROM room';

  connection.query(q, (err, rows) => {
    if (err) {
      console.error('Error fetching room information: ' + err.message);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.render('all_rooms.ejs', { rooms: rows });
  });
});

//----DELETE PATIENCE FROM ROOM--------//
app.delete("/room/:id/", (req, res) => {
  let { id } = req.params;
  let q1 = `DELETE FROM room WHERE patient_id='${id}'`;

  try {
      connection.query(q1, (err, result) => {
          if (err) throw err;
          res.redirect("/all_rooms");
      });
  } catch (err) {
      res.send("Error deleting nurse");
  }
});
