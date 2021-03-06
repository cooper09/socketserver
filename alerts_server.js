var mysql = require('mysql')
// Let’s make node/socketio listen on port 3000
var io = require('socket.io').listen(3000)
// Define our db creds
var db = mysql.createConnection({
    host: '127.0.0.1',
    port: "8889",
    user: 'root',
    password: 'root',
    database: 'testDB'
})
 
// Log any errors connected to the db
db.connect(function(err){
    if (err) console.log(err)
})
 
// Define/initialize our global vars
var notes = []
let alerts = [];
var isInitNotes = false;
var isInitAlerts =false;
var socketCount = 0
 
io.sockets.on('connection', function(socket){
    socket.emit("alert-list-init", alerts );
    // Socket has connected, increase socket count
    socketCount++
    // Let all sockets know how many are connected
    io.sockets.emit('users connected', socketCount)
 
    socket.on('disconnect', function() {
        // Decrease the socket count on a disconnect, emit
        socketCount--
        io.sockets.emit('users connected', socketCount)
    })
   //cooper s - only two action items on the socket right  now 
   //   initialize alerts and select-alert
 
    socket.on('select-alert', function(data){
        // cooper s - modify alert list here
        console.log("We have selected alert: ",data  ); 
        color = "#00a651"; 
        io.sockets.emit('alert-list-updated', color );
        console.log("select-alert - sent alert-list-update")
    })

    // Check to see if initial query/notes are set

    if (! isInitAlerts) {
        console.log("Initialize Alerts...");
        db.query('SELECT * FROM alerts')
            .on('result', function(data){
                // Push results onto the notes array
                alerts.push(data)
                console.log("MainScrn - Initial Alerts: ", data );
                socket.emit('initial alerts', data )
            })
            .on('end', function(){
                // Only emit notes after query has been completed
                socket.emit('initial alerts', alerts );
                isInitAlerts = true
            })
 
        //isInitAlerts = true
    } else {
        
    }//end isInitAlert iffy

})//end on connect